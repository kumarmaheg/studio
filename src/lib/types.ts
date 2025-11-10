
export type Sale = {
  id: number;
  product?: string;
  quantity: number;
  price: number;
  customer: string;
  date: string;
  item_name: string;
  sku: string;
  purchase_price: number;
  discount: number;
  final_price: number;
  profit_amount: number;
};

export type Purchase = {
  id: string;
  supplier: string;
  itemName: string;
  quantity: number;
  price: number;
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
  lowStockThreshold: number;
  purchase_price: number;
  selling_price: number;
};

export type Expense = {
  id: string;
  date: string;
  category: 'Rent' | 'Utilities' | 'Salaries' | 'Marketing' | 'Supplies' | 'Other';
  amount: number;
  description: string;
};

export type Investment = {
  id:string;
  date: string;
  amount: number;
  description: string;
};
