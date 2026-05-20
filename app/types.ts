// Data model type definitions

export interface Category {
  id: number;
  type: 'income' | 'expense';
  name: string;
  icon: string | null;
  sort_order: number;
  is_preset: number;
}

export interface Worker {
  id: number;
  name: string;
  phone: string | null;
  note: string | null;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  unit: string | null;
  created_at: string;
}

export interface Record {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  category_id: number | null;
  worker_id: number | null;
  product_id: number | null;
  unit_price: number | null;
  weight: number | null;
  total_price: number | null;
  date: string;
  note: string | null;
  created_at: string;
}

export interface RecordJoined extends Record {
  category_name: string | null;
  category_type: string | null;
  worker_name: string | null;
  product_name: string | null;
  product_unit: string | null;
}

export interface MonthSummary {
  totalIncome: number;
  totalExpense: number;
}

export interface CategoryStat {
  name: string;
  total: number;
}

export interface WorkerSalaryStat {
  name: string;
  total: number;
}

export interface ProductSalesStat {
  name: string;
  unit: string | null;
  totalWeight: number;
  totalAmount: number;
  count: number;
}

export interface MonthlyTrendItem {
  month: number;
  income: number;
  expense: number;
}

export interface RecordFilters {
  type?: 'income' | 'expense';
  month?: string;
  limit?: number;
}

export interface InsertCategory {
  type: string;
  name: string;
  icon?: string | null;
  sort_order?: number;
  is_preset?: number;
}

export interface UpdateCategory {
  id: number;
  name: string;
  icon?: string | null;
  sort_order?: number;
}

export interface InsertWorker {
  name: string;
  phone?: string | null;
  note?: string | null;
  created_at: string;
}

export interface UpdateWorker {
  id: number;
  name: string;
  phone?: string | null;
  note?: string | null;
}

export interface InsertProduct {
  name: string;
  unit?: string | null;
  created_at: string;
}

export interface UpdateProduct {
  id: number;
  name: string;
  unit?: string | null;
}

export interface InsertRecord {
  type: string;
  amount: number;
  category_id: number | null;
  worker_id?: number | null;
  product_id?: number | null;
  unit_price?: number | null;
  weight?: number | null;
  total_price?: number | null;
  date: string;
  note?: string | null;
  created_at: string;
}

export interface UpdateRecord {
  id: number;
  type: string;
  amount: number;
  category_id: number | null;
  worker_id?: number | null;
  product_id?: number | null;
  unit_price?: number | null;
  weight?: number | null;
  total_price?: number | null;
  date: string;
  note?: string | null;
}

export interface AddRecordForm {
  type: 'income' | 'expense';
  category_id: number | null;
  worker_id: number | null;
  product_id: number | null;
  date: Date;
  note: string;
}

export interface DbRow {
  [key: string]: unknown;
}
