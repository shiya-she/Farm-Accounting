<template>
  <Page class="page">
    <ActionBar title="统计" />
    <ScrollView>
      <StackLayout>
        <MonthSummaryCard :summary="summary" title="年度统计" />
        <GridLayout columns="*, *, *" class="year-nav">
          <Button text="◀" col="0" class="nav-btn" @tap="prevYear" />
          <Label :text="currentYear + '年'" col="1" class="year-label" textAlignment="center" />
          <Button text="▶" col="2" class="nav-btn" @tap="nextYear" />
        </GridLayout>
        <MonthBarChart :data="monthlyTrend" />
        <CategoryPieChart :data="categoryStats" />
        <WorkerSalaryList :data="workerStats" />
        <ProductSalesList :data="productStats" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>
<script lang="ts">
import Vue from 'nativescript-vue';
import MonthSummaryCard from '../components/MonthSummaryCard.vue';
import MonthBarChart from '../components/MonthBarChart.vue';
import CategoryPieChart from '../components/CategoryPieChart.vue';
import WorkerSalaryList from '../components/WorkerSalaryList.vue';
import ProductSalesList from '../components/ProductSalesList.vue';
import { StatsService } from '../services/StatsService';
import type { MonthSummary, MonthlyTrendItem, CategoryStat, WorkerSalaryStat, ProductSalesStat } from '../types';

interface StatsData {
  currentYear: number;
  summary: MonthSummary;
  monthlyTrend: MonthlyTrendItem[];
  categoryStats: CategoryStat[];
  workerStats: WorkerSalaryStat[];
  productStats: ProductSalesStat[];
}

export default Vue.extend({
  components: { MonthSummaryCard, MonthBarChart, CategoryPieChart, WorkerSalaryList, ProductSalesList },
  data(): StatsData {
    return {
      currentYear: new Date().getFullYear(),
      summary: { totalIncome: 0, totalExpense: 0 },
      monthlyTrend: [], categoryStats: [], workerStats: [], productStats: []
    };
  },
  async mounted(): Promise<void> { await this.loadStats(); },
  methods: {
    async loadStats(): Promise<void> {
      let yearIncome = 0, yearExpense = 0;
      const trend: MonthlyTrendItem[] = [];
      const currentMonth = new Date().getMonth() + 1;
      for (let m = 1; m <= currentMonth; m++) {
        const ym = `${this.currentYear}-${String(m).padStart(2, '0')}`;
        const s = await StatsService.getMonthSummary(ym);
        trend.push({ month: m, income: s.totalIncome, expense: s.totalExpense });
        yearIncome += s.totalIncome;
        yearExpense += s.totalExpense;
      }
      this.summary = { totalIncome: yearIncome, totalExpense: yearExpense };
      this.monthlyTrend = trend;
      const cm = `${this.currentYear}-${String(currentMonth).padStart(2, '0')}`;
      this.categoryStats = await StatsService.getCategoryStats('expense', cm);
      this.workerStats = await StatsService.getWorkerSalaryStats(cm);
      this.productStats = await StatsService.getProductSalesStats(cm);
    },
    prevYear(): void { this.currentYear--; this.loadStats(); },
    nextYear(): void { this.currentYear++; this.loadStats(); }
  }
});
</script>
<style scoped>
.page { background-color: var(--color-bg); }
.year-nav { margin: var(--spacing-sm) var(--spacing-base); background-color: var(--color-surface); border-radius: var(--radius-md); padding: var(--spacing-sm); border-width: 1; border-color: var(--color-border); }
.nav-btn { background-color: transparent; color: var(--color-primary); font-size: var(--text-lg); font-weight: var(--font-bold); }
.year-label { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--color-text); vertical-align: center; }
</style>
