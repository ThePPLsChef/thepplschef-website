import { eq, desc, sql, and, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, inquiries, InsertInquiry, serviceTypes, InsertServiceType } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── Inquiry helpers ───

export async function createInquiry(data: InsertInquiry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(inquiries).values(data);
  const insertId = result[0].insertId;
  return { id: insertId };
}

export async function listInquiries(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(inquiries)
    .orderBy(desc(inquiries.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getInquiryById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateInquiryStatus(id: number, status: "new" | "reviewed" | "quoted" | "booked" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
  return { success: true };
}

export async function getInquiryStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Total count
  const totalResult = await db.select({ count: sql<number>`count(*)` }).from(inquiries);
  const total = totalResult[0]?.count ?? 0;

  // New count
  const newResult = await db.select({ count: sql<number>`count(*)` }).from(inquiries).where(eq(inquiries.status, "new"));
  const newCount = newResult[0]?.count ?? 0;

  // This week count (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekResult = await db.select({ count: sql<number>`count(*)` }).from(inquiries).where(gte(inquiries.createdAt, weekAgo));
  const thisWeek = weekResult[0]?.count ?? 0;

  // By status breakdown
  const byStatusResult = await db
    .select({
      status: inquiries.status,
      count: sql<number>`count(*)`,
    })
    .from(inquiries)
    .groupBy(inquiries.status);

  const byStatus: Record<string, number> = {};
  for (const row of byStatusResult) {
    byStatus[row.status] = row.count;
  }

  return { total, newCount, thisWeek, byStatus };
}

// ─── Service type helpers ───

export async function getServiceTypes() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(serviceTypes);
}

export async function seedServiceTypes() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(serviceTypes);
  if (existing.length > 0) return; // Already seeded

  const services: InsertServiceType[] = [
    { name: "Private Chef", description: "Intimate, chef-driven dining in the comfort of your home." },
    { name: "Catering", description: "Full-service catering for events of every scale." },
    { name: "Meal Prep", description: "Chef-crafted meals delivered fresh to your door." },
    { name: "Special Events", description: "Unforgettable celebrations with bespoke menus." },
    { name: "Corporate Dining", description: "Elevate your business events with premium dining." },
  ];

  await db.insert(serviceTypes).values(services);
}
