# Farm Accounting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete NativeScript-Vue Android offline farm accounting app with 4 database tables, 5 tab pages, worker/production tracking, and auto-backup.

**Architecture:** 4-layer stack — Vue components → Pinia stores → Services → DAOs → SQLite. Bottom-up implementation starting from database, then services, then stores, then components, then pages, then assembly.

**Tech Stack:** NativeScript-Vue, Pinia, nativescript-sqlite, nativescript-ui-chart, JavaScript, NativeScript CSS

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `webpack.config.js`
- Create: `app/app.js`
- Create: `app/app.css`
- Create: `references.d.ts`
- Create: `tsconfig.json`

- [ ] **Step 1: Initialize NativeScript project**

Run: `ns create farm-accounting --vue --js`

If `ns create` unavailable, manually scaffold with:
```bash
npm init -y
npm install @nativescript/core nativescript-vue pinia nativescript-sqlite nativescript-ui-chart
```

- [ ] **Step 2: Create directory structure**

```bash
mkdir -p app/{components,views,store,services,database/dao,models,utils,assets}
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: scaffold NativeScript-Vue project"
```

---

### Task 2: Utility Functions

**Files:**
- Create: `app/utils/date.js`
- Create: `app/utils/amount.js`

- [ ] **Step 1: Write date utility**

Create `app/utils/date.js`:

```js
export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function now() {
  return new Date().toISOString();
}

export function monthKey(dateStr) {
  return dateStr.substring(0, 7);
}

export function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${y}年${parseInt(m)}月${parseInt(d)}日`;
}
```

- [ ] **Step 2: Write amount utility**

Create `app/utils/amount.js`:

```js
export function formatAmount(value) {
  return Number(value).toFixed(2);
}

export function cnAmount(value) {
  const abs = Math.abs(Number(value));
  if (abs >= 10000) {
    return (abs / 10000).toFixed(2) + '万';
  }
  return abs.toFixed(2);
}
```

- [ ] **Step 3: Commit**

```bash
git add app/utils/ && git commit -m "feat: add date and amount utilities"
```

---

### Task 3: Database Initialization

**Files:**
- Create: `app/database/database.js`

- [ ] **Step 1: Write database init with table creation and seed data**

Create `app/database/database.js`:

```js
const Sqlite = require('nativescript-sqlite');

let db = null;

export async function getDb() {
  if (db) return db;
  db = await new Sqlite('farm-accounting.db');
  await db.execSQL('PRAGMA foreign_keys = ON');
  return db;
}

