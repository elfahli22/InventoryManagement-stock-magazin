import { z } from "zod";
import { objectIdSchema } from "./common";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Product name must be at most 200 characters"),
  barcode: z
    .string()
    .max(50, "Barcode must be at most 50 characters")
    .optional()
    .or(z.literal("")),
  sku: z
    .string()
    .min(1, "SKU is required")
    .max(50, "SKU must be at most 50 characters"),
  category: objectIdSchema,
  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters")
    .optional()
    .or(z.literal("")),
  image: z.string().optional().or(z.literal("")),
  purchasePrice: z
    .number()
    .min(0, "Purchase price must be 0 or greater"),
  sellingPrice: z
    .number()
    .min(0, "Selling price must be 0 or greater"),
  quantity: z
    .number()
    .int()
    .min(0, "Quantity must be 0 or greater")
    .default(0),
  minQuantity: z
    .number()
    .int()
    .min(0, "Minimum quantity must be 0 or greater")
    .default(10),
  supplier: objectIdSchema.optional().or(z.literal("")),
  status: z.enum(["active", "inactive", "discontinued"]).default("active"),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  category: objectIdSchema.optional(),
  supplier: objectIdSchema.optional(),
  status: z.enum(["active", "inactive", "discontinued"]).optional(),
  minQuantity: z.coerce.number().int().min(0).optional(),
  maxQuantity: z.coerce.number().int().min(0).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  isActive: z
    .string()
    .transform((v) => v === "true")
    .optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
