import { getDb } from '../database';

export const ProductDAO = {
  async getAll() {
    const db = await getDb();
    return db.all('SELECT * FROM products ORDER BY name');
  },
  async getById(id) {
    const db = await getDb();
    return db.get('SELECT * FROM products WHERE id = ?', [id]);
  },
  async insert(product) {
    const db = await getDb();
    await db.execSQL(
      'INSERT INTO products (name, unit, created_at) VALUES (?, ?, ?)',
      [product.name, product.unit || null, product.created_at]
    );
  },
  async update(product) {
    const db = await getDb();
    await db.execSQL(
      'UPDATE products SET name = ?, unit = ? WHERE id = ?',
      [product.name, product.unit || null, product.id]
    );
  },
  async deleteById(id) {
    const db = await getDb();
    await db.execSQL('DELETE FROM products WHERE id = ?', [id]);
  }
};
