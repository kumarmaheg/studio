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

  await db.exec('ALTER TABLE inventory RENAME COLUMN purchase_price TO price;');
  await db.exec('ALTER TABLE inventory RENAME COLUMN selling_price TO sale_price;');
  await db.exec('ALTER TABLE inventory RENAME COLUMN stk_qty TO quantity;');

  console.log('Migration: UP complete');
}

export async function down() {
  const db = await openDb();

  await db.exec('DROP TABLE sales');

  await db.exec('ALTER TABLE inventory RENAME COLUMN price TO purchase_price;');
  await db.exec('ALTER TABLE inventory RENAME COLUMN sale_price TO selling_price;');
  await db.exec('ALTER TABLE inventory RENAME COLUMN quantity TO stk_qty;');

  console.log('Migration: DOWN complete');
}
