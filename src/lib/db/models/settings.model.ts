import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  storeName: string;
  storeEmail?: string;
  storePhone?: string;
  storeAddress?: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  lowStockThreshold: number;
  timezone: string;
  dateFormat: string;
  notifications: {
    lowStock: boolean;
    dailyReport: boolean;
  };
  updatedBy: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    storeName: {
      type: String,
      required: true,
      trim: true,
      default: "My Store",
    },
    storeEmail: {
      type: String,
      trim: true,
    },
    storePhone: {
      type: String,
      trim: true,
    },
    storeAddress: {
      type: String,
      trim: true,
    },
    currency: {
      type: String,
      default: "USD",
      trim: true,
    },
    currencySymbol: {
      type: String,
      default: "$",
      trim: true,
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 0,
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    dateFormat: {
      type: String,
      default: "MM/dd/yyyy",
    },
    notifications: {
      lowStock: { type: Boolean, default: true },
      dailyReport: { type: Boolean, default: false },
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  },
);

export const Settings =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", settingsSchema);
