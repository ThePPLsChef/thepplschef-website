import dns from "dns/promises";

/**
 * Checks whether the domain part of an email has at least one MX record.
 * Returns true if valid MX records exist, false otherwise.
 * On DNS lookup failure/timeout, returns true (fail-open) to avoid blocking real users.
 */
export async function hasMxRecord(email) {
  try {
    const domain = email.split("@")[1];
    if (!domain) return false;
    const records = await dns.resolveMx(domain);
    return Array.isArray(records) && records.length > 0;
  } catch (err) {
    // ENOTFOUND = domain doesn't exist; ENODATA = no MX records
    if (
      err.code === "ENOTFOUND" ||
      err.code === "ENODATA" ||
      err.code === "ESERVFAIL"
    ) {
      return false;
    }
    // For other errors (timeout, etc.) fail-open
    console.warn(
      "[inquiry validation] MX lookup error (fail-open):",
      err.code,
      err.message
    );
    return true;
  }
}
