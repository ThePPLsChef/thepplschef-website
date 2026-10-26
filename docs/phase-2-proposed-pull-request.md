# Proposed title

Secure admin sessions, inquiry email rendering, and inquiry failure handling

# Proposed description

Administrative access currently trusts a deterministic password-hash substring without expiry. Inquiry emails interpolate user input as HTML, while REST submissions can report success after database failures and CAPTCHA outages. This proposal replaces the token with signed one-hour sessions, escapes both email implementations, returns explicit persistence/verification failures, and prevents identical REST retries from creating repeated inquiries within ten minutes.

The older tRPC inquiry mutation also uses the shared fail-closed CAPTCHA verifier. The client validates restored administrative sessions, and the tracked serverless bundle is regenerated. No dependency, image, layout, infrastructure, or production configuration changes are included.

Validation: all 108 automated tests pass, including five disposable local PostgreSQL transaction tests and eight concurrent identical submissions producing one inquiry and one email pair. TypeScript, local Vercel build, standalone server bundle, and diff whitespace checks pass. Email/CAPTCHA/DNS providers are mocked. No live-provider, production, preview, or manual browser end-to-end tests were run.

Deployment prerequisites: CEO-approved provisioning of a separate random `ADMIN_SESSION_SECRET` of at least 32 bytes, review of existing CAPTCHA configuration, and rotation of a historical password fixture described as real. Its active status was not tested. Details, limitations, file list, and recovery considerations are in `docs/phase-2-security-report.md`.

Publication is on hold: Stephen must verify automatic deployment behavior and explicitly authorize branch publication and PR creation. This document is a local draft, not an opened PR. Do not enable auto-merge or deploy. Claude reviews the technical proposal; Alex provides the executive recommendation; Stephen retains final approval.
