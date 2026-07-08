import { apiHandler } from "@/lib/api/api-handler";
import { reportService } from "@/lib/services/report.service";
import { successResponse } from "@/lib/api/api-response";

export const GET = apiHandler(async () => {
  const report = await reportService.getInventoryReport();
  return successResponse(report);
}, { auth: true, roles: ["super_admin", "admin", "manager"] });
