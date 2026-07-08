"use server";

import { supplierService } from "@/lib/services/supplier.service";
import { createSupplierSchema, updateSupplierSchema } from "@/lib/validations/supplier";
import { revalidatePath } from "next/cache";
import { getSession, refreshSession } from "@/lib/auth/session";

export async function createSupplierAction(formData: FormData) {
  let session = await getSession();
  if (!session) {
    session = await refreshSession();
  }
  if (!session) return { success: false, error: "Unauthorized" };

  const raw = {
    name: formData.get("name") as string,
    company: formData.get("company") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    notes: formData.get("notes") as string,
  };

  const parsed = createSupplierSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const supplier = await supplierService.create(parsed.data);
    revalidatePath("/suppliers");
    return { success: true, data: JSON.parse(JSON.stringify(supplier)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create supplier" };
  }
}

export async function updateSupplierAction(id: string, formData: FormData) {
  let session = await getSession();
  if (!session) {
    session = await refreshSession();
  }
  if (!session) return { success: false, error: "Unauthorized" };

  const raw = {
    name: formData.get("name") as string,
    company: formData.get("company") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    notes: formData.get("notes") as string,
  };

  const parsed = updateSupplierSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const supplier = await supplierService.update(id, parsed.data);
    revalidatePath("/suppliers");
    return { success: true, data: JSON.parse(JSON.stringify(supplier)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update supplier" };
  }
}

export async function deleteSupplierAction(id: string) {
  let session = await getSession();
  if (!session) {
    session = await refreshSession();
  }
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await supplierService.delete(id);
    revalidatePath("/suppliers");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete supplier" };
  }
}
