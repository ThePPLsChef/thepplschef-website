import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  sql: Object.assign(vi.fn(), { transaction: vi.fn() }),
  send: vi.fn(),
  mx: vi.fn(),
  fetch: vi.fn(),
}));
vi.mock("@neondatabase/serverless", () => ({ neon: () => mocks.sql }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.send };
  },
}));
vi.mock("dns/promises", () => ({ default: { resolveMx: mocks.mx } }));
import handler, {
  buildOwnerEmailHtml,
  buildClientEmailHtml,
} from "../api/inquiries.js";
import { buildInternalEmailHtml, buildCustomerEmailHtml } from "./email";

const validCaptcha = {
  success: true,
  score: 0.9,
  action: "submit_inquiry",
  hostname: "www.thepplschef.com",
};
const body = {
  name: "Renée O’Connor",
  email: "customer@example.com",
  phone: "+1 555 0100",
  serviceType: "Private Chef",
  eventDate: "2026-12-01",
  eventTime: "18:00",
  location: "Las Vegas",
  guestCount: "12",
  budget: "$1000",
  foodPreferences: "Thai",
  allergies: "Nuts",
  notes: "Birthday dinner\nPlease call first",
  recaptchaToken: "local-token",
};
async function request(payload = body, method = "POST") {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    setHeader: vi.fn(),
    end: vi.fn(),
  };
  await handler({ method, body: payload }, res);
  return {
    status: res.status.mock.calls[0]?.[0],
    data: res.json.mock.calls[0]?.[0],
    res,
  };
}
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("DATABASE_URL", "postgresql://local-test-only");
  vi.stubEnv("RESEND_API_KEY", "local-test-only");
  vi.stubEnv("RECAPTCHA_SECRET_KEY", "local-test-only");
  vi.stubGlobal("fetch", mocks.fetch);
  mocks.fetch.mockResolvedValue({ ok: true, json: async () => validCaptcha });
  mocks.mx.mockResolvedValue([{ exchange: "mail.example.com", priority: 10 }]);
  mocks.sql.mockReturnValue([]);
  mocks.sql.transaction.mockResolvedValue([[], [{ id: 42, duplicate: false }]]);
  mocks.send.mockResolvedValue({ data: { id: "local-email" } });
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("local inquiry REST regression", () => {
  it("saves complete booking details and sends both confirmations only after persistence", async () => {
    const result = await request();
    expect(result.status).toBe(200);
    expect(result.data).toMatchObject({ success: true, id: 42 });
    expect(mocks.sql.transaction).toHaveBeenCalledOnce();
    expect(mocks.send).toHaveBeenCalledTimes(2);
    expect(mocks.sql.transaction.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.send.mock.invocationCallOrder[0]
    );
    const values = mocks.sql.mock.calls.flatMap(call => call.slice(1));
    for (const key of [
      "name",
      "email",
      "phone",
      "eventDate",
      "eventTime",
      "location",
      "guestCount",
      "budget",
      "foodPreferences",
      "allergies",
      "notes",
    ])
      expect(values).toContain(body[key]);
  });
  it.each([
    "李",
    "李 小龍",
    "Nguyễn Thị Mỹ",
    "محمد علي",
    "Łukasz Żółć",
    "Björk",
    "D’Arcy O'Neill",
    "Ch Ng",
  ])("accepts legitimate name %s", async name => {
    expect((await request({ ...body, name })).status).toBe(200);
  });
  it("accepts a minimal inquiry", async () => {
    expect(
      (
        await request({
          name: "José",
          email: body.email,
          recaptchaToken: "token",
        } as typeof body)
      ).status
    ).toBe(200);
  });
  it.each(["database error", "empty result"])(
    "returns accurate failure and sends no emails for %s",
    async failure => {
      if (failure === "database error")
        mocks.sql.transaction.mockRejectedValueOnce(new Error("offline"));
      else mocks.sql.transaction.mockResolvedValueOnce([[], []]);
      const result = await request();
      expect(result.status).toBe(503);
      expect(result.data.success).toBe(false);
      expect(mocks.send).not.toHaveBeenCalled();
    }
  );
  it("returns the saved ID and does not repeat emails for a duplicate retry", async () => {
    mocks.sql.transaction.mockResolvedValueOnce([
      [],
      [{ id: 42, duplicate: true }],
    ]);
    const result = await request();
    expect(result.data).toMatchObject({ success: true, id: 42 });
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it("keeps a saved inquiry successful when email delivery fails", async () => {
    mocks.send.mockRejectedValue(new Error("email unavailable"));
    expect((await request()).data).toMatchObject({ success: true, id: 42 });
    expect(mocks.sql.transaction).toHaveBeenCalledOnce();
  });
  it("reports bad input without saving", async () => {
    expect((await request({ ...body, email: "invalid" })).status).toBe(400);
    expect(mocks.sql.transaction).not.toHaveBeenCalled();
  });
  it("preserves method handling", async () => {
    expect((await request(body, "GET")).status).toBe(405);
    expect((await request(body, "OPTIONS")).status).toBe(200);
    expect(mocks.sql.transaction).not.toHaveBeenCalled();
  });
});

describe("CAPTCHA fails closed with visible errors", () => {
  it("rejects missing tokens", async () => {
    const result = await request({
      ...body,
      recaptchaToken: undefined,
    } as unknown as typeof body);
    expect(result.status).toBe(400);
    expect(mocks.fetch).not.toHaveBeenCalled();
    expect(mocks.sql.transaction).not.toHaveBeenCalled();
  });
  it("returns explicit service unavailability for missing configuration", async () => {
    vi.stubEnv("RECAPTCHA_SECRET_KEY", "");
    expect((await request()).status).toBe(503);
    expect(mocks.sql.transaction).not.toHaveBeenCalled();
  });
  it.each([
    { success: false },
    { ...validCaptcha, score: 0.69 },
    { ...validCaptcha, score: undefined },
    { ...validCaptcha, score: "0.9" },
    { ...validCaptcha, action: "other" },
    { ...validCaptcha, hostname: "attacker.example" },
    { ...validCaptcha, score: 2 },
  ])("rejects unsuccessful or unbound verification %#", async captcha => {
    mocks.fetch.mockResolvedValueOnce({ ok: true, json: async () => captcha });
    expect((await request()).status).toBe(400);
    expect(mocks.sql.transaction).not.toHaveBeenCalled();
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it.each(["network", "timeout", "http", "json", "malformed"])(
    "returns 503 without side effects on %s failure",
    async failure => {
      if (failure === "network" || failure === "timeout")
        mocks.fetch.mockRejectedValueOnce(new Error(failure));
      if (failure === "http") mocks.fetch.mockResolvedValueOnce({ ok: false });
      if (failure === "json")
        mocks.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => {
            throw new Error("invalid JSON");
          },
        });
      if (failure === "malformed")
        mocks.fetch.mockResolvedValueOnce({ ok: true, json: async () => null });
      expect((await request()).status).toBe(503);
      expect(mocks.sql.transaction).not.toHaveBeenCalled();
      expect(mocks.send).not.toHaveBeenCalled();
    }
  );
  it("uses a bounded provider timeout", async () => {
    await request();
    expect(mocks.fetch.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
  });
});

describe("both email paths escape user-controlled content", () => {
  const attack = `<img src=x onerror="alert('x')">&`;
  it("escapes every owner field, preserves line breaks and protects mailto attributes", () => {
    const data = Object.fromEntries(
      Object.keys(body).map(key => [key, attack])
    );
    const html = buildOwnerEmailHtml({
      ...data,
      inquiryId: attack,
      notes: attack + "\nNext",
    });
    expect(html).not.toContain(attack);
    expect(html).not.toContain("<img src=x");
    expect(html).toContain(
      "&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;&amp;"
    );
    expect(html).toContain("<br>Next");
    expect(html).toContain(`href="mailto:${encodeURIComponent(attack)}"`);
  });
  it("escapes the customer name and service in both template implementations", () => {
    for (const html of [
      buildClientEmailHtml(attack, attack),
      buildCustomerEmailHtml({
        name: attack,
        email: body.email,
        serviceType: attack,
      }),
    ]) {
      expect(html).not.toContain("<img src=x");
      expect(html).toContain("&lt;img");
    }
  });
  it("escapes legacy admin email text and link attributes", () => {
    const html = buildInternalEmailHtml({
      ...body,
      name: attack,
      email: attack,
      phone: attack,
      notes: attack,
    });
    expect(html).not.toContain(attack);
    expect(html).toContain(`href="mailto:${encodeURIComponent(attack)}"`);
    expect(html).toContain(`href="tel:${encodeURIComponent(attack)}"`);
  });
  it("preserves international text and displays punctuation safely", () => {
    const name = "Renée O'Connor 李";
    expect(buildClientEmailHtml(name, "Dîner & fête")).toContain(
      "Renée O&#39;Connor 李"
    );
    expect(buildOwnerEmailHtml({ ...body, name })).toContain(
      "Renée O&#39;Connor 李"
    );
  });
});

describe("shared contact and booking submission helper", () => {
  it("sends the booking payload once and preserves a confirmed ID", async () => {
    const { submitInquiry } = await import("../client/src/lib/submitInquiry");
    mocks.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, id: 42 }),
    });
    await expect(submitInquiry(body)).resolves.toEqual({
      success: true,
      id: 42,
    });
    expect(mocks.fetch).toHaveBeenCalledExactlyOnceWith("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  });
  it("shows the backend error without automatically resubmitting", async () => {
    const { submitInquiry } = await import("../client/src/lib/submitInquiry");
    mocks.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: "Could not save; call us directly.",
      }),
    });
    await expect(submitInquiry(body)).rejects.toThrow(
      "Could not save; call us directly."
    );
    expect(mocks.fetch).toHaveBeenCalledOnce();
  });
});

