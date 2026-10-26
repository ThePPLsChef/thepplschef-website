# Phase 2 security remediation — local review report

Prepared for Stephen Austin, Founder & CEO, The PPL’S Chef LLC.

## Status and authorization

The initial repairs and the authorized follow-up (durable login throttling, matching inquiry validation, and consistent tRPC preflight headers) are prepared in the local `security/phase-2-remediation` branch. No branch has been pushed and no pull request has been opened. Stephen’s subsequent instruction limits this phase to local fixes and tests until automatic deployment behavior has been verified and he explicitly authorizes publication. This report and the accompanying proposed PR description are ready for independent review by Claude and executive evaluation by Alex. Neither review constitutes deployment approval.

**No production systems were changed.** No production database, customer record, credential, DNS record, hosting configuration, GitHub security setting, main branch, live preview, or deployment was modified. Tests used synthetic data, mocked email/CAPTCHA/DNS services, and a disposable local PostgreSQL container. No live email was sent. No paid service was provisioned.

## Findings and corrections

| Finding | Root cause | Proposed correction and behavior |
| --- | --- | --- |
| Administrative token forgery/reuse | A deterministic base64 substring of the password hash acted as a bearer token with no signature or expiry. | Replace it with an HS256 JWT using a separate server-only signing secret and the existing `jose` dependency. Enforce issuer, audience, subject, issued-at time, a one-hour maximum age, expiry, and password-version binding. Each login receives a random session ID. Missing, malformed, expired, tampered, legacy, or incorrectly signed tokens are rejected by the shared admin middleware. Password-hash or signing-secret changes invalidate existing sessions. |
| Client restored sessions without validation | Any stored token caused the gate to render the dashboard. | Validate restored sessions on the server before rendering. Revalidate every 30 seconds; clear the token and inquiry cache on rejection. Unauthorized admin requests return the user to the gate. Server enforcement applies to every protected request regardless of the client’s display state. |
| HTML email injection | User fields entered HTML text and quoted link attributes without output encoding, in both the REST templates and the older tRPC email templates. | Escape `&`, `<`, `>`, and both quote characters at template boundaries. URI-encode user-derived mailto/tel destinations. Keep recipient and reply-to API fields as original addresses. Escape notes before adding trusted line breaks. Plain-text emails are unchanged. |
| Legitimate names rejected | Latin-vowel, whitespace, and case-transition heuristics rejected real international and single-word names. | Accept Unicode names containing a letter, retain length checks, and reject control/surrogate characters. Protection against HTML injection occurs at rendering, rather than by removing international characters. |
| False inquiry success | REST database exceptions were logged and ignored; confirmation emails and success responses could follow failed inserts. | Return an explicit 503 error when the transaction fails or returns no inquiry ID. Send confirmations only after confirmed persistence. A subsequent email error does not turn a saved inquiry into a false failure. Existing contact and booking helpers display the server’s error and do not automatically retry. |
| Duplicate inquiries after retries | A retry could create another row, particularly after an uncertain response or a post-save email error. | Serialize identical REST submissions using a transaction-scoped PostgreSQL advisory lock, then reuse a matching inquiry from the previous ten minutes. Compare every persisted customer/event field with null-safe comparisons. Use READ COMMITTED so the statement after waiting for the lock sees the committed prior insert. Reuse the saved ID and do not resend emails. No schema migration or production database change is required. |
| CAPTCHA fail-open and alternate endpoint bypass | A missing secret returned synthetic success, provider exceptions were ignored, and the older public tRPC submission did not verify CAPTCHA. | Use one verifier in both endpoints. Missing configuration, provider HTTP/network/timeout errors, and malformed responses produce explicit service-unavailable errors before persistence. Reject missing tokens, unsuccessful verification, absent/invalid scores, scores below the existing 0.7 threshold, wrong action, or wrong hostname. Require action `submit_inquiry` and one of the existing public website hostnames. Bound provider requests to five seconds. There is no development or production bypass. |
| Unlimited administrative password guesses | The public password-verification mutation had no attempt budget. | Add an atomic PostgreSQL counter for the shared administrative account: ten sign-in attempts per fifteen-minute fixed window, shared across processes, serverless instances, and source IPs. Check the counter before bcrypt or session creation. Count both correct and incorrect passwords. Return an explicit throttling error with the remaining wait; fail closed with a service-unavailable message if the counter is unavailable. Existing authenticated sessions do not consume this budget. |
| Inconsistent inquiry input validation | The older tRPC mutation lacked REST’s field caps, name rules, and MX check. REST also accepted event date/time strings longer than the database columns. | Both endpoints now use one schema and email-domain helper. Cap every field, including CAPTCHA tokens; accept international/single-word names; trim names and addresses; reject control characters in names and service labels; retain multiline notes. Limit event date/time to the existing 50-character columns. Known missing-MX domains are rejected on both paths; the existing transient-DNS policy is preserved. |
| Inconsistent CORS preflight | The tRPC function returned a wildcard origin while the existing Vercel API policy specified the website origin and credentials. | Match that existing origin and credentials policy in the function preflight handler. Do not reflect arbitrary origins. No hosting configuration was changed. CORS does not replace server-side authentication or CAPTCHA. |
| Unsafe legacy tests | Tests could contact Resend and included a password fixture labeled as the real administrative password. | Replace the fixture with a synthetic local password and mock all provider calls. Test the actual login procedure and shared authorization middleware, rather than only bcrypt in isolation. Do not read or validate production credentials. |

