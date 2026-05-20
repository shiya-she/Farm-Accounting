import { defineStore } from 'pinia';
import { RecordService } from '../services/RecordService';

export const useRecordsStore = defineStore('records', {
  state: () => ({
    records: [],
    monthSummary: { totalIncome: 0, totalExpense: 0 },
    filters: {}
  }),
  getters: {
    balance: (s) => s.monthSummary.totalIncome - s.monthSummary.totalExpense
  },
  actions: {
    async loadRecords(filters = {}) {
      this.filters = { ...filters };
      this.records = await RecordService.getRecords(filters);
    },
    async loadMonthSummary(yearMonth) {
      this.monthSummary = await RecordService.getMonthSummary(yearMonth);
    },
    async addRecord(data) {
      await RecordService.addRecord(data);
      const ym = data.date.substring(0, 7);
      await Promise.all([
        this.loadMonthSummary(ym),
        this.loadRecords(this.filters)
      ]);
    },
    async deleteRecord(id, date) {
      await RecordService.deleteRecord(id);
      const ym = date.substring(0, 7);
      await Promise.all([
        this.loadMonthSummary(ym),
        this.loadRecords(this.filters)
      ]);
    }
  }
});
