import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/api-handler";
import { historyService } from "@/lib/services/history.service";
import { successResponse } from "@/lib/api/api-response";

export const GET = apiHandler(async (req) => {
  const { searchParams } = new URL(req.url);
  const result = await historyService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 20,
    product: searchParams.get("product") || undefined,
    action: searchParams.get("action") || undefined,
    userId: searchParams.get("userId") || undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
  });
  return successResponse(result.data, { pagination: result.pagination });
}, { auth: true });
