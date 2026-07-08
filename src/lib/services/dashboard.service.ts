import { Product } from "@/lib/db/models/product.model";
import { Category } from "@/lib/db/models/category.model";
import { Supplier } from "@/lib/db/models/supplier.model";
import { User } from "@/lib/db/models/user.model";
import { StockMovement } from "@/lib/db/models/stock.model";
import { connectDB } from "@/lib/db/connection";

export const dashboardService = {
  async getStats() {
    await connectDB();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalProducts,
      totalCategories,
      totalSuppliers,
      totalUsers,
      products,
      lowStockProducts,
      outOfStockProducts,
      todayMovements,
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Category.countDocuments({ isActive: true }),
      Supplier.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: true }),
      Product.find({ isActive: true }).select("purchasePrice sellingPrice quantity").lean(),
      Product.countDocuments({ quantity: { $lte: 10 }, isActive: true }),
      Product.countDocuments({ quantity: 0, isActive: true }),
      StockMovement.find({ createdAt: { $gte: todayStart } }).lean(),
    ]);

    const inventoryValue = products.reduce(
      (sum, p) => sum + p.sellingPrice * p.quantity,
      0,
    );
    const inventoryCost = products.reduce(
      (sum, p) => sum + p.purchasePrice * p.quantity,
      0,
    );

    const todayStockIn = todayMovements
      .filter((m) => m.type === "stock_in")
      .reduce((sum, m) => sum + m.quantity, 0);
    const todayStockOut = todayMovements
      .filter((m) => m.type === "stock_out")
      .reduce((sum, m) => sum + Math.abs(m.quantity), 0);
    const todaySales = todayMovements
      .filter((m) => m.type === "stock_out")
      .length;

    return {
      totalProducts,
      totalCategories,
      totalSuppliers,
      totalUsers,
      inventoryValue,
      inventoryCost,
      potentialProfit: inventoryValue - inventoryCost,
      lowStockCount: lowStockProducts,
      outOfStockCount: outOfStockProducts,
      recentStockMovements: todayMovements.length,
      todaySales,
      todayStockIn,
      todayStockOut,
    };
  },

  async getTopProducts(limit = 5) {
    await connectDB();
    return Product.find({ isActive: true })
      .populate("category", "name")
      .sort({ quantity: -1 })
      .limit(limit)
      .select("name sku quantity sellingPrice")
      .lean()
      .then((products) =>
        products.map((p) => ({
          _id: String(p._id),
          name: p.name,
          sku: p.sku,
          quantity: p.quantity,
          sellingPrice: p.sellingPrice,
          totalValue: p.sellingPrice * p.quantity,
        })),
      );
  },

  async getTopCategories() {
    await connectDB();
    const products = await Product.find({ isActive: true })
      .populate("category", "name")
      .lean();

    const categoryMap = new Map<string, { name: string; count: number; value: number }>();

    for (const product of products) {
      const cat = product.category as unknown as { _id: string; name: string };
      if (!cat) continue;
      const catId = cat._id.toString();
      const existing = categoryMap.get(catId) || { name: cat.name, count: 0, value: 0 };
      existing.count += 1;
      existing.value += product.sellingPrice * product.quantity;
      categoryMap.set(catId, existing);
    }

    return Array.from(categoryMap.entries())
      .map(([id, data]) => ({ _id: id, ...data }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  },

  async getRecentActivity(limit = 10) {
    await connectDB();
    const history = await (await import("@/lib/db/models/history.model")).InventoryHistory
      .find({})
      .populate("product", "name")
      .populate("performedBy", "name")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return history.map((h) => ({
      _id: String(h._id),
      action: h.action,
      description: `${h.action.replace("_", " ")} - ${(h.product as unknown as { name: string })?.name || "Unknown"}`,
      productName: (h.product as unknown as { name: string })?.name,
      userName: (h.performedBy as unknown as { name: string })?.name,
      timestamp: h.createdAt,
    }));
  },

  async getChartData(days = 30) {
    await connectDB();
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const movements = await StockMovement.find({
      createdAt: { $gte: startDate },
    })
      .sort({ createdAt: 1 })
      .lean();

    const dailyMap = new Map<string, { stockIn: number; stockOut: number; revenue: number }>();

    for (let i = 0; i < days; i++) {
      const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      dailyMap.set(key, { stockIn: 0, stockOut: 0, revenue: 0 });
    }

    const products = await Product.find({}).select("sellingPrice").lean();
    const productPriceMap = new Map(products.map((p) => [String(p._id), p.sellingPrice]));

    for (const m of movements) {
      const key = new Date(m.createdAt).toISOString().split("T")[0];
      const day = dailyMap.get(key);
      if (day) {
        if (m.type === "stock_in") day.stockIn += m.quantity;
        if (m.type === "stock_out") {
          day.stockOut += Math.abs(m.quantity);
          const productId = (m.product as unknown as { _id?: string })?._id?.toString() || m.product.toString();
          day.revenue += Math.abs(m.quantity) * (productPriceMap.get(productId) || 0);
        }
      }
    }

    return Array.from(dailyMap.entries()).map(([label, data]) => ({
      label,
      ...data,
    }));
  },
};
