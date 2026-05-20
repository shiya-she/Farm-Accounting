<template>
  <GridLayout columns="*, *" class="type-switch">
    <Button text="支出" :class="type === 'expense' ? 'btn-active' : 'btn-inactive'"
      col="0" @tap="$emit('change', 'expense')" />
    <Button text="收入" :class="type === 'income' ? 'btn-active' : 'btn-inactive'"
      col="1" @tap="$emit('change', 'income')" />
  </GridLayout>
</template>
<script>
export default {
  props: { type: { type: String, default: 'expense' } }
};
</script>
<style scoped>
.type-switch { margin: 8 0; }
.btn-active { background-color: #2e6b3e; color: white; font-weight: bold; }
.btn-inactive { background-color: #e0e0e0; color: #666; }
</style>
