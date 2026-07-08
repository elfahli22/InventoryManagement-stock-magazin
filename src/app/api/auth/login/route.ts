import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth.service";
import { setAuthCookies } from "@/lib/auth/cookies";
import { loginSchema } from "@/lib/validations/auth";
import { successResponse, validationErrorResponse, unauthorizedResponse } from "@/lib/api/api-response";
import { logger } from "@/lib/utils/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const result = await authService.login(parsed.data.email, parsed.data.password);
    await setAuthCookies(result.accessToken, result.refreshToken);

    return successResponse({ user: result.user });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid email or password") {
      return unauthorizedResponse("Invalid email or password");
    }
    logger.error("Login error", { error: String(error) });
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 },
    );
  }
}
