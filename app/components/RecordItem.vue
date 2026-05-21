<template>
  <GridLayout columns="auto, *, auto" class="record-item" @tap="$emit('tap', record)">
    <Label col="0" :text="record.type === 'income' ? '+' : '-'"
      :class="record.type === 'income' ? 'income-icon' : 'expense-icon'" />
    <StackLayout col="1">
      <Label :text="record.category_name" class="item-category" />
      <Label :text="record.note || record.date" class="item-note" textWrap="true" />
    </StackLayout>
    <Label col="2" :text="Number(record.amount).toFixed(2)"
      :class="record.type === 'income' ? 'income-amount' : 'expense-amount'" />
  </GridLayout>
</template>
<script lang="ts">
import Vue from 'nativescript-vue';
import type { RecordJoined } from '../types';
export default Vue.extend({
  props: {
    record: { type: Object as () => RecordJoined, required: true }
  }
});
</script>
<style scoped>
.record-item { padding: var(--spacing-md) var(--spacing-base); background-color: var(--color-surface); border-bottom-width: 1; border-bottom-color: var(--color-divider); }
.income-icon { font-size: var(--text-xl); color: var(--color-income); font-weight: var(--font-bold); margin-right: var(--spacing-md); width: 32; text-align: center; }
.expense-icon { font-size: var(--text-xl); color: var(--color-expense); font-weight: var(--font-bold); margin-right: var(--spacing-md); width: 32; text-align: center; }
.item-category { font-size: var(--text-base); color: var(--color-text); font-weight: var(--font-medium); }
.item-note { font-size: var(--text-sm); color: var(--color-text-muted); }
.income-amount { font-size: var(--text-lg); color: var(--color-income); font-weight: var(--font-bold); }
.expense-amount { font-size: var(--text-lg); color: var(--color-expense); font-weight: var(--font-bold); }
</style>
