import { getDb } from '../database';

export const CategoryDAO = {
  async getAll() {
    const db = await getDb();
    return db.all('SELECT * FROM categories ORDER BY type, sort_order');
  },

  async getByType(type) {
    const db = await getDb();
    return db.all('SELECT * FROM categories WHERE type = ? ORDER BY sort_order', [type]);
  },

  async getById(id) {
    const db = await getDb();
    return db.get('SELECT * FROM categories WHERE id = ?', [id]);
  },

  async insert(category) {
    const db = await getDb();
    await db.execSQL(
      'INSERT INTO categories (type, name, icon, sort_order, is_preset) VALUES (?, ?, ?, ?, ?)',
      [category.type, category.name, category.icon || null, category.sort_order || 0, category.is_preset || 0]
    );
  },

  async update(category) {
    const db = await getDb();
    await db.execSQL(
      'UPDATE categories SET name = ?, icon = ?, sort_order = ? WHERE id = ?',
      [category.name, category.icon || null, category.sort_order || 0, category.id]
    );
  },

  async deleteById(id) {
    const db = await getDb();
    await db.execSQL('DELETE FROM categories WHERE id = ? AND is_preset = 0', [id]);
  }
};
