import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { config } from "@/config";

const secret = new TextEncoder().encode(config.jwt.secret);

export interface JwtUserPayload {
  userId: string;
  role: string;
}

export async function signAccessToken(payload: JwtUserPayload): Promise<string> {
  return new SignJWT({ ...payload } as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(config.jwt.accessExpiry)
    .sign(secret);
}

export async function signRefreshToken(payload: JwtUserPayload): Promise<string> {
  return new SignJWT({ ...payload } as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(config.jwt.refreshExpiry)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JwtUserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    console.log(`[JWT] verifyToken SUCCESS — userId=${payload.userId}, role=${payload.role}`);
    return {
      userId: payload.userId as string,
      role: payload.role as string,
    };
  } catch (err) {
    console.log(`[JWT] verifyToken FAILED — error:`, err instanceof Error ? err.message : String(err));
    console.log(`[JWT] verifyToken FAILED — full error object:`, JSON.stringify(err, Object.getOwnPropertyNames(err)));
    if (err instanceof Error && err.cause) {
      console.log(`[JWT] verifyToken FAILED — cause:`, String(err.cause));
    }
    console.log(`[JWT] token prefix (first 50 chars):`, token.substring(0, 50));
    return null;
  }
}
