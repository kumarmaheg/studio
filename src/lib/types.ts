export type Sale = {
  id: string | number;
  product: string;
  quantity: number;
  price: number;
  customer: string;
  date: string;
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
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  lowStockThreshold: number;
  price: number;
  sale_price: number;
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
