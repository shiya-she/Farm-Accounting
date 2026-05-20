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
.page { background-color: #f5f5f5; }
.content { padding: 12; }
.add-row { margin-bottom: 12; }
.input { border-width: 1; border-color: #ddd; border-radius: 8; padding: 10; background-color: white; margin: 2; }
.btn-add { background-color: #2e6b3e; color: white; border-radius: 8; margin-left: 4; padding: 10 12; }
.item-row { padding: 12 8; background-color: white; border-bottom-width: 1; border-bottom-color: #eee; }
.item-name { font-size: 14; color: #333; }
.item-sub { font-size: 12; color: #999; }
.btn-del { background-color: #e74c3c; color: white; font-size: 12; padding: 4 12; border-radius: 4; }
</style>
