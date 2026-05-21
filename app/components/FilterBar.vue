<template>
  <GridLayout columns="auto, *, auto" class="filter-bar">
    <Button text="全部" :class="!activeType ? 'filter-active' : 'filter-btn'" col="0" @tap="$emit('filterChange', { type: null })" />
    <Button text="支出" :class="activeType === 'expense' ? 'filter-active' : 'filter-btn'" col="1" @tap="$emit('filterChange', { type: 'expense' })" />
    <Button text="收入" :class="activeType === 'income' ? 'filter-active' : 'filter-btn'" col="2" @tap="$emit('filterChange', { type: 'income' })" />
  </GridLayout>
</template>
<script lang="ts">
import Vue from 'nativescript-vue';
export default Vue.extend({
  props: {
    activeType: { type: String as () => string | null, default: null }
  }
});
</script>
<style scoped>
.filter-bar { padding: var(--spacing-sm); background-color: var(--color-surface); border-bottom-width: 1; border-bottom-color: var(--color-border); }
.filter-btn { background-color: var(--color-bg); color: var(--color-text-secondary); font-size: var(--text-sm); margin: 2; border-radius: var(--radius-sm); font-weight: var(--font-medium); }
.filter-active { background-color: var(--color-primary); color: var(--color-text-inverse); font-size: var(--text-sm); margin: 2; border-radius: var(--radius-sm); font-weight: var(--font-semibold); }
</style>
