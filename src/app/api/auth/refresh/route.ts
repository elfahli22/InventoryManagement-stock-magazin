import { NextResponse } from "next/server";
import { getRefreshToken, setAuthCookies, clearAuthCookies } from "@/lib/auth/cookies";
import { verifyToken, signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { successResponse, unauthorizedResponse } from "@/lib/api/api-response";

export async function POST() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return unauthorizedResponse("No refresh token");
  }

  const payload = await verifyToken(refreshToken);
  if (!payload) {
    await clearAuthCookies();
    return unauthorizedResponse("Invalid refresh token");
  }

  const newAccessToken = await signAccessToken({
    userId: payload.userId,
    role: payload.role,
  });
  const newRefreshToken = await signRefreshToken({
    userId: payload.userId,
    role: payload.role,
  });

  await setAuthCookies(newAccessToken, newRefreshToken);
  return successResponse({ message: "Tokens refreshed" });
}
