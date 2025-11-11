
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT NOT NULL UNIQUE,
      category TEXT,
      description TEXT,
      purchase_price REAL,
      selling_price REAL,
      stk_date TEXT,
      stk_qty INTEGER,
      low_stock_threshold INTEGER
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT NOT NULL,
      supplier TEXT,
      quantity INTEGER NOT NULL,
      purchase_price REAL NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (sku) REFERENCES inventory(sku)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT NOT NULL,
      item_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      purchase_price REAL,
      discount REAL,
      final_price REAL,
      profit_amount REAL,
      customer TEXT,
      date TEXT NOT NULL,
      FOREIGN KEY (sku) REFERENCES inventory(sku)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      amount REAL NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS investments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      description TEXT,
      amount REAL NOT NULL
    );
  `);

  return db;
}
