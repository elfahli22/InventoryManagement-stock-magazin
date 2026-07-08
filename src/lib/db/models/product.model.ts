import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  barcode?: string;
  sku: string;
  category: mongoose.Types.ObjectId;
  description?: string;
  image?: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  minQuantity: number;
  supplier?: mongoose.Types.ObjectId;
  status: "active" | "inactive" | "discontinued";
  tags?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    barcode: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    image: {
      type: String,
    },
    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    minQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 10,
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "discontinued"],
      default: "active",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ name: "text", description: "text" });
productSchema.index({ status: 1, isActive: 1 });
productSchema.index({ quantity: 1 });
productSchema.index({ createdAt: -1 });

export const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);
