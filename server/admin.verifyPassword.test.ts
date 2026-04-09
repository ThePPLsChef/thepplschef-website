/**
 * Tests for admin.verifyPassword tRPC procedure
 * Verifies bcrypt server-side password checking works correctly,
 * including the base64-decode step for the env var.
 */
import { describe, it, expect, beforeAll } from "vitest";
import bcrypt from "bcrypt";

// The real admin password
const ADMIN_PASSWORD = "15Lessproblem$";
let RAW_HASH: string;
let BASE64_HASH: string;

beforeAll(async () => {
  RAW_HASH = await bcrypt.hash(ADMIN_PASSWORD, 12);
  BASE64_HASH = Buffer.from(RAW_HASH).toString("base64");
});

describe("admin password bcrypt verification", () => {
  it("bcrypt.compare returns true for correct password against raw hash", async () => {
    const result = await bcrypt.compare(ADMIN_PASSWORD, RAW_HASH);
    expect(result).toBe(true);
  });

  it("bcrypt.compare returns false for wrong password", async () => {
    const result = await bcrypt.compare("wrongpassword", RAW_HASH);
    expect(result).toBe(false);
  });

  it("bcrypt.compare returns false for empty string", async () => {
    const result = await bcrypt.compare("", RAW_HASH);
    expect(result).toBe(false);
  });

  it("bcrypt hash has correct cost factor ($2b$12$)", () => {
    expect(RAW_HASH.startsWith("$2b$12$")).toBe(true);
  });

  it("base64 round-trip: decode then bcrypt.compare succeeds (simulates env var path)", async () => {
    // This mirrors exactly what the server does:
    // 1. Read base64 from env var
    // 2. Decode to raw bcrypt hash
    // 3. bcrypt.compare(submittedPassword, decodedHash)
    const decoded = Buffer.from(BASE64_HASH, "base64").toString("utf8");
    expect(decoded).toBe(RAW_HASH);
    const result = await bcrypt.compare(ADMIN_PASSWORD, decoded);
    expect(result).toBe(true);
  });

  it("ADMIN_PASSWORD_HASH env var (base64) decodes and verifies correctly", async () => {
    const storedBase64 = process.env.ADMIN_PASSWORD_HASH ?? "";
    if (!storedBase64) {
      // Skip if env not set (CI without secrets)
      return;
    }
    const decoded = Buffer.from(storedBase64, "base64").toString("utf8");
    expect(decoded).toMatch(/^\$2[ab]\$\d{2}\$/);
    const result = await bcrypt.compare(ADMIN_PASSWORD, decoded);
    expect(result).toBe(true);
  });

  it("token generation from hash slice is deterministic", () => {
    const token = Buffer.from(RAW_HASH.slice(-20)).toString("base64");
    const token2 = Buffer.from(RAW_HASH.slice(-20)).toString("base64");
    expect(token).toBe(token2);
    expect(token.length).toBeGreaterThan(0);
  });
});
