import { getDashboardStatsAction } from "@/lib/actions/dashboard.actions";
import {
  Package,
  DollarSign,
  AlertTriangle,
  TrendingDown,
  Warehouse,
  ShoppingCart,
  ArrowUpDown,
  BarChart3,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { formatCurrency, formatNumber } from "@/lib/utils/formatters";

export async function DashboardStatsGrid() {
  const result = await getDashboardStatsAction();

  if (!result.success) {
    return <p className="text-sm text-muted-foreground">Failed to load stats</p>;
  }

  const stats = result.data;

  const statItems = [
    {
      title: "Total Products",
      value: formatNumber(stats.totalProducts),
      icon: Package,
      description: `${stats.lowStockCount} low stock, ${stats.outOfStockCount} out of stock`,
    },
    {
      title: "Inventory Value",
      value: formatCurrency(stats.inventoryValue),
      icon: DollarSign,
      trend: { value: stats.potentialProfit > 0 ? 12 : -5, positive: stats.potentialProfit > 0 },
    },
    {
      title: "Low Stock Items",
      value: formatNumber(stats.lowStockCount),
      icon: AlertTriangle,
      description: "Items below minimum quantity",
    },
    {
      title: "Out of Stock",
      value: formatNumber(stats.outOfStockCount),
      icon: TrendingDown,
      description: "Items with zero quantity",
    },
    {
      title: "Today's Sales",
      value: formatNumber(stats.todaySales),
      icon: ShoppingCart,
      description: `${formatNumber(stats.todayStockOut)} units sold`,
    },
    {
      title: "Today Stock In",
      value: formatNumber(stats.todayStockIn),
      icon: Warehouse,
      description: "Units received today",
    },
    {
      title: "Potential Profit",
      value: formatCurrency(stats.potentialProfit),
      icon: BarChart3,
      trend: { value: 8, positive: true },
    },
    {
      title: "Movements Today",
      value: formatNumber(stats.recentStockMovements),
      icon: ArrowUpDown,
      description: "Total stock movements",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <StatCard key={item.title} {...item} />
      ))}
    </div>
  );
}
