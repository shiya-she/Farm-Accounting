import { getDb } from '../database';
import type { Category, InsertCategory, UpdateCategory } from '../../types';

export const CategoryDAO = {
  async getAll(): Promise<Category[]> {
    const db = await getDb();
    return db.all('SELECT * FROM categories ORDER BY type, sort_order') as Promise<Category[]>;
  },

  async getByType(type: string): Promise<Category[]> {
    const db = await getDb();
    return db.all('SELECT * FROM categories WHERE type = ? ORDER BY sort_order', [type]) as Promise<Category[]>;
  },

  async getById(id: number): Promise<Category | undefined> {
    const db = await getDb();
    return db.get('SELECT * FROM categories WHERE id = ?', [id]) as Promise<Category | undefined>;
  },

  async insert(category: InsertCategory): Promise<void> {
    const db = await getDb();
    await db.execSQL(
      'INSERT INTO categories (type, name, icon, sort_order, is_preset) VALUES (?, ?, ?, ?, ?)',
      [category.type, category.name, category.icon || null, category.sort_order || 0, category.is_preset || 0]
    );
  },

  async update(category: UpdateCategory): Promise<void> {
    const db = await getDb();
    await db.execSQL(
      'UPDATE categories SET name = ?, icon = ?, sort_order = ? WHERE id = ?',
      [category.name, category.icon || null, category.sort_order || 0, category.id]
    );
  },

  async deleteById(id: number): Promise<void> {
    const db = await getDb();
    await db.execSQL('DELETE FROM categories WHERE id = ? AND is_preset = 0', [id]);
  }
};
