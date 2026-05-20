import { defineStore } from 'pinia';
import { ProductService } from '../services/ProductService';
import type { Product } from '../types';

export const useProductsStore = defineStore('products', {
  state: (): { products: Product[] } => ({ products: [] }),
  actions: {
    async loadProducts(): Promise<void> { this.products = await ProductService.getAll(); },
    async addProduct(name: string, unit?: string): Promise<void> {
      await ProductService.addProduct(name, unit);
      await this.loadProducts();
    },
    async updateProduct(id: number, name: string, unit?: string): Promise<void> {
      await ProductService.updateProduct(id, name, unit);
      await this.loadProducts();
    },
    async deleteProduct(id: number): Promise<void> {
      await ProductService.deleteProduct(id);
      await this.loadProducts();
    }
  }
});
