import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/api-handler";
import { supplierService } from "@/lib/services/supplier.service";
import { successResponse, validationErrorResponse } from "@/lib/api/api-response";
import { updateSupplierSchema } from "@/lib/validations/supplier";

export const GET = apiHandler(async (_req, { params }) => {
  const { id } = await params;
  const result = await supplierService.getById(id);
  return successResponse(result);
}, { auth: true });

export const PATCH = apiHandler(async (req, { params }) => {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateSupplierSchema.safeParse(body);
  if (!parsed.success) {
    return validationErrorResponse(parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }
  const supplier = await supplierService.update(id, parsed.data);
  return successResponse(supplier);
}, { auth: true, roles: ["super_admin", "admin", "manager"] });

export const DELETE = apiHandler(async (_req, { params }) => {
  const { id } = await params;
  await supplierService.delete(id);
  return successResponse({ deleted: true });
}, { auth: true, roles: ["super_admin", "admin"] });
