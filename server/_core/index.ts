import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { seedServiceTypes } from "../db";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // robots.txt — served as text/plain
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(
      [
        "User-agent: *",
        "Allow: /",
        "Disallow: /admin",
        "Disallow: /api/",
        "",
        "Sitemap: https://www.thepplschef.com/sitemap.xml",
      ].join("\n")
    );
  });

  // sitemap.xml — served as application/xml
  app.get("/sitemap.xml", (_req, res) => {
    const baseUrl = "https://www.thepplschef.com";
    const routes = [
      { loc: "/", priority: "1.0", changefreq: "weekly" },
      { loc: "/about", priority: "0.8", changefreq: "monthly" },
      { loc: "/menus", priority: "0.8", changefreq: "monthly" },
      { loc: "/gallery", priority: "0.8", changefreq: "weekly" },
      { loc: "/pricing", priority: "0.9", changefreq: "monthly" },
      { loc: "/book", priority: "0.9", changefreq: "monthly" },
      { loc: "/faq", priority: "0.7", changefreq: "monthly" },
      { loc: "/contact", priority: "0.8", changefreq: "monthly" },
      { loc: "/private-chef-las-vegas", priority: "0.8", changefreq: "monthly" },
      { loc: "/catering-las-vegas", priority: "0.8", changefreq: "monthly" },
      { loc: "/meal-prep-las-vegas", priority: "0.8", changefreq: "monthly" },
      { loc: "/special-events-las-vegas", priority: "0.8", changefreq: "monthly" },
      { loc: "/corporate-catering-las-vegas", priority: "0.8", changefreq: "monthly" },
    ];
    const today = new Date().toISOString().split("T")[0];
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...routes.map(
        (r) =>
          `  <url>\n    <loc>${baseUrl}${r.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
      ),
      "</urlset>",
    ].join("\n");
    res.type("application/xml").send(xml);
  });

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

// Seed service types on startup
seedServiceTypes()
  .then(() => console.log("[Seed] Service types ready"))
  .catch((err) => console.warn("[Seed] Failed to seed service types:", err));
