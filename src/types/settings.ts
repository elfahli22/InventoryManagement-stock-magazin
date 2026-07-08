export interface Settings {
  _id: string;
  storeName: string;
  storeEmail?: string;
  storePhone?: string;
  storeAddress?: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  lowStockThreshold: number;
  timezone: string;
  dateFormat: string;
  notifications: {
    lowStock: boolean;
    dailyReport: boolean;
  };
  updatedBy: string;
  updatedAt: string;
}

export interface UpdateSettingsInput {
  storeName?: string;
  storeEmail?: string;
  storePhone?: string;
  storeAddress?: string;
  currency?: string;
  currencySymbol?: string;
  taxRate?: number;
  lowStockThreshold?: number;
  timezone?: string;
  dateFormat?: string;
  notifications?: {
    lowStock?: boolean;
    dailyReport?: boolean;
  };
}
