import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminTokenProcedure } from "./_core/trpc";
import { inquiryRouter } from "./routers/inquiry";
import { ENV } from "./_core/env";
import { z } from "zod";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
import { consumeAdminLoginAttempt } from "./_core/adminLoginRateLimit";
import { createAdminSession } from "./_core/adminSession";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  inquiry: inquiryRouter,

  /**
   * Admin password verification — bcrypt compare server-side.
   * Returns a signed token on success that the client stores in sessionStorage.
   * The hash lives only in ADMIN_PASSWORD_HASH env var, never sent to the browser.
   */
  admin: router({
    session: adminTokenProcedure.query(() => ({ success: true as const })),
    verifyPassword: publicProcedure
      .input(z.object({ password: z.string().min(1).max(200) }))
      .mutation(async ({ input }) => {
        if (!ENV.adminPasswordHash) {
          throw new Error("[Admin] ADMIN_PASSWORD_HASH is not configured.");
        }
        let limit: Awaited<ReturnType<typeof consumeAdminLoginAttempt>>;
        try {
          limit = await consumeAdminLoginAttempt();
        } catch {
          throw new TRPCError({
            code: "SERVICE_UNAVAILABLE",
            message:
              "Sign-in is temporarily unavailable. Please try again shortly.",
          });
        }
        if (!limit.allowed) {
          const minutes = Math.ceil(limit.retryAfterSeconds / 60);
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: `Too many sign-in attempts. Please try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
          });
        }
        // The hash is stored as base64 in the env var to avoid $ character
        // stripping by the secrets system. Decode it before comparing.
        const hash = Buffer.from(ENV.adminPasswordHash, "base64").toString(
          "utf8"
        );
        const valid = await bcrypt.compare(input.password, hash);
        if (!valid) {
          // Return false rather than throwing so the client can show a friendly error
          return { success: false as const };
        }
        return { success: true as const, ...(await createAdminSession()) };
      }),
  }),
});

export type AppRouter = typeof appRouter;
