<template>
  <StackLayout>
    <Label text="工人" class="field-label" />
    <ListPicker :items="workerNames" :selectedIndex="selectedIndex"
      @selectedIndexChange="onSelect" />
  </StackLayout>
</template>
<script>
export default {
  props: { workers: Array, selectedId: Number },
  computed: {
    workerNames() { return this.workers.map(w => w.name); },
    selectedIndex() {
      const idx = this.workers.findIndex(w => w.id === this.selectedId);
      return idx >= 0 ? idx : 0;
    }
  },
  methods: {
    onSelect(e) {
      const w = this.workers[e.value];
      if (w) this.$emit('select', w);
    }
  }
};
</script>
<style scoped>
.field-label { font-size: 14; color: #555; margin: 8 0 4; }
</style>
