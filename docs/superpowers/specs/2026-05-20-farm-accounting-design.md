# Farm Accounting — Design Spec

**Date**: 2026-05-20
**Platform**: Android (NativeScript-Vue)
**Target users**: 个体农户家庭生产

## 需求总结

| 维度 | 决策 |
|------|------|
| 用户 | 个体农户家庭生产 |
| 记账范围 | 种植收支 + 临时工工资（按人统计）+ 每日产出（产出即销售） |
| 账户 | 不区分账户 |
| 导出 | 暂不需要 |
| 语言 | 简体中文 |
| 分类 | 预置常用分类，用户可增删改 |
| 预算 | 不需要 |
| 备份 | 本地自动备份（启动时备份，保留 7 天） |

## 数据模型

### 表结构

**records** — 账目记录

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增主键 |
| type | TEXT | `income` / `expense` |
| amount | REAL | 金额 |
| category_id | INTEGER FK | 关联 categories |
| worker_id | INTEGER FK (可空) | 关联 workers，仅支出-工资时填写 |
| product_id | INTEGER FK (可空) | 关联 products，仅收入时填写 |
| unit_price | REAL (可空) | 单价，非必填 |
| weight | REAL (可空) | 重量，非必填 |
| total_price | REAL (可空) | 总价，非必填 |
| date | TEXT | YYYY-MM-DD |
| note | TEXT | 备注 |
| created_at | TEXT | 创建时间戳 |

**categories** — 收支分类

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增主键 |
| type | TEXT | `income` / `expense` |
| name | TEXT | 分类名称 |
| icon | TEXT (可空) | 图标标识 |
| sort_order | INTEGER | 排序 |
| is_preset | INTEGER | 1=预置（不可删），0=用户创建 |

**workers** — 临时工

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增主键 |
| name | TEXT | 工人姓名 |
| phone | TEXT (可空) | 电话 |
| note | TEXT (可空) | 备注 |
| created_at | TEXT | 创建时间戳 |

**products** — 产出物

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增主键 |
| name | TEXT | 产出物名称 |
| unit | TEXT | 单位（斤/公斤/个/袋...） |
| created_at | TEXT | 创建时间戳 |

### 预置分类

**支出 (10项)**：种子、化肥、农药、农机/燃油、灌溉/水电、土地租金、雇工工资、农膜/农具、运输/物流、其他支出

**收入 (6项)**：蔬菜销售、粮食销售、水果销售、畜禽销售、蛋奶销售、其他收入

## 页面结构

底部 Tab 导航，5 个标签页：

1. **首页 (Dashboard)** — 本月收支概览卡片（收入/支出/结余），最近 5 条记录
2. **记账 (AddRecord)** — 快速记账表单：类型切换、分类选择、金额、日期、备注；支出-工资时选工人；收入时选产出物+重量+单价（可选）
3. **账单 (RecordList)** — 按日期倒序，支持按月份/分类/类型筛选
4. **统计 (Statistics)** — 月度收支柱状图、分类支出饼图、工人工资汇总、产出物销售排行
5. **设置 (Settings)** — 分类管理、工人管理、产出物管理、备份恢复、关于

设置页的子页面通过路由跳转（非 Tab）。

## 架构

### 分层

```
Vue 组件 (.vue)
  ↓ 调用 actions / 读取 state
Pinia Store (store/)
  ↓ 调用 service 方法
Service 层 (services/)
  ↓ 调用 DAO
DAO 层 (database/dao/)
  ↓
SQLite 数据库
```

### Pinia Store

| Store | 职责 |
|-------|------|
| recordsStore | records[], currentMonthSummary, filters; addRecord/deleteRecord/updateRecord/loadRecords/getMonthSummary |
| categoriesStore | categories[], incomeCategories/expenseCategories getters; loadCategories/addCategory/updateCategory/deleteCategory |
| workersStore | workers[], workerSalaryStats; addWorker/deleteWorker/getSalarySummary |
| productsStore | products[], productSalesStats; addProduct/deleteProduct/getSalesSummary |

### 组件树

```
App.vue (TabView 容器)
├── Dashboard.vue (首页)
│   ├── MonthSummaryCard.vue
│   └── RecentRecordList.vue
├── AddRecord.vue (记账)
│   ├── TypeSwitch.vue
│   ├── CategoryPicker.vue
│   ├── WorkerPicker.vue (仅支出-工资时显示)
│   └── ProductPicker.vue (仅收入时显示)
├── RecordList.vue (账单列表)
│   ├── FilterBar.vue
│   └── RecordItem.vue
├── Statistics.vue (统计)
│   ├── MonthBarChart.vue
│   ├── CategoryPieChart.vue
│   ├── WorkerSalaryList.vue
│   └── ProductSalesList.vue
└── Settings.vue (设置)
    ├── CategoryManage.vue (子页面)
    ├── WorkerManage.vue (子页面)
    ├── ProductManage.vue (子页面)
    └── BackupRestore.vue (子页面)
```

## 记账逻辑

- 收入/支出通过 TypeSwitch 切换
- 当 type=expense 且 category=雇工工资 时，显示 WorkerPicker（选择或新增工人）
- 当 type=income 时，显示 ProductPicker + weight + unit_price + total_price（单价和总价非必填）
- 产出即销售，直接记录为收入，不需要库存

## 备份机制

- 每次应用启动时自动备份 SQLite 数据库文件
- 备份目录：应用 documents 目录下的 backups/
- 命名规则：`farm-accounting-YYYY-MM-DD.db`
- 保留最近 7 天的备份，每天一份
- 恢复：从备份列表中选日期，替换当前数据库，重启应用

## 技术选型

- 框架：NativeScript-Vue
- 状态管理：Pinia
- 数据库：nativescript-sqlite
- 图表：nativescript-ui-chart
- 语言：JavaScript（组件内使用 TypeScript 可选）
- 样式：NativeScript CSS（flexbox）

## 项目文件结构

```
app/
├── components/
│   ├── MonthSummaryCard.vue
│   ├── RecentRecordList.vue
│   ├── TypeSwitch.vue
│   ├── CategoryPicker.vue
│   ├── WorkerPicker.vue
│   ├── ProductPicker.vue
│   ├── FilterBar.vue
│   ├── RecordItem.vue
│   ├── MonthBarChart.vue
│   ├── CategoryPieChart.vue
│   ├── WorkerSalaryList.vue
│   └── ProductSalesList.vue
├── views/
│   ├── Dashboard.vue
│   ├── AddRecord.vue
│   ├── RecordList.vue
│   ├── Statistics.vue
│   ├── Settings.vue
│   ├── CategoryManage.vue
│   ├── WorkerManage.vue
│   ├── ProductManage.vue
│   └── BackupRestore.vue
├── store/
│   ├── records.js
│   ├── categories.js
│   ├── workers.js
│   └── products.js
├── services/
│   ├── RecordService.js
│   ├── CategoryService.js
│   ├── WorkerService.js
│   ├── ProductService.js
│   ├── StatsService.js
│   └── BackupService.js
├── database/
│   ├── database.js
│   └── dao/
│       ├── RecordDAO.js
│       ├── CategoryDAO.js
│       ├── WorkerDAO.js
│       └── ProductDAO.js
├── models/
├── utils/
├── assets/
├── app.js
└── app.css
```
