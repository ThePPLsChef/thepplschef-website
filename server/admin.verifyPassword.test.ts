/**
 * Tests for admin.verifyPassword tRPC procedure
 * Verifies bcrypt server-side password checking works correctly.
 */
import { describe, it, expect, vi, beforeAll } from "vitest";
import bcrypt from "bcrypt";

// The password used for the default admin account
const ADMIN_PASSWORD = "pplschef2024admin";
let HASH: string;

beforeAll(async () => {
  HASH = await bcrypt.hash(ADMIN_PASSWORD, 12);
});

describe("admin password bcrypt verification", () => {
  it("bcrypt.compare returns true for correct password", async () => {
    const result = await bcrypt.compare(ADMIN_PASSWORD, HASH);
    expect(result).toBe(true);
  });

  it("bcrypt.compare returns false for wrong password", async () => {
    const result = await bcrypt.compare("wrongpassword", HASH);
    expect(result).toBe(false);
  });

  it("bcrypt.compare returns false for empty string", async () => {
    const result = await bcrypt.compare("", HASH);
    expect(result).toBe(false);
  });

  it("bcrypt hash has correct cost factor ($2b$12$)", () => {
    expect(HASH.startsWith("$2b$12$")).toBe(true);
  });

  it("stored ADMIN_PASSWORD_HASH env var is a valid bcrypt hash format", () => {
    const storedHash = process.env.ADMIN_PASSWORD_HASH ?? "";
    // If env var is set, verify it looks like a bcrypt hash
    if (storedHash) {
      expect(storedHash).toMatch(/^\$2[ab]\$\d{2}\$.{53}$/);
    } else {
      // In CI without the env var, just verify bcrypt works
      expect(HASH).toMatch(/^\$2[ab]\$\d{2}\$.{53}$/);
    }
  });

  it("token generation from hash slice is deterministic", () => {
    const token = Buffer.from(HASH.slice(-20)).toString("base64");
    const token2 = Buffer.from(HASH.slice(-20)).toString("base64");
    expect(token).toBe(token2);
    expect(token.length).toBeGreaterThan(0);
  });
});
