// api/trpc-entry.ts
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH ?? ""
};

// server/_core/notification.ts
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);
var adminTokenProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    const token = ctx.req.headers["x-admin-token"];
    if (!token || !ENV.adminPasswordHash) {
      throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
    }
    const hash = Buffer.from(ENV.adminPasswordHash, "base64").toString("utf8");
    const expectedToken = Buffer.from(hash.slice(-20)).toString("base64");
    if (token !== expectedToken) {
      throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
    }
    return next({ ctx });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers/inquiry.ts
import { z as z2 } from "zod";
import { TRPCError as TRPCError3 } from "@trpc/server";

// server/db.ts
import { eq, desc, sql, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// drizzle/schema.ts
import {
  pgTable,
  pgEnum,
  serial,
  text,
  varchar,
  integer,
  decimal,
  boolean,
  timestamp
} from "drizzle-orm/pg-core";
var userRoleEnum = pgEnum("user_role", ["user", "admin", "eater", "chef"]);
var inquiryStatusEnum = pgEnum("inquiry_status", ["new", "reviewed", "quoted", "booked", "cancelled"]);
var bookingStatusEnum = pgEnum("booking_status", ["pending", "confirmed", "completed", "cancelled"]);
var quoteStatusEnum = pgEnum("quote_status", ["pending", "accepted", "declined"]);
var paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed", "refunded"]);
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  passwordHash: varchar("passwordHash", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var eaterProfiles = pgTable("eater_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var chefProfiles = pgTable("chef_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  bio: text("bio"),
  specialties: text("specialties"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var serviceTypes = pgTable("service_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description")
});
var inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  eaterId: integer("eaterId").references(() => eaterProfiles.id),
  serviceTypeId: integer("serviceTypeId").references(() => serviceTypes.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  eventDate: varchar("eventDate", { length: 50 }),
  eventTime: varchar("eventTime", { length: 50 }),
  location: varchar("location", { length: 500 }),
  guestCount: varchar("guestCount", { length: 50 }),
  budget: varchar("budget", { length: 100 }),
  foodPreferences: text("foodPreferences"),
  allergies: text("allergies"),
  notes: text("notes"),
  status: inquiryStatusEnum("status").default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  inquiryId: integer("inquiryId").references(() => inquiries.id),
  chefId: integer("chefId").references(() => chefProfiles.id),
  status: bookingStatusEnum("status").default("pending").notNull(),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }),
  depositAmount: decimal("depositAmount", { precision: 10, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  inquiryId: integer("inquiryId").references(() => inquiries.id),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }),
  notes: text("notes"),
  status: quoteStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("bookingId").references(() => bookings.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("bookingId").references(() => bookings.id),
  eaterId: integer("eaterId").references(() => eaterProfiles.id),
  chefId: integer("chefId").references(() => chefProfiles.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  type: varchar("type", { length: 50 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});

// server/db.ts
var _db = null;
function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const sql_client = neon(process.env.DATABASE_URL);
      _db = drizzle(sql_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createInquiry(data) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(inquiries).values(data).returning({ id: inquiries.id });
  return { id: result[0].id };
}
async function listInquiries(limit = 100, offset = 0) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(limit).offset(offset);
}
async function getInquiryById(id) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}
async function updateInquiryStatus(id, status) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
  return { success: true };
}
async function getInquiryStats() {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  const totalResult = await db.select({ count: sql`count(*)` }).from(inquiries);
  const total = Number(totalResult[0]?.count ?? 0);
  const newResult = await db.select({ count: sql`count(*)` }).from(inquiries).where(eq(inquiries.status, "new"));
  const newCount = Number(newResult[0]?.count ?? 0);
  const weekAgo = /* @__PURE__ */ new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekResult = await db.select({ count: sql`count(*)` }).from(inquiries).where(gte(inquiries.createdAt, weekAgo));
  const thisWeek = Number(weekResult[0]?.count ?? 0);
  const byStatusResult = await db.select({
    status: inquiries.status,
    count: sql`count(*)`
  }).from(inquiries).groupBy(inquiries.status);
  const byStatus = {};
  for (const row2 of byStatusResult) {
    byStatus[row2.status] = Number(row2.count);
  }
  return { total, newCount, thisWeek, byStatus };
}
async function getServiceTypes() {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(serviceTypes);
}

