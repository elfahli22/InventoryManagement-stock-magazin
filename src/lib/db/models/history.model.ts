import mongoose, { Schema, Document } from "mongoose";

export interface IInventoryHistory extends Document {
  product: mongoose.Types.ObjectId;
  action: "created" | "updated" | "stock_in" | "stock_out" | "adjustment" | "deleted";
  changes?: Record<string, { from: unknown; to: unknown }>;
  performedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const inventoryHistorySchema = new Schema<IInventoryHistory>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ["created", "updated", "stock_in", "stock_out", "adjustment", "deleted"],
      required: true,
    },
    changes: {
      type: Schema.Types.Mixed,
      default: {},
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

inventoryHistorySchema.index({ action: 1 });
inventoryHistorySchema.index({ createdAt: -1 });
inventoryHistorySchema.index({ product: 1, createdAt: -1 });

export const InventoryHistory =
  mongoose.models.InventoryHistory ||
  mongoose.model<IInventoryHistory>("InventoryHistory", inventoryHistorySchema);
