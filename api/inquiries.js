/**
 * Vercel Serverless Function — POST /api/inquiries
 *
 * ESM syntax (import/export) required because package.json has "type":"module".
 *
 * Features:
 *  - Saves inquiry to Neon PostgreSQL via @neondatabase/serverless
 *  - Sends owner alert email to info@thepplschef.com via Resend
 *  - Sends confirmation email to the client via Resend
 *  - Verifies Google reCAPTCHA v3 token (rejects score < 0.7)
 *  - Validates name field (must contain a space; rejects random-character strings)
 *  - Validates email domain has a live MX record via DNS lookup
 *
 * Required Vercel Environment Variables:
 *  - DATABASE_URL        : Neon PostgreSQL connection string
 *  - RESEND_API_KEY      : Resend API key (resend.com — free tier: 3,000 emails/month)
 *  - RECAPTCHA_SECRET_KEY: Google reCAPTCHA v3 secret key
 */

import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import dns from "dns/promises";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

/**
 * Checks whether a name looks like a real human name.
 * Rejects:
 *  - names with no space (no first+last)
 *  - names that are purely random mixed-case with no vowel pattern
 */
function isValidName(name) {
  const trimmed = name.trim();
  // Must contain at least one space (first + last name)
  if (!trimmed.includes(" ")) return false;

  // Each word must contain at least one vowel (a e i o u — case-insensitive)
  const words = trimmed.split(/\s+/);
  const vowelPattern = /[aeiouAEIOU]/;
  for (const word of words) {
    if (word.length > 0 && !vowelPattern.test(word)) return false;
  }

  // Reject strings that look like random camelCase gibberish:
  // High ratio of alternating upper/lower case transitions is a red flag.
  // Count case transitions (e.g. aAbBcC has many transitions).
  let transitions = 0;
  for (let i = 1; i < trimmed.length; i++) {
    const prev = trimmed[i - 1];
    const curr = trimmed[i];
    if (/[a-zA-Z]/.test(prev) && /[a-zA-Z]/.test(curr)) {
      const prevUpper = prev === prev.toUpperCase();
      const currUpper = curr === curr.toUpperCase();
      if (prevUpper !== currUpper) transitions++;
    }
  }
  const letters = trimmed.replace(/[^a-zA-Z]/g, "").length;
  // If more than 40% of letter-pairs are case transitions, it's likely random
  if (letters > 4 && transitions / (letters - 1) > 0.4) return false;

  return true;
}

/**
 * Checks whether the domain part of an email has at least one MX record.
 * Returns true if valid MX records exist, false otherwise.
 * On DNS lookup failure/timeout, returns true (fail-open) to avoid blocking real users.
 */
async function hasMxRecord(email) {
  try {
    const domain = email.split("@")[1];
    if (!domain) return false;
    const records = await dns.resolveMx(domain);
    return Array.isArray(records) && records.length > 0;
  } catch (err) {
    // ENOTFOUND = domain doesn't exist; ENODATA = no MX records
    if (err.code === "ENOTFOUND" || err.code === "ENODATA" || err.code === "ESERVFAIL") {
      return false;
    }
    // For other errors (timeout, etc.) fail-open
    console.warn("[api/inquiries] MX lookup error (fail-open):", err.code, err.message);
    return true;
  }
}

/**
 * Verifies a reCAPTCHA v3 token with Google's siteverify API.
 * Returns { success, score, action } or throws on network failure.
 * If RECAPTCHA_SECRET_KEY is not set, verification is skipped (returns success).
 */
async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.warn("[api/inquiries] RECAPTCHA_SECRET_KEY not set — skipping verification");
    return { success: true, score: 1.0, skipped: true };
  }
  if (!token) {
    return { success: false, score: 0, error: "Missing reCAPTCHA token" };
  }

  const params = new URLSearchParams({
    secret: secretKey,
    response: token,
  });

  const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const verifyData = await verifyRes.json();
  console.log("[api/inquiries] reCAPTCHA verify response:", JSON.stringify(verifyData));
  return verifyData;
}

