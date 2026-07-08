"use server";

import { settingsService } from "@/lib/services/settings.service";
import { updateSettingsSchema } from "@/lib/validations/settings";
import { revalidatePath } from "next/cache";
import { getSession, refreshSession } from "@/lib/auth/session";

export async function updateSettingsAction(formData: FormData) {
  let session = await getSession();
  if (!session) {
    session = await refreshSession();
  }
  if (!session) return { success: false, error: "Unauthorized" };

  const raw = {
    storeName: formData.get("storeName") as string,
    storeEmail: formData.get("storeEmail") as string,
    storePhone: formData.get("storePhone") as string,
    storeAddress: formData.get("storeAddress") as string,
    currency: formData.get("currency") as string,
    currencySymbol: formData.get("currencySymbol") as string,
    taxRate: Number(formData.get("taxRate")) || 0,
    lowStockThreshold: Number(formData.get("lowStockThreshold")) || 10,
    timezone: formData.get("timezone") as string,
    dateFormat: formData.get("dateFormat") as string,
    notifications: {
      lowStock: formData.get("notifications.lowStock") === "true",
      dailyReport: formData.get("notifications.dailyReport") === "true",
    },
  };

  const parsed = updateSettingsSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const settings = await settingsService.update(parsed.data, session.userId);
    revalidatePath("/settings");
    return { success: true, data: JSON.parse(JSON.stringify(settings)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update settings" };
  }
}
