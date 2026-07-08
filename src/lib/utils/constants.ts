export const PRODUCT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DISCONTINUED: "discontinued",
} as const;

export const STOCK_TYPE = {
  IN: "stock_in",
  OUT: "stock_out",
  ADJUSTMENT: "adjustment",
  RETURN: "return",
} as const;

export const USER_ROLE = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MANAGER: "manager",
  STAFF: "staff",
  DEMO: "demo",
} as const;

export const HISTORY_ACTION = {
  CREATED: "created",
  UPDATED: "updated",
  STOCK_IN: "stock_in",
  STOCK_OUT: "stock_out",
  ADJUSTMENT: "adjustment",
  DELETED: "deleted",
} as const;

export const BACKUP_STATUS = {
  COMPLETED: "completed",
  FAILED: "failed",
  IN_PROGRESS: "in_progress",
} as const;

export const DEFAULT_SETTINGS = {
  storeName: "My Store",
  currency: "USD",
  currencySymbol: "$",
  taxRate: 0,
  lowStockThreshold: 10,
  timezone: "UTC",
  dateFormat: "MM/dd/yyyy",
  notifications: {
    lowStock: true,
    dailyReport: false,
  },
};

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/products", label: "Products", icon: "Package" },
  { href: "/categories", label: "Categories", icon: "Tags" },
  { href: "/suppliers", label: "Suppliers", icon: "Truck" },
  { href: "/stock", label: "Stock", icon: "Warehouse" },
  { href: "/stock/movements", label: "Movements", icon: "ArrowRightLeft" },
  { href: "/history", label: "History", icon: "Clock" },
  { href: "/reports", label: "Reports", icon: "BarChart3" },
  { href: "/users", label: "Users", icon: "Users" },
  { href: "/settings", label: "Settings", icon: "Settings" },
  { href: "/backup", label: "Backup", icon: "Shield" },
] as const;

export const META = {
  title: "InventoryManager",
  description: "Premium Inventory Management System",
};
