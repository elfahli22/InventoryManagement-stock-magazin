import { Settings } from "@/lib/db/models/settings.model";
import { connectDB } from "@/lib/db/connection";
import { DEFAULT_SETTINGS } from "@/lib/utils/constants";

export const settingsService = {
  async get() {
    await connectDB();

    let settings = await Settings.findOne().populate("updatedBy", "name").lean();

    if (!settings) {
      settings = await Settings.create({
        ...DEFAULT_SETTINGS,
        updatedBy: "000000000000000000000000",
      });
    }

    return settings;
  },

  async update(data: Record<string, unknown>, userId: string) {
    await connectDB();

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        ...DEFAULT_SETTINGS,
        ...data,
        updatedBy: userId,
      });
      return settings;
    }

    return Settings.findByIdAndUpdate(
      settings._id,
      { ...data, updatedBy: userId },
      { new: true, runValidators: true },
    ).populate("updatedBy", "name").lean();
  },
};
