"use server";

import { productService } from "@/lib/services/product.service";
import { createProductSchema, updateProductSchema } from "@/lib/validations/product";
import { revalidatePath } from "next/cache";
import { getSession, refreshSession } from "@/lib/auth/session";
import { guardDemo } from "@/lib/permissions/guards";

export async function createProductAction(formData: FormData) {
  let session = await getSession();
  if (!session) {
    session = await refreshSession();
  }
  if (!session) return { success: false, error: "Unauthorized" };
  const demoError = guardDemo(session);
  if (demoError) return { success: false, error: demoError };

  const raw = {
    name: formData.get("name") as string,
    sku: formData.get("sku") as string,
    barcode: formData.get("barcode") as string,
    category: formData.get("category") as string,
    description: formData.get("description") as string,
    purchasePrice: Number(formData.get("purchasePrice")) || 0,
    sellingPrice: Number(formData.get("sellingPrice")) || 0,
    quantity: Number(formData.get("quantity")) || 0,
    minQuantity: Number(formData.get("minQuantity")) || 10,
    supplier: formData.get("supplier") as string,
    status: formData.get("status") as "active" | "inactive" | "discontinued" || "active",
  };

  const parsed = createProductSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { success: false, error: "Validation failed", errors };
  }

  try {
    const product = await productService.create(parsed.data, session.userId);
    revalidatePath("/products");
    return { success: true, data: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create product" };
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  let session = await getSession();
  if (!session) {
    session = await refreshSession();
  }
  if (!session) return { success: false, error: "Unauthorized" };
  const demoError = guardDemo(session);
  if (demoError) return { success: false, error: demoError };

  const raw = {
    name: formData.get("name") as string,
    sku: formData.get("sku") as string,
    barcode: formData.get("barcode") as string,
    category: formData.get("category") as string,
    description: formData.get("description") as string,
    purchasePrice: Number(formData.get("purchasePrice")) || undefined,
    sellingPrice: Number(formData.get("sellingPrice")) || undefined,
    minQuantity: Number(formData.get("minQuantity")) || undefined,
    supplier: formData.get("supplier") as string,
    status: formData.get("status") as "active" | "inactive" | "discontinued",
  };

  const parsed = updateProductSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const product = await productService.update(id, parsed.data, session.userId);
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
    return { success: true, data: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update product" };
  }
}

export async function deleteProductAction(id: string) {
  let session = await getSession();
  if (!session) {
    session = await refreshSession();
  }
  if (!session) return { success: false, error: "Unauthorized" };
  const demoError = guardDemo(session);
  if (demoError) return { success: false, error: demoError };

  try {
    await productService.delete(id, session.userId);
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete product" };
  }
}
