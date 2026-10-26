import { z } from "zod";

// Names are Unicode text. Output encoding, rather than Latin-only filtering,
// protects email HTML. Keep field lengths within the existing database columns.
export const InquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .refine(
      name => /\p{L}/u.test(name) && !/[\p{Cc}\p{Cs}]/u.test(name),
      "Please enter your name."
    ),
  email: z.string().trim().email().max(254),
  phone: z.string().max(30).optional(),
  serviceType: z
    .string()
    .max(100)
    .regex(/^[^\p{Cc}\p{Cs}]*$/u)
    .optional(),
  eventDate: z.string().max(50).optional(),
  eventTime: z.string().max(50).optional(),
  guestCount: z.string().max(50).optional(),
  budget: z.string().max(50).optional(),
  allergies: z.string().max(1000).optional(),
  foodPreferences: z.string().max(1000).optional(),
  location: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
  recaptchaToken: z.string().max(4096).optional(),
});
