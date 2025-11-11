import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET() {
  const db = await openDb();
  try {
    const sales = await db.all("SELECT id, item_name, quantity, final_price, date FROM sales ORDER BY date DESC, id DESC LIMIT 5");
    const expenses = await db.all("SELECT id, description, amount, date FROM expenses ORDER BY date DESC, id DESC LIMIT 5");

    const salesTransactions = sales.map(s => ({
      id: `sale-${s.id}`,
      description: `Sale of ${s.quantity} x ${s.item_name}`,
      amount: s.final_price,
      type: 'credit' as const,
      date: new Date(s.date)
    }));

    const expenseTransactions = expenses.map(e => ({
      id: `exp-${e.id}`,
      description: e.description,
      amount: e.amount,
      type: 'debit' as const,
      date: new Date(e.date)
    }));

    const allTransactions = [...salesTransactions, ...expenseTransactions];

    allTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());

    return NextResponse.json(allTransactions.slice(0, 5));
  } catch (error) {
    console.error('Failed to fetch recent transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch recent transactions' }, { status: 500 });
  } finally {
    await db.close();
  }
}
