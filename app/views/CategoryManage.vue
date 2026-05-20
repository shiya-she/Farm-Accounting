<template>
  <Page class="page">
    <ActionBar title="分类管理" />
    <StackLayout class="content">
      <GridLayout columns="*, auto, auto" class="add-row">
        <TextField col="0" v-model="newName" class="input" hint="新分类名称" />
        <Button col="1" text="支出" :class="newType === 'expense' ? 'type-sel' : 'type-btn'" @tap="newType = 'expense'" />
        <Button col="2" text="收入" :class="newType === 'income' ? 'type-sel' : 'type-btn'" @tap="newType = 'income'" />
      </GridLayout>
      <Button text="添加" class="btn-add" @tap="addCategory" />
      <ListView :items="store.categories" class="list">
        <template #default="{ item }">
          <GridLayout columns="auto, *, auto" class="item-row">
            <Label col="0" :text="item.type === 'income' ? '收' : '支'"
              :class="item.type === 'income' ? 'tag-income' : 'tag-expense'" />
            <Label col="1" :text="item.name" class="item-name" />
            <Button v-if="!item.is_preset" col="2" text="删除" class="btn-del" @tap="del(item)" />
            <Label v-else col="2" text="预置" class="preset-tag" />
          </GridLayout>
        </template>
      </ListView>
    </StackLayout>
  </Page>
</template>
<script lang="ts">
import Vue from 'nativescript-vue';
import { useCategoriesStore } from '../store/categories';
import type { Category } from '../types';

export default Vue.extend({
  data(): { newName: string; newType: 'income' | 'expense' } {
    return { newName: '', newType: 'expense' };
  },
  computed: { store: () => useCategoriesStore() },
  async mounted(): Promise<void> { await this.store.loadCategories(); },
  methods: {
    async addCategory(): Promise<void> {
      if (!this.newName.trim()) return;
      await this.store.addCategory(this.newType, this.newName.trim());
      this.newName = '';
    },
    async del(c: Category): Promise<void> { await this.store.deleteCategory(c.id); }
  }
});
</script>
<style scoped>
.page { background-color: #f5f5f5; }
.content { padding: 12; }
.add-row { margin-bottom: 8; }
.input { border-width: 1; border-color: #ddd; border-radius: 8; padding: 10; background-color: white; }
.type-btn { background-color: #e0e0e0; color: #666; font-size: 12; margin-left: 4; padding: 8 12; border-radius: 4; }
.type-sel { background-color: #2e6b3e; color: white; font-size: 12; margin-left: 4; padding: 8 12; border-radius: 4; }
.btn-add { background-color: #2e6b3e; color: white; border-radius: 8; padding: 10; margin-bottom: 12; }
.item-row { padding: 12 8; background-color: white; border-bottom-width: 1; border-bottom-color: #eee; }
.tag-income { font-size: 11; color: #27ae60; font-weight: bold; margin-right: 8; }
.tag-expense { font-size: 11; color: #e74c3c; font-weight: bold; margin-right: 8; }
.item-name { font-size: 14; color: #333; }
.btn-del { background-color: #e74c3c; color: white; font-size: 12; padding: 4 12; border-radius: 4; }
.preset-tag { font-size: 11; color: #999; }
</style>
