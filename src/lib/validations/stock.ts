import { z } from "zod";
import { objectIdSchema } from "./common";

export const stockInSchema = z.object({
  product: objectIdSchema,
  quantity: z.number().int().positive("Quantity must be positive"),
  reference: z
    .string()
    .max(200, "Reference must be at most 200 characters")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(500, "Notes must be at most 500 characters")
    .optional()
    .or(z.literal("")),
});

export const stockOutSchema = z.object({
  product: objectIdSchema,
  quantity: z.number().int().positive("Quantity must be positive"),
  reference: z
    .string()
    .max(200, "Reference must be at most 200 characters")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(500, "Notes must be at most 500 characters")
    .optional()
    .or(z.literal("")),
});

export const stockAdjustSchema = z.object({
  product: objectIdSchema,
  newQuantity: z.number().int().min(0, "Quantity must be 0 or greater"),
  reference: z
    .string()
    .max(200, "Reference must be at most 200 characters")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(500, "Notes must be at most 500 characters")
    .optional()
    .or(z.literal("")),
});

export type StockInInput = z.infer<typeof stockInSchema>;
export type StockOutInput = z.infer<typeof stockOutSchema>;
export type StockAdjustInput = z.infer<typeof stockAdjustSchema>;