// server/email.ts
import { Resend } from "resend";
var _resend = null;
function getResend() {
  if (!_resend) {
    if (!ENV.resendApiKey) {
      throw new Error("[Email] RESEND_API_KEY is not configured.");
    }
    _resend = new Resend(ENV.resendApiKey);
  }
  return _resend;
}
var BRAND = {
  bg: "#1A1A1A",
  cream: "#F3F1E9",
  gold: "#ECA241",
  red: "#D82E2B",
  darkCard: "#242424",
  border: "#2E2E2E",
  mutedText: "#9A9A8A",
  logoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/thepplschef/logo_primary_v4.webp",
  website: "https://thepplschef.com",
  phone: "(725) 212-2236"
};
function row(label, value) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid ${BRAND.border};width:38%;color:${BRAND.mutedText};font-size:13px;font-family:'Helvetica Neue',Arial,sans-serif;vertical-align:top;white-space:nowrap;">${label}</td>
      <td style="padding:10px 16px;border-bottom:1px solid ${BRAND.border};color:${BRAND.cream};font-size:14px;font-family:'Helvetica Neue',Arial,sans-serif;vertical-align:top;font-weight:500;">${value}</td>
    </tr>`;
}
function buildInternalEmailHtml(data) {
  const serviceLabel = data.serviceType || "General Inquiry";
  const firstName = data.name.split(" ")[0];
  const detailRows = [
    row("Service", serviceLabel),
    row("Name", data.name),
    row("Email", `<a href="mailto:${data.email}" style="color:${BRAND.gold};text-decoration:none;">${data.email}</a>`),
    row("Phone", data.phone ? `<a href="tel:${data.phone}" style="color:${BRAND.gold};text-decoration:none;">${data.phone}</a>` : null),
    row("Event Date", data.eventDate),
    row("Event Time", data.eventTime),
    row("Location", data.location),
    row("Guest Count", data.guestCount),
    row("Budget", data.budget),
    row("Food Preferences", data.foodPreferences),
    row("Allergies / Dietary", data.allergies),
    row("Notes", data.notes)
  ].filter(Boolean).join("");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Inquiry \u2014 ${serviceLabel} \u2014 ${data.name}</title>
</head>
<body style="margin:0;padding:0;background-color:#111111;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#111111;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${BRAND.bg};border-radius:8px;overflow:hidden;border:1px solid ${BRAND.border};">

          <!-- Header bar -->
          <tr>
            <td style="background-color:${BRAND.gold};padding:4px 0;"></td>
          </tr>

          <!-- Logo + header -->
          <tr>
            <td style="padding:32px 32px 24px;text-align:center;border-bottom:1px solid ${BRAND.border};">
              <img src="${BRAND.logoUrl}" alt="The PPL's Chef" width="120" style="display:block;margin:0 auto 20px;height:auto;" />
              <div style="display:inline-block;background-color:${BRAND.red};color:#fff;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:4px 12px;border-radius:2px;margin-bottom:12px;">New Inquiry</div>
              <h1 style="margin:0;color:${BRAND.cream};font-size:22px;font-weight:700;letter-spacing:-0.01em;">${serviceLabel}</h1>
              <p style="margin:8px 0 0;color:${BRAND.mutedText};font-size:14px;">From <strong style="color:${BRAND.cream};">${data.name}</strong>${data.eventDate ? ` &bull; ${data.eventDate}` : ""}</p>
            </td>
          </tr>

          <!-- Inquiry details table -->
          <tr>
            <td style="padding:24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BRAND.border};border-radius:6px;overflow:hidden;">
                ${detailRows}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 32px 32px;text-align:center;">
              <a href="mailto:${data.email}" style="display:inline-block;background-color:${BRAND.gold};color:#1A1A1A;font-size:14px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:14px 32px;border-radius:3px;text-decoration:none;">Reply to ${firstName}</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid ${BRAND.border};text-align:center;">
              <p style="margin:0;color:${BRAND.mutedText};font-size:12px;">The PPL's Chef &bull; Las Vegas, NV &bull; <a href="tel:${BRAND.phone}" style="color:${BRAND.mutedText};text-decoration:none;">${BRAND.phone}</a></p>
              <p style="margin:6px 0 0;color:${BRAND.mutedText};font-size:11px;">This is an automated notification from your inquiry system.</p>
            </td>
          </tr>

          <!-- Bottom accent bar -->
          <tr>
            <td style="background-color:${BRAND.gold};padding:3px 0;"></td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
function buildCustomerEmailHtml(data) {
  const firstName = data.name.split(" ")[0];
  const serviceLabel = data.serviceType || "your upcoming event";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Experience Starts Here \u2014 The PPL's Chef</title>
</head>
<body style="margin:0;padding:0;background-color:#F0EDE4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0EDE4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#FAFAF6;border-radius:8px;overflow:hidden;border:1px solid #E0DDD4;">

          <!-- Gold top bar -->
          <tr>
            <td style="background-color:${BRAND.gold};padding:5px 0;"></td>
          </tr>

          <!-- Logo header -->
          <tr>
            <td style="padding:40px 40px 32px;text-align:center;border-bottom:1px solid #E8E5DC;">
              <img src="${BRAND.logoUrl}" alt="The PPL's Chef" width="130" style="display:block;margin:0 auto;height:auto;" />
            </td>
          </tr>

          <!-- Main message -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 20px;color:#1A1A1A;font-size:15px;line-height:1.6;">Hi ${firstName},</p>

              <p style="margin:0 0 20px;color:#1A1A1A;font-size:15px;line-height:1.6;">
                Thank you for reaching out to <strong>The PPL's Chef</strong>. We've received your request for <strong>${serviceLabel}</strong> and are already reviewing the details to begin crafting your experience.
              </p>

              <p style="margin:0 0 20px;color:#1A1A1A;font-size:15px;line-height:1.6;">
                Every event we design is tailored specifically to you \u2014 the menu, the presentation, the entire experience. We'll be in touch within <strong>24 hours</strong> to continue the conversation and make sure every detail is exactly right.
              </p>

              <!-- Highlight box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
                <tr>
                  <td style="background-color:#1A1A1A;border-left:4px solid ${BRAND.gold};border-radius:4px;padding:20px 24px;">
                    <p style="margin:0;color:${BRAND.cream};font-size:14px;line-height:1.7;font-style:italic;">
                      "If there are any additional details you'd like us to consider \u2014 dietary needs, a specific vision, or anything else \u2014 feel free to reply directly to this email. We read every message."
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 32px;color:#1A1A1A;font-size:15px;line-height:1.6;">
                We look forward to creating something exceptional for you.
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="text-align:center;">
                    <a href="${BRAND.website}" style="display:inline-block;background-color:${BRAND.gold};color:#1A1A1A;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:14px 36px;border-radius:3px;text-decoration:none;">Visit Our Website</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding:0 40px 40px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-top:24px;border-top:1px solid #E8E5DC;">
                    <p style="margin:0 0 4px;color:#1A1A1A;font-size:15px;font-weight:700;">Stephen Austin</p>
                    <p style="margin:0 0 2px;color:#6A6A5A;font-size:13px;">Owner &amp; Culinary Director</p>
                    <p style="margin:0 0 2px;color:#6A6A5A;font-size:13px;font-weight:600;">The PPL's Chef</p>
                    <p style="margin:6px 0 0;">
                      <a href="tel:${BRAND.phone}" style="color:${BRAND.gold};font-size:13px;text-decoration:none;font-weight:600;">${BRAND.phone}</a>
                      &nbsp;&bull;&nbsp;
                      <a href="${BRAND.website}" style="color:${BRAND.gold};font-size:13px;text-decoration:none;font-weight:600;">thepplschef.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background-color:#F0EDE4;border-top:1px solid #E0DDD4;text-align:center;">
              <p style="margin:0;color:#9A9A8A;font-size:11px;line-height:1.6;">
                The PPL's Chef &bull; Las Vegas, NV<br />
                You're receiving this because you submitted an inquiry at <a href="${BRAND.website}" style="color:#9A9A8A;">${BRAND.website}</a>
              </p>
            </td>
          </tr>

          <!-- Gold bottom bar -->
          <tr>
            <td style="background-color:${BRAND.gold};padding:4px 0;"></td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
function buildInternalEmailText(data) {
  const lines = [
    `NEW INQUIRY \u2014 THE PPL'S CHEF`,
    ``,
    `Service: ${data.serviceType || "General Inquiry"}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    data.eventDate ? `Event Date: ${data.eventDate}` : null,
    data.eventTime ? `Event Time: ${data.eventTime}` : null,
    data.location ? `Location: ${data.location}` : null,
    data.guestCount ? `Guest Count: ${data.guestCount}` : null,
    data.budget ? `Budget: ${data.budget}` : null,
    data.foodPreferences ? `Food Preferences: ${data.foodPreferences}` : null,
    data.allergies ? `Allergies: ${data.allergies}` : null,
    data.notes ? `Notes: ${data.notes}` : null,
    ``,
    `Reply to ${data.name}: ${data.email}`
  ];
  return lines.filter((l) => l !== null).join("\n");
}
function buildCustomerEmailText(data) {
  const firstName = data.name.split(" ")[0];
  const serviceLabel = data.serviceType || "your upcoming event";
  return `Hi ${firstName},

