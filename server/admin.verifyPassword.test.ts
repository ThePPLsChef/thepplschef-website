import {
  beforeAll,
  afterAll,
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { appRouter } from "./routers";
import { ENV } from "./_core/env";
import { createAdminSession, verifyAdminSession } from "./_core/adminSession";
import type { TrpcContext } from "./_core/context";

const password = "local-test-fixture-not-a-real-password";
const secret = "local-only-test-signing-secret-32-bytes-minimum";
const originalHash = ENV.adminPasswordHash;
const context = (token?: string): TrpcContext => ({
  user: null,
  req: {
    headers: token ? { "x-admin-token": token } : {},
  } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});
beforeAll(async () => {
  ENV.adminPasswordHash = Buffer.from(await bcrypt.hash(password, 4)).toString(
    "base64"
  );
});
afterAll(() => {
  ENV.adminPasswordHash = originalHash;
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe("signed administrative authentication", () => {
  it("authenticates the real password procedure and allows protected session access", async () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", secret);
    const result = await appRouter
      .createCaller(context())
      .admin.verifyPassword({ password });
    expect(result.success).toBe(true);
    if (!result.success) throw new Error("Expected login");
    expect(result.expiresAt).toBeGreaterThan(Date.now() / 1000);
    await expect(
      appRouter.createCaller(context(result.token)).admin.session()
    ).resolves.toEqual({ success: true });
    const another = await createAdminSession();
    expect(another.token).not.toBe(result.token);
  });
  it.each(["wrong-password", " "])(
    "rejects an incorrect password",
    async password => {
      vi.stubEnv("ADMIN_SESSION_SECRET", secret);
      await expect(
        appRouter.createCaller(context()).admin.verifyPassword({ password })
      ).resolves.toEqual({ success: false });
    }
  );
  it("rejects missing, malformed, tampered, and legacy hash-derived tokens", async () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", secret);
    const { token } = await createAdminSession();
    const legacy = Buffer.from(
      Buffer.from(ENV.adminPasswordHash, "base64").toString().slice(-20)
    ).toString("base64");
    for (const invalid of [
      undefined,
      "bad-token",
      token.slice(0, -10) + "tamperedxx",
      legacy,
    ]) {
      await expect(
        appRouter.createCaller(context(invalid)).admin.session()
      ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    }
    expect(await verifyAdminSession([token])).toBe(false);
  });
  it("rejects expiry at the exact one-hour boundary", async () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", secret);
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const { token } = await createAdminSession();
    vi.advanceTimersByTime(3_599_000);
    expect(await verifyAdminSession(token)).toBe(true);
    vi.advanceTimersByTime(1000);
    await expect(
      appRouter.createCaller(context(token)).admin.session()
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
  it("fails closed for missing or weak signing configuration", async () => {
    for (const value of ["", "too-short"]) {
      vi.stubEnv("ADMIN_SESSION_SECRET", value);
      await expect(createAdminSession()).rejects.toThrow(
        "ADMIN_SESSION_SECRET"
      );
      expect(await verifyAdminSession("token")).toBe(false);
    }
  });
  it("invalidates sessions when the signing key or password hash changes", async () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", secret);
    const { token } = await createAdminSession();
    vi.stubEnv("ADMIN_SESSION_SECRET", secret + "rotated");
    expect(await verifyAdminSession(token)).toBe(false);
    vi.stubEnv("ADMIN_SESSION_SECRET", secret);
    const saved = ENV.adminPasswordHash;
    try {
      ENV.adminPasswordHash = "changed";
      expect(await verifyAdminSession(token)).toBe(false);
    } finally {
      ENV.adminPasswordHash = saved;
    }
  });
  it("rejects wrong audience and missing expiry even when signed with the test key", async () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", secret);
    for (const builder of [
      new SignJWT({})
        .setIssuer("pplschef-admin")
        .setSubject("admin")
        .setAudience("wrong")
        .setIssuedAt()
        .setExpirationTime("1h"),
      new SignJWT({})
        .setIssuer("pplschef-admin")
        .setSubject("admin")
        .setAudience("pplschef-admin-api")
        .setIssuedAt(),
    ]) {
      const token = await builder
        .setProtectedHeader({ alg: "HS256" })
        .sign(new TextEncoder().encode(secret));
      expect(await verifyAdminSession(token)).toBe(false);
    }
  });
});
