import { apiHandler } from "@/lib/api/api-handler";
import { authService } from "@/lib/services/auth.service";
import { successResponse } from "@/lib/api/api-response";

export const GET = apiHandler(async (_req, { session }) => {
  const user = await authService.getCurrentUser(session.userId);
  return successResponse(user);
}, { auth: true });
