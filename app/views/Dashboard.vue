<template>
  <Page class="page">
    <ActionBar title="农场记账" />
    <ScrollView>
      <StackLayout>
        <MonthSummaryCard :summary="recordsStore.monthSummary" :title="monthTitle" />
        <RecentRecordList :records="recentRecords" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>
<script lang="ts">
import Vue from 'nativescript-vue';
import MonthSummaryCard from '../components/MonthSummaryCard.vue';
import RecentRecordList from '../components/RecentRecordList.vue';
import { useRecordsStore } from '../store/records';
import { monthKey, today } from '../utils/date';
import type { RecordJoined } from '../types';

export default Vue.extend({
  components: { MonthSummaryCard, RecentRecordList },
  data(): { recentRecords: RecordJoined[] } { return { recentRecords: [] }; },
  computed: {
    recordsStore: () => useRecordsStore(),
    monthTitle(): string {
      const [y, m] = today().split('-');
      return `${y}年${parseInt(m)}月概览`;
    }
  },
  async mounted(): Promise<void> {
    const ym = monthKey(today());
    await this.recordsStore.loadMonthSummary(ym);
    await this.recordsStore.loadRecords({ month: ym });
    this.recentRecords = this.recordsStore.records.slice(0, 5);
  }
});
</script>
<style scoped>
.page { background-color: #f5f5f5; }
</style>
