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
.filter-bar { padding: 8; background-color: #fafafa; }
.filter-btn { background-color: #e0e0e0; color: #666; font-size: 12; margin: 2; }
.filter-active { background-color: #2e6b3e; color: white; font-size: 12; margin: 2; }
</style>
