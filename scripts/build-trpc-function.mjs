/**
 * Build script for the Vercel tRPC serverless function.
 * Bundles server/routers.ts + server/_core/context.ts into api/trpc.js
 * using esbuild, with all local code inlined and npm packages left external.
 *
 * Run: node scripts/build-trpc-function.mjs
 */
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

console.log("🔨 Building tRPC serverless function...");

execFileSync(
  "node_modules/.bin/esbuild",
  [
    "api/trpc-entry.ts",
    "--platform=node",
    "--packages=external",
    "--bundle",
    "--format=esm",
    "--outfile=api/trpc.js",
    "--alias:@shared=./shared",
    "--alias:@shared/_core=./shared/_core",
  ],
  { cwd: root, stdio: "inherit" }
);

console.log("✅ api/trpc.js built successfully");
