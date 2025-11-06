import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

async function setup() {
  const db = await open({ filename: './database.db', driver: sqlite3.Database });
  await db.migrate({ migrationsPath: './migrations' });

  // Clear the sales table before inserting new data
  await db.exec('DELETE FROM sales');

  const sales = [
    {
      id: 1,
      product: 'Laptop',
      quantity: 2,
      price: 1200,
      customer: 'Acme Corp',
      date: '2024-01-15',
    },
    {
      id: 2,
      product: 'Mouse',
      quantity: 5,
      price: 25,
      customer: 'Beta Inc',
      date: '2024-01-16',
    },
  ];

  const stmt = await db.prepare('INSERT INTO sales (id, product, quantity, price, customer, date) VALUES (?, ?, ?, ?, ?, ?)');
  for (const sale of sales) {
    await stmt.run(sale.id, sale.product, sale.quantity, sale.price, sale.customer, sale.date);
  }
  await stmt.finalize();

  console.log('Database setup complete');
}

setup();
