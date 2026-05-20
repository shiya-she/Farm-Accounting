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
<script>
import Dashboard from '../views/Dashboard';
import AddRecord from '../views/AddRecord';
import RecordList from '../views/RecordList';
import Statistics from '../views/Statistics';
import Settings from '../views/Settings';
export default {
  components: { Dashboard, AddRecord, RecordList, Statistics, Settings },
  data() { return { tab: 0 }; }
};
</script>
