import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/api-handler";
import { productService } from "@/lib/services/product.service";
import { successResponse, validationErrorResponse, notFoundResponse, conflictResponse } from "@/lib/api/api-response";
import { updateProductSchema } from "@/lib/validations/product";

export const GET = apiHandler(async (_req, { params }) => {
  const { id } = await params;
  const product = await productService.getById(id);
  return successResponse(product);
}, { auth: true });

export const PATCH = apiHandler(async (req, { session, params }) => {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateProductSchema.safeParse(body);
  if (!parsed.success) {
    return validationErrorResponse(parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }
  const product = await productService.update(id, parsed.data, session.userId);
  return successResponse(product);
}, { auth: true, roles: ["super_admin", "admin", "manager"] });

export const DELETE = apiHandler(async (_req, { session, params }) => {
  const { id } = await params;
  await productService.delete(id, session.userId);
  return successResponse({ deleted: true });
}, { auth: true, roles: ["super_admin", "admin"] });
