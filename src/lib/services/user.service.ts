import { User } from "@/lib/db/models/user.model";
import { connectDB } from "@/lib/db/connection";
import { hashPassword, comparePassword } from "@/lib/auth/password";
import { NotFoundError, ConflictError, ValidationError } from "@/lib/api/api-error";
import { parsePagination, createPaginationMeta } from "@/lib/api/pagination";

export const userService = {
  async list(params: { page?: number; limit?: number; sort?: string; order?: string; search?: string }) {
    await connectDB();
    const { page, limit, skip, sort } = parsePagination(params);

    const filter: Record<string, unknown> = {};

    if (params.search) {
      filter.$or = [
        { name: { $regex: params.search, $options: "i" } },
        { email: { $regex: params.search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select("-password")
        .lean(),
      User.countDocuments(filter),
    ]);

    return {
      data: users,
      pagination: createPaginationMeta(total, page, limit),
    };
  },

  async getById(id: string) {
    await connectDB();
    const user = await User.findById(id).select("-password").lean();
    if (!user) throw new NotFoundError("User not found");
    return user;
  },

  async create(data: { name: string; email: string; password: string; role: string; phone?: string }) {
    await connectDB();

    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) throw new ConflictError("Email already registered");

    const hashedPassword = await hashPassword(data.password);
    const user = await User.create({
      ...data,
      email: data.email.toLowerCase(),
      password: hashedPassword,
    });

    return user;
  },

  async update(id: string, data: Record<string, unknown>) {
    await connectDB();

    const user = await User.findById(id);
    if (!user) throw new NotFoundError("User not found");

    if (data.email && typeof data.email === "string" && data.email.toLowerCase() !== user.email) {
      const existing = await User.findOne({ email: data.email.toLowerCase(), _id: { $ne: id } });
      if (existing) throw new ConflictError("Email already in use");
      data.email = data.email.toLowerCase();
    }

    if (data.password && typeof data.password === "string") {
      data.password = await hashPassword(data.password);
    }

    const updated = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .select("-password")
      .lean();

    return updated;
  },

  async delete(id: string) {
    await connectDB();

    const user = await User.findById(id);
    if (!user) throw new NotFoundError("User not found");

    if (user.role === "super_admin") {
      const superAdminCount = await User.countDocuments({ role: "super_admin" });
      if (superAdminCount <= 1) {
        throw new ValidationError("Cannot delete the last super admin");
      }
    }

    await User.findByIdAndDelete(id);
    return { deleted: true };
  },

  async updateProfile(id: string, data: { name?: string; email?: string; phone?: string; avatar?: string }) {
    await connectDB();

    const user = await User.findById(id);
    if (!user) throw new NotFoundError("User not found");

    if (data.email && data.email.toLowerCase() !== user.email) {
      const existing = await User.findOne({ email: data.email.toLowerCase(), _id: { $ne: id } });
      if (existing) throw new ConflictError("Email already in use");
      data.email = data.email.toLowerCase();
    }

    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .select("-password")
      .lean();
  },

  async changePassword(id: string, currentPassword: string, newPassword: string) {
    await connectDB();

    const user = await User.findById(id).select("+password");
    if (!user) throw new NotFoundError("User not found");

    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) throw new ValidationError("Current password is incorrect");

    user.password = await hashPassword(newPassword);
    await user.save();

    return { success: true };
  },
};