The checked-in generated `api/trpc.js` has been rebuilt from source, so it no longer contains the old token implementation. Manus components, image URLs/storage, branding, and website layout were preserved. No dependency or lockfile changes were required. The follow-up adds one small database migration for login counters, with matching Drizzle schema and metadata. It has only been applied to the disposable local test database; it must be separately approved and applied before deploying the new authentication code.

## Verification follow-up

A fresh local recheck found a concurrency edge in the login wait estimate: using the request’s statement start time after waiting for another writer could report 901 seconds for a 900-second window. The attempt budget remained enforced. Calculate the response wait from the database wall clock after acquiring the lock; retain a stable statement timestamp for counter updates. A controlled row-lock regression test fails against the previous calculation and passes against the correction. See `docs/phase-2-review-update.md` for the executive update. No production changes were made.

## Automated verification

Final full-suite result: **180 passed, 0 failed, 0 skipped across 11 test files**, including ten opt-in local PostgreSQL tests. TypeScript checking, the local Vercel build pipeline, standalone server bundling, and whitespace validation passed.

| Verification | Result | Evidence and limits |
| --- | --- | --- |
| Actual admin login and authorization | Passed | Correct/wrong passwords; missing, malformed, tampered and legacy tokens; exact one-hour expiry; weak/missing signing configuration; signing-key and password-version changes; wrong audience and missing expiry. Existing inquiry list/detail/status/statistics tests now use signed sessions. |
| Durable login throttling | Passed | Atomic counter migration applied only locally; thirty concurrent attempts permit exactly ten, with one bounded counter row. Verify automatic window recovery, that blocked attempts do not extend the window, missing-table/database/configuration failures, a controlled concurrent-window-reset wait regression, rejection before bcrypt, wrong-password counting, forwarded-header bypass prevention, and continued access for authenticated sessions. |
| Validation parity | Passed | Both actual REST and tRPC handlers reject every oversized field and invalid names before side effects. Check valid international/single-word names, whitespace normalization, service-label control characters, and matching MX rejection. Shared DNS helper tests cover positive, negative, and transient-failure cases without contacting DNS. |
| CORS preflight | Passed | Actual Express preflight requests over loopback only; compare website origin and credentials with the existing Vercel configuration; check arbitrary origins are not reflected and missing-Origin requests still work. |
| HTML email safety | Passed | Both REST and legacy owner/customer templates; malicious tags, quotes, attribute content, ampersands, trusted note line breaks, and international names. Original recipient address remains intact. |
| REST inquiry and booking data | Passed | Full and minimal payloads, international and single-word names, method handling, accurate database errors, duplicate response behavior, email failure after persistence, and the actual shared client submission helper. |
| CAPTCHA | Passed | Missing configuration/token, verification rejection, low/missing/string/out-of-range scores, wrong action/hostname, network/timeout/HTTP/JSON/malformed-response failures, bounded timeout signal, and the legacy tRPC bypass path. All provider results were mocked. |
| PostgreSQL integration | Passed | Actual handler SQL executed against disposable local PostgreSQL 16: saved row and service linkage; eight simultaneous identical requests produce one row and only one pair of confirmation sends; changed details create a separate row; identical submissions outside the ten-minute window create a new row; constraint rejection rolls back and returns failure. |
| Existing regression suite | Passed | Inquiry service types and administrative operations, logout, gallery logic, and metadata tests. Existing email tests now run without live services. |
| TypeScript | Passed | `tsc --noEmit`. |
| Vercel build pipeline | Passed locally | `pnpm run build:vercel`: Vite, metadata injection, SEO prerender, and tRPC bundling. This compiles local artifacts; it does not deploy or create a preview. |
| Standalone server bundle | Passed locally | Existing esbuild server-bundling command. |
| Migration consistency | Passed locally | `drizzle-kit check` and snapshot comparison confirm only the login-counter table is added; all existing tables and enums match the prior snapshot. |
| Default test safety | Passed | Without the explicit local-database URL, all ten database tests are skipped before fixture setup or migrations. The full explicitly configured local run executed and passed all ten. |
| Diff validation | Passed | `git diff --check`. |
| Live providers, production/preview runtime, manual browser end-to-end | Not executed | Deliberately excluded by authorization. Local database tests use a Neon-compatible query adapter over a local PostgreSQL client; they do not validate Neon HTTP transport or the deployed Vercel runtime. |

