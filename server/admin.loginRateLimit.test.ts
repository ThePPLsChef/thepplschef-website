import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  sql: vi.fn(),
  compare: vi.fn(),
  createSession: vi.fn(),
  verifySession: vi.fn(),
}));
vi.mock("@neondatabase/serverless", () => ({ neon: () => mocks.sql }));
vi.mock("bcrypt", () => ({ default: { compare: mocks.compare } }));
vi.mock("./_core/adminSession", () => ({
  createAdminSession: mocks.createSession,
  verifyAdminSession: mocks.verifySession,
}));
import { consumeAdminLoginAttempt } from "./_core/adminLoginRateLimit";
import { appRouter } from "./routers";
import { ENV } from "./_core/env";
import type { TrpcContext } from "./_core/context";
const originalHash = ENV.adminPasswordHash;
const ctx = { user: null, req: { headers: {} }, res: {} } as TrpcContext;
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("DATABASE_URL", "postgresql://local-only");
  ENV.adminPasswordHash = Buffer.from("synthetic-test-hash").toString("base64");
  mocks.sql.mockResolvedValue([{ attempts: 1, retryAfterSeconds: 900 }]);
  mocks.compare.mockResolvedValue(true);
  mocks.verifySession.mockResolvedValue(true);
  mocks.createSession.mockResolvedValue({
    token: "local-test-session",
    expiresAt: 123,
  });
});
afterAll(() => {
  ENV.adminPasswordHash = originalHash;
  vi.unstubAllEnvs();
});

describe("administrative login throttling", () => {
  it("permits valid credentials while budget remains", async () => {
    await expect(
      appRouter.createCaller(ctx).admin.verifyPassword({ password: "fixture" })
    ).resolves.toMatchObject({ success: true, token: "local-test-session" });
    expect(mocks.sql).toHaveBeenCalledOnce();
    expect(mocks.sql.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.compare.mock.invocationCallOrder[0]
    );
  });
  it("consumes a slot for wrong passwords too", async () => {
    mocks.compare.mockResolvedValue(false);
    await expect(
      appRouter.createCaller(ctx).admin.verifyPassword({ password: "wrong" })
    ).resolves.toEqual({ success: false });
    expect(mocks.sql).toHaveBeenCalledOnce();
    expect(mocks.createSession).not.toHaveBeenCalled();
  });
  it("rejects exhausted budgets before bcrypt or session creation", async () => {
    mocks.sql.mockResolvedValue([{ attempts: 11, retryAfterSeconds: 120 }]);
    await expect(
      appRouter.createCaller(ctx).admin.verifyPassword({ password: "fixture" })
    ).rejects.toMatchObject({
      code: "TOO_MANY_REQUESTS",
      message: expect.stringContaining("2 minute"),
    });
    expect(mocks.compare).not.toHaveBeenCalled();
    expect(mocks.createSession).not.toHaveBeenCalled();
  });
  it("cannot bypass the shared account budget with forwarding headers", async () => {
    mocks.sql.mockResolvedValue([{ attempts: 11, retryAfterSeconds: 900 }]);
    const caller = appRouter.createCaller({
      ...ctx,
      req: {
        headers: {
          "x-forwarded-for": "192.0.2.99",
          "x-vercel-forwarded-for": "192.0.2.98",
        },
      } as TrpcContext["req"],
    });
    await expect(
      caller.admin.verifyPassword({ password: "fixture" })
    ).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
    expect(mocks.compare).not.toHaveBeenCalled();
  });
  it("fails closed when the counter database or table is unavailable", async () => {
    mocks.sql.mockRejectedValue(
      new Error("relation missing or database offline")
    );
    await expect(
      appRouter.createCaller(ctx).admin.verifyPassword({ password: "fixture" })
    ).rejects.toMatchObject({ code: "SERVICE_UNAVAILABLE" });
    expect(mocks.compare).not.toHaveBeenCalled();
    expect(mocks.createSession).not.toHaveBeenCalled();
  });
  it("fails closed without database configuration", async () => {
    vi.stubEnv("DATABASE_URL", "");
    await expect(
      appRouter.createCaller(ctx).admin.verifyPassword({ password: "fixture" })
    ).rejects.toMatchObject({ code: "SERVICE_UNAVAILABLE" });
    expect(mocks.sql).not.toHaveBeenCalled();
    expect(mocks.compare).not.toHaveBeenCalled();
  });
  it.each(
    [
      undefined,
      null,
      [],
      [{ attempts: "1", retryAfterSeconds: 900 }],
      [{ attempts: 0, retryAfterSeconds: 900 }],
      [{ attempts: 1, retryAfterSeconds: null }],
    ].map(rows => ({ rows }))
  )("rejects malformed counter responses %#", async ({ rows }) => {
    mocks.sql.mockResolvedValue(rows);
    await expect(consumeAdminLoginAttempt()).rejects.toThrow(
      "Invalid login rate limiter response"
    );
  });
  it("keeps authenticated sessions usable while new sign-ins are throttled", async () => {
    mocks.sql.mockResolvedValue([{ attempts: 11, retryAfterSeconds: 900 }]);
    const caller = appRouter.createCaller({
      ...ctx,
      req: {
        headers: { "x-admin-token": "valid-test-session" },
      } as TrpcContext["req"],
    });
    await expect(caller.admin.session()).resolves.toEqual({ success: true });
    expect(mocks.sql).not.toHaveBeenCalled();
    await expect(
      caller.admin.verifyPassword({ password: "fixture" })
    ).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
  });
});
