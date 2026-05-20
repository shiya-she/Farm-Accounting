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
<script>
import TypeSwitch from '../components/TypeSwitch';
import CategoryPicker from '../components/CategoryPicker';
import WorkerPicker from '../components/WorkerPicker';
import ProductPicker from '../components/ProductPicker';
import { useRecordsStore } from '../store/records';
import { useCategoriesStore } from '../store/categories';
import { useWorkersStore } from '../store/workers';
import { useProductsStore } from '../store/products';

export default {
  components: { TypeSwitch, CategoryPicker, WorkerPicker, ProductPicker },
  data() {
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
    currentCats() {
      return this.form.type === 'expense'
        ? this.categoriesStore.expenseCategories
        : this.categoriesStore.incomeCategories;
    },
    showWorker() {
      if (this.form.type !== 'expense') return false;
      const cat = this.categoriesStore.categories.find(c => c.id === this.form.category_id);
      return cat && cat.name === '雇工工资';
    },
    showProduct() { return this.form.type === 'income'; }
  },
  async mounted() {
    await Promise.all([
      this.categoriesStore.loadCategories(),
      this.workersStore.loadWorkers(),
      this.productsStore.loadProducts()
    ]);
  },
  methods: {
    onProductSelect(p) { this.form.product_id = p.id; this.selectedUnit = p.unit || ''; },
    async save() {
      const amount = parseFloat(this.amountText);
      if (isNaN(amount) || amount <= 0) { alert('请输入有效金额'); return; }
      if (!this.form.category_id) { alert('请选择分类'); return; }
      const d = this.form.date;
      const dateStr = d instanceof Date
        ? `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
        : this.form.date;
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
};
</script>
<style scoped>
.page { background-color: #f5f5f5; }
.form { padding: 12; }
.field-label { font-size: 14; color: #555; margin: 8 0 4; }
.input { border-width: 1; border-color: #ddd; border-radius: 8; padding: 10; background-color: white; font-size: 15; }
.btn-save { background-color: #2e6b3e; color: white; font-weight: bold; margin: 16 0; border-radius: 8; padding: 14; }
.unit-label { font-size: 14; color: #666; margin-left: 8; vertical-align: center; }
</style>
