import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const db = await openDb();
  try {
    const { id } = params;
    const { date, invested_by, reason, amount } = await req.json();

    if (!date || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await db.run(
      'UPDATE investments SET date = ?, invested_by = ?, reason = ?, amount = ? WHERE id = ?',
      [date, invested_by, reason, parseFloat(amount), id]
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Investment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Investment updated successfully' });
  } catch (error: any) {
    console.error('Failed to update investment:', error);
    return NextResponse.json({ error: 'Failed to update investment', details: error.message }, { status: 500 });
  } finally {
    await db.close();
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const db = await openDb();
  try {
    const { id } = params;

    const result = await db.run('DELETE FROM investments WHERE id = ?', [id]);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Investment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Investment deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete investment:', error);
    return NextResponse.json({ error: 'Failed to delete investment', details: error.message }, { status: 500 });
  } finally {
    await db.close();
  }
}
