import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/api-handler";
import { supplierService } from "@/lib/services/supplier.service";
import { successResponse, createdResponse, validationErrorResponse } from "@/lib/api/api-response";
import { createSupplierSchema } from "@/lib/validations/supplier";

export const GET = apiHandler(async (req) => {
  const { searchParams } = new URL(req.url);
  const result = await supplierService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 20,
    sort: searchParams.get("sort") || "createdAt",
    order: searchParams.get("order") || "desc",
    search: searchParams.get("search") || undefined,
  });
  return successResponse(result.data, { pagination: result.pagination });
}, { auth: true });

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const parsed = createSupplierSchema.safeParse(body);
  if (!parsed.success) {
    return validationErrorResponse(parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }
  const supplier = await supplierService.create(parsed.data);
  return createdResponse(supplier);
}, { auth: true, roles: ["super_admin", "admin", "manager"] });
