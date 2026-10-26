/** Opt-in integration test; refuses every destination except the disposable local DB. */
import {
  beforeAll,
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import postgres from "postgres";
const fixture = vi.hoisted(() => ({
  db: null as ReturnType<typeof postgres> | null,
  send: vi.fn().mockResolvedValue({ data: { id: "local-only" } }),
}));
vi.mock("@neondatabase/serverless", () => ({
  neon: () => {
    const sql = (strings: TemplateStringsArray, ...values: unknown[]) => {
      const text = strings.reduce(
        (text, part, index) => text + (index ? `$${index}` : "") + part,
        ""
      );
      return {
        text,
        values,
        then(
          resolve: (rows: unknown) => unknown,
          reject: (error: unknown) => unknown
        ) {
          return fixture
            .db!.unsafe(text, values as never[])
            .then(resolve, reject);
        },
      };
    };
    sql.transaction = async (
      queries: { text: string; values: unknown[] }[],
      options: { isolationLevel: string }
    ) => {
      if (options.isolationLevel !== "ReadCommitted")
        throw new Error("Unexpected isolation level");
      return fixture.db!.begin("isolation level read committed", async tx => {
        const rows = [];
        for (const query of queries)
          rows.push(await tx.unsafe(query.text, query.values as never[]));
        return rows;
      });
    };
    return sql;
  },
}));
vi.mock("dns/promises", () => ({
  default: {
    resolveMx: vi.fn().mockResolvedValue([{ exchange: "test.invalid" }]),
  },
}));
vi.mock("resend", () => ({
  Resend: class {
    emails = {
      send: fixture.send,
    };
  },
}));
import handler from "../api/inquiries.js";

const url = process.env.PPLCHEF_TEST_POSTGRES_URL;
const payload = {
  name: "Local Test",
  email: "local@example.com",
  serviceType: "Private Chef",
  notes: "local integration fixture",
  recaptchaToken: "mocked",
};
async function request(body = payload) {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    setHeader: vi.fn(),
    end: vi.fn(),
  };
  await handler({ method: "POST", body }, res);
  return {
    status: res.status.mock.calls[0][0],
    data: res.json.mock.calls[0][0],
  };
}
describe.skipIf(!url)(
  "disposable local PostgreSQL inquiry transactions",
  () => {
    beforeAll(async () => {
      const parsed = new URL(url!);
      if (
        parsed.hostname !== "127.0.0.1" ||
        parsed.port !== "55432" ||
        parsed.pathname !== "/phase2_test"
      ) {
        throw new Error("Refusing non-local test database");
      }
      fixture.db = postgres(url!, { max: 10 });
      vi.stubEnv("DATABASE_URL", url!);
      vi.stubEnv("RESEND_API_KEY", "local-only");
      vi.stubEnv("RECAPTCHA_SECRET_KEY", "local-only");
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({
            success: true,
            score: 0.9,
            action: "submit_inquiry",
            hostname: "www.thepplschef.com",
          }),
        })
      );
      await fixture.db.unsafe(`
      CREATE TABLE IF NOT EXISTS service_types (id serial PRIMARY KEY, name varchar(100) NOT NULL);
      CREATE TABLE IF NOT EXISTS inquiries (
        id serial PRIMARY KEY, name varchar(255) NOT NULL, email varchar(320) NOT NULL,
        phone varchar(50), "serviceTypeId" integer REFERENCES service_types(id),
        "eventDate" varchar(50), "eventTime" varchar(50), location varchar(500),
        "guestCount" varchar(50), budget varchar(100), "foodPreferences" text,
        allergies text, notes text, status varchar(50) NOT NULL,
        "createdAt" timestamp NOT NULL DEFAULT NOW()
      );
    `);
    });
    beforeEach(async () => {
      fixture.send.mockClear();
      await fixture.db!.unsafe(
        "TRUNCATE inquiries, service_types RESTART IDENTITY CASCADE"
      );
      await fixture.db!`INSERT INTO service_types(name) VALUES ('Private Chef')`;
    });
    afterAll(async () => {
      await fixture.db?.end();
      vi.unstubAllEnvs();
      vi.unstubAllGlobals();
    });
    it("executes the actual handler SQL and persists the expected record", async () => {
      const result = await request();
      expect(result.status).toBe(200);
      const rows = await fixture.db!`SELECT * FROM inquiries`;
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({
        id: result.data.id,
        name: payload.name,
        serviceTypeId: 1,
        status: "new",
        notes: payload.notes,
      });
    });
    it("serializes simultaneous identical submissions into one saved inquiry", async () => {
      const results = await Promise.all(
        Array.from({ length: 8 }, () => request())
      );
      expect(results.every(result => result.status === 200)).toBe(true);
      expect(new Set(results.map(result => result.data.id)).size).toBe(1);
      expect(fixture.send).toHaveBeenCalledTimes(2);
      expect(await fixture.db!`SELECT * FROM inquiries`).toHaveLength(1);
    });
    it("saves a changed inquiry separately", async () => {
      await request();
      await request({ ...payload, notes: "Different event" });
      expect(await fixture.db!`SELECT * FROM inquiries`).toHaveLength(2);
    });
    it("allows an identical new inquiry outside the ten-minute retry window", async () => {
      await request();
      await fixture.db!`UPDATE inquiries SET "createdAt" = NOW() - INTERVAL '11 minutes'`;
      await request();
      expect(await fixture.db!`SELECT * FROM inquiries`).toHaveLength(2);
    });
    it("rolls back a rejected insert and reports a failure", async () => {
      await fixture.db!`ALTER TABLE inquiries ADD CONSTRAINT reject_fixture CHECK (name <> 'Rejected Fixture')`;
      try {
        const result = await request({ ...payload, name: "Rejected Fixture" });
        expect(result.status).toBe(503);
        expect(result.data.success).toBe(false);
        expect(await fixture.db!`SELECT * FROM inquiries`).toHaveLength(0);
      } finally {
        await fixture.db!`ALTER TABLE inquiries DROP CONSTRAINT reject_fixture`;
      }
    });
  }
);
