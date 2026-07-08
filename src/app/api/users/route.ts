import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/api-handler";
import { userService } from "@/lib/services/user.service";
import { successResponse, createdResponse, validationErrorResponse, conflictResponse } from "@/lib/api/api-response";
import { createUserSchema } from "@/lib/validations/user";

export const GET = apiHandler(async (req) => {
  const { searchParams } = new URL(req.url);
  const result = await userService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 20,
    sort: searchParams.get("sort") || "createdAt",
    order: searchParams.get("order") || "desc",
    search: searchParams.get("search") || undefined,
  });
  return successResponse(result.data, { pagination: result.pagination });
}, { auth: true, roles: ["super_admin"] });

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return validationErrorResponse(parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }
  const user = await userService.create(parsed.data);
  return createdResponse(user);
}, { auth: true, roles: ["super_admin"] });
