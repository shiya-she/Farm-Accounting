<template>
  <StackLayout class="summary-card">
    <Label :text="title" class="card-title" />
    <GridLayout columns="*, *, *" class="summary-row">
      <StackLayout col="0" class="summary-item">
        <Label text="收入" class="summary-label" />
        <Label :text="cnAmount(summary.totalIncome)" class="summary-value income" />
      </StackLayout>
      <StackLayout col="1" class="summary-item">
        <Label text="支出" class="summary-label" />
        <Label :text="cnAmount(summary.totalExpense)" class="summary-value expense" />
      </StackLayout>
      <StackLayout col="2" class="summary-item">
        <Label text="结余" class="summary-label" />
        <Label :text="cnAmount(summary.totalIncome - summary.totalExpense)"
          :class="summary.totalIncome >= summary.totalExpense ? 'summary-value income' : 'summary-value expense'" />
      </StackLayout>
    </GridLayout>
  </StackLayout>
</template>
<script lang="ts">
import Vue from 'nativescript-vue';
import { cnAmount } from '../utils/amount';
import type { MonthSummary } from '../types';
export default Vue.extend({
  props: {
    summary: { type: Object as () => MonthSummary, required: true },
    title: { type: String, default: '本月概览' as string }
  },
  methods: { cnAmount }
});
</script>
<style scoped>
.summary-card { background-color: var(--color-surface); border-radius: var(--radius-xl); margin: var(--spacing-base); padding: var(--spacing-lg); elevation: var(--elevation-md); border-width: 1; border-color: var(--color-border); }
.card-title { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--color-text); margin-bottom: var(--spacing-md); }
.summary-row { text-align: center; }
.summary-label { font-size: var(--text-xs); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.5; }
.summary-value { font-size: var(--text-xl); font-weight: var(--font-bold); margin-top: var(--spacing-xs); }
.income { color: var(--color-income); }
.expense { color: var(--color-expense); }
</style>
