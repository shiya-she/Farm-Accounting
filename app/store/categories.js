import { defineStore } from 'pinia';
import { CategoryService } from '../services/CategoryService';

export const useCategoriesStore = defineStore('categories', {
  state: () => ({ categories: [] }),
  getters: {
    incomeCategories: (s) => s.categories.filter(c => c.type === 'income'),
    expenseCategories: (s) => s.categories.filter(c => c.type === 'expense')
  },
  actions: {
    async loadCategories() { this.categories = await CategoryService.getAll(); },
    async addCategory(type, name) {
      await CategoryService.addCategory(type, name);
      await this.loadCategories();
    },
    async updateCategory(id, name) {
      await CategoryService.updateCategory(id, name);
      await this.loadCategories();
    },
    async deleteCategory(id) {
      await CategoryService.deleteCategory(id);
      await this.loadCategories();
    }
  }
});
