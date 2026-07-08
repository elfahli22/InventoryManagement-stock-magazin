import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { apiHandler } from "@/lib/api/api-handler";
import { successResponse, validationErrorResponse } from "@/lib/api/api-response";
import { config } from "@/config";

export const POST = apiHandler(async (req) => {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return validationErrorResponse({ file: ["File is required"] });
  }

  if (!config.upload.allowedTypes.includes(file.type)) {
    return validationErrorResponse({ file: ["Invalid file type"] });
  }

  if (file.size > config.upload.maxFileSize) {
    return validationErrorResponse({ file: ["File too large"] });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, filename), buffer);

  const url = `/uploads/${filename}`;

  return successResponse({ url, filename });
}, { auth: true, roles: ["super_admin", "admin", "manager"] });
