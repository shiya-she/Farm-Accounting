import { getDb } from '../database';

export const WorkerDAO = {
  async getAll() {
    const db = await getDb();
    return db.all('SELECT * FROM workers ORDER BY name');
  },
  async getById(id) {
    const db = await getDb();
    return db.get('SELECT * FROM workers WHERE id = ?', [id]);
  },
  async insert(worker) {
    const db = await getDb();
    await db.execSQL(
      'INSERT INTO workers (name, phone, note, created_at) VALUES (?, ?, ?, ?)',
      [worker.name, worker.phone || null, worker.note || null, worker.created_at]
    );
  },
  async update(worker) {
    const db = await getDb();
    await db.execSQL(
      'UPDATE workers SET name = ?, phone = ?, note = ? WHERE id = ?',
      [worker.name, worker.phone || null, worker.note || null, worker.id]
    );
  },
  async deleteById(id) {
    const db = await getDb();
    await db.execSQL('DELETE FROM workers WHERE id = ?', [id]);
  }
};
