import { openDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  const db = await openDb();
  try {
    const investments = await db.all('SELECT id, date, invested_by, reason, amount FROM investments ORDER BY date DESC');
    return NextResponse.json(investments);
  } finally {
    await db.close();
  }
}

export async function POST(req: NextRequest) {
  const db = await openDb();
  const body = await req.json();
  const { date, reason, invested_by, amount } = body;

  if (!date || !amount) {
    await db.close();
    return NextResponse.json({ error: 'Date and amount are required' }, { status: 400 });
  }

  try {
    const result = await db.run(
      'INSERT INTO investments (date, invested_by, reason, amount) VALUES (?, ?, ?, ?)',
      [date, invested_by, reason, parseFloat(amount)]
    );
    
    return NextResponse.json({ id: result.lastID });
  } catch (error: any) {
    console.error('Failed to create investment:', error);
    return NextResponse.json({ error: 'Failed to create investment', details: error.message }, { status: 500 });
  } finally {
    await db.close();
  }
}
