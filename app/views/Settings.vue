<template>
  <Page class="page">
    <ActionBar title="设置" />
    <ScrollView>
      <StackLayout class="content">
        <Button text="分类管理" class="menu-btn" @tap="$navigateTo(CategoryManage)" />
        <Button text="工人管理" class="menu-btn" @tap="$navigateTo(WorkerManage)" />
        <Button text="产出物管理" class="menu-btn" @tap="$navigateTo(ProductManage)" />
        <Button text="备份与恢复" class="menu-btn" @tap="$navigateTo(BackupRestore)" />
        <Label style="margin-top: var(--spacing-2xl);" />
        <Label text="农场记账 v1.0" class="about" />
        <Label text="离线记账，数据安全" class="about-sub" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>
<script lang="ts">
import Vue from 'nativescript-vue';
import CategoryManage from './CategoryManage.vue';
import WorkerManage from './WorkerManage.vue';
import ProductManage from './ProductManage.vue';
import BackupRestore from './BackupRestore.vue';
export default Vue.extend({
  components: { CategoryManage, WorkerManage, ProductManage, BackupRestore }
});
</script>
<style scoped>
.page { background-color: var(--color-bg); }
.content { padding: var(--spacing-base); }
.menu-btn { background-color: var(--color-surface); color: var(--color-text); font-size: var(--text-base); font-weight: var(--font-medium); text-align: left; padding: var(--spacing-base); margin: var(--spacing-xs) 0; border-radius: var(--radius-md); elevation: var(--elevation-sm); border-width: 1; border-color: var(--color-border); }
.about { font-size: var(--text-sm); color: var(--color-text-secondary); text-align: center; margin-top: var(--spacing-2xl); }
.about-sub { font-size: var(--text-xs); color: var(--color-text-muted); text-align: center; margin-top: var(--spacing-xs); }
</style>
