import { neon } from "@neondatabase/serverless";

export const ADMIN_LOGIN_ATTEMPTS = 10;
export const ADMIN_LOGIN_WINDOW_SECONDS = 15 * 60;

/**
 * This is a single shared admin account, so its budget is account-wide.
 * Atomic PostgreSQL UPSERTs enforce it across workers, processes and IPs.
 * Never trust spoofable forwarding headers or reset the budget on success.
 */
export async function consumeAdminLoginAttempt(): Promise<{
  allowed: boolean;
  retryAfterSeconds: number;
}> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Login rate limiter is unavailable");
  const sql = neon(url);
  // Keep window updates on one stable statement timestamp, but calculate the
  // response wait from wall-clock time after acquiring the row lock. A waiting
  // statement may have started before another request created the window.
  const rows = await sql`
    INSERT INTO admin_login_rate_limits AS limits ("key", attempts, "windowStartedAt")
    VALUES ('admin-password', 1, statement_timestamp())
    ON CONFLICT ("key") DO UPDATE SET
      attempts = CASE
        WHEN limits."windowStartedAt" <= statement_timestamp() - make_interval(secs => ${ADMIN_LOGIN_WINDOW_SECONDS})
        THEN 1 ELSE LEAST(limits.attempts + 1, ${ADMIN_LOGIN_ATTEMPTS + 1}) END,
      "windowStartedAt" = CASE
        WHEN limits."windowStartedAt" <= statement_timestamp() - make_interval(secs => ${ADMIN_LOGIN_WINDOW_SECONDS})
        THEN statement_timestamp() ELSE limits."windowStartedAt" END
    RETURNING attempts,
      GREATEST(1, CEIL(EXTRACT(EPOCH FROM
        ("windowStartedAt" + make_interval(secs => ${ADMIN_LOGIN_WINDOW_SECONDS}) - clock_timestamp()))))::integer AS "retryAfterSeconds"
  `;
  const row = Array.isArray(rows) ? rows[0] : undefined;
  if (
    !row ||
    !Number.isInteger(row.attempts) ||
    row.attempts < 1 ||
    !Number.isInteger(row.retryAfterSeconds) ||
    row.retryAfterSeconds < 1
  ) {
    throw new Error("Invalid login rate limiter response");
  }
  return {
    allowed: row.attempts <= ADMIN_LOGIN_ATTEMPTS,
    retryAfterSeconds: row.retryAfterSeconds,
  };
}
