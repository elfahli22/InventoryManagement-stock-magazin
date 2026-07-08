import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/api-handler";
import { userService } from "@/lib/services/user.service";
import { successResponse, validationErrorResponse } from "@/lib/api/api-response";
import { updateUserSchema } from "@/lib/validations/user";

export const GET = apiHandler(async (_req, { params }) => {
  const { id } = await params;
  const user = await userService.getById(id);
  return successResponse(user);
}, { auth: true, roles: ["super_admin"] });

export const PATCH = apiHandler(async (req, { params }) => {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) {
    return validationErrorResponse(parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }
  const user = await userService.update(id, parsed.data);
  return successResponse(user);
}, { auth: true, roles: ["super_admin"] });

export const DELETE = apiHandler(async (_req, { params }) => {
  const { id } = await params;
  await userService.delete(id);
  return successResponse({ deleted: true });
}, { auth: true, roles: ["super_admin"] });
