import type { z } from "zod";
export interface ValidatedInquiry {
  name: string;
  email: string;
  phone?: string;
  serviceType?: string;
  eventDate?: string;
  eventTime?: string;
  guestCount?: string;
  budget?: string;
  allergies?: string;
  foodPreferences?: string;
  location?: string;
  notes?: string;
  recaptchaToken?: string;
}
export const InquirySchema: z.ZodType<ValidatedInquiry, ValidatedInquiry>;
