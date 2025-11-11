import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const db = await openDb();
    
    await db.exec('BEGIN TRANSACTION');

    const purchase = await db.get('SELECT * FROM purchases WHERE id = ?', [id]);

    if (!purchase) {
        await db.exec('ROLLBACK');
        return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 });
    }

    // Update the status of the purchase order
    await db.run('UPDATE purchases SET status = ? WHERE id = ?', [status, id]);

    // If the new status is 'Received', update the inventory
    if (status === 'Received' && purchase.status !== 'Received') {
      await db.run(
        'UPDATE inventory SET stk_qty = stk_qty + ? WHERE sku = ?',
        [purchase.quantity, purchase.sku]
      );
    }
    
    // If order is cancelled, and was previously received, revert stock.
    if (status === 'Cancelled' && purchase.status === 'Received') {
        await db.run(
            'UPDATE inventory SET stk_qty = stk_qty - ? WHERE sku = ?',
            [purchase.quantity, purchase.sku]
        )
    }

    await db.exec('COMMIT');

    await db.close();
    return NextResponse.json({ message: 'Purchase order status updated successfully' });
  } catch (error) {
    const db = await openDb();
    await db.exec('ROLLBACK');
    console.error('Error updating purchase order status:', error);
    return NextResponse.json({ error: 'Failed to update purchase order status' }, { status: 500 });
  }
}