function formatDate(dateStr) {
  if (!dateStr) return "Not specified";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function buildOwnerEmailHtml(data) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Inquiry — The PPL's Chef</title></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    <div style="background:#000;padding:24px 32px;text-align:center;">
      <h1 style="color:#ECA241;margin:0;font-size:22px;letter-spacing:2px;text-transform:uppercase;">New Inquiry Received</h1>
      <p style="color:#F3F1E9;margin:8px 0 0;font-size:13px;opacity:0.7;">The PPL's Chef — Las Vegas</p>
    </div>
    <div style="background:#D82E2B;padding:12px 32px;text-align:center;">
      <p style="color:#fff;margin:0;font-size:14px;font-weight:bold;">⚡ Action Required: Review and respond within 24 hours</p>
    </div>
    <div style="padding:32px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td colspan="2" style="padding:0 0 16px;border-bottom:2px solid #ECA241;">
          <h2 style="color:#000;margin:0;font-size:16px;text-transform:uppercase;letter-spacing:1px;">Client Information</h2>
        </td></tr>
        <tr><td style="padding:10px 0;color:#666;font-size:14px;width:40%;font-weight:bold;">Name</td><td style="padding:10px 0;color:#000;font-size:14px;">${data.name}</td></tr>
        <tr style="background:#fafafa;"><td style="padding:10px 8px;color:#666;font-size:14px;font-weight:bold;">Email</td><td style="padding:10px 8px;color:#000;font-size:14px;"><a href="mailto:${data.email}" style="color:#D82E2B;">${data.email}</a></td></tr>
        <tr><td style="padding:10px 0;color:#666;font-size:14px;font-weight:bold;">Phone</td><td style="padding:10px 0;color:#000;font-size:14px;">${data.phone || "Not provided"}</td></tr>
        <tr><td colspan="2" style="padding:24px 0 16px;">
          <h2 style="color:#000;margin:0;font-size:16px;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #ECA241;padding-bottom:8px;">Event Details</h2>
        </td></tr>
        <tr><td style="padding:10px 0;color:#666;font-size:14px;font-weight:bold;">Service Type</td><td style="padding:10px 0;color:#000;font-size:14px;">${data.serviceType || "Not specified"}</td></tr>
        <tr style="background:#fafafa;"><td style="padding:10px 8px;color:#666;font-size:14px;font-weight:bold;">Event Date</td><td style="padding:10px 8px;color:#000;font-size:14px;">${formatDate(data.eventDate)}</td></tr>
        <tr><td style="padding:10px 0;color:#666;font-size:14px;font-weight:bold;">Event Time</td><td style="padding:10px 0;color:#000;font-size:14px;">${data.eventTime || "Not specified"}</td></tr>
        <tr style="background:#fafafa;"><td style="padding:10px 8px;color:#666;font-size:14px;font-weight:bold;">Location</td><td style="padding:10px 8px;color:#000;font-size:14px;">${data.location || "Not specified"}</td></tr>
        <tr><td style="padding:10px 0;color:#666;font-size:14px;font-weight:bold;">Guest Count</td><td style="padding:10px 0;color:#000;font-size:14px;">${data.guestCount || "Not specified"}</td></tr>
        <tr style="background:#fafafa;"><td style="padding:10px 8px;color:#666;font-size:14px;font-weight:bold;">Budget</td><td style="padding:10px 8px;color:#000;font-size:14px;">${data.budget || "Not specified"}</td></tr>
        <tr><td style="padding:10px 0;color:#666;font-size:14px;font-weight:bold;">Food Preferences</td><td style="padding:10px 0;color:#000;font-size:14px;">${data.foodPreferences || "None"}</td></tr>
        <tr style="background:#fafafa;"><td style="padding:10px 8px;color:#666;font-size:14px;font-weight:bold;">Allergies</td><td style="padding:10px 8px;color:#000;font-size:14px;">${data.allergies || "None"}</td></tr>
        ${data.notes ? `<tr><td colspan="2" style="padding:16px 0 8px;"><h2 style="color:#000;margin:0;font-size:16px;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #ECA241;padding-bottom:8px;">Additional Notes</h2></td></tr><tr><td colspan="2" style="padding:10px 0;color:#333;font-size:14px;line-height:1.6;">${data.notes.replace(/\n/g, "<br>")}</td></tr>` : ""}
      </table>
    </div>
    <div style="background:#000;padding:20px 32px;text-align:center;">
      <p style="color:#F3F1E9;margin:0;font-size:12px;opacity:0.6;">Inquiry #${data.inquiryId} · Submitted ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} PT</p>
      <p style="color:#ECA241;margin:8px 0 0;font-size:11px;">Log in to the admin dashboard to update the inquiry status.</p>
    </div>
  </div>
</body>
</html>`;
}

function buildClientEmailHtml(name, serviceType) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>We Received Your Inquiry — The PPL's Chef</title></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    <div style="background:#000;padding:32px;text-align:center;">
      <h1 style="color:#ECA241;margin:0;font-size:26px;letter-spacing:2px;text-transform:uppercase;font-style:italic;">The PPL's Chef</h1>
      <p style="color:#F3F1E9;margin:8px 0 0;font-size:13px;opacity:0.7;letter-spacing:1px;text-transform:uppercase;">Las Vegas Private Chef &amp; Catering</p>
    </div>
    <div style="padding:40px 32px;">
      <h2 style="color:#000;font-size:22px;margin:0 0 16px;">Thank you, ${name}!</h2>
      <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 20px;">
        We've received your inquiry${serviceType ? ` for <strong>${serviceType}</strong>` : ""} and are excited to learn more about your event.
        Our team will review your request and reach out within <strong>24 hours</strong> to discuss the details and begin crafting your custom experience.
      </p>
      <div style="background:#f9f6f0;border-left:4px solid #ECA241;padding:20px 24px;margin:24px 0;border-radius:0 8px 8px 0;">
        <h3 style="color:#000;margin:0 0 12px;font-size:15px;text-transform:uppercase;letter-spacing:1px;">What Happens Next</h3>
        <ol style="color:#333;font-size:14px;line-height:1.8;margin:0;padding-left:20px;">
          <li>Our chef reviews your inquiry details</li>
          <li>We reach out to discuss your vision and any questions</li>
          <li>We prepare a custom menu proposal and quote</li>
          <li>Once confirmed, we handle everything — from prep to cleanup</li>
        </ol>
      </div>
      <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 8px;">In the meantime, feel free to reach out directly:</p>
      <p style="margin:0;">
        <a href="mailto:info@thepplschef.com" style="color:#D82E2B;font-weight:bold;text-decoration:none;">info@thepplschef.com</a>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="tel:7252122236" style="color:#D82E2B;font-weight:bold;text-decoration:none;">(725) 212-2236</a>
      </p>
    </div>
    <div style="height:2px;background:linear-gradient(to right,transparent,#ECA241,transparent);margin:0 32px;"></div>
    <div style="background:#000;padding:24px 32px;text-align:center;">
      <p style="color:#F3F1E9;margin:0 0 12px;font-size:13px;opacity:0.8;">Follow us for behind-the-scenes content and menu inspiration:</p>
      <p style="margin:0;">
        <a href="https://www.instagram.com/thepplschef" style="color:#ECA241;text-decoration:none;font-size:13px;margin:0 8px;">Instagram</a>
        <a href="https://tiktok.com/@thepplschef" style="color:#ECA241;text-decoration:none;font-size:13px;margin:0 8px;">TikTok</a>
        <a href="https://facebook.com/thepplschef" style="color:#ECA241;text-decoration:none;font-size:13px;margin:0 8px;">Facebook</a>
      </p>
      <p style="color:#F3F1E9;margin:16px 0 0;font-size:11px;opacity:0.4;">© ${new Date().getFullYear()} The PPL's Chef · Las Vegas, NV</p>
    </div>
  </div>
</body>
</html>`;
}

