import Sqlite from 'nativescript-sqlite';

let db: Sqlite | null = null;

export async function getDb(): Promise<Sqlite> {
  if (db) return db;
  db = await new Sqlite('farm-accounting.db');
  await db.execSQL('PRAGMA foreign_keys = ON');
  return db;
}

export async function initDatabase(): Promise<void> {
  const database = await getDb();

  await database.execSQL(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      icon TEXT,
      sort_order INTEGER DEFAULT 0,
      is_preset INTEGER DEFAULT 0
    )
  `);
  await database.execSQL(`
    CREATE TABLE IF NOT EXISTS workers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      note TEXT,
      created_at TEXT
    )
  `);
  await database.execSQL(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      unit TEXT,
      created_at TEXT
    )
  `);
  await database.execSQL(`
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

  await seedCategories(database);
}

async function seedCategories(database: Sqlite): Promise<void> {
  const count = await database.get('SELECT COUNT(*) as cnt FROM categories');
  if (count.cnt > 0) return;

  const expenseCategories = [
    '种子', '化肥', '农药', '农机/燃油', '灌溉/水电',
    '土地租金', '雇工工资', '农膜/农具', '运输/物流', '其他支出'
  ];
  const incomeCategories = [
    '蔬菜销售', '粮食销售', '水果销售', '畜禽销售', '蛋奶销售', '其他收入'
  ];

  for (let i = 0; i < expenseCategories.length; i++) {
    await database.execSQL(
      'INSERT INTO categories (type, name, sort_order, is_preset) VALUES (?, ?, ?, 1)',
      ['expense', expenseCategories[i], i]
    );
  }
  for (let i = 0; i < incomeCategories.length; i++) {
    await database.execSQL(
      'INSERT INTO categories (type, name, sort_order, is_preset) VALUES (?, ?, ?, 1)',
      ['income', incomeCategories[i], i]
    );
  }
}
