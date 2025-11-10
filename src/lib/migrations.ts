'use server';

import { openDb } from './db';

export async function up() {
  const db = await openDb();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product INTEGER,
      quantity INTEGER,
      price REAL,
      customer TEXT,
      date TEXT,
      item_name TEXT,
      item_code TEXT,
      purchase_price REAL,
      discount REAL,
      final_price REAL,
      profit_amount REAL,
      FOREIGN KEY (product) REFERENCES inventory(id)
    );
  `);

  console.log('Migration: UP complete');
}

export async function down() {
  const db = await openDb();

  await db.exec('DROP TABLE IF EXISTS sales');

  console.log('Migration: DOWN complete');
}
