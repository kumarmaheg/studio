
'use server';

import { openDb } from './db';

export async function up() {
  const db = await openDb();

  // Drop the table if it exists to ensure a clean slate, then recreate with the correct schema
  await db.exec('DROP TABLE IF EXISTS sales');

  await db.exec(`
    CREATE TABLE sales (
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

  console.log('Migration: UP complete, sales table recreated correctly.');
}

export async function down() {
  const db = await openDb();

  await db.exec('DROP TABLE IF EXISTS sales');

  console.log('Migration: DOWN complete');
}
