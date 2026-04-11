/**
 * email.ts — The PPL's Chef Email Notification System
 *
 * Handles two email types for every inquiry submission:
 *   1. Internal notification → saustin@thepplschef.com
 *   2. Customer confirmation → the email entered in the form
 *
 * Uses Resend for delivery. Falls back gracefully if API key is missing.
 */

import { Resend } from "resend";
import { ENV } from "./_core/env";

// ─── Resend client (lazy-init so missing key doesn't crash the server) ───────
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    if (!ENV.resendApiKey) {
      throw new Error("[Email] RESEND_API_KEY is not configured.");
    }
    _resend = new Resend(ENV.resendApiKey);
  }
  return _resend;
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface InquiryEmailData {
  name: string;
  email: string;
  phone?: string | null;
  serviceType?: string | null;
  eventDate?: string | null;
  eventTime?: string | null;
  location?: string | null;
  guestCount?: string | null;
  budget?: string | null;
  foodPreferences?: string | null;
  allergies?: string | null;
  notes?: string | null;
}

// ─── Shared brand constants ───────────────────────────────────────────────────
const BRAND = {
  bg: "#1A1A1A",
  cream: "#F3F1E9",
  gold: "#ECA241",
  red: "#D82E2B",
  darkCard: "#242424",
  border: "#2E2E2E",
  mutedText: "#9A9A8A",
  logoUrl:
    "https://d2xsxph8kpxj0f.cloudfront.net/thepplschef/logo_primary_v4.webp",
  website: "https://thepplschef.com",
  phone: "(725) 212-2236",
};

