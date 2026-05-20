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
<script>
import MonthSummaryCard from '../components/MonthSummaryCard';
import RecentRecordList from '../components/RecentRecordList';
import { useRecordsStore } from '../store/records';
import { monthKey, today } from '../utils/date';

export default {
  components: { MonthSummaryCard, RecentRecordList },
  data() { return { recentRecords: [] }; },
  computed: {
    recordsStore: () => useRecordsStore(),
    monthTitle() {
      const [y, m] = today().split('-');
      return `${y}年${parseInt(m)}月概览`;
    }
  },
  async mounted() {
    const ym = monthKey(today());
    await this.recordsStore.loadMonthSummary(ym);
    const all = await this.recordsStore.loadRecords({ month: ym });
    this.recentRecords = this.recordsStore.records.slice(0, 5);
  }
};
</script>
<style scoped>
.page { background-color: #f5f5f5; }
</style>