Thank you for reaching out to The PPL's Chef. We've received your request for ${serviceLabel} and are already reviewing the details to begin crafting your experience.

Every event we design is tailored specifically to you \u2014 the menu, the presentation, the entire experience. We'll be in touch within 24 hours to continue the conversation and make sure every detail is exactly right.

If there are any additional details you'd like us to consider, feel free to reply directly to this email. We read every message.

We look forward to creating something exceptional for you.

\u2014

Stephen Austin
Owner & Culinary Director
The PPL's Chef
${BRAND.phone}
${BRAND.website}`;
}
async function sendInquiryEmails(data) {
  const resend = getResend();
  const serviceLabel = data.serviceType || "General Inquiry";
  const firstName = data.name.split(" ")[0];
  const eventDatePart = data.eventDate ? ` \u2014 ${data.eventDate}` : "";
  const fromAddress = ENV.isProduction ? "The PPL's Chef <notifications@send.thepplschef.com>" : "The PPL's Chef <onboarding@resend.dev>";
  const internalSubject = `New Inquiry \u2014 ${serviceLabel} \u2014 ${data.name}${eventDatePart}`;
  const customerSubject = `Your Experience Starts Here \u2014 The PPL's Chef`;
  const errors = [];
  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: ["saustin@thepplschef.com"],
      replyTo: data.email,
      subject: internalSubject,
      html: buildInternalEmailHtml(data),
      text: buildInternalEmailText(data)
    });
    if (error) {
      console.error("[Email] Internal notification failed:", error);
      errors.push(`Internal: ${error.message}`);
    } else {
      console.log(`[Email] Internal notification sent \u2192 saustin@thepplschef.com (${serviceLabel} from ${data.name})`);
    }
  } catch (err) {
    console.error("[Email] Internal notification exception:", err);
    errors.push(`Internal exception: ${String(err)}`);
  }
  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: [data.email],
      replyTo: "saustin@thepplschef.com",
      subject: customerSubject,
      html: buildCustomerEmailHtml(data),
      text: buildCustomerEmailText(data)
    });
    if (error) {
      console.error("[Email] Customer confirmation failed:", error);
      errors.push(`Customer: ${error.message}`);
    } else {
      console.log(`[Email] Customer confirmation sent \u2192 ${data.email} (${firstName})`);
    }
  } catch (err) {
    console.error("[Email] Customer confirmation exception:", err);
    errors.push(`Customer exception: ${String(err)}`);
  }
  if (errors.length > 0) {
    console.error(`[Email] ${errors.length} email(s) failed for inquiry from ${data.name}:`, errors);
  }
}

