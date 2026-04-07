/**
 * Vercel Serverless Function Entry Point
 *
 * This file wraps the Express/tRPC app as a Vercel serverless function.
 * All /api/* requests are routed here by vercel.json rewrites.
 *
 * The Express app is created once (module-level) and reused across
 * warm invocations for performance.
 */
import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../server/_core/oauth";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { seedServiceTypes } from "../server/db";

const app = express();

// Body parsing
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// OAuth callback
registerOAuthRoutes(app);

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Seed service types (runs once per cold start)
seedServiceTypes()
  .then(() => console.log("[Seed] Service types ready"))
  .catch((err) => console.warn("[Seed] Failed to seed service types:", err));

export default app;
