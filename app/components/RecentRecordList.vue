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
<script lang="ts">
import Vue from 'nativescript-vue';
import RecordItem from './RecordItem.vue';
import type { RecordJoined } from '../types';
export default Vue.extend({
  components: { RecordItem },
  props: {
    records: { type: Array as () => RecordJoined[], required: true }
  }
});
</script>
<style scoped>
.section-title { font-size: 14; font-weight: bold; color: #333; margin: 8 12; }
.empty-text { text-align: center; color: #999; font-size: 14; margin: 20; }
</style>
