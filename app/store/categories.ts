import { defineStore } from 'pinia';
import { CategoryService } from '../services/CategoryService';
import type { Category } from '../types';

export const useCategoriesStore = defineStore('categories', {
  state: (): { categories: Category[] } => ({ categories: [] }),
  getters: {
    incomeCategories: (s) => s.categories.filter((c: Category) => c.type === 'income'),
    expenseCategories: (s) => s.categories.filter((c: Category) => c.type === 'expense')
  },
  actions: {
    async loadCategories(): Promise<void> { this.categories = await CategoryService.getAll(); },
    async addCategory(type: string, name: string): Promise<void> {
      await CategoryService.addCategory(type, name);
      await this.loadCategories();
    },
    async updateCategory(id: number, name: string): Promise<void> {
      await CategoryService.updateCategory(id, name);
      await this.loadCategories();
    },
    async deleteCategory(id: number): Promise<void> {
      await CategoryService.deleteCategory(id);
      await this.loadCategories();
    }
  }
});
