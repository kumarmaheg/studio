import { openDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const db = await openDb();
  const inventory = await db.all('SELECT * FROM inventory');
  await db.close();

  return NextResponse.json(inventory);
}

export async function POST(request: Request) {
  const db = await openDb();
  const { name, description, category, purchase_price, selling_price, stk_date, stk_qty, low_stock_threshold } = await request.json();

  const lastItem = await db.get('SELECT sku FROM inventory ORDER BY id DESC LIMIT 1');

  let newSku;
  if (lastItem && lastItem.sku) {
    const lastSkuNum = parseInt(lastItem.sku.split('-')[1], 10);
    const newSkuNum = lastSkuNum + 1;
    newSku = `SS-${String(newSkuNum).padStart(4, '0')}`;
  } else {
    newSku = 'SS-0001';
  }

  const result = await db.run(
    'INSERT INTO inventory (name, sku, description, category, purchase_price, selling_price, stk_date, stk_qty, low_stock_threshold) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, newSku, description, category, purchase_price, selling_price, stk_date, stk_qty, low_stock_threshold]
  );

  await db.close();

  return NextResponse.json({ success: true, id: result.lastID, sku: newSku });
}

export async function DELETE() {
    const db = await openDb();
    await db.run('DELETE FROM inventory');
    await db.close();

    return NextResponse.json({ success: true });
}
