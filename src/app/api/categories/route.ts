import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/api-handler";
import { categoryService } from "@/lib/services/category.service";
import { successResponse, createdResponse, validationErrorResponse, conflictResponse } from "@/lib/api/api-response";
import { createCategorySchema } from "@/lib/validations/category";

export const GET = apiHandler(async () => {
  const categories = await categoryService.list();
  return successResponse(categories);
}, { auth: true });

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const parsed = createCategorySchema.safeParse(body);
  if (!parsed.success) {
    return validationErrorResponse(parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }
  const category = await categoryService.create(parsed.data);
  return createdResponse(category);
}, { auth: true, roles: ["super_admin", "admin", "manager"] });
