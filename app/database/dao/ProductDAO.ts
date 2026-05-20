import { getDb } from '../database';
import type { Product, InsertProduct, UpdateProduct } from '../../types';

export const ProductDAO = {
  async getAll(): Promise<Product[]> {
    const db = await getDb();
    return db.all('SELECT * FROM products ORDER BY name') as Promise<Product[]>;
  },
  async getById(id: number): Promise<Product | undefined> {
    const db = await getDb();
    return db.get('SELECT * FROM products WHERE id = ?', [id]) as Promise<Product | undefined>;
  },
  async insert(product: InsertProduct): Promise<void> {
    const db = await getDb();
    await db.execSQL(
      'INSERT INTO products (name, unit, created_at) VALUES (?, ?, ?)',
      [product.name, product.unit || null, product.created_at]
    );
  },
  async update(product: UpdateProduct): Promise<void> {
    const db = await getDb();
    await db.execSQL(
      'UPDATE products SET name = ?, unit = ? WHERE id = ?',
      [product.name, product.unit || null, product.id]
    );
  },
  async deleteById(id: number): Promise<void> {
    const db = await getDb();
    await db.execSQL('DELETE FROM products WHERE id = ?', [id]);
  }
};
