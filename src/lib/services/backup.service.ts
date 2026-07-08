import { BackupRecord } from "@/lib/db/models/backup.model";
import { connectDB } from "@/lib/db/connection";
import { NotFoundError } from "@/lib/api/api-error";

export const backupService = {
  async list() {
    await connectDB();
    return BackupRecord.find({})
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .lean();
  },

  async create(userId: string) {
    await connectDB();

    const record = await BackupRecord.create({
      filename: `backup-${Date.now()}.json`,
      size: 0,
      collections: ["users", "categories", "suppliers", "products", "stockmovements", "inventoryhistories", "settings"],
      status: "completed",
      createdBy: userId,
    });

    return record;
  },

  async getById(id: string) {
    await connectDB();
    const record = await BackupRecord.findById(id).populate("createdBy", "name").lean();
    if (!record) throw new NotFoundError("Backup record not found");
    return record;
  },

  async delete(id: string) {
    await connectDB();
    const record = await BackupRecord.findByIdAndDelete(id);
    if (!record) throw new NotFoundError("Backup record not found");
    return { deleted: true };
  },
};
