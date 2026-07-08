// import { BackupRecord } from "@/lib/db/models/backup.model";
// import { connectDB } from "@/lib/db/connection";
// import { NotFoundError } from "@/lib/api/api-error";

// export const backupService = {
//   async list() {
//     await connectDB();
//     return BackupRecord.find({})
//       .populate("createdBy", "name")
//       .sort({ createdAt: -1 })
//       .lean();
//   },

//   async create(userId: string) {
//     await connectDB();

//     const record = await BackupRecord.create({
//       filename: `backup-${Date.now()}.json`,
//       size: 0,
//       collections: ["users", "categories", "suppliers", "products", "stockmovements", "inventoryhistories", "settings"],
//       status: "completed",
//       createdBy: userId,
//     });

//     return record;
//   },

//   async getById(id: string) {
//     await connectDB();
//     const record = await BackupRecord.findById(id).populate("createdBy", "name").lean();
//     if (!record) throw new NotFoundError("Backup record not found");
//     return record;
//   },

//   async delete(id: string) {
//     await connectDB();
//     const record = await BackupRecord.findByIdAndDelete(id);
//     if (!record) throw new NotFoundError("Backup record not found");
//     return { deleted: true };
//   },
// };

import mongoose, { Types } from "mongoose";
import { BackupRecord } from "@/lib/db/models/backup.model";
import { connectDB } from "@/lib/db/connection";
import { NotFoundError } from "@/lib/api/api-error";

export interface BackupDTO {
  _id: Types.ObjectId;
  filename: string;
  size: number;
  collections: string[];
  status: "completed" | "failed" | "in_progress";
  createdBy:
    | {
        _id: Types.ObjectId;
        name: string;
      }
    | Types.ObjectId;
  createdAt: Date;
}

export const backupService = {
  async list(): Promise<BackupDTO[]> {
    await connectDB();

    const backups = await BackupRecord.find({})
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .lean();

    return backups as BackupDTO[];
  },

  async create(userId: string) {
    await connectDB();

    const record = await BackupRecord.create({
      filename: `backup-${Date.now()}.json`,
      size: 0,
      collections: [
        "users",
        "categories",
        "suppliers",
        "products",
        "stockmovements",
        "inventoryhistories",
        "settings",
      ],
      status: "completed",
      createdBy: new mongoose.Types.ObjectId(userId),
    });

    return record;
  },

  async getById(id: string): Promise<BackupDTO> {
    await connectDB();

    const record = await BackupRecord.findById(id)
      .populate("createdBy", "name")
      .lean();

    if (!record) {
      throw new NotFoundError("Backup record not found");
    }

    return record as BackupDTO;
  },

  async delete(id: string) {
    await connectDB();

    const record = await BackupRecord.findByIdAndDelete(id);

    if (!record) {
      throw new NotFoundError("Backup record not found");
    }

    return { deleted: true };
  },
};