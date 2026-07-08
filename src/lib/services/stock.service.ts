import { Product } from "@/lib/db/models/product.model";
import { StockMovement } from "@/lib/db/models/stock.model";
import { InventoryHistory } from "@/lib/db/models/history.model";
import { connectDB } from "@/lib/db/connection";
import { NotFoundError, ValidationError } from "@/lib/api/api-error";
import { parsePagination, createPaginationMeta } from "@/lib/api/pagination";

export const stockService = {
  async stockIn(data: { product: string; quantity: number; reference?: string; notes?: string }, userId: string) {
    await connectDB();

    const product = await Product.findById(data.product);
    if (!product) throw new NotFoundError("Product not found");

    const previousQuantity = product.quantity;
    const newQuantity = previousQuantity + data.quantity;

    product.quantity = newQuantity;
    await product.save();

    const movement = await StockMovement.create({
      product: product._id,
      type: "stock_in",
      quantity: data.quantity,
      previousQuantity,
      newQuantity,
      reference: data.reference,
      notes: data.notes,
      performedBy: userId,
    });

    await InventoryHistory.create({
      product: product._id,
      action: "stock_in",
      performedBy: userId,
      changes: {
        quantity: { from: previousQuantity, to: newQuantity },
        type: { from: "", to: "Stock In" },
      },
    });

    return movement;
  },

  async stockOut(data: { product: string; quantity: number; reference?: string; notes?: string }, userId: string) {
    await connectDB();

    const product = await Product.findById(data.product);
    if (!product) throw new NotFoundError("Product not found");

    if (product.quantity < data.quantity) {
      throw new ValidationError("Insufficient stock");
    }

    const previousQuantity = product.quantity;
    const newQuantity = previousQuantity - data.quantity;

    product.quantity = newQuantity;
    await product.save();

    const movement = await StockMovement.create({
      product: product._id,
      type: "stock_out",
      quantity: -data.quantity,
      previousQuantity,
      newQuantity,
      reference: data.reference,
      notes: data.notes,
      performedBy: userId,
    });

    await InventoryHistory.create({
      product: product._id,
      action: "stock_out",
      performedBy: userId,
      changes: {
        quantity: { from: previousQuantity, to: newQuantity },
        type: { from: "", to: "Stock Out" },
      },
    });

    return movement;
  },

  async adjust(data: { product: string; newQuantity: number; reference?: string; notes?: string }, userId: string) {
    await connectDB();

    const product = await Product.findById(data.product);
    if (!product) throw new NotFoundError("Product not found");

    const previousQuantity = product.quantity;
    const newQuantity = data.newQuantity;
    const difference = newQuantity - previousQuantity;

    product.quantity = newQuantity;
    await product.save();

    const movement = await StockMovement.create({
      product: product._id,
      type: "adjustment",
      quantity: difference,
      previousQuantity,
      newQuantity,
      reference: data.reference,
      notes: data.notes,
      performedBy: userId,
    });

    await InventoryHistory.create({
      product: product._id,
      action: "adjustment",
      performedBy: userId,
      changes: {
        quantity: { from: previousQuantity, to: newQuantity },
        type: { from: "", to: "Adjustment" },
      },
    });

    return movement;
  },

  async getMovements(params: {
    page?: number;
    limit?: number;
    product?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }) {
    await connectDB();
    const { page, limit, skip } = parsePagination(params);

    const filter: Record<string, unknown> = {};
    if (params.product) filter.product = params.product;
    if (params.type) filter.type = params.type;
    if (params.startDate || params.endDate) {
      filter.createdAt = {};
      if (params.startDate) (filter.createdAt as Record<string, unknown>).$gte = new Date(params.startDate);
      if (params.endDate) (filter.createdAt as Record<string, unknown>).$lte = new Date(params.endDate);
    }

    const [movements, total] = await Promise.all([
      StockMovement.find(filter)
        .populate("product", "name sku image")
        .populate("performedBy", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      StockMovement.countDocuments(filter),
    ]);

    return {
      data: movements,
      pagination: createPaginationMeta(total, page, limit),
    };
  },

  async getRecent(limit = 10) {
    await connectDB();
    return StockMovement.find({})
      .populate("product", "name sku")
      .populate("performedBy", "name")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  },
};
