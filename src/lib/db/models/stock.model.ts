import mongoose, { Schema, Document } from "mongoose";

export interface IStockMovement extends Document {
  product: mongoose.Types.ObjectId;
  type: "stock_in" | "stock_out" | "adjustment" | "return";
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reference?: string;
  notes?: string;
  performedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const stockMovementSchema = new Schema<IStockMovement>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["stock_in", "stock_out", "adjustment", "return"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    previousQuantity: {
      type: Number,
      required: true,
    },
    newQuantity: {
      type: Number,
      required: true,
    },
    reference: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
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

stockMovementSchema.index({ type: 1, createdAt: -1 });
stockMovementSchema.index({ createdAt: -1 });
stockMovementSchema.index({ product: 1, createdAt: -1 });

export const StockMovement =
  mongoose.models.StockMovement ||
  mongoose.model<IStockMovement>("StockMovement", stockMovementSchema);
