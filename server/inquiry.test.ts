import { describe, it, expect, vi, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { UNAUTHED_ERR_MSG } from "../shared/const";
import { ENV } from "./_core/env";

// ─── Mock DB helpers ───
vi.mock("./db", () => ({
  createInquiry: vi.fn().mockResolvedValue({ id: 42 }),
  listInquiries: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      phone: "555-1234",
      serviceTypeId: 1,
      eventDate: "2026-05-01",
      eventTime: "18:00",
      location: "Las Vegas",
      guestCount: "10-20",
      budget: "1000-2500",
      foodPreferences: "Italian",
      allergies: null,
      notes: "Birthday party",
      status: "new",
      eaterId: null,
      createdAt: new Date("2026-04-07"),
    },
  ]),
  getInquiryById: vi.fn().mockImplementation(async (id: number) => {
    if (id === 1) {
      return {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        phone: "555-1234",
        serviceTypeId: 1,
        eventDate: "2026-05-01",
        eventTime: "18:00",
        location: "Las Vegas",
        guestCount: "10-20",
        budget: "1000-2500",
        foodPreferences: "Italian",
        allergies: null,
        notes: "Birthday party",
        status: "new",
        eaterId: null,
        createdAt: new Date("2026-04-07"),
      };
    }
    return null;
  }),
  updateInquiryStatus: vi.fn().mockResolvedValue({ success: true }),
  getInquiryStats: vi.fn().mockResolvedValue({
    total: 15,
    newCount: 5,
    thisWeek: 3,
    byStatus: { new: 5, reviewed: 4, quoted: 3, booked: 2, cancelled: 1 },
  }),
  getServiceTypes: vi.fn().mockResolvedValue([
    { id: 1, name: "Private Chef", description: "Intimate dining" },
    { id: 2, name: "Catering", description: "Full-service catering" },
    { id: 3, name: "Meal Prep", description: "Chef-crafted meals" },
    { id: 4, name: "Special Events", description: "Celebrations" },
    { id: 5, name: "Corporate Dining", description: "Business events" },
  ]),
  seedServiceTypes: vi.fn().mockResolvedValue(undefined),
  getDb: vi.fn(),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
}));

// ─── Mock notification ───
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// ─── Mock email ───
vi.mock("./email", () => ({
  sendInquiryEmails: vi.fn().mockResolvedValue(undefined),
}));

// ─── Derive the admin token from the env var (same logic as the server) ───
function getAdminToken(): string {
  const base64Hash = ENV.adminPasswordHash ?? "";
  if (!base64Hash) return "test-token-no-hash";
  const hash = Buffer.from(base64Hash, "base64").toString("utf8");
  return Buffer.from(hash.slice(-20)).toString("base64");
}

// ─── Context helpers ───
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAdminTokenContext(): TrpcContext {
  // adminTokenProcedure reads x-admin-token from req.headers
  return {
    user: null,
    req: {
      protocol: "https",
      headers: { "x-admin-token": getAdminToken() },
    } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createWrongTokenContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: { "x-admin-token": "wrong-token-value" },
    } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("inquiry.submit (public)", () => {
  it("creates an inquiry with valid input", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.inquiry.submit({
      name: "John Doe",
      email: "john@example.com",
      phone: "555-0000",
      serviceType: "Private Chef",
      eventDate: "2026-06-15",
      location: "Las Vegas",
      guestCount: "10-20",
    });

    expect(result).toEqual({ success: true, id: 42 });
  });

  it("creates an inquiry with minimal required fields", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.inquiry.submit({
      name: "Jane",
      email: "jane@example.com",
    });

    expect(result).toEqual({ success: true, id: 42 });
  });

  it("rejects empty name", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.inquiry.submit({ name: "", email: "test@example.com" })
    ).rejects.toThrow();
  });

  it("rejects invalid email", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.inquiry.submit({ name: "Test", email: "not-an-email" })
    ).rejects.toThrow();
  });
});

describe("inquiry.serviceTypes (public)", () => {
  it("returns the list of service types", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const types = await caller.inquiry.serviceTypes();

    expect(types).toHaveLength(5);
    expect(types[0]).toHaveProperty("name", "Private Chef");
  });
});

describe("inquiry.list (adminToken)", () => {
  it("returns inquiries for requests with valid admin token", async () => {
    const caller = appRouter.createCaller(createAdminTokenContext());
    const list = await caller.inquiry.list();

    expect(list).toHaveLength(1);
    expect(list[0]).toHaveProperty("name", "Test User");
    expect(list[0]).toHaveProperty("serviceTypeName", "Private Chef");
  });

  it("rejects requests with no token", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.inquiry.list()).rejects.toThrow(UNAUTHED_ERR_MSG);
  });

  it("rejects requests with wrong token", async () => {
    const caller = appRouter.createCaller(createWrongTokenContext());
    await expect(caller.inquiry.list()).rejects.toThrow(UNAUTHED_ERR_MSG);
  });
});

describe("inquiry.detail (adminToken)", () => {
  it("returns inquiry details for valid admin token", async () => {
    const caller = appRouter.createCaller(createAdminTokenContext());
    const detail = await caller.inquiry.detail({ id: 1 });

    expect(detail).toHaveProperty("name", "Test User");
    expect(detail).toHaveProperty("email", "test@example.com");
    expect(detail).toHaveProperty("serviceTypeName", "Private Chef");
  });

  it("throws NOT_FOUND for non-existent inquiry", async () => {
    const caller = appRouter.createCaller(createAdminTokenContext());
    await expect(caller.inquiry.detail({ id: 999 })).rejects.toThrow("Inquiry not found");
  });

  it("rejects requests with no token", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.inquiry.detail({ id: 1 })).rejects.toThrow(UNAUTHED_ERR_MSG);
  });
});

describe("inquiry.updateStatus (adminToken)", () => {
  it("updates status for valid admin token", async () => {
    const caller = appRouter.createCaller(createAdminTokenContext());
    const result = await caller.inquiry.updateStatus({ id: 1, status: "reviewed" });

    expect(result).toEqual({ success: true });
  });

  it("rejects invalid status values", async () => {
    const caller = appRouter.createCaller(createAdminTokenContext());
    await expect(
      // @ts-expect-error testing invalid status
      caller.inquiry.updateStatus({ id: 1, status: "invalid" })
    ).rejects.toThrow();
  });

  it("rejects requests with wrong token", async () => {
    const caller = appRouter.createCaller(createWrongTokenContext());
    await expect(
      caller.inquiry.updateStatus({ id: 1, status: "reviewed" })
    ).rejects.toThrow(UNAUTHED_ERR_MSG);
  });
});

describe("inquiry.stats (adminToken)", () => {
  it("returns dashboard statistics for valid admin token", async () => {
    const caller = appRouter.createCaller(createAdminTokenContext());
    const stats = await caller.inquiry.stats();

    expect(stats).toHaveProperty("total", 15);
    expect(stats).toHaveProperty("newCount", 5);
    expect(stats).toHaveProperty("thisWeek", 3);
    expect(stats.byStatus).toHaveProperty("booked", 2);
  });

  it("rejects requests with no token", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.inquiry.stats()).rejects.toThrow(UNAUTHED_ERR_MSG);
  });
});
