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
.chart-container { margin: 12; padding: 12; background-color: #fff; border-radius: 12; }
.chart-title { font-size: 14; font-weight: bold; color: #333; margin-bottom: 8; }
.bar-row { margin: 4 0; }
.bar-label { font-size: 11; color: #666; vertical-align: center; }
.bar-value { font-size: 10; }
.bar-bg { background-color: #eee; height: 8; border-radius: 4; margin-top: 2; }
.bar-fill { height: 8; border-radius: 4; }
.income-bg { background-color: #27ae60; }
.expense-bg { background-color: #e74c3c; }
.income { color: #27ae60; }
.expense { color: #e74c3c; }
</style>