export async function initDatabase() {
  const db = await getDb();

  await db.execSQL(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      icon TEXT,
      sort_order INTEGER DEFAULT 0,
      is_preset INTEGER DEFAULT 0
    )
  `);
  await db.execSQL(`
    CREATE TABLE IF NOT EXISTS workers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      note TEXT,
      created_at TEXT
    )
  `);
  await db.execSQL(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      unit TEXT,
      created_at TEXT
    )
  `);
  await db.execSQL(`
    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      category_id INTEGER,
      worker_id INTEGER,
      product_id INTEGER,
      unit_price REAL,
      weight REAL,
      total_price REAL,
      date TEXT NOT NULL,
      note TEXT,
      created_at TEXT,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (worker_id) REFERENCES workers(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  await seedCategories(db);
}

async function seedCategories(db) {
  const count = await db.get('SELECT COUNT(*) as cnt FROM categories');
  if (count.cnt > 0) return;

  const expenseCategories = [
    '种子', '化肥', '农药', '农机/燃油', '灌溉/水电',
    '土地租金', '雇工工资', '农膜/农具', '运输/物流', '其他支出'
  ];
  const incomeCategories = [
    '蔬菜销售', '粮食销售', '水果销售', '畜禽销售', '蛋奶销售', '其他收入'
  ];

  for (let i = 0; i < expenseCategories.length; i++) {
    await db.execSQL(
      'INSERT INTO categories (type, name, sort_order, is_preset) VALUES (?, ?, ?, 1)',
      ['expense', expenseCategories[i], i]
    );
  }
  for (let i = 0; i < incomeCategories.length; i++) {
    await db.execSQL(
      'INSERT INTO categories (type, name, sort_order, is_preset) VALUES (?, ?, ?, 1)',
      ['income', incomeCategories[i], i]
    );
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/database/database.js && git commit -m "feat: database init with tables and seed categories"
```

---

### Task 4: Category DAO

**Files:**
- Create: `app/database/dao/CategoryDAO.js`

- [ ] **Step 1: Write CategoryDAO**

Create `app/database/dao/CategoryDAO.js`:

```js
import { getDb } from '../database';

export const CategoryDAO = {
  async getAll() {
    const db = await getDb();
    return db.all('SELECT * FROM categories ORDER BY type, sort_order');
  },

  async getByType(type) {
    const db = await getDb();
    return db.all('SELECT * FROM categories WHERE type = ? ORDER BY sort_order', [type]);
  },

  async getById(id) {
    const db = await getDb();
    return db.get('SELECT * FROM categories WHERE id = ?', [id]);
  },

  async insert(category) {
    const db = await getDb();
    await db.execSQL(
      'INSERT INTO categories (type, name, icon, sort_order, is_preset) VALUES (?, ?, ?, ?, ?)',
      [category.type, category.name, category.icon || null, category.sort_order || 0, category.is_preset || 0]
    );
  },

  async update(category) {
    const db = await getDb();
    await db.execSQL(
      'UPDATE categories SET name = ?, icon = ?, sort_order = ? WHERE id = ?',
      [category.name, category.icon || null, category.sort_order || 0, category.id]
    );
  },

  async deleteById(id) {
    const db = await getDb();
    await db.execSQL('DELETE FROM categories WHERE id = ? AND is_preset = 0', [id]);
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add app/database/dao/CategoryDAO.js && git commit -m "feat: add CategoryDAO"
```

---

### Task 5: Worker DAO

**Files:**
- Create: `app/database/dao/WorkerDAO.js`

- [ ] **Step 1: Write WorkerDAO**

Create `app/database/dao/WorkerDAO.js`:

```js
import { getDb } from '../database';

export const WorkerDAO = {
  async getAll() {
    const db = await getDb();
    return db.all('SELECT * FROM workers ORDER BY name');
  },
  async getById(id) {
    const db = await getDb();
    return db.get('SELECT * FROM workers WHERE id = ?', [id]);
  },
  async insert(worker) {
    const db = await getDb();
    await db.execSQL(
      'INSERT INTO workers (name, phone, note, created_at) VALUES (?, ?, ?, ?)',
      [worker.name, worker.phone || null, worker.note || null, worker.created_at]
    );
  },
  async update(worker) {
    const db = await getDb();
    await db.execSQL(
      'UPDATE workers SET name = ?, phone = ?, note = ? WHERE id = ?',
      [worker.name, worker.phone || null, worker.note || null, worker.id]
    );
  },
  async deleteById(id) {
    const db = await getDb();
    await db.execSQL('DELETE FROM workers WHERE id = ?', [id]);
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add app/database/dao/WorkerDAO.js && git commit -m "feat: add WorkerDAO"
```

---

### Task 6: Product DAO

**Files:**
- Create: `app/database/dao/ProductDAO.js`

- [ ] **Step 1: Write ProductDAO**

Create `app/database/dao/ProductDAO.js`:

```js
import { getDb } from '../database';

export const ProductDAO = {
  async getAll() {
    const db = await getDb();
    return db.all('SELECT * FROM products ORDER BY name');
  },
  async getById(id) {
    const db = await getDb();
    return db.get('SELECT * FROM products WHERE id = ?', [id]);
  },
  async insert(product) {
    const db = await getDb();
    await db.execSQL(
      'INSERT INTO products (name, unit, created_at) VALUES (?, ?, ?)',
      [product.name, product.unit || null, product.created_at]
    );
  },
  async update(product) {
    const db = await getDb();
    await db.execSQL(
      'UPDATE products SET name = ?, unit = ? WHERE id = ?',
      [product.name, product.unit || null, product.id]
    );
  },
  async deleteById(id) {
    const db = await getDb();
    await db.execSQL('DELETE FROM products WHERE id = ?', [id]);
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add app/database/dao/ProductDAO.js && git commit -m "feat: add ProductDAO"
```

---

### Task 7: Record DAO

**Files:**
- Create: `app/database/dao/RecordDAO.js`

- [ ] **Step 1: Write RecordDAO with filters and stats queries**

Create `app/database/dao/RecordDAO.js`:

```js
import { getDb } from '../database';

export const RecordDAO = {
  async getAll(filters = {}) {
    const db = await getDb();
    let sql = `
      SELECT r.*, c.name as category_name, c.type as category_type,
             w.name as worker_name, p.name as product_name, p.unit as product_unit
      FROM records r
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN workers w ON r.worker_id = w.id
      LEFT JOIN products p ON r.product_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.type) {
      sql += ' AND r.type = ?';
      params.push(filters.type);
    }
    if (filters.month) {
      sql += ' AND r.date LIKE ?';
      params.push(filters.month + '%');
    }

    sql += ' ORDER BY r.date DESC, r.id DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(filters.limit);
    }

    return db.all(sql, params);
  },

  async getById(id) {
    const db = await getDb();
    return db.get(`
      SELECT r.*, c.name as category_name, c.type as category_type,
             w.name as worker_name, p.name as product_name, p.unit as product_unit
      FROM records r
      LEFT JOIN categories c ON r.category_id = c.id
      LEFT JOIN workers w ON r.worker_id = w.id
      LEFT JOIN products p ON r.product_id = p.id
      WHERE r.id = ?
    `, [id]);
  },

  async insert(record) {
    const db = await getDb();
    await db.execSQL(
      `INSERT INTO records (type, amount, category_id, worker_id, product_id,
       unit_price, weight, total_price, date, note, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [record.type, record.amount, record.category_id,
       record.worker_id || null, record.product_id || null,
       record.unit_price || null, record.weight || null, record.total_price || null,
       record.date, record.note || null, record.created_at]
    );
  },

  async update(record) {
    const db = await getDb();
    await db.execSQL(
      `UPDATE records SET type=?, amount=?, category_id=?, worker_id=?,
       product_id=?, unit_price=?, weight=?, total_price=?, date=?, note=?
       WHERE id=?`,
      [record.type, record.amount, record.category_id,
       record.worker_id || null, record.product_id || null,
       record.unit_price || null, record.weight || null, record.total_price || null,
       record.date, record.note || null, record.id]
    );
  },

  async deleteById(id) {
    const db = await getDb();
    await db.execSQL('DELETE FROM records WHERE id = ?', [id]);
  },

  async getMonthSummary(yearMonth) {
    const db = await getDb();
    return db.get(`
      SELECT
        COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE 0 END), 0) as totalIncome,
        COALESCE(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END), 0) as totalExpense
      FROM records WHERE date LIKE ?
    `, [yearMonth + '%']);
  },

  async getCategoryStats(type, yearMonth) {
    const db = await getDb();
    return db.all(`
      SELECT c.name, SUM(r.amount) as total
      FROM records r JOIN categories c ON r.category_id = c.id
      WHERE r.type = ? AND r.date LIKE ?
      GROUP BY c.id, c.name ORDER BY total DESC
    `, [type, yearMonth + '%']);
  },

  async getWorkerSalaryStats(yearMonth) {
    const db = await getDb();
    return db.all(`
      SELECT w.name, SUM(r.amount) as total
      FROM records r JOIN workers w ON r.worker_id = w.id
      WHERE r.category_id = (SELECT id FROM categories WHERE name='雇工工资' LIMIT 1)
        AND r.date LIKE ?
      GROUP BY w.id, w.name ORDER BY total DESC
    `, [yearMonth + '%']);
  },

  async getProductSalesStats(yearMonth) {
    const db = await getDb();
    return db.all(`
      SELECT p.name, p.unit, SUM(r.weight) as totalWeight,
             SUM(r.amount) as totalAmount, COUNT(*) as count
      FROM records r JOIN products p ON r.product_id = p.id
      WHERE r.type='income' AND r.product_id IS NOT NULL AND r.date LIKE ?
      GROUP BY p.id, p.name, p.unit ORDER BY totalAmount DESC
    `, [yearMonth + '%']);
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add app/database/dao/RecordDAO.js && git commit -m "feat: add RecordDAO with stats queries"
```

---

### Task 8: Category Service

**Files:**
- Create: `app/services/CategoryService.js`

- [ ] **Step 1: Write CategoryService**

Create `app/services/CategoryService.js`:

