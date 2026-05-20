<template>
  <Page class="page">
    <ActionBar title="账单" />
    <StackLayout>
      <FilterBar :activeType="filters.type" @filterChange="onFilter" />
      <ListView :items="recordsStore.records">
        <template #default="{ item }">
          <RecordItem :record="item" />
        </template>
      </ListView>
      <Label v-if="!recordsStore.records.length" text="暂无记录" class="empty" />
    </StackLayout>
  </Page>
</template>
<script lang="ts">
import Vue from 'nativescript-vue';
import FilterBar from '../components/FilterBar.vue';
import RecordItem from '../components/RecordItem.vue';
import { useRecordsStore } from '../store/records';
import type { RecordFilters } from '../types';

export default Vue.extend({
  components: { FilterBar, RecordItem },
  data(): { filters: RecordFilters } { return { filters: {} }; },
  computed: { recordsStore: () => useRecordsStore() },
  async mounted(): Promise<void> { await this.recordsStore.loadRecords(); },
  methods: {
    async onFilter(f: RecordFilters): Promise<void> {
      this.filters = { ...f };
      await this.recordsStore.loadRecords(this.filters);
    }
  }
});
</script>
<style scoped>
.page { background-color: #f5f5f5; }
.empty { text-align: center; color: #999; font-size: 14; margin: 40; }
</style>
