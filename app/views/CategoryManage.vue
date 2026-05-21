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
.page { background-color: var(--color-bg); }
.content { padding: var(--spacing-base); }
.add-row { margin-bottom: var(--spacing-sm); }
.input { border-width: 1; border-color: var(--color-border); border-radius: var(--radius-md); padding: var(--spacing-sm) var(--spacing-md); background-color: var(--color-surface); color: var(--color-text); font-size: var(--text-base); }
.type-btn { background-color: var(--color-bg); color: var(--color-text-secondary); font-size: var(--text-sm); margin-left: var(--spacing-xs); padding: var(--spacing-sm) var(--spacing-md); border-radius: var(--radius-sm); font-weight: var(--font-medium); }
.type-sel { background-color: var(--color-primary); color: var(--color-text-inverse); font-size: var(--text-sm); margin-left: var(--spacing-xs); padding: var(--spacing-sm) var(--spacing-md); border-radius: var(--radius-sm); font-weight: var(--font-semibold); }
.btn-add { background-color: var(--color-primary); color: var(--color-text-inverse); border-radius: var(--radius-md); padding: var(--spacing-sm) var(--spacing-md); margin-bottom: var(--spacing-md); font-weight: var(--font-semibold); }
.item-row { padding: var(--spacing-md) var(--spacing-sm); background-color: var(--color-surface); border-bottom-width: 1; border-bottom-color: var(--color-divider); }
.tag-income { font-size: var(--text-xs); color: var(--color-income); font-weight: var(--font-bold); margin-right: var(--spacing-sm); background-color: var(--color-income-bg); border-radius: var(--radius-sm); padding: 2 6; }
.tag-expense { font-size: var(--text-xs); color: var(--color-expense); font-weight: var(--font-bold); margin-right: var(--spacing-sm); background-color: var(--color-expense-bg); border-radius: var(--radius-sm); padding: 2 6; }
.item-name { font-size: var(--text-base); color: var(--color-text); }
.btn-del { background-color: var(--color-expense); color: var(--color-text-inverse); font-size: var(--text-sm); padding: var(--spacing-xs) var(--spacing-md); border-radius: var(--radius-sm); font-weight: var(--font-medium); }
.preset-tag { font-size: var(--text-xs); color: var(--color-text-muted); }
</style>
