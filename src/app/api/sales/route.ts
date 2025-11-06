import { openDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  const db = await openDb();
  const sales = await db.all('SELECT * FROM sales');
  return NextResponse.json(sales);
}
