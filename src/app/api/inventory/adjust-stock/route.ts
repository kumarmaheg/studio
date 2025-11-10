import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sku, quantity } = body;

    if (!sku || quantity === undefined) {
      return NextResponse.json({ error: 'SKU and quantity are required' }, { status: 400 });
    }

    const db = await openDb();
    await db.run('UPDATE inventory SET stk_qty = stk_qty + ? WHERE sku = ?', [quantity, sku]);
    await db.close();

    return NextResponse.json({ message: 'Stock adjusted successfully' });
  } catch (error) {
    console.error('Error adjusting stock:', error);
    return NextResponse.json({ error: 'Failed to adjust stock' }, { status: 500 });
  }
}
