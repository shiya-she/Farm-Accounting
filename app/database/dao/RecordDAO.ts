import { getDb } from '../database';
import type {
  RecordJoined, InsertRecord, UpdateRecord, RecordFilters,
  MonthSummary, CategoryStat, WorkerSalaryStat, ProductSalesStat
} from '../../types';

export const RecordDAO = {
  async getAll(filters: RecordFilters = {}): Promise<RecordJoined[]> {
    const db = await getDb();
    let sql = `
      SELECT r.*, c.name as category_name, c.type as category_type,
             w.name as worker_name, p.name as product_name, p.unit as product_unit
      FROM records r
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN workers w ON r.worker_id = w.id
      LEFT JOIN products p ON r.product_id = p.id
      WHERE 1=1
    `;
    const params: (string | number)[] = [];

    if (filters.type) {
      sql += ' AND r.type = ?';
      params.push(filters.type);
    }
    if (filters.month) {
      sql += ' AND r.date LIKE ?';
      params.push(filters.month + '%');
    }

    sql += ' ORDER BY r.date DESC, r.id DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(filters.limit);
    }

    return db.all(sql, params as unknown[]) as Promise<RecordJoined[]>;
  },

  async getById(id: number): Promise<RecordJoined | undefined> {
    const db = await getDb();
    return db.get(`
      SELECT r.*, c.name as category_name, c.type as category_type,
             w.name as worker_name, p.name as product_name, p.unit as product_unit
      FROM records r
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN workers w ON r.worker_id = w.id
      LEFT JOIN products p ON r.product_id = p.id
      WHERE r.id = ?
    `, [id]) as Promise<RecordJoined | undefined>;
  },

  async insert(record: InsertRecord): Promise<void> {
    const db = await getDb();
    await db.execSQL(
      `INSERT INTO records (type, amount, category_id, worker_id, product_id,
       unit_price, weight, total_price, date, note, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [record.type, record.amount, record.category_id,
       record.worker_id || null, record.product_id || null,
       record.unit_price || null, record.weight || null, record.total_price || null,
       record.date, record.note || null, record.created_at]
    );
  },

  async update(record: UpdateRecord): Promise<void> {
    const db = await getDb();
    await db.execSQL(
      `UPDATE records SET type=?, amount=?, category_id=?, worker_id=?,
       product_id=?, unit_price=?, weight=?, total_price=?, date=?, note=?
       WHERE id=?`,
      [record.type, record.amount, record.category_id,
       record.worker_id || null, record.product_id || null,
       record.unit_price || null, record.weight || null, record.total_price || null,
       record.date, record.note || null, record.id]
    );
  },

  async deleteById(id: number): Promise<void> {
    const db = await getDb();
    await db.execSQL('DELETE FROM records WHERE id = ?', [id]);
  },

  async getMonthSummary(yearMonth: string): Promise<MonthSummary> {
    const db = await getDb();
    return db.get(`
      SELECT
        COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE 0 END), 0) as totalIncome,
        COALESCE(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END), 0) as totalExpense
      FROM records WHERE date LIKE ?
    `, [yearMonth + '%']) as Promise<MonthSummary>;
  },

  async getCategoryStats(type: string, yearMonth: string): Promise<CategoryStat[]> {
    const db = await getDb();
    return db.all(`
      SELECT c.name, SUM(r.amount) as total
      FROM records r JOIN categories c ON r.category_id = c.id
      WHERE r.type = ? AND r.date LIKE ?
      GROUP BY c.id, c.name ORDER BY total DESC
    `, [type, yearMonth + '%']) as Promise<CategoryStat[]>;
  },

  async getWorkerSalaryStats(yearMonth: string): Promise<WorkerSalaryStat[]> {
    const db = await getDb();
    return db.all(`
      SELECT w.name, SUM(r.amount) as total
      FROM records r JOIN workers w ON r.worker_id = w.id
      WHERE r.category_id = (SELECT id FROM categories WHERE name='雇工工资' LIMIT 1)
        AND r.date LIKE ?
      GROUP BY w.id, w.name ORDER BY total DESC
    `, [yearMonth + '%']) as Promise<WorkerSalaryStat[]>;
  },

  async getProductSalesStats(yearMonth: string): Promise<ProductSalesStat[]> {
    const db = await getDb();
    return db.all(`
      SELECT p.name, p.unit, SUM(r.weight) as totalWeight,
             SUM(r.amount) as totalAmount, COUNT(*) as count
      FROM records r JOIN products p ON r.product_id = p.id
      WHERE r.type='income' AND r.product_id IS NOT NULL AND r.date LIKE ?
      GROUP BY p.id, p.name, p.unit ORDER BY totalAmount DESC
    `, [yearMonth + '%']) as Promise<ProductSalesStat[]>;
  }
};
