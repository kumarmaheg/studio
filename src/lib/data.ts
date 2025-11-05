import type { Sale, Purchase, InventoryItem, Expense, Investment } from '@/lib/types';

export const sales: Sale[] = [
  { id: 'S001', itemName: 'Pro Soccer Ball', quantity: 10, price: 25, tax: 12.5, total: 262.5, date: '2024-07-20' },
  { id: 'S002', itemName: 'Running Shoes', quantity: 5, price: 120, tax: 30, total: 630, date: '2024-07-20' },
  { id: 'S003', itemName: 'Yoga Mat', quantity: 20, price: 15, tax: 15, total: 315, date: '2024-07-19' },
  { id: 'S004', itemName: 'Basketball', quantity: 8, price: 30, tax: 12, total: 252, date: '2024-07-18' },
  { id: 'S005', itemName: 'Swim Goggles', quantity: 15, price: 10, tax: 7.5, total: 157.5, date: '2024-07-17' },
];

export const purchases: Purchase[] = [
  { id: 'P001', supplier: 'SportsGear Inc.', itemName: 'Pro Soccer Ball', quantity: 50, price: 15, total: 750, status: 'Received', date: '2024-07-15' },
  { id: 'P002', supplier: 'Footwear Co.', itemName: 'Running Shoes', quantity: 30, price: 80, total: 2400, status: 'Received', date: '2024-07-12' },
  { id: 'P003', supplier: 'Wellness Supply', itemName: 'Yoga Mat', quantity: 100, price: 8, total: 800, status: 'Ordered', date: '2024-07-20' },
  { id: 'P004', supplier: 'SportsGear Inc.', itemName: 'Basketball', quantity: 40, price: 18, total: 720, status: 'Pending', date: '2024-07-21' },
];

export const inventory: InventoryItem[] = [
  { id: 'I001', name: 'Pro Soccer Ball', sku: 'SSB-001', category: 'Soccer', stock: 40, lowStockThreshold: 20 },
  { id: 'I002', name: 'Running Shoes', sku: 'FRS-002', category: 'Running', stock: 25, lowStockThreshold: 10 },
  { id: 'I003', name: 'Yoga Mat', sku: 'WYM-003', category: 'Yoga', stock: 80, lowStockThreshold: 30 },
  { id: 'I004', name: 'Basketball', sku: 'SBB-004', category: 'Basketball', stock: 32, lowStockThreshold: 15 },
  { id: 'I005', name: 'Swim Goggles', sku: 'ASG-005', category: 'Swimming', stock: 35, lowStockThreshold: 20 },
  { id: 'I006', name: 'Tennis Racket', sku: 'STR-006', category: 'Tennis', stock: 15, lowStockThreshold: 10 },
];

export const expenses: Expense[] = [
  { id: 'E001', date: '2024-07-01', category: 'Rent', amount: 2000, description: 'Monthly shop rent' },
  { id: 'E002', date: '2024-07-05', category: 'Utilities', amount: 350, description: 'Electricity and water bills' },
  { id: 'E003', date: '2024-07-15', category: 'Salaries', amount: 5000, description: 'Staff salaries for July' },
  { id: 'E004', date: '2024-07-18', category: 'Marketing', amount: 500, description: 'Social media campaign' },
];

export const investments: Investment[] = [
    { id: 'INV001', date: '2023-01-15', amount: 50000, description: 'Initial Capital Investment' },
    { id: 'INV002', date: '2024-06-01', amount: 10000, description: 'Additional Investment for Expansion' },
];

export const financialOverview = {
  totalRevenue: sales.reduce((acc, sale) => acc + sale.total, 0),
  cogs: purchases.filter(p => p.status === 'Received').reduce((acc, purchase) => acc + purchase.total, 0),
  grossProfit: sales.reduce((acc, sale) => acc + sale.total, 0) - purchases.filter(p => p.status === 'Received').reduce((acc, purchase) => acc + purchase.total, 0),
  totalExpenses: expenses.reduce((acc, expense) => acc + expense.amount, 0),
  netProfit: (sales.reduce((acc, sale) => acc + sale.total, 0) - purchases.filter(p => p.status === 'Received').reduce((acc, purchase) => acc + purchase.total, 0)) - expenses.reduce((acc, expense) => acc + expense.amount, 0),
  totalInvestment: investments.reduce((acc, inv) => acc + inv.amount, 0),
};

export const profitLossData = [
  { month: 'Jan', profit: 2200, loss: 500 },
  { month: 'Feb', profit: 2800, loss: 700 },
  { month: 'Mar', profit: 3500, loss: 600 },
  { month: 'Apr', profit: 3200, loss: 800 },
  { month: 'May', profit: 4100, loss: 400 },
  { month: 'Jun', profit: 4500, loss: 300 },
];

export const recentTransactions = [
  ...sales.slice(0, 2).map(s => ({ id: s.id, description: `Sale of ${s.quantity} x ${s.itemName}`, amount: s.total, type: 'credit' as const })),
  ...expenses.slice(0, 2).map(e => ({ id: e.id, description: e.description, amount: e.amount, type: 'debit' as const })),
  ...purchases.slice(0, 1).map(p => ({ id: p.id, description: `PO for ${p.quantity} x ${p.itemName}`, amount: p.total, type: 'debit' as const })),
];
