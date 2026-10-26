import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createServer, request } from "node:http";
import app from "../api/trpc-entry";
import { readFileSync } from "node:fs";
const server = createServer(app);
let port: number;
beforeAll(async () => {
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("Missing local test listener");
  port = address.port;
});
afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close(error => (error ? reject(error) : resolve()))
  );
});
async function preflight(origin?: string) {
  return new Promise<{
    status: number | undefined;
    headers: Record<string, unknown>;
  }>((resolve, reject) => {
    const req = request(
      {
        hostname: "127.0.0.1",
        port,
        path: "/admin.verifyPassword",
        method: "OPTIONS",
        agent: false,
        headers: origin
          ? {
              Origin: origin,
              "Access-Control-Request-Method": "POST",
              "Access-Control-Request-Headers": "x-admin-token,content-type",
            }
          : {},
      },
      res => {
        res.resume();
        res.on("end", () =>
          resolve({ status: res.statusCode, headers: res.headers })
        );
      }
    );
    req.on("error", reject);
    req.end();
  });
}
describe("tRPC CORS preflight on loopback only", () => {
  it("matches the existing Vercel credentials and website-origin policy", async () => {
    const config = JSON.parse(
      readFileSync(new URL("../vercel.json", import.meta.url), "utf8")
    );
    const headers = config.headers.find(
      (entry: { source: string }) => entry.source === "/api/:path*"
    ).headers;
    const response = await preflight("https://www.thepplschef.com");
    expect(response.status).toBe(200);
    for (const name of [
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
    ]) {
      expect(response.headers[name.toLowerCase()]).toBe(
        headers.find((header: { key: string }) => header.key === name).value
      );
    }
    expect(response.headers["access-control-allow-headers"]).toContain(
      "x-admin-token"
    );
    expect(response.headers["access-control-allow-methods"]).toContain("POST");
  });
  it("does not reflect an arbitrary requesting origin or send a wildcard", async () => {
    const response = await preflight("https://untrusted.invalid");
    expect(response.headers["access-control-allow-origin"]).toBe(
      "https://www.thepplschef.com"
    );
    expect(response.headers["access-control-allow-origin"]).not.toBe("*");
  });
  it("keeps requests without an Origin header functional", async () => {
    expect((await preflight()).status).toBe(200);
  });
});
