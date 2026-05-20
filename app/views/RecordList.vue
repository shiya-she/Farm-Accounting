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
<script>
import FilterBar from '../components/FilterBar';
import RecordItem from '../components/RecordItem';
import { useRecordsStore } from '../store/records';
export default {
  components: { FilterBar, RecordItem },
  data() { return { filters: {} }; },
  computed: { recordsStore: () => useRecordsStore() },
  async mounted() { await this.recordsStore.loadRecords(); },
  methods: {
    async onFilter(f) { this.filters = { ...f }; await this.recordsStore.loadRecords(this.filters); }
  }
};
</script>
<style scoped>
.page { background-color: #f5f5f5; }
.empty { text-align: center; color: #999; font-size: 14; margin: 40; }
</style>
