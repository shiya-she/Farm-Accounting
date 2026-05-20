# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Farm Accounting（农场记账）—— 基于 NativeScript-Vue 的安卓离线记账应用。

- **框架**: [NativeScript-Vue](https://nativescript-vue.org/) — 使用 Vue.js 编写原生移动应用
- **平台**: Android（离线应用，无需网络）
- **语言**: JavaScript / TypeScript
- **UI**: NativeScript 原生组件（非 WebView），Vue 单文件组件（.vue）
- **样式**: NativeScript CSS（原生 CSS 子集）

## 项目结构约定

```
Farm Accounting/
├── app/
│   ├── components/       # 可复用的 Vue 组件
│   ├── views/            # 页面级组件（每个页面一个文件）
│   ├── store/            # Pinia/Vuex 状态管理
│   ├── services/         # 业务逻辑层（记账、统计、导出等）
│   ├── models/           # 数据模型定义
│   ├── database/         # SQLite 数据库层（初始化、迁移、DAO）
│   ├── utils/            # 工具函数（日期格式化、金额计算等）
│   ├── assets/           # 静态资源（图片、字体等）
│   ├── App_Resources/    # 原生平台资源
│   ├── app.js            # 应用入口
│   └── app.css           # 全局样式
├── App_Resources/        # Android/iOS 原生资源（图标、启动页等）
├── package.json
├── webpack.config.js     # Webpack 配置
├── tsconfig.json         # TypeScript 配置（如使用 TS）
├── references.d.ts       # NativeScript 类型声明
└── CLAUDE.md
```

## 常用命令

```bash
# 运行（Android）
ns run android

# 构建 APK
ns build android

# 构建 release APK
ns build android --release --key-store-path <path> --key-store-password <pwd> --key-store-alias <alias> --key-store-alias-password <pwd>

# 清理构建缓存
ns clean

# 添加 NativeScript 插件
ns plugin add <plugin-name>

# 安装依赖
npm install

# 运行测试（如已配置）
ns test android
```

## 核心架构设计

### 离线数据库
- 使用 `nativescript-sqlite` 或 `nativescript-sqlite-encrypted` 作为本地存储
- 数据库在应用首次启动时初始化，包含预置科目/分类数据
- 采用 DAO（数据访问对象）模式封装数据库操作
- 所有记账数据仅存储在本地，无需网络同步

### 核心数据模型
- **账目记录**（Record）：日期、金额、分类、备注、创建时间
- **分类**（Category）：收入/支出分类（如种子、化肥、农产品销售、设备维护等）
- **账户**（Account）：现金、银行卡、微信/支付宝等
- **预算**（Budget）：月度/年度预算（可选功能）

### 状态管理
- 使用 Pinia（推荐）或 Vuex 管理全局状态
- Store 模块划分：records（账目）、categories（分类）、accounts（账户）、settings（设置）

### 页面规划
- **首页/仪表盘**：本月收支概览、近期记录
- **记账页**：快速添加收入/支出
- **账单列表**：按日期/分类筛选查看
- **统计报表**：图表展示收支趋势（可使用 `nativescript-ui-chart`）
- **设置页**：分类管理、数据导出（CSV/Excel）、主题设置

## 开发规范

### 命名约定
- **文件/文件夹**: kebab-case（如 `add-record.vue`, `farm-expense-list.vue`）
- **变量/函数**: camelCase
- **常量**: UPPER_SNAKE_CASE
- **Vue 组件名**: PascalCase（如 `AddRecordForm`）

### 样式规范
- 使用 NativeScript CSS（flexbox 布局，不支持 web 的 display: block/inline）
- 颜色/主题变量统一在 `app.css` 中定义
- 每个 .vue 文件使用 `<style scoped>` 避免样式冲突

### 推荐 NativeScript 插件
- `nativescript-sqlite` — 本地数据库
- `nativescript-ui-chart` — 图表（用于统计报表）
- `nativescript-local-notifications` — 本地通知（记账提醒）
- `nativescript-csv` / `nativescript-xlsx` — 数据导出
- `nativescript-theme-core` — 主题样式
- `@nativescript/geolocation` — 位置（可选，记录农场位置）
