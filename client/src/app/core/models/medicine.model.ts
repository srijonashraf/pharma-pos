// src/app/core/models/medicine.model.ts

export interface MedicineDto {
  id: string;
  name: string;
  genericName?: string;
  barcode?: string;
  brand?: string;
  category?: string;
  unit: string;
  price: number;
  discountPct: number;
  stock: number;
  isActive: boolean;
}

export interface MedicineFilter {
  search?: string;
  status?: 'all' | 'in_stock' | 'out_of_stock' | 'discounted';
  brand?: string;
  page?: number;
  limit?: number;
}
