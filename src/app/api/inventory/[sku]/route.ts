import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { sku: string } }) {
  try {
    const { sku } = params;
    const body = await req.json();
    const db = await openDb();
    await db.run(
      'UPDATE inventory SET name = ?, description = ?, category = ?, purchase_price = ?, selling_price = ?, stk_date = ?, stk_qty = ?, low_stock_threshold = ? WHERE sku = ?',
      [body.name, body.description, body.category, body.purchase_price, body.selling_price, body.stk_date, body.stk_qty, body.low_stock_threshold, sku]
    );
    await db.close();
    return NextResponse.json({ message: 'Inventory item updated successfully' });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return NextResponse.json({ error: 'Failed to update inventory item' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { sku: string } }) {
    try {
        const { sku } = params;
        const db = await openDb();
        const item = await db.get('SELECT * FROM inventory WHERE sku = ?', [sku]);
        await db.close();

        if (!item) {
            return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
        }

        return NextResponse.json(item);
    } catch (error) {
        console.error('Error fetching inventory item:', error);
        return NextResponse.json({ error: 'Failed to fetch inventory item' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { sku: string } }) {
    try {
        const { sku } = params;
        const db = await openDb();
        await db.run('DELETE FROM inventory WHERE sku = ?', [sku]);
        await db.close();
        return NextResponse.json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        return NextResponse.json({ error: 'Failed to delete inventory item' }, { status: 500 });
    }
}
