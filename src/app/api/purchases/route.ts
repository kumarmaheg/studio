import { openDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  const db = await openDb();
  try {
    const purchases = await db.all(`
      SELECT 
        p.id,
        p.supplier,
        p.sku,
        i.name as item_name,
        p.quantity,
        p.purchase_price,
        p.total,
        p.status,
        p.date
      FROM purchases p
      JOIN inventory i ON p.sku = i.sku
      ORDER BY p.date DESC
    `);
    return NextResponse.json(purchases);
  } finally {
    await db.close();
  }
}

export async function POST(req: NextRequest) {
  const db = await openDb();
  const body = await req.json();
  const { sku, supplier, quantity, purchase_price, date } = body;

  if (!sku || !quantity || !purchase_price || !date) {
    await db.close();
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const total = purchase_price * quantity;
    const status = 'Ordered';
    
    const result = await db.run(
      'INSERT INTO purchases (sku, supplier, quantity, purchase_price, total, status, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [sku, supplier, quantity, purchase_price, total, status, date]
    );
    
    return NextResponse.json({ id: result.lastID });
  } catch (error: any) {
    console.error('Failed to create purchase order:', error);
    return NextResponse.json({ error: 'Failed to create purchase order', details: error.message }, { status: 500 });
  } finally {
    await db.close();
  }
}