// ── Main Handler ──────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    const {
      name,
      email,
      phone = null,
      serviceType = null,
      eventDate = null,
      eventTime = null,
      location = null,
      guestCount = null,
      budget = null,
      foodPreferences = null,
      allergies = null,
      notes = null,
      recaptchaToken = null,
    } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ success: false, error: "Name is required" });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ success: false, error: "Valid email is required" });
    }

    // ── Protection: Name validation ──────────────────────────────────────────
    if (!isValidName(name)) {
      console.warn("[api/inquiries] Name validation failed:", name);
      return res.status(400).json({
        success: false,
        error: "Please enter your full name (first and last name).",
      });
    }

    // ── Protection: Email MX record validation ───────────────────────────────
    const mxValid = await hasMxRecord(email.trim());
    if (!mxValid) {
      console.warn("[api/inquiries] MX record check failed for email domain:", email);
      return res.status(400).json({
        success: false,
        error: "The email address provided does not appear to be valid. Please check and try again.",
      });
    }

    // ── Protection 2: reCAPTCHA v3 verification ───────────────────────────────
    try {
      const captchaResult = await verifyRecaptcha(recaptchaToken);
      if (!captchaResult.success && !captchaResult.skipped) {
        console.warn("[api/inquiries] reCAPTCHA failed:", captchaResult);
        return res.status(400).json({
          success: false,
          error: "Security verification failed. Please refresh the page and try again.",
        });
      }
      if (captchaResult.success && !captchaResult.skipped && captchaResult.score < 0.7) {
        console.warn("[api/inquiries] reCAPTCHA score too low:", captchaResult.score);
        return res.status(400).json({
          success: false,
          error: "Security verification failed. Please refresh the page and try again.",
        });
      }
    } catch (captchaErr) {
      // Don't block legitimate users if reCAPTCHA network call fails
      console.error("[api/inquiries] reCAPTCHA verification error:", captchaErr);
    }

    // ── Save to database ──────────────────────────────────────────────────────
    let inquiryId = null;

    try {
      const sql = getDb();

      // Try to match service type
      const serviceRows = serviceType
        ? await sql`SELECT id FROM service_types WHERE name = ${serviceType} LIMIT 1`
        : [];
      const serviceTypeId = serviceRows.length > 0 ? serviceRows[0].id : null;

      const inserted = await sql`
        INSERT INTO inquiries (
          name, email, phone,
          "serviceTypeId",
          "eventDate", "eventTime", location,
          "guestCount", budget,
          "foodPreferences", allergies, notes,
          status, "createdAt"
        ) VALUES (
          ${name.trim()}, ${email.trim()}, ${phone},
          ${serviceTypeId},
          ${eventDate}, ${eventTime}, ${location},
          ${guestCount}, ${budget},
          ${foodPreferences}, ${allergies}, ${notes},
          'new', NOW()
        )
        RETURNING id
      `;
      inquiryId = inserted[0]?.id;
    } catch (dbErr) {
      console.error("[api/inquiries] DB error:", dbErr);
      // Don't fail the whole request for DB errors
    }

    // ── Send emails via Resend ────────────────────────────────────────────────
    const resend = getResend();
    if (resend) {
      // send.thepplschef.com is the verified Resend sending domain
      const FROM_ADDRESS = "The PPL's Chef <notifications@send.thepplschef.com>";
      const OWNER_EMAIL = "saustin@thepplschef.com";

      const emailData = {
        name: name.trim(),
        email: email.trim(),
        phone,
        serviceType,
        eventDate,
        eventTime,
        location,
        guestCount,
        budget,
        foodPreferences,
        allergies,
        notes,
        inquiryId: inquiryId || "N/A",
      };

      // Await both emails so Vercel doesn't terminate before delivery
      const emailResults = await Promise.allSettled([
        resend.emails.send({
          from: FROM_ADDRESS,
          to: [OWNER_EMAIL],
          replyTo: email.trim(),
          subject: `New Inquiry — ${serviceType || "General"} — ${name.trim()}`,
          html: buildOwnerEmailHtml(emailData),
        }),
        resend.emails.send({
          from: FROM_ADDRESS,
          to: [email.trim()],
          replyTo: OWNER_EMAIL,
          subject: "Your Experience Starts Here — The PPL's Chef",
          html: buildClientEmailHtml(name.trim(), serviceType),
        }),
      ]);

      emailResults.forEach((r, i) => {
        const label = i === 0 ? "owner" : "client";
        if (r.status === "rejected") {
          console.error(`[api/inquiries] Email ${label} rejected:`, r.reason);
        } else if (r.value?.error) {
          console.error(`[api/inquiries] Email ${label} Resend error:`, r.value.error);
        } else {
          console.log(`[api/inquiries] Email ${label} sent OK, id:`, r.value?.data?.id);
        }
      });
    } else {
      console.warn("[api/inquiries] RESEND_API_KEY not set — emails skipped");
    }

    return res.status(200).json({
      success: true,
      id: inquiryId,
      message: "Inquiry submitted successfully",
    });
  } catch (err) {
    console.error("[api/inquiries] Unexpected error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to save inquiry. Please try again or call us directly.",
    });
  }
}
