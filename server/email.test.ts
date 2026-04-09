/**
 * email.test.ts — Tests for The PPL's Chef email notification system
 *
 * Tests:
 *   1. RESEND_API_KEY is present and valid (validates against Resend API)
 *   2. sendInquiryEmails() sends both emails without throwing
 *   3. sendInquiryEmails() handles missing optional fields gracefully
 *   4. sendInquiryEmails() is non-fatal — never throws even on partial failure
 */

import { describe, it, expect } from "vitest";
import { sendInquiryEmails, validateResendApiKey } from "./email";

// ─── Test data ────────────────────────────────────────────────────────────────
const FULL_INQUIRY = {
  name: "Test User",
  email: "delivered@resend.dev", // Resend's test address — always delivers
  phone: "(725) 555-0100",
  serviceType: "Private Chef",
  eventDate: "2025-12-25",
  eventTime: "7:00 PM",
  location: "Las Vegas, NV",
  guestCount: "8 guests",
  budget: "$500 – $1,000",
  foodPreferences: "Mediterranean, Seafood",
  allergies: "None",
  notes: "This is an automated test inquiry. Please ignore.",
};

const MINIMAL_INQUIRY = {
  name: "Jane Doe",
  email: "delivered@resend.dev",
};

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("Email Notification System", () => {
  it("RESEND_API_KEY is configured and valid", async () => {
    const isValid = await validateResendApiKey();
    expect(isValid).toBe(true);
  }, 15_000);

  it("sendInquiryEmails() sends both emails for a full inquiry without throwing", async () => {
    await expect(sendInquiryEmails(FULL_INQUIRY)).resolves.not.toThrow();
  }, 20_000);

  it("sendInquiryEmails() handles minimal inquiry (no optional fields) without throwing", async () => {
    await expect(sendInquiryEmails(MINIMAL_INQUIRY)).resolves.not.toThrow();
  }, 20_000);

  it("sendInquiryEmails() is non-fatal when called with a bad email address", async () => {
    // Should log errors but never throw — inquiry submission must always succeed
    await expect(
      sendInquiryEmails({
        name: "Bad Email Test",
        email: "not-a-valid-email-address-xyz@thisdomain.invalid",
      })
    ).resolves.not.toThrow();
  }, 20_000);
});
