import type { Sale, Purchase, InventoryItem, Expense, Investment } from '@/lib/types';

export const sales: Sale[] = [];

export const purchases: Purchase[] = [];

export const inventory: InventoryItem[] = [];

export const expenses: Expense[] = [];

export const investments: Investment[] = [];

export const financialOverview = {
  totalRevenue: 0,
  cogs: 0,
  grossProfit: 0,
  totalExpenses: 0,
  netProfit: 0,
  totalInvestment: 0,
};

export const profitLossData: { month: string; profit: number; loss: number }[] = [];

export const recentTransactions: { id: string | number; description: string; amount: number; type: 'credit' | 'debit' }[] = [];
