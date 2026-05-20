import { ProductDAO } from '../database/dao/ProductDAO';
import { now } from '../utils/date';

export const ProductService = {
  async getAll() { return ProductDAO.getAll(); },
  async addProduct(name, unit) {
    await ProductDAO.insert({ name, unit, created_at: now() });
  },
  async updateProduct(id, name, unit) {
    await ProductDAO.update({ id, name, unit });
  },
  async deleteProduct(id) { await ProductDAO.deleteById(id); }
};
