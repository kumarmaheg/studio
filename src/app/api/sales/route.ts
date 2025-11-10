import { openDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  const db = await openDb();
  const sales = await db.all(`
    SELECT s.id, i.name as product, s.quantity, s.price, s.customer, s.date
    FROM sales s
    JOIN inventory i ON s.product = i.id
  `);
  return NextResponse.json(sales);
}

export async function POST(req: NextRequest) {
  const db = await openDb();
  const { product, quantity, price, customer, date } = await req.json();

  const result = await db.run(
    'INSERT INTO sales (product, quantity, price, customer, date) VALUES (?, ?, ?, ?, ?)',
    [product, quantity, price, customer, date]
  );

  return NextResponse.json({ id: result.lastID });
}