```js
import { CategoryDAO } from '../database/dao/CategoryDAO';

export const CategoryService = {
  async getIncomeCategories() {
    return CategoryDAO.getByType('income');
  },
  async getExpenseCategories() {
    return CategoryDAO.getByType('expense');
  },
  async getAll() {
    return CategoryDAO.getAll();
  },
  async addCategory(type, name) {
    const existing = await CategoryDAO.getByType(type);
    const maxSort = existing.reduce((max, c) => Math.max(max, c.sort_order), -1);
    await CategoryDAO.insert({ type, name, sort_order: maxSort + 1, is_preset: 0 });
  },
  async updateCategory(id, name) {
    await CategoryDAO.update({ id, name });
  },
  async deleteCategory(id) {
    await CategoryDAO.deleteById(id);
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add app/services/CategoryService.js && git commit -m "feat: add CategoryService"
```

---

### Task 9: Worker and Product Services

**Files:**
- Create: `app/services/WorkerService.js`
- Create: `app/services/ProductService.js`

- [ ] **Step 1: Write WorkerService**

Create `app/services/WorkerService.js`:

```js
import { WorkerDAO } from '../database/dao/WorkerDAO';
import { now } from '../utils/date';

export const WorkerService = {
  async getAll() { return WorkerDAO.getAll(); },
  async addWorker(name, phone, note) {
    await WorkerDAO.insert({ name, phone, note, created_at: now() });
  },
  async updateWorker(id, name, phone, note) {
    await WorkerDAO.update({ id, name, phone, note });
  },
  async deleteWorker(id) { await WorkerDAO.deleteById(id); }
};
```

- [ ] **Step 2: Write ProductService**

Create `app/services/ProductService.js`:

```js
import { ProductDAO } from '../database/dao/ProductDAO';
import { now } from '../utils/date';

export const ProductService = {
  async getAll() { return ProductDAO.getAll(); },
  async addProduct(name, unit) {
    await ProductDAO.insert({ name, unit, created_at: now() });
  },
  async updateProduct(id, name, unit) {
    await ProductDAO.update({ id, name, unit });
  },
  async deleteProduct(id) { await ProductDAO.deleteById(id); }
};
```

- [ ] **Step 3: Commit**

```bash
git add app/services/WorkerService.js app/services/ProductService.js && git commit -m "feat: add WorkerService and ProductService"
```

---

### Task 10: Record and Stats Services

**Files:**
- Create: `app/services/RecordService.js`
- Create: `app/services/StatsService.js`

- [ ] **Step 1: Write RecordService**

Create `app/services/RecordService.js`:

```js
import { RecordDAO } from '../database/dao/RecordDAO';
import { now } from '../utils/date';

export const RecordService = {
  async getRecords(filters) { return RecordDAO.getAll(filters); },
  async getRecentRecords(limit = 5) { return RecordDAO.getAll({ limit }); },
  async getMonthSummary(yearMonth) { return RecordDAO.getMonthSummary(yearMonth); },

  async addRecord(data) {
    await RecordDAO.insert({
      type: data.type, amount: data.amount, category_id: data.category_id,
      worker_id: data.worker_id || null, product_id: data.product_id || null,
      unit_price: data.unit_price || null, weight: data.weight || null,
      total_price: data.total_price || null, date: data.date,
      note: data.note || null, created_at: now()
    });
  },

  async deleteRecord(id) { await RecordDAO.deleteById(id); }
};
```

- [ ] **Step 2: Write StatsService**

Create `app/services/StatsService.js`:

```js
import { RecordDAO } from '../database/dao/RecordDAO';

export const StatsService = {
  async getMonthSummary(yearMonth) { return RecordDAO.getMonthSummary(yearMonth); },
  async getCategoryStats(type, yearMonth) { return RecordDAO.getCategoryStats(type, yearMonth); },
  async getWorkerSalaryStats(yearMonth) { return RecordDAO.getWorkerSalaryStats(yearMonth); },
  async getProductSalesStats(yearMonth) { return RecordDAO.getProductSalesStats(yearMonth); },

  async getMonthlyTrend(year) {
    const months = [];
    const currentMonth = new Date().getMonth() + 1;
    for (let m = 1; m <= currentMonth; m++) {
      const ym = `${year}-${String(m).padStart(2, '0')}`;
      const summary = await RecordDAO.getMonthSummary(ym);
      months.push({ month: m, income: summary.totalIncome, expense: summary.totalExpense });
    }
    return months;
  }
};
```

- [ ] **Step 3: Commit**

```bash
git add app/services/RecordService.js app/services/StatsService.js && git commit -m "feat: add RecordService and StatsService"
```

---

### Task 11: Backup Service

**Files:**
- Create: `app/services/BackupService.js`

- [ ] **Step 1: Write BackupService**

Create `app/services/BackupService.js`:

```js
const fs = require('@nativescript/core/file-system');

const BACKUP_DIR = 'backups';
const DB_NAME = 'farm-accounting.db';
const MAX_BACKUPS = 7;

export const BackupService = {
  async backup() {
    const documents = fs.knownFolders.documents();
    const backupFolder = documents.getFolder(BACKUP_DIR);

    const d = new Date();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const backupName = `farm-accounting-${dateStr}.db`;

    const dstPath = fs.path.join(backupFolder.path, backupName);
    if (fs.File.exists(dstPath)) return;

    const srcPath = fs.path.join(documents.path, DB_NAME);
    if (fs.File.exists(srcPath)) {
      const srcFile = fs.File.fromPath(srcPath);
      await srcFile.copy(dstPath);
    }
    await this.cleanOldBackups();
  },

  async listBackups() {
    const documents = fs.knownFolders.documents();
    const backupFolder = documents.getFolder(BACKUP_DIR);
    const files = backupFolder.getEntitiesSync()
      .filter(e => e.name.startsWith('farm-accounting-') && e.name.endsWith('.db'))
      .sort((a, b) => b.name.localeCompare(a.name));

    return files.map(f => ({
      filename: f.name,
      label: f.name.replace('farm-accounting-', '').replace('.db', ''),
      path: f.path
    }));
  },

  async restore(filename) {
    const documents = fs.knownFolders.documents();
    const backupFolder = documents.getFolder(BACKUP_DIR);
    const srcPath = fs.path.join(backupFolder.path, filename);
    const dstPath = fs.path.join(documents.path, DB_NAME);

    if (fs.File.exists(srcPath)) {
      const srcFile = fs.File.fromPath(srcPath);
      await srcFile.copy(dstPath);
    }
  },

  async cleanOldBackups() {
    const backups = await this.listBackups();
    if (backups.length > MAX_BACKUPS) {
      const documents = fs.knownFolders.documents();
      const backupFolder = documents.getFolder(BACKUP_DIR);
      for (let i = MAX_BACKUPS; i < backups.length; i++) {
        const file = fs.File.fromPath(backups[i].path);
        await file.remove();
      }
    }
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add app/services/BackupService.js && git commit -m "feat: add BackupService"
```