An initial PostgreSQL test run reported a service-link assertion failure because the local test adapter did not execute awaited service queries. The adapter was corrected to implement the Neon query thenable contract, and the final suite passes. There are no unresolved automated test failures.

To reproduce unit tests, install the frozen lockfile with the repository-pinned pnpm version and run `pnpm test`. Without the explicit local-database setting, the ten PostgreSQL integration tests are skipped. To run those tests, start a disposable local PostgreSQL 16 database named `phase2_test` on `127.0.0.1:55432`, set `PPLCHEF_TEST_POSTGRES_URL` to that database’s local connection string, and run `pnpm test`. The integration suite refuses other hosts, ports, and database names before creating or truncating fixture tables or applying the counter migration. Never set this variable to a production database. Email, DNS, and CAPTCHA are mocked in these tests.

## Remaining risks and deliberate limits

- A historical fixture was explicitly labeled as the real administrative password. The independently supplied discovery report identifies a second, older password in history. Neither credential was tested against production; treat both as compromised. Removing it from current code does not remove it from Git history. Treat it as potentially compromised and arrange CEO-approved password rotation before deployment; do not reuse it. This work did not change any live password or secret or rewrite history.
- Admin sessions remain bearer tokens in sessionStorage, preserving the existing client transport. An XSS vulnerability could steal a valid token until expiry. There is no per-session server-side revocation list; password/signing-secret rotation invalidates sessions globally. MFA remains a separate improvement. The shared-account throttle can temporarily block legitimate new sign-ins when attackers use its budget. Blocked requests do not prolong the fixed window, and established sessions remain usable. This does not replace edge-level traffic protection or guarantee resistance to a volumetric denial of service. Each attempt still contacts the existing database; a small atomic counter does not eliminate that load.
- The REST duplicate guard is intentionally a ten-minute, identical-persisted-content guard, not indefinite exactly-once delivery. Intentional identical submissions during that window share an ID. Changed details or later submissions create new inquiries. The legacy tRPC mutation has the shared CAPTCHA check and propagates database errors, but does not gain REST’s duplicate guard; current contact and booking forms use REST. Cross-endpoint deduplication is not guaranteed.
- Notification delivery remains best effort after a save. Failed notifications are logged; there is no durable email outbox or automatic resend. A duplicate retry intentionally does not resend confirmations. Persisted inquiries remain available in the dashboard.
- CAPTCHA deliberately blocks unverifiable requests with a visible retry/direct-contact message. It cannot guarantee booking availability during a provider outage. Before deployment, configuration must be verified; missing configuration must never be compensated for by silently disabling verification. Local live-provider browser testing would need separately approved development credentials/hostname support, or mocked-provider tests.
- Dependency advisories reported in the independent discovery have not been independently reassessed or patched in this follow-up. Image recovery, backups, DNS/ownership verification, and unrelated Manus cleanup remain outside this change set.
- Existing MX lookup timeout fail-open behavior remains unchanged; it is distinct from CAPTCHA verification. A broader infrastructure/security audit was outside scope.
- The login counter is account-wide by design because the site has one shared administrative password. It stores no passwords, IP addresses, tokens, or customer information. Missing counter schema or database availability blocks new sign-ins with a visible service-unavailable message; there is no in-memory fallback that could be bypassed by a new serverless worker. Production migration/runtime compatibility must be reviewed before rollout.
- Production query performance, provider connectivity, and browser end-to-end behavior have not been exercised. The duplicate lookup uses the existing inquiry schema. The only added table is the login counter; no new database service, index on customer data, hosting change, or other infrastructure change was introduced. Review expected traffic before approving deployment.

