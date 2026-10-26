import { beforeEach, afterAll, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ send: vi.fn(), list: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.send };
    domains = { list: mocks.list };
    apiKeys = { list: mocks.list };
  },
}));
import { sendInquiryEmails, validateResendApiKey } from "./email";
import { ENV } from "./_core/env";
const original = ENV.resendApiKey;
beforeEach(() => {
  ENV.resendApiKey = "local-test-only";
  mocks.send.mockReset().mockResolvedValue({ data: { id: "local-email" } });
  mocks.list.mockReset().mockResolvedValue({ data: [], error: null });
});
afterAll(() => {
  ENV.resendApiKey = original;
});
describe("email delivery with local provider mocks", () => {
  it("validates the mocked provider without contacting Resend", async () => {
    expect(await validateResendApiKey()).toBe(true);
  });
  it("sends both email types with the original customer address", async () => {
    await sendInquiryEmails({
      name: "Renée O'Connor",
      email: "customer@example.com",
      notes: "Dinner",
    });
    expect(mocks.send).toHaveBeenCalledTimes(2);
    expect(mocks.send.mock.calls[1][0].to).toEqual(["customer@example.com"]);
  });
  it("accepts minimal inquiry details", async () => {
    await expect(
      sendInquiryEmails({ name: "李", email: "customer@example.com" })
    ).resolves.toBeUndefined();
    expect(mocks.send).toHaveBeenCalledTimes(2);
  });
  it("handles provider failures after saving without throwing", async () => {
    mocks.send.mockRejectedValue(new Error("local simulated failure"));
    await expect(
      sendInquiryEmails({ name: "Test", email: "customer@example.com" })
    ).resolves.toBeUndefined();
  });
});
