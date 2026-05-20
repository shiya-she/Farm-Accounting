import { RecordDAO } from '../database/dao/RecordDAO';

export const StatsService = {
  async getMonthSummary(yearMonth) { return RecordDAO.getMonthSummary(yearMonth); },
  async getCategoryStats(type, yearMonth) { return RecordDAO.getCategoryStats(type, yearMonth); },
  async getWorkerSalaryStats(yearMonth) { return RecordDAO.getWorkerSalaryStats(yearMonth); },
  async getProductSalesStats(yearMonth) { return RecordDAO.getProductSalesStats(yearMonth); },

  async getMonthlyTrend(year) {
    const months = [];
    const currentMonth = new Date().getMonth() + 1;
    for (let m = 1; m <= currentMonth; m++) {
      const ym = `${year}-${String(m).padStart(2, '0')}`;
      const summary = await RecordDAO.getMonthSummary(ym);
      months.push({ month: m, income: summary.totalIncome, expense: summary.totalExpense });
    }
    return months;
  }
};
