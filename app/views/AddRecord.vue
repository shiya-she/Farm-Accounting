<template>
  <Page class="page">
    <ActionBar title="记账" />
    <ScrollView>
      <StackLayout class="form">
        <TypeSwitch :type="form.type" @change="form.type = $event" />

        <Label text="分类" class="field-label" />
        <CategoryPicker :categories="currentCats" :selectedId="form.category_id" @select="form.category_id = $event.id" />

        <Label text="金额 (元)" class="field-label" />
        <TextField v-model="amountText" keyboardType="decimal" class="input" hint="输入金额" />

        <Label text="日期" class="field-label" />
        <DatePicker v-model="form.date" />

        <StackLayout v-if="showWorker">
          <WorkerPicker :workers="workersStore.workers" :selectedId="form.worker_id" @select="form.worker_id = $event.id" />
        </StackLayout>

        <StackLayout v-if="showProduct">
          <ProductPicker :products="productsStore.products" :selectedId="form.product_id" @select="onProductSelect" />
          <Label text="重量" class="field-label" />
          <GridLayout columns="*, auto">
            <TextField col="0" v-model="weightText" keyboardType="decimal" class="input" hint="重量（可选）" />
            <Label col="1" :text="selectedUnit" class="unit-label" />
          </GridLayout>
          <Label text="单价 (元)" class="field-label" />
          <TextField v-model="unitPriceText" keyboardType="decimal" class="input" hint="单价（可选）" />
          <Label text="总价 (元)" class="field-label" />
          <TextField v-model="totalPriceText" keyboardType="decimal" class="input" hint="总价（可选）" />
        </StackLayout>

        <Label text="备注" class="field-label" />
        <TextField v-model="form.note" class="input" hint="备注（可选）" />

        <Button text="保存" class="btn-save" @tap="save" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>
<script lang="ts">
import Vue from 'nativescript-vue';
import TypeSwitch from '../components/TypeSwitch.vue';
import CategoryPicker from '../components/CategoryPicker.vue';
import WorkerPicker from '../components/WorkerPicker.vue';
import ProductPicker from '../components/ProductPicker.vue';
import { useRecordsStore } from '../store/records';
import { useCategoriesStore } from '../store/categories';
import { useWorkersStore } from '../store/workers';
import { useProductsStore } from '../store/products';
import type { AddRecordForm, Category, Product, Worker } from '../types';

interface FormData {
  form: AddRecordForm;
  amountText: string;
  weightText: string;
  unitPriceText: string;
  totalPriceText: string;
  selectedUnit: string;
}

export default Vue.extend({
  components: { TypeSwitch, CategoryPicker, WorkerPicker, ProductPicker },
  data(): FormData {
    return {
      form: { type: 'expense', category_id: null, worker_id: null,
        product_id: null, date: new Date(), note: '' },
      amountText: '', weightText: '', unitPriceText: '', totalPriceText: '',
      selectedUnit: ''
    };
  },
  computed: {
    categoriesStore: () => useCategoriesStore(),
    workersStore: () => useWorkersStore(),
    productsStore: () => useProductsStore(),
    recordsStore: () => useRecordsStore(),
    currentCats(): Category[] {
      return this.form.type === 'expense'
        ? this.categoriesStore.expenseCategories
        : this.categoriesStore.incomeCategories;
    },
    showWorker(): boolean {
      if (this.form.type !== 'expense') return false;
      const cat = this.categoriesStore.categories.find((c: Category) => c.id === this.form.category_id);
      return !!cat && cat.name === '雇工工资';
    },
    showProduct(): boolean { return this.form.type === 'income'; }
  },
  async mounted(): Promise<void> {
    await Promise.all([
      this.categoriesStore.loadCategories(),
      this.workersStore.loadWorkers(),
      this.productsStore.loadProducts()
    ]);
  },
  methods: {
    onProductSelect(p: Product): void { this.form.product_id = p.id; this.selectedUnit = p.unit || ''; },
    async save(): Promise<void> {
      const amount = parseFloat(this.amountText);
      if (isNaN(amount) || amount <= 0) { alert('请输入有效金额'); return; }
      if (!this.form.category_id) { alert('请选择分类'); return; }
      const d = this.form.date;
      const dateStr = d instanceof Date
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        : String(d);
      await this.recordsStore.addRecord({
        type: this.form.type, amount, category_id: this.form.category_id,
        worker_id: this.form.worker_id, product_id: this.form.product_id,
        unit_price: parseFloat(this.unitPriceText) || null,
        weight: parseFloat(this.weightText) || null,
        total_price: parseFloat(this.totalPriceText) || null,
        date: dateStr, note: this.form.note
      });
      alert('保存成功');
      this.amountText = ''; this.weightText = ''; this.unitPriceText = '';
      this.totalPriceText = ''; this.form.note = '';
      this.form.worker_id = null; this.form.product_id = null;
    }
  }
});
</script>
<style scoped>
.page { background-color: var(--color-bg); }
.form { padding: var(--spacing-base); }
.field-label { font-size: var(--text-sm); color: var(--color-text-secondary); margin: var(--spacing-md) 0 var(--spacing-xs); font-weight: var(--font-medium); }
.input { border-width: 1; border-color: var(--color-border); border-radius: var(--radius-md); padding: var(--spacing-sm) var(--spacing-md); background-color: var(--color-surface); font-size: var(--text-base); color: var(--color-text); }
.btn-save { background-color: var(--color-primary); color: var(--color-text-inverse); font-weight: var(--font-bold); margin: var(--spacing-xl) 0; border-radius: var(--radius-md); padding: var(--spacing-md); font-size: var(--text-lg); elevation: var(--elevation-md); }
.unit-label { font-size: var(--text-sm); color: var(--color-text-secondary); margin-left: var(--spacing-sm); vertical-align: center; }
</style>
