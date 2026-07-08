import { getAccessToken, getRefreshToken, setAuthCookies } from "./cookies";
import { verifyToken, signAccessToken, signRefreshToken, type JwtUserPayload } from "./jwt";
export type { JwtUserPayload };

export async function getSession(): Promise<JwtUserPayload | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  const payload = await verifyToken(accessToken);
  if (payload) return payload;

  return null;
}

export async function refreshSession(): Promise<JwtUserPayload | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  const refreshPayload = await verifyToken(refreshToken);
  if (!refreshPayload) return null;

  const newAccessToken = await signAccessToken({
    userId: refreshPayload.userId,
    role: refreshPayload.role,
  });
  const newRefreshToken = await signRefreshToken({
    userId: refreshPayload.userId,
    role: refreshPayload.role,
  });

  await setAuthCookies(newAccessToken, newRefreshToken);
  return refreshPayload;
}

export async function requireAuth(): Promise<JwtUserPayload> {
  const session = await getSession() || await refreshSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
