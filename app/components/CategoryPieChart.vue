<template>
  <StackLayout class="chart-container">
    <Label text="分类支出分布" class="chart-title" />
    <StackLayout v-for="(item, idx) in data" :key="item.name" class="pie-row">
      <GridLayout columns="auto, *, auto">
        <StackLayout col="0" width="12" height="12" :backgroundColor="colors[idx % colors.length]" class="dot" />
        <Label col="1" :text="item.name" class="pie-label" />
        <Label col="2" :text="cnAmount(item.total)" class="pie-value" />
      </GridLayout>
    </StackLayout>
  </StackLayout>
</template>
<script lang="ts">
import Vue from 'nativescript-vue';
import { cnAmount } from '../utils/amount';
import type { CategoryStat } from '../types';
export default Vue.extend({
  props: {
    data: { type: Array as () => CategoryStat[], required: true }
  },
  data(): { colors: string[] } {
    return {
      colors: ['#e74c3c','#e67e22','#f1c40f','#2ecc71','#3498db','#9b59b6','#1abc9c','#34495e','#e91e63','#00bcd4']
    };
  },
  methods: { cnAmount }
});
</script>
<style scoped>
.chart-container { margin: var(--spacing-sm) var(--spacing-base); padding: var(--spacing-base); background-color: var(--color-surface); border-radius: var(--radius-lg); elevation: var(--elevation-sm); border-width: 1; border-color: var(--color-border); }
.chart-title { font-size: var(--text-base); font-weight: var(--font-semibold); color: var(--color-text); margin-bottom: var(--spacing-sm); }
.pie-row { margin: var(--spacing-xs) 0; }
.dot { border-radius: 6; margin-right: var(--spacing-sm); vertical-align: center; }
.pie-label { font-size: var(--text-sm); color: var(--color-text); }
.pie-value { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-expense); }
</style>
