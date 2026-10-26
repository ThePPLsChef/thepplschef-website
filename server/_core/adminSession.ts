import { SignJWT, jwtVerify } from "jose";
import { createHash, randomUUID } from "node:crypto";
import { ENV } from "./env";

export const ADMIN_SESSION_SECONDS = 60 * 60;
const issuer = "pplschef-admin";
const audience = "pplschef-admin-api";

function signingKey() {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  if (Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("ADMIN_SESSION_SECRET must contain at least 32 bytes");
  }
  return new TextEncoder().encode(secret);
}

function passwordVersion() {
  return createHash("sha256").update(ENV.adminPasswordHash).digest("hex");
}

export async function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS;
  const token = await new SignJWT({ passwordVersion: passwordVersion() })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(issuer)
    .setAudience(audience)
    .setSubject("admin")
    .setJti(randomUUID())
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(signingKey());
  return { token, expiresAt };
}

export async function verifyAdminSession(token: unknown): Promise<boolean> {
  if (
    typeof token !== "string" ||
    !token ||
    token.length > 4096 ||
    !ENV.adminPasswordHash
  )
    return false;
  try {
    const { payload } = await jwtVerify(token, signingKey(), {
      algorithms: ["HS256"],
      issuer,
      audience,
      subject: "admin",
      requiredClaims: ["exp", "iat", "jti"],
      maxTokenAge: ADMIN_SESSION_SECONDS,
    });
    return payload.passwordVersion === passwordVersion();
  } catch {
    return false;
  }
}
