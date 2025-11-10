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

  return db;
}
