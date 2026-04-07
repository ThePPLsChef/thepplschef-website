/**
 * Vercel Serverless Function — API Handler
 *
 * Vercel requires a default export of a function with signature:
 *   (req: VercelRequest, res: VercelResponse) => void | Promise<void>
 *
 * We create the Express app once at module level (reused across warm invocations)
 * and delegate every request to it using a Promise wrapper.
 */
import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../server/_core/oauth";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { seedServiceTypes } from "../server/db";

// ── Build Express app once (module-level singleton) ──────────────────────────
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// OAuth routes: /api/oauth/callback
registerOAuthRoutes(app);

// tRPC: /api/trpc/*
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", ts: Date.now() });
});

// Seed service types on cold start (non-blocking)
seedServiceTypes()
  .then(() => console.log("[Seed] Service types ready"))
  .catch((err) => console.warn("[Seed] Failed to seed service types:", err));

// ── Vercel handler ────────────────────────────────────────────────────────────
export default function handler(req: VercelRequest, res: VercelResponse) {
  // Cast Vercel's req/res to the Node.js IncomingMessage/ServerResponse types
  // that Express expects — they are compatible at runtime.
  return app(req as any, res as any);
}
