import { openDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  const db = await openDb();
  try {
    const sales = await db.all(`
      SELECT 
        s.id, 
        s.item_name, 
        s.quantity, 
        s.price, 
        s.customer, 
        s.date,
        s.sku, 
        s.purchase_price, 
        s.discount, 
        s.final_price, 
        s.profit_amount
      FROM sales s
    `);
    return NextResponse.json(sales);
  } finally {
    await db.close();
  }
}

export async function POST(req: NextRequest) {
  const db = await openDb();
  const body = await req.json();
  const { sku, quantity, price, customer, date } = body;

  if (!sku || !quantity || !price || !date) {
    await db.close();
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    await db.exec('BEGIN TRANSACTION');

    const item = await db.get('SELECT * FROM inventory WHERE sku = ?', [sku]);

    if (!item) {
      await db.exec('ROLLBACK');
      return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
    }

    if (item.stk_qty < quantity) {
        await db.exec('ROLLBACK');
        return NextResponse.json({ error: 'Not enough stock available' }, { status: 400 });
    }

    const discount = parseFloat(body.discount) || 0;
    const final_price = (price * quantity) - discount;
    const profit_amount = final_price - (item.purchase_price * quantity);
    
    const result = await db.run(
      'INSERT INTO sales (sku, item_name, quantity, price, purchase_price, discount, final_price, profit_amount, customer, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [sku, item.name, quantity, price, item.purchase_price, discount, final_price, profit_amount, customer, date]
    );

    await db.run('UPDATE inventory SET stk_qty = stk_qty - ? WHERE sku = ?', [quantity, sku]);

    await db.exec('COMMIT');
    
    return NextResponse.json({ id: result.lastID });
  } catch (error: any) {
    await db.exec('ROLLBACK');
    console.error('Failed to create sale:', error);
    return NextResponse.json({ error: 'Failed to create sale', details: error.message }, { status: 500 });
  } finally {
    await db.close();
  }
}
