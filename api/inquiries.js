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
 *  - Accepts international names; escapes untrusted HTML email content
 *  - Validates email domain has a live MX record via DNS lookup
 *
 * Required Vercel Environment Variables:
 *  - DATABASE_URL        : Neon PostgreSQL connection string
 *  - RESEND_API_KEY      : Resend API key (resend.com — free tier: 3,000 emails/month)
 *  - RECAPTCHA_SECRET_KEY: Google reCAPTCHA v3 secret key
 */

import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import { InquirySchema } from "../shared/inquiryValidation.js";
import { hasMxRecord } from "./_lib/emailDomain.js";
import { createHash } from "node:crypto";
import { escapeHtml } from "../shared/escapeHtml.js";
import { verifyRecaptcha } from "./_lib/recaptcha.js";

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

export function buildOwnerEmailHtml(data) {
  const emailHref = `mailto:${encodeURIComponent(data.email)}`;
  data = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value == null ? value : escapeHtml(value),
    ])
  );
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
        <tr style="background:#fafafa;"><td style="padding:10px 8px;color:#666;font-size:14px;font-weight:bold;">Email</td><td style="padding:10px 8px;color:#000;font-size:14px;"><a href="${emailHref}" style="color:#D82E2B;">${data.email}</a></td></tr>
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

export function buildClientEmailHtml(name, serviceType) {
  name = escapeHtml(name);
  serviceType = escapeHtml(serviceType);
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
  res.setHeader("Access-Control-Allow-Origin", "https://www.thepplschef.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const body = req.body || {};

    // ── Zod schema validation ─────────────────────────────────────────────────
    const parsed = InquirySchema.safeParse(body);
    if (!parsed.success) {
      console.warn(
        "[api/inquiries] Zod validation failed:",
        parsed.error.flatten()
      );
      return res.status(400).json({
        success: false,
        error: "Invalid input. Please check your form fields and try again.",
      });
    }

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
    } = parsed.data;

    // ── Protection: Email MX record validation ───────────────────────────────
    const mxValid = await hasMxRecord(email.trim());
    if (!mxValid) {
      console.warn(
        "[api/inquiries] MX record check failed for email domain:",
        email
      );
      return res.status(400).json({
        success: false,
        error:
          "The email address provided does not appear to be valid. Please check and try again.",
      });
    }

    // ── Protection 2: reCAPTCHA v3 verification ───────────────────────────────
    try {
      if (!(await verifyRecaptcha(recaptchaToken))) {
        return res.status(400).json({
          success: false,
          error:
            "Security verification failed. Please refresh the page and try again, or call us directly.",
        });
      }
    } catch {
      console.error("[api/inquiries] reCAPTCHA unavailable");
      return res.status(503).json({
        success: false,
        error:
          "Security verification is temporarily unavailable. Please try again shortly or call (725) 212-2236.",
      });
    }

    // ── Save to database ──────────────────────────────────────────────────────
    let inquiryId = null;
    let duplicate = false;

    try {
      const sql = getDb();

      // Try to match service type
      const serviceRows = serviceType
        ? await sql`SELECT id FROM service_types WHERE name = ${serviceType} LIMIT 1`
        : [];
      const serviceTypeId = serviceRows.length > 0 ? serviceRows[0].id : null;

      // Serialize identical submissions across serverless instances without a
      // schema change. READ COMMITTED gives the second statement a fresh snapshot
      // after acquiring the transaction-scoped lock. Compare every stored field.
      const fingerprint = createHash("sha256")
        .update(
          JSON.stringify([
            name.trim(),
            email.trim(),
            phone,
            serviceTypeId,
            eventDate,
            eventTime,
            location,
            guestCount,
            budget,
            foodPreferences,
            allergies,
            notes,
          ])
        )
        .digest();
      const [, inserted] = await sql.transaction(
        [
          sql`SELECT pg_advisory_xact_lock(${fingerprint.readInt32BE(0)}, ${fingerprint.readInt32BE(4)})`,
          sql`
        WITH existing AS (
          SELECT id FROM inquiries WHERE
            name = ${name.trim()} AND email = ${email.trim()}
            AND phone IS NOT DISTINCT FROM ${phone}
            AND "serviceTypeId" IS NOT DISTINCT FROM ${serviceTypeId}
            AND "eventDate" IS NOT DISTINCT FROM ${eventDate}
            AND "eventTime" IS NOT DISTINCT FROM ${eventTime}
            AND location IS NOT DISTINCT FROM ${location}
            AND "guestCount" IS NOT DISTINCT FROM ${guestCount}
            AND budget IS NOT DISTINCT FROM ${budget}
            AND "foodPreferences" IS NOT DISTINCT FROM ${foodPreferences}
            AND allergies IS NOT DISTINCT FROM ${allergies}
            AND notes IS NOT DISTINCT FROM ${notes}
            AND "createdAt" >= NOW() - INTERVAL '10 minutes'
          ORDER BY id DESC LIMIT 1
        ), saved AS (
        INSERT INTO inquiries (
          name, email, phone,
          "serviceTypeId",
          "eventDate", "eventTime", location,
          "guestCount", budget,
          "foodPreferences", allergies, notes,
          status, "createdAt"
        ) SELECT
          ${name.trim()}, ${email.trim()}, ${phone},
          ${serviceTypeId},
          ${eventDate}, ${eventTime}, ${location},
          ${guestCount}, ${budget},
          ${foodPreferences}, ${allergies}, ${notes},
          'new', NOW()
        WHERE NOT EXISTS (SELECT 1 FROM existing)
        RETURNING id
        )
        SELECT id, false AS duplicate FROM saved
        UNION ALL SELECT id, true AS duplicate FROM existing
      `,
        ],
        { isolationLevel: "ReadCommitted" }
      );
      inquiryId = inserted[0]?.id;
      duplicate = inserted[0]?.duplicate === true;
      if (!inquiryId) throw new Error("Insert did not return an inquiry ID");
    } catch (dbErr) {
      console.error("[api/inquiries] Database save failed");
      return res.status(503).json({
        success: false,
        error:
          "We could not confirm your inquiry was saved. Please try again shortly or call (725) 212-2236.",
      });
    }

    // ── Send emails via Resend ────────────────────────────────────────────────
    try {
      const resend = duplicate ? null : getResend();
      if (resend) {
        // send.thepplschef.com is the verified Resend sending domain
        const FROM_ADDRESS =
          "The PPL's Chef <notifications@send.thepplschef.com>";
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
            console.error(
              `[api/inquiries] Email ${label} Resend error:`,
              r.value.error
            );
          } else {
            console.log(
              `[api/inquiries] Email ${label} sent OK, id:`,
              r.value?.data?.id
            );
          }
        });
      } else if (!duplicate) {
        console.warn("[api/inquiries] RESEND_API_KEY not set — emails skipped");
      }
    } catch {
      console.error(
        "[api/inquiries] Email delivery failed after saving inquiry"
      );
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
