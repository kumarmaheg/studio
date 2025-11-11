import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET() {
  const db = await openDb();
  try {
    const salesData = await db.all('SELECT final_price FROM sales');
    const expensesData = await db.all('SELECT amount FROM expenses');
    const investmentsData = await db.all('SELECT amount FROM investments');

    const totalRevenue = salesData.reduce((acc, sale) => acc + (sale.final_price || 0), 0);
    const totalExpenses = expensesData.reduce((acc, expense) => acc + (expense.amount || 0), 0);
    const totalInvestment = investmentsData.reduce((acc, investment) => acc + (investment.amount || 0), 0);
    
    // For net profit, we need COGS. This is simplified for now.
    // Assuming profit_amount on sales is net profit for that sale.
    const netProfitData = await db.all('SELECT profit_amount FROM sales');
    const netProfit = netProfitData.reduce((acc, sale) => acc + (sale.profit_amount || 0), 0);

    const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

    return NextResponse.json({
      totalRevenue,
      netProfit,
      totalExpenses,
      roi,
    });
  } catch (error) {
    console.error('Failed to fetch dashboard overview:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard overview' }, { status: 500 });
  } finally {
    await db.close();
  }
}
