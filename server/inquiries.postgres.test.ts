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
import { readFileSync } from "node:fs";
import { consumeAdminLoginAttempt } from "./_core/adminLoginRateLimit";
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
      // Only the strictly guarded disposable DB above can reach this migration.
      await fixture.db!.unsafe("DROP TABLE IF EXISTS admin_login_rate_limits");
      await fixture.db!.unsafe(
        readFileSync(
          new URL(
            "../drizzle/0001_admin_login_rate_limits.sql",
            import.meta.url
          ),
          "utf8"
        )
      );
    });
    beforeEach(async () => {
      fixture.send.mockClear();
      await fixture.db!.unsafe(
        "TRUNCATE inquiries, service_types RESTART IDENTITY CASCADE"
      );
      await fixture.db!`INSERT INTO service_types(name) VALUES ('Private Chef')`;
      await fixture.db!`TRUNCATE admin_login_rate_limits`;
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
    it("enforces one shared login budget across concurrent requests", async () => {
      const results = await Promise.all(
        Array.from({ length: 30 }, () => consumeAdminLoginAttempt())
      );
      expect(results.filter(result => result.allowed)).toHaveLength(10);
      expect(results.filter(result => !result.allowed)).toHaveLength(20);
      const rows = await fixture.db!`SELECT * FROM admin_login_rate_limits`;
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({ key: "admin-password", attempts: 11 });
      expect(
        results.every(
          result =>
            result.retryAfterSeconds > 0 && result.retryAfterSeconds <= 900
        )
      ).toBe(true);
    });
    it("bounds the wait when a request predates a concurrent window reset", async () => {
      let locked!: () => void;
      let release!: () => void;
      const acquired = new Promise<void>(resolve => {
        locked = resolve;
      });
      const proceed = new Promise<void>(resolve => {
        release = resolve;
      });
      await fixture.db!`INSERT INTO admin_login_rate_limits ("key", attempts, "windowStartedAt")
        VALUES ('admin-password', 1, NOW())`;
      const winner = fixture.db!.begin(async tx => {
        await tx`SELECT 1 FROM admin_login_rate_limits WHERE "key" = 'admin-password' FOR UPDATE`;
        locked();
        await proceed;
        await tx`UPDATE admin_login_rate_limits SET "windowStartedAt" = clock_timestamp()
          WHERE "key" = 'admin-password'`;
      });
      await acquired;
      const pending = consumeAdminLoginAttempt();
      let waiting = false;
      try {
        for (let count = 0; count < 100; count++) {
          const rows = await fixture.db!`
            SELECT 1 FROM pg_stat_activity
            WHERE datname = current_database() AND wait_event_type = 'Lock'
              AND position('INSERT INTO admin_login_rate_limits AS limits' in query) > 0
          `;
          if (rows.length) {
            waiting = true;
            break;
          }
        }
      } finally {
        release();
      }
      await winner;
      const result = await pending;
      expect(waiting).toBe(true);
      expect(result.allowed).toBe(true);
      expect(result.retryAfterSeconds).toBeGreaterThan(0);
      expect(result.retryAfterSeconds).toBeLessThanOrEqual(900);
    });
    it("automatically restores the login budget after fifteen minutes", async () => {
      await fixture.db!`INSERT INTO admin_login_rate_limits ("key", attempts, "windowStartedAt") VALUES ('admin-password', 11, NOW() - INTERVAL '16 minutes')`;
      expect(await consumeAdminLoginAttempt()).toMatchObject({
        allowed: true,
        retryAfterSeconds: 900,
      });
      const rows =
        await fixture.db!`SELECT attempts FROM admin_login_rate_limits`;
      expect(rows[0].attempts).toBe(1);
    });
    it("blocked requests do not prolong the current login window", async () => {
      await fixture.db!`INSERT INTO admin_login_rate_limits ("key", attempts, "windowStartedAt") VALUES ('admin-password', 11, NOW() - INTERVAL '10 minutes')`;
      const result = await consumeAdminLoginAttempt();
      expect(result.allowed).toBe(false);
      expect(result.retryAfterSeconds).toBeGreaterThan(0);
      expect(result.retryAfterSeconds).toBeLessThanOrEqual(300);
    });
    it("fails closed if the required counter table is missing", async () => {
      await fixture.db!`ALTER TABLE admin_login_rate_limits RENAME TO missing_login_rate_limits`;
      try {
        await expect(consumeAdminLoginAttempt()).rejects.toThrow();
      } finally {
        await fixture.db!`ALTER TABLE missing_login_rate_limits RENAME TO admin_login_rate_limits`;
      }
    });
  }
);
