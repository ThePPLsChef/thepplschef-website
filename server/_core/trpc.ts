import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";
import { ENV } from "./env";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);

/**
 * adminTokenProcedure — validates the password-gate session token.
 * The token is base64(hash.slice(-20)) where hash is the decoded ADMIN_PASSWORD_HASH.
 * Clients send it via the x-admin-token header.
 */
export const adminTokenProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;
    const token = ctx.req.headers["x-admin-token"] as string | undefined;

    if (!token || !ENV.adminPasswordHash) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
    }

    // Decode the stored base64 hash and derive the expected token
    const hash = Buffer.from(ENV.adminPasswordHash, "base64").toString("utf8");
    const expectedToken = Buffer.from(hash.slice(-20)).toString("base64");

    if (token !== expectedToken) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
    }

    return next({ ctx });
  }),
);
