import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/api-handler";
import { categoryService } from "@/lib/services/category.service";
import { successResponse, validationErrorResponse } from "@/lib/api/api-response";
import { updateCategorySchema } from "@/lib/validations/category";

export const GET = apiHandler(async (_req, { params }) => {
  const { id } = await params;
  const category = await categoryService.getById(id);
  return successResponse(category);
}, { auth: true });

export const PATCH = apiHandler(async (req, { params }) => {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateCategorySchema.safeParse(body);
  if (!parsed.success) {
    return validationErrorResponse(parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }
  const category = await categoryService.update(id, parsed.data);
  return successResponse(category);
}, { auth: true, roles: ["super_admin", "admin", "manager"] });

export const DELETE = apiHandler(async (_req, { params }) => {
  const { id } = await params;
  await categoryService.delete(id);
  return successResponse({ deleted: true });
}, { auth: true, roles: ["super_admin", "admin"] });
