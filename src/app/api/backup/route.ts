import { apiHandler } from "@/lib/api/api-handler";
import { backupService } from "@/lib/services/backup.service";
import { successResponse, createdResponse } from "@/lib/api/api-response";

export const GET = apiHandler(async () => {
  const backups = await backupService.list();
  return successResponse(backups);
}, { auth: true, roles: ["super_admin"] });

export const POST = apiHandler(async (_req, { session }) => {
  const backup = await backupService.create(session.userId);
  return createdResponse(backup);
}, { auth: true, roles: ["super_admin"] });

export const DELETE = apiHandler(async (_req, { params }) => {
  const { id } = await params;
  await backupService.delete(id);
  return successResponse({ deleted: true });
}, { auth: true, roles: ["super_admin"] });
