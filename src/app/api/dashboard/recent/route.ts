import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/api-handler";
import { dashboardService } from "@/lib/services/dashboard.service";
import { successResponse } from "@/lib/api/api-response";

export const GET = apiHandler(async (req) => {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit")) || 10;
  const activities = await dashboardService.getRecentActivity(limit);
  return successResponse(activities);
}, { auth: true });
