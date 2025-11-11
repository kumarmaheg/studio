import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';
import { format, subMonths, getMonth } from 'date-fns';

export async function GET() {
  const db = await openDb();
  try {
    const sixMonthsAgo = format(subMonths(new Date(), 5), 'yyyy-MM-01');
    
    const sales = await db.all('SELECT date, profit_amount FROM sales WHERE date >= ?', [sixMonthsAgo]);
    const expenses = await db.all('SELECT date, amount FROM expenses WHERE date >= ?', [sixMonthsAgo]);

    const monthlyData: { [key: string]: { profit: number; loss: number } } = {};

    for (let i = 5; i >= 0; i--) {
      const month = format(subMonths(new Date(), i), 'MMM');
      monthlyData[month] = { profit: 0, loss: 0 };
    }

    sales.forEach(sale => {
      const saleDate = new Date(sale.date);
      const month = format(saleDate, 'MMM');
      if (monthlyData[month]) {
        monthlyData[month].profit += sale.profit_amount || 0;
      }
    });

    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const month = format(expenseDate, 'MMM');
      if (monthlyData[month]) {
        monthlyData[month].loss += expense.amount || 0;
      }
    });

    const profitLossData = Object.entries(monthlyData).map(([month, { profit, loss }]) => ({
      month,
      profit,
      loss,
    }));

    return NextResponse.json(profitLossData);
  } catch (error) {
    console.error('Failed to fetch profit/loss data:', error);
    return NextResponse.json({ error: 'Failed to fetch profit/loss data' }, { status: 500 });
  } finally {
    await db.close();
  }
}
