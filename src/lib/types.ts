
export type Sale = {
  id: number;
  product?: string;
  quantity: number;
  price: number;
  customer: string;
  date: string;
  item_name: string;
  sku: string;
  category: string;
  purchase_price: number;
  discount: number;
  final_price: number;
  profit_amount: number;
};

export type Purchase = {
  id: number;
  supplier: string;
  sku: string;
  item_name?: string;
  category: string;
  quantity: number;
  purchase_price: number;
  total: number;
  status: 'Pending' | 'Ordered' | 'Received' | 'Cancelled';
  date: string;
};

export type InventoryItem = {
  id: number;
  name: string;
  sku: string;
  category: string;
  stk_qty: number;
  low_stock_threshold: number;
  purchase_price: number;
  selling_price: number;
};

export type Expense = {
  id: number;
  date: string;
  category: 'Rent' | 'Utilities' | 'Salaries' | 'Marketing' | 'Supplies' | 'Other';
  amount: number;
  description: string;
};

export type Investment = {
  id: number;
  date: string;
  amount: number;
  reason: string;
  invested_by: string;
};
