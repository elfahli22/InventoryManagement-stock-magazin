"use server";

import { stockService } from "@/lib/services/stock.service";
import { stockInSchema, stockOutSchema, stockAdjustSchema } from "@/lib/validations/stock";
import { revalidatePath } from "next/cache";
import { getSession, refreshSession } from "@/lib/auth/session";
import { guardDemo } from "@/lib/permissions/guards";

export async function stockInAction(formData: FormData) {
  let session = await getSession();
  if (!session) {
    session = await refreshSession();
  }
  if (!session) return { success: false, error: "Unauthorized" };
  const demoError = guardDemo(session);
  if (demoError) return { success: false, error: demoError };

  const raw = {
    product: formData.get("product") as string,
    quantity: Number(formData.get("quantity")) || 0,
    reference: formData.get("reference") as string,
    notes: formData.get("notes") as string,
  };

  const parsed = stockInSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const movement = await stockService.stockIn(parsed.data, session.userId);
    revalidatePath("/stock");
    revalidatePath("/products");
    revalidatePath("/dashboard");
    return { success: true, data: JSON.parse(JSON.stringify(movement)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Stock in failed" };
  }
}

export async function stockOutAction(formData: FormData) {
  let session = await getSession();
  if (!session) {
    session = await refreshSession();
  }
  if (!session) return { success: false, error: "Unauthorized" };
  const demoError = guardDemo(session);
  if (demoError) return { success: false, error: demoError };

  const raw = {
    product: formData.get("product") as string,
    quantity: Number(formData.get("quantity")) || 0,
    reference: formData.get("reference") as string,
    notes: formData.get("notes") as string,
  };

  const parsed = stockOutSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const movement = await stockService.stockOut(parsed.data, session.userId);
    revalidatePath("/stock");
    revalidatePath("/products");
    revalidatePath("/dashboard");
    return { success: true, data: JSON.parse(JSON.stringify(movement)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Stock out failed" };
  }
}

export async function stockAdjustAction(formData: FormData) {
  let session = await getSession();
  if (!session) {
    session = await refreshSession();
  }
  if (!session) return { success: false, error: "Unauthorized" };
  const demoError = guardDemo(session);
  if (demoError) return { success: false, error: demoError };

  const raw = {
    product: formData.get("product") as string,
    newQuantity: Number(formData.get("newQuantity")) || 0,
    reference: formData.get("reference") as string,
    notes: formData.get("notes") as string,
  };

  const parsed = stockAdjustSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const movement = await stockService.adjust(parsed.data, session.userId);
    revalidatePath("/stock");
    revalidatePath("/products");
    revalidatePath("/dashboard");
    return { success: true, data: JSON.parse(JSON.stringify(movement)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Stock adjustment failed" };
  }
}
