import { openDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  const db = await openDb();
  const sales = await db.all(`
    SELECT s.id, i.name as product, s.quantity, s.price, s.customer, s.date, s.item_name, s.item_code, s.purchase_price, s.discount, s.final_price, s.profit_amount
    FROM sales s
    LEFT JOIN inventory i ON s.product = i.id
  `);
  return NextResponse.json(sales);
}

export async function POST(req: NextRequest) {
  const db = await openDb();
  const { product, quantity, price, customer, date, itemName, itemCode, purchase_price, discount, final_price, profit_amount } = await req.json();

  // Begin transaction
  await db.exec('BEGIN TRANSACTION');

  try {
    const result = await db.run(
      'INSERT INTO sales (product, quantity, price, customer, date, item_name, item_code, purchase_price, discount, final_price, profit_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [product, quantity, price, customer, date, itemName, itemCode, purchase_price, discount, final_price, profit_amount]
    );

    // Update inventory
    await db.run('UPDATE inventory SET stk_qty = stk_qty - ? WHERE id = ?', [quantity, product]);

    // Commit transaction
    await db.exec('COMMIT');
    
    return NextResponse.json({ id: result.lastID });
  } catch (error) {
    // Rollback transaction in case of error
    await db.exec('ROLLBACK');
    console.error(error);
    return NextResponse.json({ error: 'Failed to create sale' }, { status: 500 });
  } finally {
    await db.close();
  }
}