---

### Task 12: Pinia Stores (Categories, Workers, Products)

**Files:**
- Create: `app/store/categories.js`
- Create: `app/store/workers.js`
- Create: `app/store/products.js`

- [ ] **Step 1: Write categories store**

Create `app/store/categories.js`:

```js
import { defineStore } from 'pinia';
import { CategoryService } from '../services/CategoryService';

export const useCategoriesStore = defineStore('categories', {
  state: () => ({ categories: [] }),
  getters: {
    incomeCategories: (s) => s.categories.filter(c => c.type === 'income'),
    expenseCategories: (s) => s.categories.filter(c => c.type === 'expense')
  },
  actions: {
    async loadCategories() { this.categories = await CategoryService.getAll(); },
    async addCategory(type, name) {
      await CategoryService.addCategory(type, name);
      await this.loadCategories();
    },
    async updateCategory(id, name) {
      await CategoryService.updateCategory(id, name);
      await this.loadCategories();
    },
    async deleteCategory(id) {
      await CategoryService.deleteCategory(id);
      await this.loadCategories();
    }
  }
});
```

- [ ] **Step 2: Write workers store**

Create `app/store/workers.js`:

```js
import { defineStore } from 'pinia';
import { WorkerService } from '../services/WorkerService';

export const useWorkersStore = defineStore('workers', {
  state: () => ({ workers: [] }),
  actions: {
    async loadWorkers() { this.workers = await WorkerService.getAll(); },
    async addWorker(name, phone, note) {
      await WorkerService.addWorker(name, phone, note);
      await this.loadWorkers();
    },
    async updateWorker(id, name, phone, note) {
      await WorkerService.updateWorker(id, name, phone, note);
      await this.loadWorkers();
    },
    async deleteWorker(id) {
      await WorkerService.deleteWorker(id);
      await this.loadWorkers();
    }
  }
});
```

- [ ] **Step 3: Write products store**

Create `app/store/products.js`:

```js
import { defineStore } from 'pinia';
import { ProductService } from '../services/ProductService';

export const useProductsStore = defineStore('products', {
  state: () => ({ products: [] }),
  actions: {
    async loadProducts() { this.products = await ProductService.getAll(); },
    async addProduct(name, unit) {
      await ProductService.addProduct(name, unit);
      await this.loadProducts();
    },
    async updateProduct(id, name, unit) {
      await ProductService.updateProduct(id, name, unit);
      await this.loadProducts();
    },
    async deleteProduct(id) {
      await ProductService.deleteProduct(id);
      await this.loadProducts();
    }
  }
});
```

- [ ] **Step 4: Commit**

```bash
git add app/store/ && git commit -m "feat: add categories, workers, and products Pinia stores"
```

---

### Task 13: Records Store

**Files:**
- Create: `app/store/records.js`

- [ ] **Step 1: Write records store**

Create `app/store/records.js`:

```js
import { defineStore } from 'pinia';
import { RecordService } from '../services/RecordService';

export const useRecordsStore = defineStore('records', {
  state: () => ({
    records: [],
    monthSummary: { totalIncome: 0, totalExpense: 0 },
    filters: {}
  }),
  getters: {
    balance: (s) => s.monthSummary.totalIncome - s.monthSummary.totalExpense
  },
  actions: {
    async loadRecords(filters = {}) {
      this.filters = { ...filters };
      this.records = await RecordService.getRecords(filters);
    },
    async loadMonthSummary(yearMonth) {
      this.monthSummary = await RecordService.getMonthSummary(yearMonth);
    },
    async addRecord(data) {
      await RecordService.addRecord(data);
      const ym = data.date.substring(0, 7);
      await Promise.all([
        this.loadMonthSummary(ym),
        this.loadRecords(this.filters)
      ]);
    },
    async deleteRecord(id, date) {
      await RecordService.deleteRecord(id);
      const ym = date.substring(0, 7);
      await Promise.all([
        this.loadMonthSummary(ym),
        this.loadRecords(this.filters)
      ]);
    }
  }
});
```

- [ ] **Step 2: Commit**

```bash
git add app/store/records.js && git commit -m "feat: add records store"
```

---

### Task 14: Reusable UI Components

**Files:**
- Create: `app/components/TypeSwitch.vue`
- Create: `app/components/CategoryPicker.vue`
- Create: `app/components/WorkerPicker.vue`
- Create: `app/components/ProductPicker.vue`

- [ ] **Step 1: Write TypeSwitch**

Create `app/components/TypeSwitch.vue`:

```vue
<template>
  <GridLayout columns="*, *" class="type-switch">
    <Button text="支出" :class="type === 'expense' ? 'btn-active' : 'btn-inactive'"
      col="0" @tap="$emit('change', 'expense')" />
    <Button text="收入" :class="type === 'income' ? 'btn-active' : 'btn-inactive'"
      col="1" @tap="$emit('change', 'income')" />
  </GridLayout>
</template>
<script>
export default {
  props: { type: { type: String, default: 'expense' } }
};
</script>
<style scoped>
.type-switch { margin: 8 0; }
.btn-active { background-color: #2e6b3e; color: white; font-weight: bold; }
.btn-inactive { background-color: #e0e0e0; color: #666; }
</style>
```

- [ ] **Step 2: Write CategoryPicker**

Create `app/components/CategoryPicker.vue`:

```vue
<template>
  <ScrollView orientation="horizontal" height="60">
    <StackLayout orientation="horizontal" class="cat-list">
      <Button v-for="cat in categories" :key="cat.id" :text="cat.name"
        :class="selectedId === cat.id ? 'cat-selected' : 'cat-item'"
        @tap="$emit('select', cat)" />
    </StackLayout>
  </ScrollView>
</template>
<script>
export default {
  props: { categories: Array, selectedId: Number }
};
</script>
<style scoped>
.cat-list { padding: 4; }
.cat-item { background-color: #f0f0f0; margin: 4; border-radius: 20; padding: 8 16; font-size: 13; }
.cat-selected { background-color: #2e6b3e; color: white; margin: 4; border-radius: 20; padding: 8 16; font-size: 13; }
</style>
```

- [ ] **Step 3: Write WorkerPicker**

Create `app/components/WorkerPicker.vue`:

```vue
<template>
  <StackLayout>
    <Label text="工人" class="field-label" />
    <ListPicker :items="workerNames" :selectedIndex="selectedIndex"
      @selectedIndexChange="onSelect" />
  </StackLayout>
</template>
<script>
export default {
  props: { workers: Array, selectedId: Number },
  computed: {
    workerNames() { return this.workers.map(w => w.name); },
    selectedIndex() {
      const idx = this.workers.findIndex(w => w.id === this.selectedId);
      return idx >= 0 ? idx : 0;
    }
  },
  methods: {
    onSelect(e) {
      const w = this.workers[e.value];
      if (w) this.$emit('select', w);
    }
  }
};
</script>
<style scoped>
.field-label { font-size: 14; color: #555; margin: 8 0 4; }
</style>
```

- [ ] **Step 4: Write ProductPicker**

Create `app/components/ProductPicker.vue`:

```vue
<template>
  <StackLayout>
    <Label text="产出物" class="field-label" />
    <ListPicker :items="productNames" :selectedIndex="selectedIndex"
      @selectedIndexChange="onSelect" />
  </StackLayout>
</template>
<script>
export default {
  props: { products: Array, selectedId: Number },
  computed: {
    productNames() { return this.products.map(p => p.name); },
    selectedIndex() {
      const idx = this.products.findIndex(p => p.id === this.selectedId);
      return idx >= 0 ? idx : 0;
    }
  },
  methods: {
    onSelect(e) {
      const p = this.products[e.value];
      if (p) this.$emit('select', p);
    }
  }
};
</script>
<style scoped>
.field-label { font-size: 14; color: #555; margin: 8 0 4; }
</style>
```

- [ ] **Step 5: Commit**

```bash
git add app/components/TypeSwitch.vue app/components/CategoryPicker.vue app/components/WorkerPicker.vue app/components/ProductPicker.vue && git commit -m "feat: add form input components"
```

---

### Task 15: List Components

**Files:**
- Create: `app/components/FilterBar.vue`
- Create: `app/components/RecordItem.vue`
- Create: `app/components/MonthSummaryCard.vue`
- Create: `app/components/RecentRecordList.vue`

- [ ] **Step 1: Write FilterBar**

Create `app/components/FilterBar.vue`:

```vue
<template>
  <GridLayout columns="auto, *, auto" class="filter-bar">
    <Button text="全部" :class="!activeType ? 'filter-active' : 'filter-btn'" col="0" @tap="$emit('filterChange', { type: null })" />
    <Button text="支出" :class="activeType === 'expense' ? 'filter-active' : 'filter-btn'" col="1" @tap="$emit('filterChange', { type: 'expense' })" />
    <Button text="收入" :class="activeType === 'income' ? 'filter-active' : 'filter-btn'" col="2" @tap="$emit('filterChange', { type: 'income' })" />
  </GridLayout>
</template>
<script>
export default { props: { activeType: String } };
</script>
<style scoped>
.filter-bar { padding: 8; background-color: #fafafa; }
.filter-btn { background-color: #e0e0e0; color: #666; font-size: 12; margin: 2; }
.filter-active { background-color: #2e6b3e; color: white; font-size: 12; margin: 2; }
</style>
```

- [ ] **Step 2: Write RecordItem**

Create `app/components/RecordItem.vue`:

```vue
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
```

- [ ] **Step 3: Write MonthSummaryCard**

Create `app/components/MonthSummaryCard.vue`:

```vue
<template>
  <StackLayout class="summary-card">
    <Label :text="title" class="card-title" />
    <GridLayout columns="*, *, *" class="summary-row">
      <StackLayout col="0" class="summary-item">
        <Label text="收入" class="summary-label" />
        <Label :text="cnAmount(summary.totalIncome)" class="summary-value income" />
      </StackLayout>
      <StackLayout col="1" class="summary-item">
        <Label text="支出" class="summary-label" />
        <Label :text="cnAmount(summary.totalExpense)" class="summary-value expense" />
      </StackLayout>
      <StackLayout col="2" class="summary-item">
        <Label text="结余" class="summary-label" />
        <Label :text="cnAmount(summary.totalIncome - summary.totalExpense)"
          :class="summary.totalIncome >= summary.totalExpense ? 'summary-value income' : 'summary-value expense'" />
      </StackLayout>
    </GridLayout>
  </StackLayout>
</template>
<script>
import { cnAmount } from '../utils/amount';
export default {
  props: { summary: Object, title: { type: String, default: '本月概览' } },
  methods: { cnAmount }
};
</script>
<style scoped>
.summary-card { background-color: #fff; border-radius: 12; margin: 12; padding: 16; }
.card-title { font-size: 16; font-weight: bold; color: #333; margin-bottom: 12; }
.summary-row { text-align: center; }
.summary-label { font-size: 12; color: #999; }
.summary-value { font-size: 20; font-weight: bold; margin-top: 4; }
.income { color: #27ae60; }
.expense { color: #e74c3c; }
</style>
```

- [ ] **Step 4: Write RecentRecordList**

Create `app/components/RecentRecordList.vue`:

```vue
<template>
  <StackLayout>
    <Label text="最近记录" class="section-title" />
    <ListView :items="records">
      <template #default="{ item }">
        <RecordItem :record="item" @tap="$emit('recordTap', item)" />
      </template>
    </ListView>
    <Label v-if="!records.length" text="暂无记录" class="empty-text" />
  </StackLayout>
</template>
<script>
import RecordItem from './RecordItem';
export default {
  components: { RecordItem },
  props: { records: Array }
};
</script>
<style scoped>
.section-title { font-size: 14; font-weight: bold; color: #333; margin: 8 12; }
.empty-text { text-align: center; color: #999; font-size: 14; margin: 20; }
</style>
```

- [ ] **Step 5: Commit**

```bash
git add app/components/FilterBar.vue app/components/RecordItem.vue app/components/MonthSummaryCard.vue app/components/RecentRecordList.vue && git commit -m "feat: add list and summary components"
```

---

### Task 16: Chart Components

**Files:**
- Create: `app/components/MonthBarChart.vue`
- Create: `app/components/CategoryPieChart.vue`
- Create: `app/components/WorkerSalaryList.vue`
- Create: `app/components/ProductSalesList.vue`

- [ ] **Step 1: Write MonthBarChart**

Create `app/components/MonthBarChart.vue`:

```vue
<template>
  <StackLayout class="chart-container">
    <Label text="月度收支趋势" class="chart-title" />
    <StackLayout v-for="item in data" :key="item.month" class="bar-row">
      <GridLayout columns="40, *, *">
        <Label col="0" :text="item.month + '月'" class="bar-label" />
        <StackLayout col="1">
          <Label :text="cnAmount(item.income)" class="bar-value income" />
          <StackLayout class="bar-bg">
            <StackLayout :width="pct(item.income)" class="bar-fill income-bg" />
          </StackLayout>
        </StackLayout>
        <StackLayout col="2">
          <Label :text="cnAmount(item.expense)" class="bar-value expense" />
          <StackLayout class="bar-bg">
            <StackLayout :width="pct(item.expense)" class="bar-fill expense-bg" />
          </StackLayout>
        </StackLayout>
      </GridLayout>
    </StackLayout>
  </StackLayout>
</template>
<script>
import { cnAmount } from '../utils/amount';
export default {
  props: { data: Array },
  methods: {
    cnAmount,
    pct(val) {
      const max = Math.max(1, ...this.data.flatMap(d => [d.income, d.expense]));
      return Math.max(2, (val / max) * 100);
    }
  }
};
</script>
<style scoped>
.chart-container { margin: 12; padding: 12; background-color: #fff; border-radius: 12; }
.chart-title { font-size: 14; font-weight: bold; color: #333; margin-bottom: 8; }
.bar-row { margin: 4 0; }
.bar-label { font-size: 11; color: #666; vertical-align: center; }
.bar-value { font-size: 10; }
.bar-bg { background-color: #eee; height: 8; border-radius: 4; margin-top: 2; }
.bar-fill { height: 8; border-radius: 4; }
.income-bg { background-color: #27ae60; }
.expense-bg { background-color: #e74c3c; }
.income { color: #27ae60; }
.expense { color: #e74c3c; }
</style>
```

- [ ] **Step 2: Write CategoryPieChart**

Create `app/components/CategoryPieChart.vue`:

```vue
<template>
  <StackLayout class="chart-container">
    <Label text="分类支出分布" class="chart-title" />
    <StackLayout v-for="(item, idx) in data" :key="item.name" class="pie-row">
      <GridLayout columns="auto, *, auto">
        <StackLayout col="0" width="12" height="12" :backgroundColor="colors[idx % colors.length]" class="dot" />
        <Label col="1" :text="item.name" class="pie-label" />
        <Label col="2" :text="cnAmount(item.total)" class="pie-value" />
      </GridLayout>
    </StackLayout>
  </StackLayout>
</template>
<script>
import { cnAmount } from '../utils/amount';
export default {
  props: { data: Array },
  data: () => ({
    colors: ['#e74c3c','#e67e22','#f1c40f','#2ecc71','#3498db','#9b59b6','#1abc9c','#34495e','#e91e63','#00bcd4']
  }),
  methods: { cnAmount }
};
</script>
<style scoped>
.chart-container { margin: 12; padding: 12; background-color: #fff; border-radius: 12; }
.chart-title { font-size: 14; font-weight: bold; color: #333; margin-bottom: 8; }
.pie-row { margin: 4 0; }
.dot { border-radius: 6; margin-right: 8; vertical-align: center; }
.pie-label { font-size: 13; color: #333; }
.pie-value { font-size: 13; font-weight: bold; color: #e74c3c; }
</style>
```

- [ ] **Step 3: Write WorkerSalaryList and ProductSalesList**

Create `app/components/WorkerSalaryList.vue`:

```vue
<template>
  <StackLayout class="chart-container">
    <Label text="工人工资汇总" class="chart-title" />
    <GridLayout v-for="item in data" :key="item.name" columns="*, auto" class="stat-row">
      <Label col="0" :text="item.name" class="stat-label" />
      <Label col="1" :text="cnAmount(item.total)" class="stat-value" />
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
.stat-value { font-size: 14; font-weight: bold; color: #e74c3c; }
.empty { text-align: center; color: #999; font-size: 13; margin: 12; }
</style>
```

Create `app/components/ProductSalesList.vue`:

```vue
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
```

- [ ] **Step 4: Commit**

```bash
git add app/components/MonthBarChart.vue app/components/CategoryPieChart.vue app/components/WorkerSalaryList.vue app/components/ProductSalesList.vue && git commit -m "feat: add chart and stats components"
```

---

### Task 17: Dashboard and AddRecord Pages

**Files:**
- Create: `app/views/Dashboard.vue`
- Create: `app/views/AddRecord.vue`

- [ ] **Step 1: Write Dashboard page**

Create `app/views/Dashboard.vue`:

```vue
<template>
  <Page class="page">
    <ActionBar title="农场记账" />
    <ScrollView>
      <StackLayout>
        <MonthSummaryCard :summary="recordsStore.monthSummary" :title="monthTitle" />
        <RecentRecordList :records="recentRecords" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>
<script>
import MonthSummaryCard from '../components/MonthSummaryCard';
import RecentRecordList from '../components/RecentRecordList';
import { useRecordsStore } from '../store/records';
import { monthKey, today } from '../utils/date';

export default {
  components: { MonthSummaryCard, RecentRecordList },
  data() { return { recentRecords: [] }; },
  computed: {
    recordsStore: () => useRecordsStore(),
    monthTitle() {
      const [y, m] = today().split('-');
      return `${y}年${parseInt(m)}月概览`;
    }
  },
  async mounted() {
    const ym = monthKey(today());
    await this.recordsStore.loadMonthSummary(ym);
    const all = await this.recordsStore.loadRecords({ month: ym });
    this.recentRecords = this.recordsStore.records.slice(0, 5);
  }
};
</script>
<style scoped>
.page { background-color: #f5f5f5; }
</style>
```

- [ ] **Step 2: Write AddRecord page**

Create `app/views/AddRecord.vue`:

```vue
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
```

- [ ] **Step 3: Commit**

```bash
git add app/views/Dashboard.vue app/views/AddRecord.vue && git commit -m "feat: add Dashboard and AddRecord pages"
```

---

### Task 18: RecordList and Statistics Pages

**Files:**
- Create: `app/views/RecordList.vue`
- Create: `app/views/Statistics.vue`

- [ ] **Step 1: Write RecordList page**

Create `app/views/RecordList.vue`:

