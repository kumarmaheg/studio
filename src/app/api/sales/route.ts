import { openDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  const db = await openDb();
  const sales = await db.all('SELECT * FROM sales');
  return NextResponse.json(sales);
}

export async function POST(req: NextRequest) {
  const db = await openDb();
  const { product, quantity, price, customer } = await req.json();

  const result = await db.run(
    'INSERT INTO sales (product, quantity, price, customer) VALUES (?, ?, ?, ?)',
    [product, quantity, price, customer]
  );

  return NextResponse.json({ id: result.lastID });
}
