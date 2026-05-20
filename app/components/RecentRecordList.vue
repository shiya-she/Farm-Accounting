<template>
  <StackLayout>
    <Label text="最近记录" class="section-title" />
    <ListView :items="records">
      <template #default="{ item }">
        <RecordItem :record="item" @tap="$emit('recordTap', item)" />
      </template>
    </ListView>
    <Label v-if="!records.length" text="暂无记录" class="empty-text" />
  </StackLayout>
</template>
<script>
import RecordItem from './RecordItem';
export default {
  components: { RecordItem },
  props: { records: Array }
};
</script>
<style scoped>
.section-title { font-size: 14; font-weight: bold; color: #333; margin: 8 12; }
.empty-text { text-align: center; color: #999; font-size: 14; margin: 20; }
</style>
