import { RecordDAO } from '../database/dao/RecordDAO';
import { now } from '../utils/date';

export const RecordService = {
  async getRecords(filters) { return RecordDAO.getAll(filters); },
  async getRecentRecords(limit = 5) { return RecordDAO.getAll({ limit }); },
  async getMonthSummary(yearMonth) { return RecordDAO.getMonthSummary(yearMonth); },

  async addRecord(data) {
    await RecordDAO.insert({
      type: data.type, amount: data.amount, category_id: data.category_id,
      worker_id: data.worker_id || null, product_id: data.product_id || null,
      unit_price: data.unit_price || null, weight: data.weight || null,
      total_price: data.total_price || null, date: data.date,
      note: data.note || null, created_at: now()
    });
  },

  async deleteRecord(id) { await RecordDAO.deleteById(id); }
};
