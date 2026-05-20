import { CategoryDAO } from '../database/dao/CategoryDAO';

export const CategoryService = {
  async getIncomeCategories() {
    return CategoryDAO.getByType('income');
  },
  async getExpenseCategories() {
    return CategoryDAO.getByType('expense');
  },
  async getAll() {
    return CategoryDAO.getAll();
  },
  async addCategory(type, name) {
    const existing = await CategoryDAO.getByType(type);
    const maxSort = existing.reduce((max, c) => Math.max(max, c.sort_order), -1);
    await CategoryDAO.insert({ type, name, sort_order: maxSort + 1, is_preset: 0 });
  },
  async updateCategory(id, name) {
    await CategoryDAO.update({ id, name });
  },
  async deleteCategory(id) {
    await CategoryDAO.deleteById(id);
  }
};
