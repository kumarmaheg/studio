import { openDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const db = await openDb();
  const lastItem = await db.get('SELECT sku FROM inventory ORDER BY id DESC LIMIT 1');
  await db.close();

  let newSku;
  if (lastItem && lastItem.sku) {
    const lastSkuNum = parseInt(lastItem.sku.split('-')[1], 10);
    const newSkuNum = lastSkuNum + 1;
    newSku = `SS-${String(newSkuNum).padStart(4, '0')}`;
  } else {
    newSku = 'SS-0001';
  }

  return NextResponse.json({ sku: newSku });
}
