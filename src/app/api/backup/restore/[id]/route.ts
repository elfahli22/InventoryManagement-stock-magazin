import { apiHandler } from "@/lib/api/api-handler";
import { successResponse } from "@/lib/api/api-response";

export const POST = apiHandler(async (_req, { params }) => {
  const { id } = await params;
  return successResponse({ message: `Restore from backup ${id} initiated`, id });
}, { auth: true, roles: ["super_admin"] });
