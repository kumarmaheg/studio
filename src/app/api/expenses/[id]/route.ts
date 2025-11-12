import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const db = await openDb();
  try {
    const { id } = params;
    const { date, category, description, amount } = await req.json();

    if (!date || !category || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await db.run(
      'UPDATE expenses SET date = ?, category = ?, description = ?, amount = ? WHERE id = ?',
      [date, category, description, parseFloat(amount), id]
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Expense updated successfully' });
  } catch (error: any) {
    console.error('Failed to update expense:', error);
    return NextResponse.json({ error: 'Failed to update expense', details: error.message }, { status: 500 });
  } finally {
    await db.close();
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const db = await openDb();
  try {
    const { id } = params;

    const result = await db.run('DELETE FROM expenses WHERE id = ?', [id]);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete expense:', error);
    return NextResponse.json({ error: 'Failed to delete expense', details: error.message }, { status: 500 });
  } finally {
    await db.close();
  }
}
