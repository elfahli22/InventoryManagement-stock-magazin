import { InventoryHistory } from "@/lib/db/models/history.model";
import { connectDB } from "@/lib/db/connection";
import { parsePagination, createPaginationMeta } from "@/lib/api/pagination";

export const historyService = {
  async list(params: {
    page?: number;
    limit?: number;
    product?: string;
    action?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    await connectDB();
    const { page, limit, skip } = parsePagination(params);

    const filter: Record<string, unknown> = {};
    if (params.product) filter.product = params.product;
    if (params.action) filter.action = params.action;
    if (params.userId) filter.performedBy = params.userId;
    if (params.startDate || params.endDate) {
      filter.createdAt = {};
      if (params.startDate) (filter.createdAt as Record<string, unknown>).$gte = new Date(params.startDate);
      if (params.endDate) (filter.createdAt as Record<string, unknown>).$lte = new Date(params.endDate);
    }

    const [history, total] = await Promise.all([
      InventoryHistory.find(filter)
        .populate("product", "name sku")
        .populate("performedBy", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      InventoryHistory.countDocuments(filter),
    ]);

    return {
      data: history,
      pagination: createPaginationMeta(total, page, limit),
    };
  },

  async getRecent(limit = 20) {
    await connectDB();
    return InventoryHistory.find({})
      .populate("product", "name sku")
      .populate("performedBy", "name")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  },
};
