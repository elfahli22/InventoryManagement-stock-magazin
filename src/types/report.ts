export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  supplier?: string;
}

export interface InventoryReport {
  totalProducts: number;
  totalValue: number;
  totalCost: number;
  totalProfit: number;
  lowStockItems: number;
  outOfStockItems: number;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    value: number;
  }>;
}

export interface SalesReport {
  totalSales: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  averageMargin: number;
  periodSales: Array<{
    date: string;
    revenue: number;
    cost: number;
    profit: number;
  }>;
}

export interface ProfitReport {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  grossMargin: number;
  monthlyProfit: Array<{
    month: string;
    revenue: number;
    cost: number;
    profit: number;
  }>;
}

export interface LowStockReport {
  products: Array<{
    _id: string;
    name: string;
    sku: string;
    quantity: number;
    minQuantity: number;
    category: string;
    supplier?: string;
  }>;
  totalCount: number;
}

export interface MostSoldProduct {
  _id: string;
  name: string;
  sku: string;
  totalSold: number;
  totalRevenue: number;
  currentStock: number;
}
