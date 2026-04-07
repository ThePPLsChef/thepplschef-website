/**
 * Shared helper — POST form data to the /api/inquiries REST endpoint.
 * Used by all inquiry forms as a reliable fallback that works on Vercel.
 */
export interface InquiryPayload {
  name: string;
  email: string;
  phone?: string;
  serviceType?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  guestCount?: string;
  budget?: string;
  foodPreferences?: string;
  allergies?: string;
  notes?: string;
}

export interface InquiryResult {
  success: boolean;
  id?: number;
  message?: string;
  error?: string;
}

export async function submitInquiry(payload: InquiryPayload): Promise<InquiryResult> {
  const response = await fetch("/api/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Always try to parse JSON — even on error responses
  let data: InquiryResult;
  try {
    data = await response.json();
  } catch {
    throw new Error("Server returned an unexpected response. Please try again.");
  }

  if (!response.ok || !data.success) {
    throw new Error(data.error ?? "Failed to submit inquiry. Please try again.");
  }

  return data;
}
