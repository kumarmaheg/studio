import { openDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  const db = await openDb();
  try {
    const expenses = await db.all('SELECT * FROM expenses ORDER BY date DESC');
    return NextResponse.json(expenses);
  } finally {
    await db.close();
  }
}

export async function POST(req: NextRequest) {
  const db = await openDb();
  const body = await req.json();
  const { date, category, description, amount } = body;

  if (!date || !category || !amount) {
    await db.close();
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const result = await db.run(
      'INSERT INTO expenses (date, category, description, amount) VALUES (?, ?, ?, ?)',
      [date, category, description, parseFloat(amount)]
    );
    
    return NextResponse.json({ id: result.lastID });
  } catch (error: any) {
    console.error('Failed to create expense:', error);
    return NextResponse.json({ error: 'Failed to create expense', details: error.message }, { status: 500 });
  } finally {
    await db.close();
  }
}
