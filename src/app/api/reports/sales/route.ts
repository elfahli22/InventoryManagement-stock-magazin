import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/api-handler";
import { reportService } from "@/lib/services/report.service";
import { successResponse } from "@/lib/api/api-response";

export const GET = apiHandler(async (req) => {
  const { searchParams } = new URL(req.url);
  const report = await reportService.getSalesReport(
    searchParams.get("startDate") || undefined,
    searchParams.get("endDate") || undefined,
  );
  return successResponse(report);
}, { auth: true, roles: ["super_admin", "admin", "manager"] });