describe("REST enforces the shared inquiry validation rules", () => {
  it.each([
    { name: "12345" },
    { name: "  " },
    { name: "Name\u0000" },
    { name: "x".repeat(101) },
    { email: "not-an-email" },
    { phone: "x".repeat(31) },
    { serviceType: "x".repeat(101) },
    { serviceType: "Private Chef\r\nInjected" },
    { eventDate: "x".repeat(51) },
    { eventTime: "x".repeat(51) },
    { guestCount: "x".repeat(51) },
    { budget: "x".repeat(51) },
    { allergies: "x".repeat(1001) },
    { foodPreferences: "x".repeat(1001) },
    { location: "x".repeat(201) },
    { notes: "x".repeat(2001) },
    { recaptchaToken: "x".repeat(4097) },
  ])(
    "rejects invalid or oversized fields before side effects %#",
    async fields => {
      expect((await request({ ...body, ...fields })).status).toBe(400);
      expect(mocks.sql).not.toHaveBeenCalled();
      expect(mocks.sql.transaction).not.toHaveBeenCalled();
      expect(mocks.mx).not.toHaveBeenCalled();
      expect(mocks.fetch).not.toHaveBeenCalled();
      expect(mocks.send).not.toHaveBeenCalled();
    }
  );
  it("rejects domains without MX records before saving or CAPTCHA", async () => {
    mocks.mx.mockResolvedValueOnce([]);
    expect((await request()).status).toBe(400);
    expect(mocks.sql.transaction).not.toHaveBeenCalled();
    expect(mocks.fetch).not.toHaveBeenCalled();
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it("trims surrounding whitespace in legitimate names and email addresses", async () => {
    expect(
      (
        await request({
          ...body,
          name: "  李  ",
          email: " customer@example.com ",
        })
      ).status
    ).toBe(200);
    expect(mocks.send.mock.calls[1][0].to).toEqual(["customer@example.com"]);
    expect(mocks.mx).toHaveBeenCalledWith("example.com");
  });
});
