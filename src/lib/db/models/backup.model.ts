import mongoose, { Schema, Document } from "mongoose";

export interface IBackupRecord extends Document {
  filename: string;
  size: number;
  collections: string[];
  status: "completed" | "failed" | "in_progress";
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const backupRecordSchema = new Schema<IBackupRecord>(
  {
    filename: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 0,
    },
    collections: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["completed", "failed", "in_progress"],
      default: "in_progress",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

backupRecordSchema.index({ createdAt: -1 });

export const BackupRecord =
  mongoose.models.BackupRecord ||
  mongoose.model<IBackupRecord>("BackupRecord", backupRecordSchema);
