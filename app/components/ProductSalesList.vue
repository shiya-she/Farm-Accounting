<template>
  <StackLayout class="chart-container">
    <Label text="产出物销售排行" class="chart-title" />
    <GridLayout v-for="item in data" :key="item.name" columns="*, auto, auto" class="stat-row">
      <Label col="0" :text="item.name" class="stat-label" />
      <Label col="1" :text="item.totalWeight ? item.totalWeight + (item.unit || '') : ''" class="stat-sub" />
      <Label col="2" :text="cnAmount(item.totalAmount)" class="stat-value" />
    </GridLayout>
    <Label v-if="!data.length" text="暂无数据" class="empty" />
  </StackLayout>
</template>
<script>
import { cnAmount } from '../utils/amount';
export default { props: { data: Array }, methods: { cnAmount } };
</script>
<style scoped>
.chart-container { margin: 12; padding: 12; background-color: #fff; border-radius: 12; }
.chart-title { font-size: 14; font-weight: bold; color: #333; margin-bottom: 8; }
.stat-row { padding: 6 0; border-bottom-width: 1; border-bottom-color: #f0f0f0; }
.stat-label { font-size: 14; color: #333; }
.stat-sub { font-size: 12; color: #999; margin-right: 8; }
.stat-value { font-size: 14; font-weight: bold; color: #27ae60; }
.empty { text-align: center; color: #999; font-size: 13; margin: 12; }
</style>
