<template>
  <StackLayout>
    <Label text="产出物" class="field-label" />
    <ListPicker :items="productNames" :selectedIndex="selectedIndex"
      @selectedIndexChange="onSelect" />
  </StackLayout>
</template>
<script lang="ts">
import Vue from 'nativescript-vue';
import type { Product } from '../types';
export default Vue.extend({
  props: {
    products: { type: Array as () => Product[], required: true },
    selectedId: { type: Number as () => number | null, default: null }
  },
  computed: {
    productNames(): string[] { return this.products.map((p: Product) => p.name); },
    selectedIndex(): number {
      const idx = this.products.findIndex((p: Product) => p.id === this.selectedId);
      return idx >= 0 ? idx : 0;
    }
  },
  methods: {
    onSelect(e: { value: number }): void {
      const p = this.products[e.value];
      if (p) this.$emit('select', p);
    }
  }
});
</script>
<style scoped>
.field-label { font-size: 14; color: #555; margin: 8 0 4; }
</style>
