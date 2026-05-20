<template>
  <StackLayout>
    <Label text="工人" class="field-label" />
    <ListPicker :items="workerNames" :selectedIndex="selectedIndex"
      @selectedIndexChange="onSelect" />
  </StackLayout>
</template>
<script lang="ts">
import Vue from 'nativescript-vue';
import type { Worker } from '../types';
export default Vue.extend({
  props: {
    workers: { type: Array as () => Worker[], required: true },
    selectedId: { type: Number as () => number | null, default: null }
  },
  computed: {
    workerNames(): string[] { return this.workers.map((w: Worker) => w.name); },
    selectedIndex(): number {
      const idx = this.workers.findIndex((w: Worker) => w.id === this.selectedId);
      return idx >= 0 ? idx : 0;
    }
  },
  methods: {
    onSelect(e: { value: number }): void {
      const w = this.workers[e.value];
      if (w) this.$emit('select', w);
    }
  }
});
</script>
<style scoped>
.field-label { font-size: 14; color: #555; margin: 8 0 4; }
</style>
