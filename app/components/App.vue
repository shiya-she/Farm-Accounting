<template>
  <TabView :selectedIndex="tab" @selectedIndexChange="tab = $event.value"
    androidTabsPosition="bottom">
    <TabViewItem title="首页"><Frame><Dashboard /></Frame></TabViewItem>
    <TabViewItem title="记账"><Frame><AddRecord /></Frame></TabViewItem>
    <TabViewItem title="账单"><Frame><RecordList /></Frame></TabViewItem>
    <TabViewItem title="统计"><Frame><Statistics /></Frame></TabViewItem>
    <TabViewItem title="设置"><Frame><Settings /></Frame></TabViewItem>
  </TabView>
</template>
<script lang="ts">
import Vue from 'nativescript-vue';
import Dashboard from '../views/Dashboard.vue';
import AddRecord from '../views/AddRecord.vue';
import RecordList from '../views/RecordList.vue';
import Statistics from '../views/Statistics.vue';
import Settings from '../views/Settings.vue';
export default Vue.extend({
  components: { Dashboard, AddRecord, RecordList, Statistics, Settings },
  data(): { tab: number } { return { tab: 0 }; }
});
</script>
