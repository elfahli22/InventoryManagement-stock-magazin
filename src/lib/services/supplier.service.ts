import { Supplier } from "@/lib/db/models/supplier.model";
import { Product } from "@/lib/db/models/product.model";
import { connectDB } from "@/lib/db/connection";
import { NotFoundError } from "@/lib/api/api-error";
import { parsePagination, createPaginationMeta } from "@/lib/api/pagination";

export const supplierService = {
  async list(params: { page?: number; limit?: number; sort?: string; order?: string; search?: string }) {
    await connectDB();
    const { page, limit, skip, sort } = parsePagination(params);

    const filter: Record<string, unknown> = {};
    if (params.search) {
      filter.$or = [
        { name: { $regex: params.search, $options: "i" } },
        { company: { $regex: params.search, $options: "i" } },
        { email: { $regex: params.search, $options: "i" } },
      ];
    }

    const [suppliers, total] = await Promise.all([
      Supplier.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Supplier.countDocuments(filter),
    ]);

    return {
      data: suppliers,
      pagination: createPaginationMeta(total, page, limit),
    };
  },

  async getById(id: string) {
    await connectDB();
    const supplier = await Supplier.findById(id).lean();
    if (!supplier) throw new NotFoundError("Supplier not found");

    const products = await Product.find({ supplier: id })
      .populate("category", "name")
      .sort({ name: 1 })
      .lean();

    return { supplier, products };
  },

  async create(data: {
    name: string;
    company?: string;
    email?: string;
    phone?: string;
    address?: Record<string, string>;
    notes?: string;
  }) {
    await connectDB();
    return Supplier.create(data);
  },

  async update(id: string, data: Record<string, unknown>) {
    await connectDB();
    const supplier = await Supplier.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
    if (!supplier) throw new NotFoundError("Supplier not found");
    return supplier;
  },

  async delete(id: string) {
    await connectDB();
    const supplier = await Supplier.findById(id);
    if (!supplier) throw new NotFoundError("Supplier not found");

    await Product.updateMany({ supplier: id }, { $unset: { supplier: "" } });
    await Supplier.findByIdAndDelete(id);
    return { deleted: true };
  },

  async getAll() {
    await connectDB();
    return Supplier.find({ isActive: true }).sort({ name: 1 }).lean();
  },
};