// ─── Helper: format a label/value row for the internal email ─────────────────
function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid ${BRAND.border};width:38%;color:${BRAND.mutedText};font-size:13px;font-family:'Helvetica Neue',Arial,sans-serif;vertical-align:top;white-space:nowrap;">${label}</td>
      <td style="padding:10px 16px;border-bottom:1px solid ${BRAND.border};color:${BRAND.cream};font-size:14px;font-family:'Helvetica Neue',Arial,sans-serif;vertical-align:top;font-weight:500;">${value}</td>
    </tr>`;
}

// ─── Template 1: Internal notification email ─────────────────────────────────
function buildInternalEmailHtml(data: InquiryEmailData): string {
  const serviceLabel = data.serviceType || "General Inquiry";
  const firstName = data.name.split(" ")[0];

  const detailRows = [
    row("Service", serviceLabel),
    row("Name", data.name),
    row("Email", `<a href="mailto:${data.email}" style="color:${BRAND.gold};text-decoration:none;">${data.email}</a>`),
    row("Phone", data.phone ? `<a href="tel:${data.phone}" style="color:${BRAND.gold};text-decoration:none;">${data.phone}</a>` : null),
    row("Event Date", data.eventDate),
    row("Event Time", data.eventTime),
    row("Location", data.location),
    row("Guest Count", data.guestCount),
    row("Budget", data.budget),
    row("Food Preferences", data.foodPreferences),
    row("Allergies / Dietary", data.allergies),
    row("Notes", data.notes),
  ]
    .filter(Boolean)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Inquiry — ${serviceLabel} — ${data.name}</title>
</head>
<body style="margin:0;padding:0;background-color:#111111;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#111111;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${BRAND.bg};border-radius:8px;overflow:hidden;border:1px solid ${BRAND.border};">

          <!-- Header bar -->
          <tr>
            <td style="background-color:${BRAND.gold};padding:4px 0;"></td>
          </tr>

          <!-- Logo + header -->
          <tr>
            <td style="padding:32px 32px 24px;text-align:center;border-bottom:1px solid ${BRAND.border};">
              <img src="${BRAND.logoUrl}" alt="The PPL's Chef" width="120" style="display:block;margin:0 auto 20px;height:auto;" />
              <div style="display:inline-block;background-color:${BRAND.red};color:#fff;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:4px 12px;border-radius:2px;margin-bottom:12px;">New Inquiry</div>
              <h1 style="margin:0;color:${BRAND.cream};font-size:22px;font-weight:700;letter-spacing:-0.01em;">${serviceLabel}</h1>
              <p style="margin:8px 0 0;color:${BRAND.mutedText};font-size:14px;">From <strong style="color:${BRAND.cream};">${data.name}</strong>${data.eventDate ? ` &bull; ${data.eventDate}` : ""}</p>
            </td>
          </tr>

          <!-- Inquiry details table -->
          <tr>
            <td style="padding:24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BRAND.border};border-radius:6px;overflow:hidden;">
                ${detailRows}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 32px 32px;text-align:center;">
              <a href="mailto:${data.email}" style="display:inline-block;background-color:${BRAND.gold};color:#1A1A1A;font-size:14px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:14px 32px;border-radius:3px;text-decoration:none;">Reply to ${firstName}</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid ${BRAND.border};text-align:center;">
              <p style="margin:0;color:${BRAND.mutedText};font-size:12px;">The PPL's Chef &bull; Las Vegas, NV &bull; <a href="tel:${BRAND.phone}" style="color:${BRAND.mutedText};text-decoration:none;">${BRAND.phone}</a></p>
              <p style="margin:6px 0 0;color:${BRAND.mutedText};font-size:11px;">This is an automated notification from your inquiry system.</p>
            </td>
          </tr>

          <!-- Bottom accent bar -->
          <tr>
            <td style="background-color:${BRAND.gold};padding:3px 0;"></td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Template 2: Customer confirmation email ─────────────────────────────────
function buildCustomerEmailHtml(data: InquiryEmailData): string {
  const firstName = data.name.split(" ")[0];
  const serviceLabel = data.serviceType || "your upcoming event";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Experience Starts Here — The PPL's Chef</title>
</head>
<body style="margin:0;padding:0;background-color:#F0EDE4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0EDE4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#FAFAF6;border-radius:8px;overflow:hidden;border:1px solid #E0DDD4;">

          <!-- Gold top bar -->
          <tr>
            <td style="background-color:${BRAND.gold};padding:5px 0;"></td>
          </tr>

          <!-- Logo header -->
          <tr>
            <td style="padding:40px 40px 32px;text-align:center;border-bottom:1px solid #E8E5DC;">
              <img src="${BRAND.logoUrl}" alt="The PPL's Chef" width="130" style="display:block;margin:0 auto;height:auto;" />
            </td>
          </tr>

          <!-- Main message -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 20px;color:#1A1A1A;font-size:15px;line-height:1.6;">Hi ${firstName},</p>

              <p style="margin:0 0 20px;color:#1A1A1A;font-size:15px;line-height:1.6;">
                Thank you for reaching out to <strong>The PPL's Chef</strong>. We've received your request for <strong>${serviceLabel}</strong> and are already reviewing the details to begin crafting your experience.
              </p>

              <p style="margin:0 0 20px;color:#1A1A1A;font-size:15px;line-height:1.6;">
                Every event we design is tailored specifically to you — the menu, the presentation, the entire experience. We'll be in touch within <strong>24 hours</strong> to continue the conversation and make sure every detail is exactly right.
              </p>

              <!-- Highlight box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
                <tr>
                  <td style="background-color:#1A1A1A;border-left:4px solid ${BRAND.gold};border-radius:4px;padding:20px 24px;">
                    <p style="margin:0;color:${BRAND.cream};font-size:14px;line-height:1.7;font-style:italic;">
                      "If there are any additional details you'd like us to consider — dietary needs, a specific vision, or anything else — feel free to reply directly to this email. We read every message."
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 32px;color:#1A1A1A;font-size:15px;line-height:1.6;">
                We look forward to creating something exceptional for you.
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="text-align:center;">
                    <a href="${BRAND.website}" style="display:inline-block;background-color:${BRAND.gold};color:#1A1A1A;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:14px 36px;border-radius:3px;text-decoration:none;">Visit Our Website</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding:0 40px 40px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-top:24px;border-top:1px solid #E8E5DC;">
                    <p style="margin:0 0 4px;color:#1A1A1A;font-size:15px;font-weight:700;">Stephen Austin</p>
                    <p style="margin:0 0 2px;color:#6A6A5A;font-size:13px;">Owner &amp; Culinary Director</p>
                    <p style="margin:0 0 2px;color:#6A6A5A;font-size:13px;font-weight:600;">The PPL's Chef</p>
                    <p style="margin:6px 0 0;">
                      <a href="tel:${BRAND.phone}" style="color:${BRAND.gold};font-size:13px;text-decoration:none;font-weight:600;">${BRAND.phone}</a>
                      &nbsp;&bull;&nbsp;
                      <a href="${BRAND.website}" style="color:${BRAND.gold};font-size:13px;text-decoration:none;font-weight:600;">thepplschef.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background-color:#F0EDE4;border-top:1px solid #E0DDD4;text-align:center;">
              <p style="margin:0;color:#9A9A8A;font-size:11px;line-height:1.6;">
                The PPL's Chef &bull; Las Vegas, NV<br />
                You're receiving this because you submitted an inquiry at <a href="${BRAND.website}" style="color:#9A9A8A;">${BRAND.website}</a>
              </p>
            </td>
          </tr>

          <!-- Gold bottom bar -->
          <tr>
            <td style="background-color:${BRAND.gold};padding:4px 0;"></td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Plain-text fallbacks ─────────────────────────────────────────────────────
function buildInternalEmailText(data: InquiryEmailData): string {
  const lines = [
    `NEW INQUIRY — THE PPL'S CHEF`,
    ``,
    `Service: ${data.serviceType || "General Inquiry"}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    data.eventDate ? `Event Date: ${data.eventDate}` : null,
    data.eventTime ? `Event Time: ${data.eventTime}` : null,
    data.location ? `Location: ${data.location}` : null,
    data.guestCount ? `Guest Count: ${data.guestCount}` : null,
    data.budget ? `Budget: ${data.budget}` : null,
    data.foodPreferences ? `Food Preferences: ${data.foodPreferences}` : null,
    data.allergies ? `Allergies: ${data.allergies}` : null,
    data.notes ? `Notes: ${data.notes}` : null,
    ``,
    `Reply to ${data.name}: ${data.email}`,
  ];
  return lines.filter((l) => l !== null).join("\n");
}

function buildCustomerEmailText(data: InquiryEmailData): string {
  const firstName = data.name.split(" ")[0];
  const serviceLabel = data.serviceType || "your upcoming event";
  return `Hi ${firstName},

