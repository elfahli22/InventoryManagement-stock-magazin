import type { PRODUCT_STATUS } from "@/lib/utils/constants";

export type ProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export interface Product {
  _id: string;
  name: string;
  barcode?: string;
  sku: string;
  category: string | { _id: string; name: string };
  description?: string;
  image?: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  minQuantity: number;
  supplier?: string | { _id: string; name: string };
  status: ProductStatus;
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  barcode?: string;
  sku: string;
  category: string;
  description?: string;
  image?: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  minQuantity: number;
  supplier?: string;
  status: ProductStatus;
  tags?: string[];
}

export interface UpdateProductInput {
  name?: string;
  barcode?: string;
  sku?: string;
  category?: string;
  description?: string;
  image?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  quantity?: number;
  minQuantity?: number;
  supplier?: string;
  status?: ProductStatus;
  tags?: string[];
  isActive?: boolean;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  supplier?: string;
  status?: ProductStatus;
  minQuantity?: number;
  maxQuantity?: number;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
}
