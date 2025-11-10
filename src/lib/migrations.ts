'use server';

import { openDb } from './db';

export async function up() {
  const db = await openDb();

  await db.exec(`
    CREATE TABLE sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_name TEXT,
      item_code TEXT,
      quantity INTEGER,
      purchase_price REAL,
      sale_price REAL,
      discount REAL,
      final_price REAL,
      profit_amount REAL,
      customer TEXT,
      date TEXT
    );
  `);

  console.log('Migration: UP complete');
}

export async function down() {
  const db = await openDb();

  await db.exec('DROP TABLE sales');

  console.log('Migration: DOWN complete');
}