```vue
<template>
  <Page class="page">
    <ActionBar title="账单" />
    <StackLayout>
      <FilterBar :activeType="filters.type" @filterChange="onFilter" />
      <ListView :items="recordsStore.records">
        <template #default="{ item }">
          <RecordItem :record="item" />
        </template>
      </ListView>
      <Label v-if="!recordsStore.records.length" text="暂无记录" class="empty" />
    </StackLayout>
  </Page>
</template>
<script>
import FilterBar from '../components/FilterBar';
import RecordItem from '../components/RecordItem';
import { useRecordsStore } from '../store/records';
export default {
  components: { FilterBar, RecordItem },
  data() { return { filters: {} }; },
  computed: { recordsStore: () => useRecordsStore() },
  async mounted() { await this.recordsStore.loadRecords(); },
  methods: {
    async onFilter(f) { this.filters = { ...f }; await this.recordsStore.loadRecords(this.filters); }
  }
};
</script>
<style scoped>
.page { background-color: #f5f5f5; }
.empty { text-align: center; color: #999; font-size: 14; margin: 40; }
</style>
```

- [ ] **Step 2: Write Statistics page**

Create `app/views/Statistics.vue`:

```vue
<template>
  <Page class="page">
    <ActionBar title="统计" />
    <ScrollView>
      <StackLayout>
        <MonthSummaryCard :summary="summary" title="年度统计" />
        <GridLayout columns="*, *, *" class="year-nav">
          <Button text="◀" col="0" class="nav-btn" @tap="prevYear" />
          <Label :text="currentYear + '年'" col="1" class="year-label" textAlignment="center" />
          <Button text="▶" col="2" class="nav-btn" @tap="nextYear" />
        </GridLayout>
        <MonthBarChart :data="monthlyTrend" />
        <CategoryPieChart :data="categoryStats" />
        <WorkerSalaryList :data="workerStats" />
        <ProductSalesList :data="productStats" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>
<script>
import MonthSummaryCard from '../components/MonthSummaryCard';
import MonthBarChart from '../components/MonthBarChart';
import CategoryPieChart from '../components/CategoryPieChart';
import WorkerSalaryList from '../components/WorkerSalaryList';
import ProductSalesList from '../components/ProductSalesList';
import { StatsService } from '../services/StatsService';

export default {
  components: { MonthSummaryCard, MonthBarChart, CategoryPieChart, WorkerSalaryList, ProductSalesList },
  data() {
    return {
      currentYear: new Date().getFullYear(),
      summary: { totalIncome: 0, totalExpense: 0 },
      monthlyTrend: [], categoryStats: [], workerStats: [], productStats: []
    };
  },
  async mounted() { await this.loadStats(); },
  methods: {
    async loadStats() {
      let yearIncome = 0, yearExpense = 0;
      const trend = [];
      const currentMonth = new Date().getMonth() + 1;
      for (let m = 1; m <= currentMonth; m++) {
        const ym = `${this.currentYear}-${String(m).padStart(2, '0')}`;
        const s = await StatsService.getMonthSummary(ym);
        trend.push({ month: m, income: s.totalIncome, expense: s.totalExpense });
        yearIncome += s.totalIncome;
        yearExpense += s.totalExpense;
      }
      this.summary = { totalIncome: yearIncome, totalExpense: yearExpense };
      this.monthlyTrend = trend;
      const cm = `${this.currentYear}-${String(currentMonth).padStart(2, '0')}`;
      this.categoryStats = await StatsService.getCategoryStats('expense', cm);
      this.workerStats = await StatsService.getWorkerSalaryStats(cm);
      this.productStats = await StatsService.getProductSalesStats(cm);
    },
    prevYear() { this.currentYear--; this.loadStats(); },
    nextYear() { this.currentYear++; this.loadStats(); }
  }
};
</script>
<style scoped>
.page { background-color: #f5f5f5; }
.year-nav { margin: 8 12; }
.nav-btn { background-color: transparent; color: #2e6b3e; font-size: 16; }
.year-label { font-size: 16; font-weight: bold; color: #333; }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add app/views/RecordList.vue app/views/Statistics.vue && git commit -m "feat: add RecordList and Statistics pages"
```

---

### Task 19: Settings and Sub-Pages

**Files:**
- Create: `app/views/Settings.vue`
- Create: `app/views/CategoryManage.vue`
- Create: `app/views/WorkerManage.vue`
- Create: `app/views/ProductManage.vue`
- Create: `app/views/BackupRestore.vue`

- [ ] **Step 1: Write Settings page**

Create `app/views/Settings.vue`:

```vue
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
<script>
import CategoryManage from './CategoryManage';
import WorkerManage from './WorkerManage';
import ProductManage from './ProductManage';
import BackupRestore from './BackupRestore';
export default {
  components: { CategoryManage, WorkerManage, ProductManage, BackupRestore }
};
</script>
<style scoped>
.page { background-color: #f5f5f5; }
.content { padding: 16; }
.menu-btn { background-color: white; color: #333; font-size: 15; text-align: left; padding: 14 16; margin: 4 0; border-radius: 8; }
.about { font-size: 14; color: #333; text-align: center; }
.about-sub { font-size: 12; color: #999; text-align: center; margin-top: 4; }
</style>
```

- [ ] **Step 2: Write CategoryManage sub-page**

Create `app/views/CategoryManage.vue`:

```vue
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
<script>
import { useCategoriesStore } from '../store/categories';
export default {
  data() { return { newName: '', newType: 'expense' }; },
  computed: { store: () => useCategoriesStore() },
  async mounted() { await this.store.loadCategories(); },
  methods: {
    async addCategory() {
      if (!this.newName.trim()) return;
      await this.store.addCategory(this.newType, this.newName.trim());
      this.newName = '';
    },
    async del(c) { await this.store.deleteCategory(c.id); }
  }
};
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
```

- [ ] **Step 3: Write WorkerManage sub-page**

Create `app/views/WorkerManage.vue`:

```vue
<template>
  <Page class="page">
    <ActionBar title="工人管理" />
    <StackLayout class="content">
      <GridLayout columns="*, *, auto" class="add-row">
        <TextField col="0" v-model="newName" class="input" hint="姓名" />
        <TextField col="1" v-model="newPhone" class="input" hint="电话(可选)" />
        <Button col="2" text="添加" class="btn-add" @tap="add" />
      </GridLayout>
      <ListView :items="store.workers">
        <template #default="{ item }">
          <GridLayout columns="*, auto" class="item-row">
            <StackLayout col="0">
              <Label :text="item.name" class="item-name" />
              <Label :text="item.phone || ''" class="item-sub" />
            </StackLayout>
            <Button col="1" text="删除" class="btn-del" @tap="del(item)" />
          </GridLayout>
        </template>
      </ListView>
    </StackLayout>
  </Page>
</template>
<script>
import { useWorkersStore } from '../store/workers';
export default {
  data() { return { newName: '', newPhone: '' }; },
  computed: { store: () => useWorkersStore() },
  async mounted() { await this.store.loadWorkers(); },
  methods: {
    async add() {
      if (!this.newName.trim()) return;
      await this.store.addWorker(this.newName.trim(), this.newPhone.trim());
      this.newName = ''; this.newPhone = '';
    },
    async del(w) { await this.store.deleteWorker(w.id); }
  }
};
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
```