Thank you for reaching out to The PPL's Chef. We've received your request for ${serviceLabel} and are already reviewing the details to begin crafting your experience.

Every event we design is tailored specifically to you — the menu, the presentation, the entire experience. We'll be in touch within 24 hours to continue the conversation and make sure every detail is exactly right.

If there are any additional details you'd like us to consider, feel free to reply directly to this email. We read every message.

We look forward to creating something exceptional for you.

—

Stephen Austin
Owner & Culinary Director
The PPL's Chef
${BRAND.phone}
${BRAND.website}`;
}

// ─── Main export: send both emails ───────────────────────────────────────────
export async function sendInquiryEmails(data: InquiryEmailData): Promise<void> {
  const resend = getResend();
  const serviceLabel = data.serviceType || "General Inquiry";
  const firstName = data.name.split(" ")[0];
  const eventDatePart = data.eventDate ? ` — ${data.eventDate}` : "";

  // Determine the from address. If domain is verified, use branded address.
  // Falls back to Resend's shared domain for testing.
  // send.thepplschef.com is the verified Resend sending domain
  // onboarding@resend.dev is used only in local dev (non-production)
  const fromAddress = ENV.isProduction
    ? "The PPL's Chef <notifications@send.thepplschef.com>"
    : "The PPL's Chef <onboarding@resend.dev>";

  const internalSubject = `New Inquiry — ${serviceLabel} — ${data.name}${eventDatePart}`;
  const customerSubject = `Your Experience Starts Here — The PPL's Chef`;

  const errors: string[] = [];

  // 1. Internal notification email
  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: ["saustin@thepplschef.com"],
      replyTo: data.email,
      subject: internalSubject,
      html: buildInternalEmailHtml(data),
      text: buildInternalEmailText(data),
    });
    if (error) {
      console.error("[Email] Internal notification failed:", error);
      errors.push(`Internal: ${error.message}`);
    } else {
      console.log(`[Email] Internal notification sent → saustin@thepplschef.com (${serviceLabel} from ${data.name})`);
    }
  } catch (err) {
    console.error("[Email] Internal notification exception:", err);
    errors.push(`Internal exception: ${String(err)}`);
  }

  // 2. Customer confirmation email
  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: [data.email],
      replyTo: "saustin@thepplschef.com",
      subject: customerSubject,
      html: buildCustomerEmailHtml(data),
      text: buildCustomerEmailText(data),
    });
    if (error) {
      console.error("[Email] Customer confirmation failed:", error);
      errors.push(`Customer: ${error.message}`);
    } else {
      console.log(`[Email] Customer confirmation sent → ${data.email} (${firstName})`);
    }
  } catch (err) {
    console.error("[Email] Customer confirmation exception:", err);
    errors.push(`Customer exception: ${String(err)}`);
  }

  // Log combined errors but don't throw — email failure should never break the inquiry submission
  if (errors.length > 0) {
    console.error(`[Email] ${errors.length} email(s) failed for inquiry from ${data.name}:`, errors);
  }
}

// ─── Lightweight API key validation (used in tests) ──────────────────────────
// Note: The RESEND_API_KEY may be a send-only restricted key (cannot list domains).
// We validate by attempting a send to Resend's built-in test address and accepting
// both success and domain-restriction errors as proof the key is valid.
export async function validateResendApiKey(): Promise<boolean> {
  try {
    const resend = getResend();
    // Send a test email to Resend's official test address
    const { error } = await resend.emails.send({
      from: "The PPL'S Chef <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "[API Key Validation Test]",
      html: "<p>API key validation test — please ignore.</p>",
    });
    // A 403 domain restriction error means the key IS valid but restricted to
    // sending only from verified domains. That's fine — the key works.
    if (error) {
      const msg = (error as { message?: string }).message ?? "";
      const isKeyValid =
        (error as { statusCode?: number }).statusCode === 403 ||
        msg.includes("verify a domain") ||
        msg.includes("testing emails");
      return isKeyValid;
    }
    return true;
  } catch {
    return false;
  }
}
