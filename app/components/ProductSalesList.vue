<template>
  <StackLayout class="chart-container">
    <Label text="产出物销售排行" class="chart-title" />
    <GridLayout v-for="item in data" :key="item.name" columns="*, auto, auto" class="stat-row">
      <Label col="0" :text="item.name" class="stat-label" />
      <Label col="1" :text="item.totalWeight ? item.totalWeight + (item.unit || '') : ''" class="stat-sub" />
      <Label col="2" :text="cnAmount(item.totalAmount)" class="stat-value" />
    </GridLayout>
    <Label v-if="!data.length" text="暂无数据" class="empty" />
  </StackLayout>
</template>
<script lang="ts">
import Vue from 'nativescript-vue';
import { cnAmount } from '../utils/amount';
import type { ProductSalesStat } from '../types';
export default Vue.extend({
  props: {
    data: { type: Array as () => ProductSalesStat[], required: true }
  },
  methods: { cnAmount }
});
</script>
<style scoped>
.chart-container { margin: var(--spacing-sm) var(--spacing-base); padding: var(--spacing-base); background-color: var(--color-surface); border-radius: var(--radius-lg); elevation: var(--elevation-sm); border-width: 1; border-color: var(--color-border); }
.chart-title { font-size: var(--text-base); font-weight: var(--font-semibold); color: var(--color-text); margin-bottom: var(--spacing-sm); }
.stat-row { padding: var(--spacing-sm) 0; border-bottom-width: 1; border-bottom-color: var(--color-divider); }
.stat-label { font-size: var(--text-base); color: var(--color-text); }
.stat-sub { font-size: var(--text-sm); color: var(--color-text-muted); margin-right: var(--spacing-sm); }
.stat-value { font-size: var(--text-base); font-weight: var(--font-semibold); color: var(--color-income); }
.empty { text-align: center; color: var(--color-text-muted); font-size: var(--text-sm); margin: var(--spacing-md); }
</style>