// server/routers/inquiry.ts
var inquiryRouter = router({
  /**
   * Public: submit a new inquiry from any contact/booking form.
   */
  submit: publicProcedure.input(
    z2.object({
      name: z2.string().min(1, "Name is required"),
      email: z2.string().email("Valid email is required"),
      phone: z2.string().optional(),
      serviceType: z2.string().optional(),
      eventDate: z2.string().optional(),
      eventTime: z2.string().optional(),
      location: z2.string().optional(),
      guestCount: z2.string().optional(),
      budget: z2.string().optional(),
      foodPreferences: z2.string().optional(),
      allergies: z2.string().optional(),
      notes: z2.string().optional()
    })
  ).mutation(async ({ input }) => {
    let serviceTypeId;
    if (input.serviceType) {
      try {
        const types = await getServiceTypes();
        const match = types.find(
          (t2) => t2.name.toLowerCase() === input.serviceType.toLowerCase() || t2.name.toLowerCase().replace(/\s+/g, "-") === input.serviceType.toLowerCase()
        );
        if (match) serviceTypeId = match.id;
      } catch {
      }
    }
    const result = await createInquiry({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      serviceTypeId: serviceTypeId ?? null,
      eventDate: input.eventDate ?? null,
      eventTime: input.eventTime ?? null,
      location: input.location ?? null,
      guestCount: input.guestCount ?? null,
      budget: input.budget ?? null,
      foodPreferences: input.foodPreferences ?? null,
      allergies: input.allergies ?? null,
      notes: input.notes ?? null,
      status: "new"
    });
    try {
      const serviceLabel = input.serviceType || "General Inquiry";
      await notifyOwner({
        title: `New Inquiry from ${input.name}`,
        content: [
          `**Service:** ${serviceLabel}`,
          `**Name:** ${input.name}`,
          `**Email:** ${input.email}`,
          input.phone ? `**Phone:** ${input.phone}` : "",
          input.eventDate ? `**Event Date:** ${input.eventDate}` : "",
          input.eventTime ? `**Event Time:** ${input.eventTime}` : "",
          input.location ? `**Location:** ${input.location}` : "",
          input.guestCount ? `**Guests:** ${input.guestCount}` : "",
          input.budget ? `**Budget:** ${input.budget}` : "",
          input.foodPreferences ? `**Food Preferences:** ${input.foodPreferences}` : "",
          input.allergies ? `**Allergies:** ${input.allergies}` : "",
          input.notes ? `**Notes:** ${input.notes}` : ""
        ].filter(Boolean).join("\n")
      });
    } catch (err) {
      console.warn("[Inquiry] Failed to notify owner:", err);
    }
    try {
      await sendInquiryEmails({
        name: input.name,
        email: input.email,
        phone: input.phone,
        serviceType: input.serviceType,
        eventDate: input.eventDate,
        eventTime: input.eventTime,
        location: input.location,
        guestCount: input.guestCount,
        budget: input.budget,
        foodPreferences: input.foodPreferences,
        allergies: input.allergies,
        notes: input.notes
      });
    } catch (err) {
      console.error("[Inquiry] Email sending failed (non-fatal):", err);
    }
    return { success: true, id: result.id };
  }),
  /**
   * Public: get available service types for form dropdowns.
   */
  serviceTypes: publicProcedure.query(async () => {
    return getServiceTypes();
  }),
  /**
   * Admin: list all inquiries, newest first.
   */
  list: adminTokenProcedure.input(
    z2.object({
      limit: z2.number().min(1).max(500).optional(),
      offset: z2.number().min(0).optional()
    }).optional()
  ).query(async ({ input }) => {
    const [rows, types] = await Promise.all([
      listInquiries(input?.limit ?? 100, input?.offset ?? 0),
      getServiceTypes()
    ]);
    const typeMap = new Map(types.map((t2) => [t2.id, t2.name]));
    return rows.map((r) => ({
      ...r,
      serviceTypeName: r.serviceTypeId ? typeMap.get(r.serviceTypeId) ?? null : null
    }));
  }),
  /**
   * Admin: get a single inquiry by ID.
   */
  detail: adminTokenProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
    const inquiry = await getInquiryById(input.id);
    if (!inquiry) {
      throw new TRPCError3({ code: "NOT_FOUND", message: "Inquiry not found" });
    }
    let serviceTypeName = null;
    if (inquiry.serviceTypeId) {
      const types = await getServiceTypes();
      const match = types.find((t2) => t2.id === inquiry.serviceTypeId);
      if (match) serviceTypeName = match.name;
    }
    return { ...inquiry, serviceTypeName };
  }),
  /**
   * Admin: update inquiry status.
   */
  updateStatus: adminTokenProcedure.input(
    z2.object({
      id: z2.number(),
      status: z2.enum(["new", "reviewed", "quoted", "booked", "cancelled"])
    })
  ).mutation(async ({ input }) => {
    return updateInquiryStatus(input.id, input.status);
  }),
  /**
   * Admin: get dashboard statistics.
   */
  stats: adminTokenProcedure.query(async () => {
    return getInquiryStats();
  })
});

// server/routers.ts
import { z as z3 } from "zod";
import bcrypt from "bcrypt";
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  inquiry: inquiryRouter,
  /**
   * Admin password verification — bcrypt compare server-side.
   * Returns a signed token on success that the client stores in sessionStorage.
   * The hash lives only in ADMIN_PASSWORD_HASH env var, never sent to the browser.
   */
  admin: router({
    verifyPassword: publicProcedure.input(z3.object({ password: z3.string().min(1).max(200) })).mutation(async ({ input }) => {
      if (!ENV.adminPasswordHash) {
        throw new Error("[Admin] ADMIN_PASSWORD_HASH is not configured.");
      }
      const hash = Buffer.from(ENV.adminPasswordHash, "base64").toString("utf8");
      const valid = await bcrypt.compare(input.password, hash);
      if (!valid) {
        return { success: false };
      }
      const token = Buffer.from(hash.slice(-20)).toString("base64");
      return { success: true, token };
    })
  })
});

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString2 = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString2(openId) || !isNonEmptyString2(appId) || !isNonEmptyString2(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// api/trpc-entry.ts
var app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-token"
  );
  res.status(200).end();
});
app.use(
  "/",
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
);
var trpc_entry_default = app;
export {
  trpc_entry_default as default
};
