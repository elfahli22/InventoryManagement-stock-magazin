export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalSuppliers: number;
  totalUsers: number;
  inventoryValue: number;
  inventoryCost: number;
  potentialProfit: number;
  lowStockCount: number;
  outOfStockCount: number;
  recentStockMovements: number;
  todaySales: number;
  todayStockIn: number;
  todayStockOut: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondary?: number;
}

export interface RecentActivity {
  _id: string;
  action: string;
  description: string;
  productName?: string;
  userName?: string;
  timestamp: string;
}

export interface TopProduct {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  sellingPrice: number;
  totalValue: number;
}

export interface TopCategory {
  _id: string;
  name: string;
  productCount: number;
  totalValue: number;
}
