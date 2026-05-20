import { ProductDAO } from '../database/dao/ProductDAO';
import { now } from '../utils/date';
import type { Product } from '../types';

export const ProductService = {
  async getAll(): Promise<Product[]> { return ProductDAO.getAll(); },
  async addProduct(name: string, unit?: string): Promise<void> {
    await ProductDAO.insert({ name, unit: unit || null, created_at: now() });
  },
  async updateProduct(id: number, name: string, unit?: string): Promise<void> {
    await ProductDAO.update({ id, name, unit: unit || null });
  },
  async deleteProduct(id: number): Promise<void> { await ProductDAO.deleteById(id); }
};
