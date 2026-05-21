<template>
  <GridLayout columns="*, *" class="type-switch">
    <Button text="支出" :class="type === 'expense' ? 'btn-active' : 'btn-inactive'"
      col="0" @tap="$emit('change', 'expense')" />
    <Button text="收入" :class="type === 'income' ? 'btn-active' : 'btn-inactive'"
      col="1" @tap="$emit('change', 'income')" />
  </GridLayout>
</template>
<script lang="ts">
import Vue from 'nativescript-vue';
export default Vue.extend({
  props: {
    type: { type: String, default: 'expense' as string }
  }
});
</script>
<style scoped>
.type-switch { margin: var(--spacing-sm) 0; background-color: var(--color-bg); border-radius: var(--radius-md); padding: 4; }
.btn-active { background-color: var(--color-primary); color: var(--color-text-inverse); font-weight: var(--font-bold); border-radius: var(--radius-sm); }
.btn-inactive { background-color: transparent; color: var(--color-text-secondary); font-weight: var(--font-medium); }
</style>
