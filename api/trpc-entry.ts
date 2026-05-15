/**
 * Vercel Serverless Function — /api/trpc/*
 *
 * Handles all tRPC API calls including admin.verifyPassword.
 * All local server code is bundled by scripts/build-trpc-function.mjs
 * into api/trpc.js during the Vercel build step.
 *
 * ESM syntax required because package.json has "type":"module".
 */
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express, { type Request, type Response } from "express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Handle CORS preflight
app.options("*", (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-token"
  );
  res.status(200).end();
});

// Mount tRPC at root — Vercel passes the full path so the middleware
// extracts the procedure name from the last path segment automatically.
app.use(
  "/",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default app;
