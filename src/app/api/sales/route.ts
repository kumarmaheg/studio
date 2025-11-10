import { openDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  const db = await openDb();
  const sales = await db.all(`
    SELECT s.id, i.name as product, s.quantity, s.price, s.customer, s.date, s.item_name, s.sku, s.purchase_price, s.discount, s.final_price, s.profit_amount
    FROM sales s
    LEFT JOIN inventory i ON s.sku = i.sku
  `);
  await db.close();
  return NextResponse.json(sales);
}

export async function POST(req: NextRequest) {
  const db = await openDb();
  const body = await req.json();
  const { sku, quantity, price, customer, date, item_name, purchase_price, discount, final_price, profit_amount } = body;

  if (!sku || !quantity || !price || !date || !item_name) {
    await db.close();
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Begin transaction
  await db.exec('BEGIN TRANSACTION');

  try {
    const result = await db.run(
      'INSERT INTO sales (sku, quantity, price, customer, date, item_name, purchase_price, discount, final_price, profit_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [sku, quantity, price, customer, date, item_name, purchase_price, discount, final_price, profit_amount]
    );

    // Update inventory
    await db.run('UPDATE inventory SET stk_qty = stk_qty - ? WHERE sku = ?', [quantity, sku]);

    // Commit transaction
    await db.exec('COMMIT');
    
    await db.close();
    return NextResponse.json({ id: result.lastID });
  } catch (error) {
    // Rollback transaction in case of error
    await db.exec('ROLLBACK');
    console.error(error);
    await db.close();
    return NextResponse.json({ error: 'Failed to create sale' }, { status: 500 });
  }
}
