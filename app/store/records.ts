import { defineStore } from 'pinia';
import { RecordService } from '../services/RecordService';
import type { AddRecordData } from '../services/RecordService';
import type { RecordJoined, MonthSummary, RecordFilters } from '../types';

export const useRecordsStore = defineStore('records', {
  state: (): {
    records: RecordJoined[];
    monthSummary: MonthSummary;
    filters: RecordFilters;
  } => ({
    records: [],
    monthSummary: { totalIncome: 0, totalExpense: 0 },
    filters: {}
  }),
  getters: {
    balance: (s) => s.monthSummary.totalIncome - s.monthSummary.totalExpense
  },
  actions: {
    async loadRecords(filters: RecordFilters = {}): Promise<void> {
      this.filters = { ...filters };
      this.records = await RecordService.getRecords(filters);
    },
    async loadMonthSummary(yearMonth: string): Promise<void> {
      this.monthSummary = await RecordService.getMonthSummary(yearMonth);
    },
    async addRecord(data: AddRecordData): Promise<void> {
      await RecordService.addRecord(data);
      const ym = data.date.substring(0, 7);
      await Promise.all([
        this.loadMonthSummary(ym),
        this.loadRecords(this.filters)
      ]);
    },
    async deleteRecord(id: number, date: string): Promise<void> {
      await RecordService.deleteRecord(id);
      const ym = date.substring(0, 7);
      await Promise.all([
        this.loadMonthSummary(ym),
        this.loadRecords(this.filters)
      ]);
    }
  }
});