- [ ] **Step 4: Write ProductManage sub-page**

Create `app/views/ProductManage.vue`:

```vue
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
<script>
import { useProductsStore } from '../store/products';
export default {
  data() { return { newName: '', newUnit: '' }; },
  computed: { store: () => useProductsStore() },
  async mounted() { await this.store.loadProducts(); },
  methods: {
    async add() {
      if (!this.newName.trim()) return;
      await this.store.addProduct(this.newName.trim(), this.newUnit.trim());
      this.newName = ''; this.newUnit = '';
    },
    async del(p) { await this.store.deleteProduct(p.id); }
  }
};
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
```

- [ ] **Step 5: Write BackupRestore sub-page**

Create `app/views/BackupRestore.vue`:

```vue
<template>
  <Page class="page">
    <ActionBar title="备份恢复" />
    <StackLayout class="content">
      <Label text="自动备份" class="section-title" />
      <Label text="每次启动应用时自动备份数据库，保留最近7天" class="desc" />
      <Button text="立即备份" class="btn-main" @tap="backupNow" />
      <Label text="恢复备份" class="section-title" style="margin-top: 24;" />
      <ListView :items="backups">
        <template #default="{ item }">
          <GridLayout columns="*, auto" class="item-row">
            <Label col="0" :text="item.label" class="item-name" />
            <Button col="1" text="恢复" class="btn-restore" @tap="restore(item)" />
          </GridLayout>
        </template>
      </ListView>
      <Label v-if="!backups.length" text="暂无备份" class="empty" />
    </StackLayout>
  </Page>
</template>
<script>
import { BackupService } from '../services/BackupService';
export default {
  data() { return { backups: [] }; },
  async mounted() { await this.loadBackups(); },
  methods: {
    async loadBackups() { this.backups = await BackupService.listBackups(); },
    async backupNow() { await BackupService.backup(); alert('备份成功'); await this.loadBackups(); },
    async restore(item) { await BackupService.restore(item.filename); alert('恢复成功，请重启应用'); }
  }
};
</script>
<style scoped>
.page { background-color: #f5f5f5; }
.content { padding: 16; }
.section-title { font-size: 16; font-weight: bold; color: #333; margin-bottom: 8; }
.desc { font-size: 13; color: #666; margin-bottom: 12; }
.btn-main { background-color: #2e6b3e; color: white; border-radius: 8; padding: 12; font-weight: bold; }
.btn-restore { background-color: #3498db; color: white; font-size: 12; padding: 6 16; border-radius: 4; }
.item-row { padding: 12 8; background-color: white; border-bottom-width: 1; border-bottom-color: #eee; }
.item-name { font-size: 14; color: #333; }
.empty { text-align: center; color: #999; font-size: 13; margin: 20; }
</style>
```

- [ ] **Step 6: Commit**

```bash
git add app/views/Settings.vue app/views/CategoryManage.vue app/views/WorkerManage.vue app/views/ProductManage.vue app/views/BackupRestore.vue && git commit -m "feat: add Settings page and sub-pages"
```

---

### Task 20: App Shell and Final Assembly

**Files:**
- Create: `app/components/App.vue`
- Write: `app/app.js`
- Write: `app/app.css`

- [ ] **Step 1: Write App.vue with bottom TabView**

Create `app/components/App.vue`:

```vue
<template>
  <TabView :selectedIndex="tab" @selectedIndexChange="tab = $event.value"
    androidTabsPosition="bottom">
    <TabViewItem title="首页"><Frame><Dashboard /></Frame></TabViewItem>
    <TabViewItem title="记账"><Frame><AddRecord /></Frame></TabViewItem>
    <TabViewItem title="账单"><Frame><RecordList /></Frame></TabViewItem>
    <TabViewItem title="统计"><Frame><Statistics /></Frame></TabViewItem>
    <TabViewItem title="设置"><Frame><Settings /></Frame></TabViewItem>
  </TabView>
</template>
<script>
import Dashboard from '../views/Dashboard';
import AddRecord from '../views/AddRecord';
import RecordList from '../views/RecordList';
import Statistics from '../views/Statistics';
import Settings from '../views/Settings';
export default {
  components: { Dashboard, AddRecord, RecordList, Statistics, Settings },
  data() { return { tab: 0 }; }
};
</script>
```

- [ ] **Step 2: Write global CSS**

Create `app/app.css`:

```css
page { background-color: #f5f5f5; font-family: sans-serif; }
ActionBar { background-color: #2e6b3e; color: white; }
TabView {
  tab-text-color: #888;
  selected-tab-text-color: #2e6b3e;
  tab-background-color: white;
  android-selected-tab-highlight-color: #2e6b3e;
}
```

- [ ] **Step 3: Write app.js entry point**

Create `app/app.js`:

```js
import Vue from 'nativescript-vue';
import { createPinia } from 'pinia';
import { initDatabase } from './database/database';
import { BackupService } from './services/BackupService';
import App from './components/App';

Vue.use(createPinia());

new Vue({
  render: h => h('frame', [h(App)]),
  async created() {
    await initDatabase();
    try { await BackupService.backup(); } catch (e) { /* best-effort */ }
  }
}).$start();
```

- [ ] **Step 4: Verify build**

```bash
ns build android
```

Fix any import or compilation errors. Expected: APK builds successfully.

- [ ] **Step 5: Commit**

```bash
git add app/components/App.vue app/app.js app/app.css && git commit -m "feat: assemble app shell with TabView and startup logic"
```

---

### Implementation Order

```
Task 1  → Scaffold project
Task 2  → Utility functions
Task 3  → Database init + tables + seed
Task 4  → Category DAO
Task 5  → Worker DAO
Task 6  → Product DAO
Task 7  → Record DAO
Task 8  → Category Service
Task 9  → Worker + Product Services
Task 10 → Record + Stats Services
Task 11 → Backup Service
Task 12 → Stores (categories, workers, products)
Task 13 → Records Store
Task 14 → Form input components
Task 15 → List + summary components
Task 16 → Chart components
Task 17 → Dashboard + AddRecord pages
Task 18 → RecordList + Statistics pages
Task 19 → Settings + sub-pages
Task 20 → App shell + final assembly
```
