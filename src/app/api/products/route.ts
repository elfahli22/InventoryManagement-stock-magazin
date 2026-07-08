import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/api-handler";
import { productService } from "@/lib/services/product.service";
import { successResponse, createdResponse, validationErrorResponse, conflictResponse } from "@/lib/api/api-response";
import { createProductSchema, productFiltersSchema } from "@/lib/validations/product";

export const GET = apiHandler(async (req) => {
  const { searchParams } = new URL(req.url);
  const filters = productFiltersSchema.parse(Object.fromEntries(searchParams));
  const result = await productService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 20,
    sort: searchParams.get("sort") || "createdAt",
    order: searchParams.get("order") || "desc",
    filters,
  });
  return successResponse(result.data, { pagination: result.pagination });
}, { auth: true });

export const POST = apiHandler(async (req, { session }) => {
  const body = await req.json();
  const parsed = createProductSchema.safeParse(body);
  if (!parsed.success) {
    return validationErrorResponse(parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }
  const product = await productService.create(parsed.data, session.userId);
  return createdResponse(product);
}, { auth: true, roles: ["super_admin", "admin", "manager"] });
