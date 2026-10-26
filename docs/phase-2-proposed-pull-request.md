# Proposed title

Secure admin sessions, login throttling, and inquiry validation

# Proposed description

Administrative access currently trusts a deterministic password-hash substring without expiry. Inquiry emails interpolate user input as HTML, while REST submissions can report success after database failures and CAPTCHA outages. This proposal replaces the token with signed one-hour sessions, escapes both email implementations, returns explicit persistence/verification failures, and prevents identical REST retries from creating repeated inquiries within ten minutes.

Both inquiry endpoints use shared field limits, Unicode name checks, email normalization, MX validation, and the fail-closed CAPTCHA verifier. Login attempts use an atomic counter in the existing PostgreSQL database: ten attempts per fifteen-minute window across workers and IPs, checked before bcrypt. The tRPC preflight now matches the existing Vercel website-origin/credentials policy. The client validates restored administrative sessions, and the tracked serverless bundle is regenerated. No dependency, image, layout, hosting, or production configuration changes are included. A dedicated three-column login-counter table migration is prepared for separate approval; it was applied only to a disposable local database.

Validation: all 179 automated tests pass, including nine disposable local PostgreSQL tests and eight concurrent identical submissions producing one inquiry and one email pair. Thirty concurrent login attempts permit exactly ten, and throttling does not affect authenticated sessions. Both endpoint validation paths and local CORS preflight tests pass. TypeScript, local Vercel build, standalone server bundle, and diff whitespace checks pass. Email/CAPTCHA/DNS providers are mocked. No live-provider, production, preview, or manual browser end-to-end tests were run.

Deployment prerequisites: CEO-approved application of the login-counter migration before deploying updated login code, verification of the existing migration baseline (do not run `db:push` blindly), CEO-approved provisioning of a separate random `ADMIN_SESSION_SECRET` of at least 32 bytes, review of existing CAPTCHA configuration, and rotation of a historical password fixture described as real. Its active status was not tested. Details, limitations, file list, and recovery considerations are in `docs/phase-2-security-report.md`.

Publication is on hold: Stephen must verify automatic deployment behavior and explicitly authorize branch publication and PR creation. This document is a local draft, not an opened PR. Do not enable auto-merge or deploy. Claude reviews the technical proposal; Alex provides the executive recommendation; Stephen retains final approval.
