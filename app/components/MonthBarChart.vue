<template>
  <StackLayout class="chart-container">
    <Label text="月度收支趋势" class="chart-title" />
    <StackLayout v-for="item in data" :key="item.month" class="bar-row">
      <GridLayout columns="40, *, *">
        <Label col="0" :text="item.month + '月'" class="bar-label" />
        <StackLayout col="1">
          <Label :text="cnAmount(item.income)" class="bar-value income" />
          <StackLayout class="bar-bg">
            <StackLayout :width="pct(item.income)" class="bar-fill income-bg" />
          </StackLayout>
        </StackLayout>
        <StackLayout col="2">
          <Label :text="cnAmount(item.expense)" class="bar-value expense" />
          <StackLayout class="bar-bg">
            <StackLayout :width="pct(item.expense)" class="bar-fill expense-bg" />
          </StackLayout>
        </StackLayout>
      </GridLayout>
    </StackLayout>
  </StackLayout>
</template>
<script lang="ts">
import Vue from 'nativescript-vue';
import { cnAmount } from '../utils/amount';
import type { MonthlyTrendItem } from '../types';
export default Vue.extend({
  props: {
    data: { type: Array as () => MonthlyTrendItem[], required: true }
  },
  methods: {
    cnAmount,
    pct(val: number): number {
      const max = Math.max(1, ...this.data.flatMap((d: MonthlyTrendItem) => [d.income, d.expense]));
      return Math.max(2, (val / max) * 100);
    }
  }
});
</script>
<style scoped>
.chart-container { margin: var(--spacing-sm) var(--spacing-base); padding: var(--spacing-base); background-color: var(--color-surface); border-radius: var(--radius-lg); elevation: var(--elevation-sm); border-width: 1; border-color: var(--color-border); }
.chart-title { font-size: var(--text-base); font-weight: var(--font-semibold); color: var(--color-text); margin-bottom: var(--spacing-sm); }
.bar-row { margin: var(--spacing-xs) 0; }
.bar-label { font-size: var(--text-xs); color: var(--color-text-secondary); vertical-align: center; }
.bar-value { font-size: 10; }
.bar-bg { background-color: var(--color-bg); height: 8; border-radius: var(--radius-sm); margin-top: 2; }
.bar-fill { height: 8; border-radius: var(--radius-sm); }
.income-bg { background-color: var(--color-income); }
.expense-bg { background-color: var(--color-expense); }
.income { color: var(--color-income); }
.expense { color: var(--color-expense); }
</style>
