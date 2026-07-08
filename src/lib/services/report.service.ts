import { Product } from "@/lib/db/models/product.model";
import { StockMovement } from "@/lib/db/models/stock.model";
import { connectDB } from "@/lib/db/connection";

export const reportService = {
  async getInventoryReport() {
    await connectDB();

    const products = await Product.find({ isActive: true })
      .populate("category", "name")
      .lean();

    const totalValue = products.reduce((sum, p) => sum + p.sellingPrice * p.quantity, 0);
    const totalCost = products.reduce((sum, p) => sum + p.purchasePrice * p.quantity, 0);
    const lowStockItems = products.filter((p) => p.quantity <= p.minQuantity).length;
    const outOfStockItems = products.filter((p) => p.quantity === 0).length;

    const categoryBreakdown = products.reduce<Record<string, { category: string; count: number; value: number }>>(
      (acc, p) => {
        const catName = (p.category as unknown as { name: string })?.name || "Uncategorized";
        if (!acc[catName]) acc[catName] = { category: catName, count: 0, value: 0 };
        acc[catName].count += 1;
        acc[catName].value += p.sellingPrice * p.quantity;
        return acc;
      },
      {},
    );

    return {
      totalProducts: products.length,
      totalValue,
      totalCost,
      totalProfit: totalValue - totalCost,
      lowStockItems,
      outOfStockItems,
      categoryBreakdown: Object.values(categoryBreakdown).sort((a, b) => b.value - a.value),
    };
  },

  async getSalesReport(startDate?: string, endDate?: string) {
    await connectDB();

    const filter: Record<string, unknown> = { type: "stock_out" };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) (filter.createdAt as Record<string, unknown>).$gte = new Date(startDate);
      if (endDate) (filter.createdAt as Record<string, unknown>).$lte = new Date(endDate);
    }

    const movements = await StockMovement.find(filter)
      .populate("product", "sellingPrice purchasePrice")
      .sort({ createdAt: 1 })
      .lean();

    const totalSales = movements.length;
    const totalRevenue = movements.reduce((sum, m) => {
      const price = (m.product as unknown as { sellingPrice?: number })?.sellingPrice || 0;
      return sum + Math.abs(m.quantity) * price;
    }, 0);
    const totalCost = movements.reduce((sum, m) => {
      const price = (m.product as unknown as { purchasePrice?: number })?.purchasePrice || 0;
      return sum + Math.abs(m.quantity) * price;
    }, 0);

    const dailyMap = new Map<string, { revenue: number; cost: number; count: number }>();
    for (const m of movements) {
      const key = new Date(m.createdAt).toISOString().split("T")[0];
      const day = dailyMap.get(key) || { revenue: 0, cost: 0, count: 0 };
      const qty = Math.abs(m.quantity);
      day.revenue += qty * ((m.product as unknown as { sellingPrice?: number })?.sellingPrice || 0);
      day.cost += qty * ((m.product as unknown as { purchasePrice?: number })?.purchasePrice || 0);
      day.count += 1;
      dailyMap.set(key, day);
    }

    return {
      totalSales,
      totalRevenue,
      totalCost,
      totalProfit: totalRevenue - totalCost,
      averageMargin: totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0,
      periodSales: Array.from(dailyMap.entries()).map(([date, data]) => ({
        date,
        revenue: data.revenue,
        cost: data.cost,
        profit: data.revenue - data.cost,
        count: data.count,
      })),
    };
  },

  async getProfitReport(startDate?: string, endDate?: string) {
    await connectDB();

    const filter: Record<string, unknown> = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) (filter.createdAt as Record<string, unknown>).$gte = new Date(startDate);
      if (endDate) (filter.createdAt as Record<string, unknown>).$lte = new Date(endDate);
    }

    const movements = await StockMovement.find(filter)
      .populate("product", "sellingPrice purchasePrice")
      .sort({ createdAt: 1 })
      .lean();

    const totalRevenue = movements.reduce((sum, m) => {
      if (m.type === "stock_out") {
        const price = (m.product as unknown as { sellingPrice?: number })?.sellingPrice || 0;
        return sum + Math.abs(m.quantity) * price;
      }
      return sum;
    }, 0);

    const totalCost = movements.reduce((sum, m) => {
      const price = (m.product as unknown as { purchasePrice?: number })?.purchasePrice || 0;
      if (m.type === "stock_out") return sum + Math.abs(m.quantity) * price;
      if (m.type === "stock_in") return sum + m.quantity * price;
      return sum;
    }, 0);

    const monthlyMap = new Map<string, { revenue: number; cost: number }>();
    for (const m of movements) {
      const d = new Date(m.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const month = monthlyMap.get(key) || { revenue: 0, cost: 0 };
      const price = (m.product as unknown as { sellingPrice?: number })?.sellingPrice || 0;
      const costPrice = (m.product as unknown as { purchasePrice?: number })?.purchasePrice || 0;
      if (m.type === "stock_out") {
        month.revenue += Math.abs(m.quantity) * price;
        month.cost += Math.abs(m.quantity) * costPrice;
      }
      if (m.type === "stock_in") {
        month.cost += m.quantity * costPrice;
      }
      monthlyMap.set(key, month);
    }

    return {
      totalRevenue,
      totalCost,
      grossProfit: totalRevenue - totalCost,
      grossMargin: totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0,
      monthlyProfit: Array.from(monthlyMap.entries()).map(([month, data]) => ({
        month,
        revenue: data.revenue,
        cost: data.cost,
        profit: data.revenue - data.cost,
      })),
    };
  },

  async getLowStockReport() {
    await connectDB();

    const products = await Product.find({ isActive: true, quantity: { $lte: 10 } })
      .populate("category", "name")
      .populate("supplier", "name")
      .sort({ quantity: 1 })
      .lean();

    return {
      products: products.map((p) => ({
        _id: p._id.toString(),
        name: p.name,
        sku: p.sku,
        quantity: p.quantity,
        minQuantity: p.minQuantity,
        category: (p.category as unknown as { name: string })?.name || "N/A",
        supplier: (p.supplier as unknown as { name: string })?.name,
      })),
      totalCount: products.length,
    };
  },

  async getMostSoldProducts(limit = 10) {
    await connectDB();

    const movements = await StockMovement.find({ type: "stock_out" })
      .populate("product", "name sku quantity")
      .lean();

    const productMap = new Map<string, { name: string; sku: string; totalSold: number; totalRevenue: number; currentStock: number }>();

    for (const m of movements) {
      const p = m.product as unknown as { _id: string; name: string; sku: string; quantity: number };
      if (!p || !p._id) continue;
      const id = p._id.toString();
      const existing = productMap.get(id) || {
        name: p.name,
        sku: p.sku,
        totalSold: 0,
        totalRevenue: 0,
        currentStock: p.quantity || 0,
      };
      const qty = Math.abs(m.quantity);
      existing.totalSold += qty;
      productMap.set(id, existing);
    }

    return Array.from(productMap.entries())
      .map(([id, data]) => ({ _id: id, ...data }))
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, limit);
  },
};
