<template>
  <GridLayout columns="auto, *, auto" class="record-item" @tap="$emit('tap', record)">
    <Label col="0" :text="record.type === 'income' ? '+' : '-'"
      :class="record.type === 'income' ? 'income-icon' : 'expense-icon'" />
    <StackLayout col="1">
      <Label :text="record.category_name" class="item-category" />
      <Label :text="record.note || record.date" class="item-note" textWrap="true" />
    </StackLayout>
    <Label col="2" :text="Number(record.amount).toFixed(2)"
      :class="record.type === 'income' ? 'income-amount' : 'expense-amount'" />
  </GridLayout>
</template>
<script>
export default { props: { record: Object } };
</script>
<style scoped>
.record-item { padding: 12 8; border-bottom-width: 1; border-bottom-color: #eee; }
.income-icon { font-size: 18; color: #27ae60; font-weight: bold; margin-right: 12; }
.expense-icon { font-size: 18; color: #e74c3c; font-weight: bold; margin-right: 12; }
.item-category { font-size: 15; color: #333; }
.item-note { font-size: 12; color: #999; }
.income-amount { font-size: 16; color: #27ae60; font-weight: bold; }
.expense-amount { font-size: 16; color: #e74c3c; font-weight: bold; }
</style>
