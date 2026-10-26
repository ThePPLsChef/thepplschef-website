# Phase 2 security review update

Prepared by Codex for Stephen Austin, Claude, and Alex. October 26, 2026.

## Current status

The security repairs are committed in the isolated local development branch and ready for independent review. No branch was pushed, no pull request was opened, and no merge, production deployment, or live preview occurred. **The live website has not received these repairs.**

The proposed changes cover signed, one-hour administrative sessions; durable shared-account login throttling; HTML escaping in both email implementations; accurate inquiry persistence failures; duplicate protection for identical REST retries; fail-closed CAPTCHA verification; matching field/name/email-domain validation on both inquiry endpoints; and consistent tRPC CORS preflight headers.

## What the recheck found

A fresh local run caught a concurrency defect in the login wait calculation. A waiting request could start before another request created or reset the counter window. Calculating the remaining wait from the older statement start time could return 901 seconds for a 900-second window, causing the interface to advise waiting sixteen minutes instead of fifteen. The ten-attempt budget itself remained enforced.

The correction calculates the response wait from the database’s current clock after acquiring the lock, while retaining a stable timestamp for the atomic counter update. A regression test deliberately holds a row lock and resets the window while another request waits. It reproduces the failure with the old calculation and passes with the correction. The generated serverless bundle is updated.

## Latest verification

- Full local suite: **180 passed, 0 failed, 0 skipped**, across eleven test files.
- Ten tests ran against disposable local PostgreSQL, covering the actual inquiry SQL, simultaneous retries, concurrent login limits, window recovery, missing-table failure, and the new timing regression.
- TypeScript, migration consistency, the local Vercel build pipeline, standalone server bundling, and diff checks passed.
- The database tests safely skip when their explicit local-only connection setting is absent. External email, CAPTCHA, and DNS calls were mocked; the CORS tests used loopback only.
- Production/preview behavior, live provider configuration, and manual browser end-to-end behavior were not tested. This is Codex’s local verification, not Claude’s independent review or Alex’s executive approval.

## Actions requiring separate approval

1. Verify automatic deployment behavior, then obtain Stephen’s explicit authorization before publishing a branch or creating a PR.
2. Have Claude review the technical proposal and Alex provide an executive recommendation.
3. Obtain CEO approval to rotate the potentially compromised administrative password and provision the new server-only signing secret. The discovery identifies two historical plaintext password exposures; neither credential was tried against production.
4. Obtain CEO approval to apply the dedicated login-counter migration, after verifying the existing migration baseline, **before deploying the updated login code**. Without the table or database, new sign-ins fail closed. The application does not run migrations automatically.
5. Obtain separate CEO authorization for merge and deployment after review and configuration checks.

The shared-account throttle can temporarily block legitimate new sign-ins if an attacker exhausts the budget; existing authenticated sessions remain usable. Email delivery remains best effort after persistence, and duplicate protection is limited to identical REST submissions within ten minutes. Dependency remediation, image recovery, backups, DNS/ownership verification, and unrelated Manus cleanup remain outside this work.

No production systems, customer records, live credentials, DNS, hosting settings, GitHub security settings, or image storage/references were changed. No paid services were provisioned. The disposable test database was removed after verification.

The complete root-cause analysis, changed-file list, test limits, and rollout prerequisites are in `docs/phase-2-security-report.md`. The local proposed PR description is in `docs/phase-2-proposed-pull-request.md`.
