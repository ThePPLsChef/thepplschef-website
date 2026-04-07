import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router, adminProcedure } from "../_core/trpc";
import {
  createInquiry,
  listInquiries,
  getInquiryById,
  updateInquiryStatus,
  getInquiryStats,
  getServiceTypes,
} from "../db";
import { notifyOwner } from "../_core/notification";

export const inquiryRouter = router({
  /**
   * Public: submit a new inquiry from any contact/booking form.
   */
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
        phone: z.string().optional(),
        serviceType: z.string().optional(),
        eventDate: z.string().optional(),
        eventTime: z.string().optional(),
        location: z.string().optional(),
        guestCount: z.string().optional(),
        budget: z.string().optional(),
        foodPreferences: z.string().optional(),
        allergies: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Map serviceType string to serviceTypeId if possible
      let serviceTypeId: number | undefined;
      if (input.serviceType) {
        try {
          const types = await getServiceTypes();
          const match = types.find(
            (t) => t.name.toLowerCase() === input.serviceType!.toLowerCase()
              || t.name.toLowerCase().replace(/\s+/g, "-") === input.serviceType!.toLowerCase()
          );
          if (match) serviceTypeId = match.id;
        } catch {
          // Ignore — serviceTypeId stays undefined
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
        status: "new",
      });

      // Notify the owner about the new inquiry
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
            input.notes ? `**Notes:** ${input.notes}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
        });
      } catch (err) {
        console.warn("[Inquiry] Failed to notify owner:", err);
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
  list: adminProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(500).optional(),
          offset: z.number().min(0).optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const [rows, types] = await Promise.all([
        listInquiries(input?.limit ?? 100, input?.offset ?? 0),
        getServiceTypes(),
      ]);
      const typeMap = new Map(types.map((t) => [t.id, t.name]));
      return rows.map((r) => ({
        ...r,
        serviceTypeName: r.serviceTypeId ? typeMap.get(r.serviceTypeId) ?? null : null,
      }));
    }),

  /**
   * Admin: get a single inquiry by ID.
   */
  detail: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const inquiry = await getInquiryById(input.id);
      if (!inquiry) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Inquiry not found" });
      }
      // Resolve service type name
      let serviceTypeName: string | null = null;
      if (inquiry.serviceTypeId) {
        const types = await getServiceTypes();
        const match = types.find((t) => t.id === inquiry.serviceTypeId);
        if (match) serviceTypeName = match.name;
      }
      return { ...inquiry, serviceTypeName };
    }),

  /**
   * Admin: update inquiry status.
   */
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "reviewed", "quoted", "booked", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      return updateInquiryStatus(input.id, input.status);
    }),

  /**
   * Admin: get dashboard statistics.
   */
  stats: adminProcedure.query(async () => {
    return getInquiryStats();
  }),
});
