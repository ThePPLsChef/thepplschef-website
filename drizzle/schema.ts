import {
  pgTable,
  pgEnum,
  serial,
  text,
  varchar,
  integer,
  decimal,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", ["user", "admin", "eater", "chef"]);
export const inquiryStatusEnum = pgEnum("inquiry_status", ["new", "reviewed", "quoted", "booked", "cancelled"]);
export const bookingStatusEnum = pgEnum("booking_status", ["pending", "confirmed", "completed", "cancelled"]);
export const quoteStatusEnum = pgEnum("quote_status", ["pending", "accepted", "declined"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed", "refunded"]);

// ─── Tables ──────────────────────────────────────────────────────────────────

/**
 * Core user table backing auth flow.
 * Extended with role enum for eater/chef/admin separation.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  passwordHash: varchar("passwordHash", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Eater profiles — guests/clients who book services.
 */
export const eaterProfiles = pgTable("eater_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EaterProfile = typeof eaterProfiles.$inferSelect;
export type InsertEaterProfile = typeof eaterProfiles.$inferInsert;

/**
 * Chef profiles — chefs who fulfill bookings.
 */
export const chefProfiles = pgTable("chef_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  bio: text("bio"),
  specialties: text("specialties"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChefProfile = typeof chefProfiles.$inferSelect;
export type InsertChefProfile = typeof chefProfiles.$inferInsert;

/**
 * Service types — the 5 core service offerings.
 */
export const serviceTypes = pgTable("service_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
});

export type ServiceType = typeof serviceTypes.$inferSelect;
export type InsertServiceType = typeof serviceTypes.$inferInsert;

/**
 * Inquiries — the core Phase 1 table. Every form submission creates an inquiry.
 */
export const inquiries = pgTable("inquiries", {
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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

/**
 * Bookings — created when an inquiry is confirmed.
 */
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  inquiryId: integer("inquiryId").references(() => inquiries.id),
  chefId: integer("chefId").references(() => chefProfiles.id),
  status: bookingStatusEnum("status").default("pending").notNull(),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }),
  depositAmount: decimal("depositAmount", { precision: 10, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

/**
 * Quotes — pricing proposals sent to clients.
 */
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  inquiryId: integer("inquiryId").references(() => inquiries.id),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }),
  notes: text("notes"),
  status: quoteStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = typeof quotes.$inferInsert;

/**
 * Payments — payment records for bookings.
 */
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("bookingId").references(() => bookings.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Reviews — client reviews for completed bookings.
 */
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("bookingId").references(() => bookings.id),
  eaterId: integer("eaterId").references(() => eaterProfiles.id),
  chefId: integer("chefId").references(() => chefProfiles.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Notifications — system notifications for users.
 */
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  type: varchar("type", { length: 50 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
