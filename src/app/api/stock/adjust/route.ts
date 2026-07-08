import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/api-handler";
import { stockService } from "@/lib/services/stock.service";
import { createdResponse, validationErrorResponse } from "@/lib/api/api-response";
import { stockAdjustSchema } from "@/lib/validations/stock";

export const POST = apiHandler(async (req, { session }) => {
  const body = await req.json();
  const parsed = stockAdjustSchema.safeParse(body);
  if (!parsed.success) {
    return validationErrorResponse(parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }
  const movement = await stockService.adjust(parsed.data, session.userId);
  return createdResponse(movement);
}, { auth: true, roles: ["super_admin", "admin", "manager"] });
