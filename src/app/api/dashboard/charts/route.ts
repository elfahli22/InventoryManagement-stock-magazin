import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/api-handler";
import { dashboardService } from "@/lib/services/dashboard.service";
import { successResponse } from "@/lib/api/api-response";

export const GET = apiHandler(async (req) => {
  const { searchParams } = new URL(req.url);
  const days = Number(searchParams.get("days")) || 30;
  const chartData = await dashboardService.getChartData(days);
  const topProducts = await dashboardService.getTopProducts(5);
  const topCategories = await dashboardService.getTopCategories();
  return successResponse({ chartData, topProducts, topCategories });
}, { auth: true });
