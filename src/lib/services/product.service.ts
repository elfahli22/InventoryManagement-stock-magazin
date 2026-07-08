import { Product } from "@/lib/db/models/product.model";
import { Supplier } from "@/lib/db/models/supplier.model";
import { InventoryHistory } from "@/lib/db/models/history.model";
import { connectDB } from "@/lib/db/connection";
import { NotFoundError, ConflictError } from "@/lib/api/api-error";
import { parsePagination, createPaginationMeta } from "@/lib/api/pagination";
import type { CreateProductInput, UpdateProductInput, ProductFilters } from "@/types/product";

export const productService = {
  async list(params: { page?: number; limit?: number; sort?: string; order?: string; filters?: ProductFilters }) {
    await connectDB();
    const { page, limit, skip, sort } = parsePagination(params);

    const filter: Record<string, unknown> = {};
    const f = params.filters;

    if (f) {
      if (f.search) {
        filter.$or = [
          { name: { $regex: f.search, $options: "i" } },
          { sku: { $regex: f.search, $options: "i" } },
          { barcode: { $regex: f.search, $options: "i" } },
        ];
      }
      if (f.category) filter.category = f.category;
      if (f.supplier) filter.supplier = f.supplier;
      if (f.status) filter.status = f.status;
      if (f.isActive !== undefined) filter.isActive = f.isActive;
      if (f.minQuantity !== undefined) filter.quantity = { ...(filter.quantity as object || {}), $gte: f.minQuantity };
      if (f.maxQuantity !== undefined) filter.quantity = { ...(filter.quantity as object || {}), $lte: f.maxQuantity };
      if (f.minPrice !== undefined) filter.sellingPrice = { ...(filter.sellingPrice as object || {}), $gte: f.minPrice };
      if (f.maxPrice !== undefined) filter.sellingPrice = { ...(filter.sellingPrice as object || {}), $lte: f.maxPrice };
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name")
        .populate("supplier", "name")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return {
      data: products,
      pagination: createPaginationMeta(total, page, limit),
    };
  },

  async getById(id: string) {
    await connectDB();
    const product = await Product.findById(id)
      .populate("category", "name slug")
      .populate("supplier", "name company")
      .lean();

    if (!product) throw new NotFoundError("Product not found");
    return product;
  },

  async create(data: CreateProductInput, userId: string) {
    await connectDB();

    const existingSku = await Product.findOne({ sku: data.sku.toUpperCase() });
    if (existingSku) throw new ConflictError("SKU already exists");

    if (data.barcode) {
      const existingBarcode = await Product.findOne({ barcode: data.barcode });
      if (existingBarcode) throw new ConflictError("Barcode already exists");
    }

    const product = await Product.create({
      ...data,
      sku: data.sku.toUpperCase(),
    });

    if (data.supplier) {
      await Supplier.findByIdAndUpdate(data.supplier, { $inc: { productCount: 1 } });
    }

    await InventoryHistory.create({
      product: product._id,
      action: "created",
      performedBy: userId,
      changes: { name: { from: "", to: data.name } },
    });

    return product;
  },

  async update(id: string, data: UpdateProductInput, userId: string) {
    await connectDB();

    const existing = await Product.findById(id);
    if (!existing) throw new NotFoundError("Product not found");

    if (data.sku && data.sku.toUpperCase() !== existing.sku) {
      const duplicate = await Product.findOne({ sku: data.sku.toUpperCase(), _id: { $ne: id } });
      if (duplicate) throw new ConflictError("SKU already exists");
    }

    if (data.barcode && data.barcode !== existing.barcode) {
      const duplicate = await Product.findOne({ barcode: data.barcode, _id: { $ne: id } });
      if (duplicate) throw new ConflictError("Barcode already exists");
    }

    const changes: Record<string, { from: unknown; to: unknown }> = {};
    const fields = ["name", "purchasePrice", "sellingPrice", "minQuantity", "status"];
    for (const field of fields) {
      const key = field as keyof typeof data;
      if (data[key] !== undefined && data[key] !== (existing as unknown as Record<string, unknown>)[key]) {
        changes[field] = {
          from: (existing as unknown as Record<string, unknown>)[key],
          to: data[key],
        };
      }
    }

    const oldSupplier = existing.supplier?.toString();
    const newSupplier = data.supplier;

    if (data.sku) data.sku = data.sku.toUpperCase();
    const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate("category", "name")
      .populate("supplier", "name")
      .lean();

    if (!product) throw new NotFoundError("Product not found");

    if (newSupplier && newSupplier !== oldSupplier) {
      if (oldSupplier) await Supplier.findByIdAndUpdate(oldSupplier, { $inc: { productCount: -1 } });
      await Supplier.findByIdAndUpdate(newSupplier, { $inc: { productCount: 1 } });
    }

    if (Object.keys(changes).length > 0) {
      await InventoryHistory.create({
        product: id,
        action: "updated",
        changes,
        performedBy: userId,
      });
    }

    return product;
  },

  async delete(id: string, userId: string) {
    await connectDB();

    const product = await Product.findById(id);
    if (!product) throw new NotFoundError("Product not found");

    if (product.supplier) {
      await Supplier.findByIdAndUpdate(product.supplier, { $inc: { productCount: -1 } });
    }

    await InventoryHistory.create({
      product: product._id,
      action: "deleted",
      performedBy: userId,
      changes: { name: { from: product.name, to: "" } },
    });

    await Product.findByIdAndDelete(id);
    return { deleted: true };
  },

  async getLowStock(threshold?: number) {
    await connectDB();
    const minQty = threshold || 10;
    return Product.find({ quantity: { $lte: minQty }, isActive: true })
      .populate("category", "name")
      .populate("supplier", "name")
      .sort({ quantity: 1 })
      .lean();
  },

  async getOutOfStock() {
    await connectDB();
    return Product.find({ quantity: 0, isActive: true })
      .populate("category", "name")
      .sort({ name: 1 })
      .lean();
  },
};
