import { apiHandler } from "@/lib/api/api-handler";
import { dashboardService } from "@/lib/services/dashboard.service";
import { successResponse } from "@/lib/api/api-response";

export const GET = apiHandler(async () => {
  const stats = await dashboardService.getStats();
  return successResponse(stats);
}, { auth: true });
