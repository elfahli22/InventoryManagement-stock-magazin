import type { HISTORY_ACTION } from "@/lib/utils/constants";

export type HistoryAction = (typeof HISTORY_ACTION)[keyof typeof HISTORY_ACTION];

export interface InventoryHistory {
  _id: string;
  product: string | { _id: string; name: string; sku: string };
  action: HistoryAction;
  changes?: Record<string, { from: unknown; to: unknown }>;
  performedBy: string | { _id: string; name: string };
  createdAt: string;
}
