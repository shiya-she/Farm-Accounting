import { CategoryDAO } from '../database/dao/CategoryDAO';
import type { Category } from '../types';

export const CategoryService = {
  async getIncomeCategories(): Promise<Category[]> {
    return CategoryDAO.getByType('income');
  },
  async getExpenseCategories(): Promise<Category[]> {
    return CategoryDAO.getByType('expense');
  },
  async getAll(): Promise<Category[]> {
    return CategoryDAO.getAll();
  },
  async addCategory(type: string, name: string): Promise<void> {
    const existing = await CategoryDAO.getByType(type);
    const maxSort = existing.reduce((max, c) => Math.max(max, c.sort_order), -1);
    await CategoryDAO.insert({ type, name, sort_order: maxSort + 1, is_preset: 0 });
  },
  async updateCategory(id: number, name: string): Promise<void> {
    await CategoryDAO.update({ id, name });
  },
  async deleteCategory(id: number): Promise<void> {
    await CategoryDAO.deleteById(id);
  }
};
