/**
 * Vercel Serverless Function — POST /api/inquiries
 *
 * A simple, self-contained endpoint that:
 *  1. Accepts form data as JSON
 *  2. Inserts a row into the inquiries table via the postgres npm package
 *  3. Returns a JSON success/error response
 *
 * Deliberately avoids tRPC, Drizzle, and Express to maximise Vercel compatibility.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import postgres from "postgres";

// ── DB connection (created once per cold start) ───────────────────────────────
function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL environment variable is not set");
  return postgres(url, { ssl: "require", max: 1 });
}

// ── Handler ───────────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  let sql: ReturnType<typeof postgres> | null = null;

  try {
    const body = req.body ?? {};

    const {
      name,
      email,
      phone = null,
      serviceType = null,
      eventDate = null,
      eventTime = null,
      location = null,
      guestCount = null,
      budget = null,
      foodPreferences = null,
      allergies = null,
      notes = null,
    } = body;

    // Basic validation
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ success: false, error: "Name is required" });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ success: false, error: "Valid email is required" });
    }

    sql = getDb();

    // Ensure the inquiries table exists (graceful degradation)
    const result = await sql`
      INSERT INTO inquiries (
        name, email, phone,
        "serviceTypeId",
        "eventDate", "eventTime", location,
        "guestCount", budget,
        "foodPreferences", allergies, notes,
        status, "createdAt"
      )
      SELECT
        ${name.trim()},
        ${email.trim()},
        ${phone},
        st.id,
        ${eventDate}, ${eventTime}, ${location},
        ${guestCount}, ${budget},
        ${foodPreferences}, ${allergies}, ${notes},
        'new',
        NOW()
      FROM (
        SELECT id FROM service_types WHERE name = ${serviceType} LIMIT 1
      ) st
      RETURNING id
    `;

    // If serviceType didn't match any row, insert without serviceTypeId
    if (result.length === 0) {
      const fallback = await sql`
        INSERT INTO inquiries (
          name, email, phone,
          "eventDate", "eventTime", location,
          "guestCount", budget,
          "foodPreferences", allergies, notes,
          status, "createdAt"
        ) VALUES (
          ${name.trim()}, ${email.trim()}, ${phone},
          ${eventDate}, ${eventTime}, ${location},
          ${guestCount}, ${budget},
          ${foodPreferences}, ${allergies}, ${notes},
          'new', NOW()
        )
        RETURNING id
      `;
      return res.status(200).json({
        success: true,
        id: fallback[0]?.id,
        message: "Inquiry submitted successfully",
      });
    }

    return res.status(200).json({
      success: true,
      id: result[0]?.id,
      message: "Inquiry submitted successfully",
    });
  } catch (err: any) {
    console.error("[api/inquiries] Error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to save inquiry. Please try again or call us directly.",
    });
  } finally {
    if (sql) await sql.end();
  }
}
