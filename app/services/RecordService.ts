import { RecordDAO } from '../database/dao/RecordDAO';
import { now } from '../utils/date';
import type { RecordJoined, RecordFilters, MonthSummary } from '../types';

export interface AddRecordData {
  type: string;
  amount: number;
  category_id: number | null;
  worker_id?: number | null;
  product_id?: number | null;
  unit_price?: number | null;
  weight?: number | null;
  total_price?: number | null;
  date: string;
  note?: string | null;
}

export const RecordService = {
  async getRecords(filters: RecordFilters): Promise<RecordJoined[]> { return RecordDAO.getAll(filters); },
  async getRecentRecords(limit: number = 5): Promise<RecordJoined[]> { return RecordDAO.getAll({ limit }); },
  async getMonthSummary(yearMonth: string): Promise<MonthSummary> { return RecordDAO.getMonthSummary(yearMonth); },

  async addRecord(data: AddRecordData): Promise<void> {
    await RecordDAO.insert({
      type: data.type, amount: data.amount, category_id: data.category_id,
      worker_id: data.worker_id || null, product_id: data.product_id || null,
      unit_price: data.unit_price || null, weight: data.weight || null,
      total_price: data.total_price || null, date: data.date,
      note: data.note || null, created_at: now()
    });
  },

  async deleteRecord(id: number): Promise<void> { await RecordDAO.deleteById(id); }
};
