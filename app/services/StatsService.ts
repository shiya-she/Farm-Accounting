import { RecordDAO } from '../database/dao/RecordDAO';
import type { MonthSummary, CategoryStat, WorkerSalaryStat, ProductSalesStat, MonthlyTrendItem } from '../types';

export const StatsService = {
  async getMonthSummary(yearMonth: string): Promise<MonthSummary> { return RecordDAO.getMonthSummary(yearMonth); },
  async getCategoryStats(type: string, yearMonth: string): Promise<CategoryStat[]> { return RecordDAO.getCategoryStats(type, yearMonth); },
  async getWorkerSalaryStats(yearMonth: string): Promise<WorkerSalaryStat[]> { return RecordDAO.getWorkerSalaryStats(yearMonth); },
  async getProductSalesStats(yearMonth: string): Promise<ProductSalesStat[]> { return RecordDAO.getProductSalesStats(yearMonth); },

  async getMonthlyTrend(year: number): Promise<MonthlyTrendItem[]> {
    const months: MonthlyTrendItem[] = [];
    const currentMonth = new Date().getMonth() + 1;
    for (let m = 1; m <= currentMonth; m++) {
      const ym = `${year}-${String(m).padStart(2, '0')}`;
      const summary = await RecordDAO.getMonthSummary(ym);
      months.push({ month: m, income: summary.totalIncome, expense: summary.totalExpense });
    }
    return months;
  }
};
