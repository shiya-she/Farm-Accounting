<template>
  <ScrollView orientation="horizontal" height="60">
    <StackLayout orientation="horizontal" class="cat-list">
      <Button v-for="cat in categories" :key="cat.id" :text="cat.name"
        :class="selectedId === cat.id ? 'cat-selected' : 'cat-item'"
        @tap="$emit('select', cat)" />
    </StackLayout>
  </ScrollView>
</template>
<script lang="ts">
import Vue from 'nativescript-vue';
import type { Category } from '../types';
export default Vue.extend({
  props: {
    categories: { type: Array as () => Category[], required: true },
    selectedId: { type: Number as () => number | null, default: null }
  }
});
</script>
<style scoped>
.cat-list { padding: var(--spacing-xs); }
.cat-item { background-color: var(--color-bg); margin: var(--spacing-xs); border-radius: var(--radius-full); padding: var(--spacing-sm) var(--spacing-base); font-size: var(--text-sm); color: var(--color-text-secondary); font-weight: var(--font-medium); }
.cat-selected { background-color: var(--color-primary); color: var(--color-text-inverse); margin: var(--spacing-xs); border-radius: var(--radius-full); padding: var(--spacing-sm) var(--spacing-base); font-size: var(--text-sm); font-weight: var(--font-semibold); }
</style>
