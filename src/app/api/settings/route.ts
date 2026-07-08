import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/api-handler";
import { settingsService } from "@/lib/services/settings.service";
import { successResponse, validationErrorResponse } from "@/lib/api/api-response";
import { updateSettingsSchema } from "@/lib/validations/settings";

export const GET = apiHandler(async () => {
  const settings = await settingsService.get();
  return successResponse(settings);
}, { auth: true, roles: ["super_admin", "admin"] });

export const PATCH = apiHandler(async (req, { session }) => {
  const body = await req.json();
  const parsed = updateSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return validationErrorResponse(parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }
  const settings = await settingsService.update(parsed.data, session.userId);
  return successResponse(settings);
}, { auth: true, roles: ["super_admin"] });
