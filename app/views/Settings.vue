<template>
  <Page class="page">
    <ActionBar title="设置" />
    <ScrollView>
      <StackLayout class="content">
        <Button text="分类管理" class="menu-btn" @tap="$navigateTo(CategoryManage)" />
        <Button text="工人管理" class="menu-btn" @tap="$navigateTo(WorkerManage)" />
        <Button text="产出物管理" class="menu-btn" @tap="$navigateTo(ProductManage)" />
        <Button text="备份与恢复" class="menu-btn" @tap="$navigateTo(BackupRestore)" />
        <Label style="margin-top: 40;" />
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
.page { background-color: #f5f5f5; }
.content { padding: 16; }
.menu-btn { background-color: white; color: #333; font-size: 15; text-align: left; padding: 14 16; margin: 4 0; border-radius: 8; }
.about { font-size: 14; color: #333; text-align: center; }
.about-sub { font-size: 12; color: #999; text-align: center; margin-top: 4; }
</style>