## Required separately approved steps

1. Verify automatic branch/PR deployment behavior through the authorized repository/hosting owner. Stephen must explicitly authorize any push and PR creation. Do not trigger a preview to discover whether previews are enabled, and do not change hosting or GitHub settings under this authorization.
2. Have Claude review the local code/report and Alex provide an executive recommendation. A proposed PR description is included alongside this report; no external review request has been sent.
3. Obtain Stephen’s separate approval to rotate the potentially exposed admin password and configure the resulting base64-encoded bcrypt hash. No actual secret belongs in source control.
4. Obtain Stephen’s separate approval to provision a separate cryptographically random `ADMIN_SESSION_SECRET` of at least 32 bytes in the intended runtime. Do not reuse the password hash, a public value, or a browser-exposed variable. The `.env.example` entry is documentation only. Missing/weak configuration prevents new admin sessions.
5. Before approving rollout, verify the existing reCAPTCHA secret/site key pair, website hostnames, action `submit_inquiry`, threshold 0.7, database connection, and email configuration. No production values were accessed or changed for this work.
6. Obtain Stephen’s separate approval before applying `drizzle/0001_admin_login_rate_limits.sql` to production, **before** deploying the updated login code. The reviewed SQL only creates a dedicated three-column counter table. Confirm the production migration baseline and table ownership/permissions first. Do not run the existing `db:push` script as an unchecked shortcut: it generates and applies migrations against whichever database is configured. No production migration has been run, and application startup does not create or modify schema automatically.
7. Only after explicit CEO approval: publish the branch/PR through a path that cannot create a prohibited preview. Merge and deployment require their own explicit CEO authorization. All current sessions will require reauthentication after rollout. Rollback to the old revision would reintroduce the old weaknesses; do not treat it as a secure fallback. A configuration-only recovery may be preferable, but any production action needs approval.

## Files changed

This is the complete proposed change set relative to the original main branch, including the initial local commit and this follow-up.

- `.env.example`
- `api/_lib/emailDomain.d.ts`
- `api/_lib/emailDomain.js`
- `api/_lib/recaptcha.d.ts`
- `api/_lib/recaptcha.js`
- `api/inquiries.js`
- `api/trpc-entry.ts`
- `api/trpc.js`
- `client/src/components/AdminPasswordGate.tsx`
- `client/src/main.tsx`
- `docs/phase-2-proposed-pull-request.md`
- `docs/phase-2-security-report.md`
- `docs/phase-2-review-update.md`
- `drizzle/0001_admin_login_rate_limits.sql`
- `drizzle/meta/0001_snapshot.json`
- `drizzle/meta/_journal.json`
- `drizzle/schema.ts`
- `server/_core/adminLoginRateLimit.ts`
- `server/_core/adminSession.ts`
- `server/_core/trpc.ts`
- `server/admin.loginRateLimit.test.ts`
- `server/admin.verifyPassword.test.ts`
- `server/email.test.ts`
- `server/email.ts`
- `server/emailDomain.test.ts`
- `server/inquiries.api.test.ts`
- `server/inquiries.postgres.test.ts`
- `server/inquiry.test.ts`
- `server/routers.ts`
- `server/routers/inquiry.ts`
- `server/trpc.cors.test.ts`
- `shared/escapeHtml.d.ts`
- `shared/escapeHtml.js`
- `shared/inquiryValidation.d.ts`
- `shared/inquiryValidation.js`
