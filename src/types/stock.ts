import type { STOCK_TYPE } from "@/lib/utils/constants";

export type StockType = (typeof STOCK_TYPE)[keyof typeof STOCK_TYPE];

export interface StockMovement {
  _id: string;
  product: string | { _id: string; name: string; sku: string };
  type: StockType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reference?: string;
  notes?: string;
  performedBy: string | { _id: string; name: string };
  createdAt: string;
}

export interface CreateStockMovementInput {
  product: string;
  type: StockType;
  quantity: number;
  reference?: string;
  notes?: string;
}
