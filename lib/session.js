// Edge-safe session token helpers (jose only — no next/headers, no Node crypto),
// so this module can be imported by both server actions and middleware.
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24; // 1 day, in seconds

const secret = process.env.SESSION_SECRET;
if (!secret) {
  throw new Error("SESSION_SECRET environment variable is not set.");
}
const encodedKey = new TextEncoder().encode(secret);

// Create a signed (HMAC-SHA256) session token.
export async function createToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(encodedKey);
}

// Verify a token's signature and expiry. Returns the payload, or null if invalid.
export async function verifyToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}
