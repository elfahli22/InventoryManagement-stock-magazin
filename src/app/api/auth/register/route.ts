import { NextRequest } from "next/server";
import { authService } from "@/lib/services/auth.service";
import { setAuthCookies } from "@/lib/auth/cookies";
import { registerSchema } from "@/lib/validations/auth";
import { successResponse, validationErrorResponse, conflictResponse } from "@/lib/api/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const result = await authService.register({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
    });

    await setAuthCookies(result.accessToken, result.refreshToken);

    return successResponse({ user: result.user, message: "Account created successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Email already registered") {
      return conflictResponse("Email already registered");
    }
    return successResponse({ error: "Internal server error" });
  }
}
