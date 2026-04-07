// @ts-nocheck
/**
 * Vercel Serverless Function — POST /api/inquiries
 *
 * Plain CommonJS JavaScript (no TypeScript, no ESM) to ensure Vercel
 * can bundle and execute this function without module format conflicts.
 *
 * Features:
 *  - Saves inquiry to Neon PostgreSQL via @neondatabase/serverless
 *  - Sends owner alert email to info@thepplschef.com via Resend
 *  - Sends confirmation email to the client via Resend
 *
 * Required Vercel Environment Variables:
 *  - DATABASE_URL  : Neon PostgreSQL connection string
 *  - RESEND_API_KEY: Resend API key (get from resend.com)
 */

"use strict";

const { neon } = require("@neondatabase/serverless");
const { Resend } = require("resend");

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null; // emails are optional — don't crash if key missing
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

function buildOwnerEmailHtml(data) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Inquiry — The PPL's Chef</title></head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: #000; padding: 24px 32px; text-align: center;">
      <h1 style="color: #ECA241; margin: 0; font-size: 22px; letter-spacing: 2px; text-transform: uppercase;">New Inquiry Received</h1>
      <p style="color: #F3F1E9; margin: 8px 0 0; font-size: 13px; opacity: 0.7;">The PPL's Chef — Las Vegas</p>
    </div>
    
    <!-- Alert banner -->
    <div style="background: #D82E2B; padding: 12px 32px; text-align: center;">
      <p style="color: #fff; margin: 0; font-size: 14px; font-weight: bold;">⚡ Action Required: Review and respond within 24 hours</p>
    </div>
    
    <!-- Body -->
    <div style="padding: 32px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td colspan="2" style="padding: 0 0 16px; border-bottom: 2px solid #ECA241; margin-bottom: 16px;">
          <h2 style="color: #000; margin: 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Client Information</h2>
        </td></tr>
        <tr>
          <td style="padding: 10px 0; color: #666; font-size: 14px; width: 40%; font-weight: bold;">Name</td>
          <td style="padding: 10px 0; color: #000; font-size: 14px;">${data.name}</td>
        </tr>
        <tr style="background: #fafafa;">
          <td style="padding: 10px 8px; color: #666; font-size: 14px; font-weight: bold;">Email</td>
          <td style="padding: 10px 8px; color: #000; font-size: 14px;"><a href="mailto:${data.email}" style="color: #D82E2B;">${data.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #666; font-size: 14px; font-weight: bold;">Phone</td>
          <td style="padding: 10px 0; color: #000; font-size: 14px;">${data.phone || "Not provided"}</td>
        </tr>
        
        <tr><td colspan="2" style="padding: 24px 0 16px;">
          <h2 style="color: #000; margin: 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #ECA241; padding-bottom: 8px;">Event Details</h2>
        </td></tr>
        <tr>
          <td style="padding: 10px 0; color: #666; font-size: 14px; font-weight: bold;">Service Type</td>
          <td style="padding: 10px 0; color: #000; font-size: 14px;">${data.serviceType || "Not specified"}</td>
        </tr>
        <tr style="background: #fafafa;">
          <td style="padding: 10px 8px; color: #666; font-size: 14px; font-weight: bold;">Event Date</td>
          <td style="padding: 10px 8px; color: #000; font-size: 14px;">${formatDate(data.eventDate)}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #666; font-size: 14px; font-weight: bold;">Event Time</td>
          <td style="padding: 10px 0; color: #000; font-size: 14px;">${data.eventTime || "Not specified"}</td>
        </tr>
        <tr style="background: #fafafa;">
          <td style="padding: 10px 8px; color: #666; font-size: 14px; font-weight: bold;">Location</td>
          <td style="padding: 10px 8px; color: #000; font-size: 14px;">${data.location || "Not specified"}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #666; font-size: 14px; font-weight: bold;">Guest Count</td>
          <td style="padding: 10px 0; color: #000; font-size: 14px;">${data.guestCount || "Not specified"}</td>
        </tr>
        <tr style="background: #fafafa;">
          <td style="padding: 10px 8px; color: #666; font-size: 14px; font-weight: bold;">Budget</td>
          <td style="padding: 10px 8px; color: #000; font-size: 14px;">${data.budget || "Not specified"}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #666; font-size: 14px; font-weight: bold;">Food Preferences</td>
          <td style="padding: 10px 0; color: #000; font-size: 14px;">${data.foodPreferences || "None"}</td>
        </tr>
        <tr style="background: #fafafa;">
          <td style="padding: 10px 8px; color: #666; font-size: 14px; font-weight: bold;">Allergies</td>
          <td style="padding: 10px 8px; color: #000; font-size: 14px;">${data.allergies || "None"}</td>
        </tr>
        ${data.notes ? `
        <tr><td colspan="2" style="padding: 16px 0 8px;">
          <h2 style="color: #000; margin: 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #ECA241; padding-bottom: 8px;">Additional Notes</h2>
        </td></tr>
        <tr>
          <td colspan="2" style="padding: 10px 0; color: #333; font-size: 14px; line-height: 1.6;">${data.notes.replace(/\n/g, "<br>")}</td>
        </tr>
        ` : ""}
      </table>
    </div>
    
    <!-- Footer -->
    <div style="background: #000; padding: 20px 32px; text-align: center;">
      <p style="color: #F3F1E9; margin: 0; font-size: 12px; opacity: 0.6;">
        Inquiry #${data.inquiryId} · Submitted ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} PT
      </p>
      <p style="color: #ECA241; margin: 8px 0 0; font-size: 11px;">
        Log in to the admin dashboard to update the inquiry status.
      </p>
    </div>
  </div>
</body>
</html>`;
}

function buildClientEmailHtml(name, serviceType) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>We Received Your Inquiry — The PPL's Chef</title></head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: #000; padding: 32px; text-align: center;">
      <h1 style="color: #ECA241; margin: 0; font-size: 26px; letter-spacing: 2px; text-transform: uppercase; font-style: italic;">The PPL's Chef</h1>
      <p style="color: #F3F1E9; margin: 8px 0 0; font-size: 13px; opacity: 0.7; letter-spacing: 1px; text-transform: uppercase;">Las Vegas Private Chef &amp; Catering</p>
    </div>
    
    <!-- Body -->
    <div style="padding: 40px 32px;">
      <h2 style="color: #000; font-size: 22px; margin: 0 0 16px;">Thank you, ${name}!</h2>
      <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 20px;">
        We've received your inquiry${serviceType ? ` for <strong>${serviceType}</strong>` : ""} and are excited to learn more about your event. 
        Our team will review your request and reach out within <strong>24 hours</strong> to discuss the details and begin crafting your custom experience.
      </p>
      
      <div style="background: #f9f6f0; border-left: 4px solid #ECA241; padding: 20px 24px; margin: 24px 0; border-radius: 0 8px 8px 0;">
        <h3 style="color: #000; margin: 0 0 12px; font-size: 15px; text-transform: uppercase; letter-spacing: 1px;">What Happens Next</h3>
        <ol style="color: #333; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li>Our chef reviews your inquiry details</li>
          <li>We reach out to discuss your vision and any questions</li>
          <li>We prepare a custom menu proposal and quote</li>
          <li>Once confirmed, we handle everything — from prep to cleanup</li>
        </ol>
      </div>
      
      <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 8px;">
        In the meantime, feel free to reach out directly:
      </p>
      <p style="margin: 0;">
        <a href="mailto:info@thepplschef.com" style="color: #D82E2B; font-weight: bold; text-decoration: none;">info@thepplschef.com</a>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="tel:7252122236" style="color: #D82E2B; font-weight: bold; text-decoration: none;">(725) 212-2236</a>
      </p>
    </div>
    
    <!-- Divider -->
    <div style="height: 2px; background: linear-gradient(to right, transparent, #ECA241, transparent); margin: 0 32px;"></div>
    
    <!-- Social / Footer -->
    <div style="background: #000; padding: 24px 32px; text-align: center;">
      <p style="color: #F3F1E9; margin: 0 0 12px; font-size: 13px; opacity: 0.8;">Follow us for behind-the-scenes content and menu inspiration:</p>
      <p style="margin: 0;">
        <a href="https://www.instagram.com/thepplschef" style="color: #ECA241; text-decoration: none; font-size: 13px; margin: 0 8px;">Instagram</a>
        <a href="https://tiktok.com/@thepplschef" style="color: #ECA241; text-decoration: none; font-size: 13px; margin: 0 8px;">TikTok</a>
        <a href="https://facebook.com/thepplschef" style="color: #ECA241; text-decoration: none; font-size: 13px; margin: 0 8px;">Facebook</a>
      </p>
      <p style="color: #F3F1E9; margin: 16px 0 0; font-size: 11px; opacity: 0.4;">
        © ${new Date().getFullYear()} The PPL's Chef · Las Vegas, NV
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ── Main Handler ──────────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
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
    } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ success: false, error: "Name is required" });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ success: false, error: "Valid email is required" });
    }

    // ── Save to database ────────────────────────────────────────────────────
    const sql = getDb();
    let inquiryId = null;

    try {
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
      // Don't fail the whole request for DB errors — still try to send emails
      // and return success so the user isn't left hanging
    }

    // ── Send emails via Resend ──────────────────────────────────────────────
    const resend = getResend();
    if (resend) {
      const FROM_ADDRESS = "notifications@thepplschef.com";
      const OWNER_EMAIL = "info@thepplschef.com";

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

      // Fire both emails in parallel — don't await sequentially
      const emailPromises = [
        // Owner notification
        resend.emails.send({
          from: FROM_ADDRESS,
          to: [OWNER_EMAIL],
          subject: `🍽️ New Inquiry: ${name.trim()}${serviceType ? ` — ${serviceType}` : ""}`,
          html: buildOwnerEmailHtml(emailData),
        }),
        // Client confirmation
        resend.emails.send({
          from: FROM_ADDRESS,
          to: [email.trim()],
          subject: "We received your inquiry — The PPL's Chef",
          html: buildClientEmailHtml(name.trim(), serviceType),
        }),
      ];

      // Don't block the response on email delivery
      Promise.allSettled(emailPromises).then((results) => {
        results.forEach((r, i) => {
          if (r.status === "rejected") {
            console.error(`[api/inquiries] Email ${i === 0 ? "owner" : "client"} failed:`, r.reason);
          }
        });
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
};
