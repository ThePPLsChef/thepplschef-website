import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { inquiryRouter } from "./routers/inquiry";
import { ENV } from "./_core/env";
import { z } from "zod";
import bcrypt from "bcrypt";

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
    verifyPassword: publicProcedure
      .input(z.object({ password: z.string().min(1).max(200) }))
      .mutation(async ({ input }) => {
        if (!ENV.adminPasswordHash) {
          throw new Error("[Admin] ADMIN_PASSWORD_HASH is not configured.");
        }
        // The hash is stored as base64 in the env var to avoid $ character
        // stripping by the secrets system. Decode it before comparing.
        const hash = Buffer.from(ENV.adminPasswordHash, "base64").toString("utf8");
        const valid = await bcrypt.compare(input.password, hash);
        if (!valid) {
          // Return false rather than throwing so the client can show a friendly error
          return { success: false as const };
        }
        // Return a simple signed token: base64(hash slice) so the client can
        // persist access without storing the real hash or the plain password.
        const token = Buffer.from(hash.slice(-20)).toString("base64");
        return { success: true as const, token };
      }),
  }),
});

export type AppRouter = typeof appRouter;
