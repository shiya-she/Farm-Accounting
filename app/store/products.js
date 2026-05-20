import { defineStore } from 'pinia';
import { ProductService } from '../services/ProductService';

export const useProductsStore = defineStore('products', {
  state: () => ({ products: [] }),
  actions: {
    async loadProducts() { this.products = await ProductService.getAll(); },
    async addProduct(name, unit) {
      await ProductService.addProduct(name, unit);
      await this.loadProducts();
    },
    async updateProduct(id, name, unit) {
      await ProductService.updateProduct(id, name, unit);
      await this.loadProducts();
    },
    async deleteProduct(id) {
      await ProductService.deleteProduct(id);
      await this.loadProducts();
    }
  }
});
