import { getDb } from '../database';
import type { Worker, InsertWorker, UpdateWorker } from '../../types';

export const WorkerDAO = {
  async getAll(): Promise<Worker[]> {
    const db = await getDb();
    return db.all('SELECT * FROM workers ORDER BY name') as Promise<Worker[]>;
  },
  async getById(id: number): Promise<Worker | undefined> {
    const db = await getDb();
    return db.get('SELECT * FROM workers WHERE id = ?', [id]) as Promise<Worker | undefined>;
  },
  async insert(worker: InsertWorker): Promise<void> {
    const db = await getDb();
    await db.execSQL(
      'INSERT INTO workers (name, phone, note, created_at) VALUES (?, ?, ?, ?)',
      [worker.name, worker.phone || null, worker.note || null, worker.created_at]
    );
  },
  async update(worker: UpdateWorker): Promise<void> {
    const db = await getDb();
    await db.execSQL(
      'UPDATE workers SET name = ?, phone = ?, note = ? WHERE id = ?',
      [worker.name, worker.phone || null, worker.note || null, worker.id]
    );
  },
  async deleteById(id: number): Promise<void> {
    const db = await getDb();
    await db.execSQL('DELETE FROM workers WHERE id = ?', [id]);
  }
};
