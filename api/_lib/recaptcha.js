/** No bypass: configuration/provider outages are explicit, retryable failures. */
export async function verifyRecaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) throw new Error("reCAPTCHA is not configured");
  if (typeof token !== "string" || !token) return false;
  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }).toString(),
      signal: AbortSignal.timeout(5000),
    }
  );
  if (!response.ok) throw new Error("reCAPTCHA provider unavailable");
  const result = await response.json();
  if (typeof result?.success !== "boolean")
    throw new Error("Invalid reCAPTCHA response");
  return (
    result.success === true &&
    Number.isFinite(result.score) &&
    result.score >= 0.7 &&
    result.score <= 1 &&
    result.action === "submit_inquiry" &&
    ["thepplschef.com", "www.thepplschef.com"].includes(result.hostname)
  );
}
