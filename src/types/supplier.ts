export interface SupplierAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface Supplier {
  _id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: SupplierAddress;
  notes?: string;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierInput {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: SupplierAddress;
  notes?: string;
}

export interface UpdateSupplierInput {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: SupplierAddress;
  notes?: string;
  isActive?: boolean;
}
