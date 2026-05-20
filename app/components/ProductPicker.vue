<template>
  <StackLayout>
    <Label text="产出物" class="field-label" />
    <ListPicker :items="productNames" :selectedIndex="selectedIndex"
      @selectedIndexChange="onSelect" />
  </StackLayout>
</template>
<script>
export default {
  props: { products: Array, selectedId: Number },
  computed: {
    productNames() { return this.products.map(p => p.name); },
    selectedIndex() {
      const idx = this.products.findIndex(p => p.id === this.selectedId);
      return idx >= 0 ? idx : 0;
    }
  },
  methods: {
    onSelect(e) {
      const p = this.products[e.value];
      if (p) this.$emit('select', p);
    }
  }
};
</script>
<style scoped>
.field-label { font-size: 14; color: #555; margin: 8 0 4; }
</style>
