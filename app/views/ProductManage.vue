<template>
  <Page class="page">
    <ActionBar title="产出物管理" />
    <StackLayout class="content">
      <GridLayout columns="*, *, auto" class="add-row">
        <TextField col="0" v-model="newName" class="input" hint="名称" />
        <TextField col="1" v-model="newUnit" class="input" hint="单位(斤/公斤)" />
        <Button col="2" text="添加" class="btn-add" @tap="add" />
      </GridLayout>
      <ListView :items="store.products">
        <template #default="{ item }">
          <GridLayout columns="*, auto" class="item-row">
            <StackLayout col="0">
              <Label :text="item.name" class="item-name" />
              <Label :text="item.unit || ''" class="item-sub" />
            </StackLayout>
            <Button col="1" text="删除" class="btn-del" @tap="del(item)" />
          </GridLayout>
        </template>
      </ListView>
    </StackLayout>
  </Page>
</template>
<script lang="ts">
import Vue from 'nativescript-vue';
import { useProductsStore } from '../store/products';
import type { Product } from '../types';

export default Vue.extend({
  data(): { newName: string; newUnit: string } { return { newName: '', newUnit: '' }; },
  computed: { store: () => useProductsStore() },
  async mounted(): Promise<void> { await this.store.loadProducts(); },
  methods: {
    async add(): Promise<void> {
      if (!this.newName.trim()) return;
      await this.store.addProduct(this.newName.trim(), this.newUnit.trim());
      this.newName = ''; this.newUnit = '';
    },
    async del(p: Product): Promise<void> { await this.store.deleteProduct(p.id); }
  }
});
</script>
<style scoped>
.page { background-color: var(--color-bg); }
.content { padding: var(--spacing-base); }
.add-row { margin-bottom: var(--spacing-md); }
.input { border-width: 1; border-color: var(--color-border); border-radius: var(--radius-md); padding: var(--spacing-sm) var(--spacing-md); background-color: var(--color-surface); margin: 2; color: var(--color-text); font-size: var(--text-base); }
.btn-add { background-color: var(--color-primary); color: var(--color-text-inverse); border-radius: var(--radius-md); margin-left: var(--spacing-xs); padding: var(--spacing-sm) var(--spacing-md); font-weight: var(--font-semibold); }
.item-row { padding: var(--spacing-md) var(--spacing-sm); background-color: var(--color-surface); border-bottom-width: 1; border-bottom-color: var(--color-divider); }
.item-name { font-size: var(--text-base); color: var(--color-text); font-weight: var(--font-medium); }
.item-sub { font-size: var(--text-sm); color: var(--color-text-muted); }
.btn-del { background-color: var(--color-expense); color: var(--color-text-inverse); font-size: var(--text-sm); padding: var(--spacing-xs) var(--spacing-md); border-radius: var(--radius-sm); font-weight: var(--font-medium); }
</style>
