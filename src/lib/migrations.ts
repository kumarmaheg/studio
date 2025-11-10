'use server';

import { openDb } from './db';

export async function up() {
  const db = await openDb();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      customer TEXT,
      date TEXT NOT NULL,
      item_name TEXT NOT NULL,
      purchase_price REAL,
      discount REAL,
      final_price REAL,
      profit_amount REAL,
      FOREIGN KEY (sku) REFERENCES inventory(sku)
    );
  `);

  console.log('Migration: UP complete');
}

export async function down() {
  const db = await openDb();

  await db.exec('DROP TABLE IF EXISTS sales');

  console.log('Migration: DOWN complete');
}
