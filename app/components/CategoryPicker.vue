<template>
  <ScrollView orientation="horizontal" height="60">
    <StackLayout orientation="horizontal" class="cat-list">
      <Button v-for="cat in categories" :key="cat.id" :text="cat.name"
        :class="selectedId === cat.id ? 'cat-selected' : 'cat-item'"
        @tap="$emit('select', cat)" />
    </StackLayout>
  </ScrollView>
</template>
<script>
export default {
  props: { categories: Array, selectedId: Number }
};
</script>
<style scoped>
.cat-list { padding: 4; }
.cat-item { background-color: #f0f0f0; margin: 4; border-radius: 20; padding: 8 16; font-size: 13; }
.cat-selected { background-color: #2e6b3e; color: white; margin: 4; border-radius: 20; padding: 8 16; font-size: 13; }
</style>
