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
<script>
import { cnAmount } from '../utils/amount';
export default {
  props: { summary: Object, title: { type: String, default: '本月概览' } },
  methods: { cnAmount }
};
</script>
<style scoped>
.summary-card { background-color: #fff; border-radius: 12; margin: 12; padding: 16; }
.card-title { font-size: 16; font-weight: bold; color: #333; margin-bottom: 12; }
.summary-row { text-align: center; }
.summary-label { font-size: 12; color: #999; }
.summary-value { font-size: 20; font-weight: bold; margin-top: 4; }
.income { color: #27ae60; }
.expense { color: #e74c3c; }
</style>
