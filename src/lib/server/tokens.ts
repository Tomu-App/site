import { SignJWT, jwtVerify } from "jose";

export type TokenPurpose = "confirm" | "unsubscribe";

export const CONFIRM_TTL_S = 48 * 3600;

const key = (secret: string) => new TextEncoder().encode(secret);

export async function signToken(
  secret: string,
  id: string,
  purpose: TokenPurpose,
  nowMs: number,
): Promise<string> {
  const iat = Math.floor(nowMs / 1000);
  const jwt = new SignJWT({ purpose }).setProtectedHeader({ alg: "HS256" }).setSubject(id).setIssuedAt(iat);
  if (purpose === "confirm") jwt.setExpirationTime(iat + CONFIRM_TTL_S);
  return jwt.sign(key(secret));
}

export async function verifyToken(
  secret: string,
  token: string,
  purpose: TokenPurpose,
  nowMs: number,
): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, key(secret), {
      algorithms: ["HS256"],
      currentDate: new Date(nowMs),
    });
    if (payload.purpose !== purpose) return null;
    return typeof payload.sub === "string" && payload.sub ? payload.sub : null;
  } catch {
    return null;
  }
}
