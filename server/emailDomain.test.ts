import { beforeEach, describe, expect, it, vi } from "vitest";
const resolveMx = vi.hoisted(() => vi.fn());
vi.mock("dns/promises", () => ({ default: { resolveMx } }));
import { hasMxRecord } from "../api/_lib/emailDomain.js";
beforeEach(() => {
  resolveMx.mockReset();
});
describe("shared email-domain validation", () => {
  it("accepts a domain with MX records", async () => {
    resolveMx.mockResolvedValue([
      { exchange: "mail.example.com", priority: 10 },
    ]);
    expect(await hasMxRecord("customer@example.com")).toBe(true);
    expect(resolveMx).toHaveBeenCalledWith("example.com");
  });
  it("rejects a domain with no MX records", async () => {
    resolveMx.mockResolvedValue([]);
    expect(await hasMxRecord("customer@example.com")).toBe(false);
  });
  it.each(["ENOTFOUND", "ENODATA", "ESERVFAIL"])(
    "preserves rejection for DNS error %s",
    async code => {
      resolveMx.mockRejectedValue({ code });
      expect(await hasMxRecord("customer@example.com")).toBe(false);
    }
  );
  it("preserves the existing transient DNS failure policy", async () => {
    resolveMx.mockRejectedValue({ code: "ETIMEOUT" });
    expect(await hasMxRecord("customer@example.com")).toBe(true);
  });
  it("rejects a missing email domain without a lookup", async () => {
    expect(await hasMxRecord("invalid")).toBe(false);
    expect(resolveMx).not.toHaveBeenCalled();
  });
});
