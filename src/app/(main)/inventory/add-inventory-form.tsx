'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';

// Define the shape of an inventory item
interface InventoryItem {
  sku?: string;
  name: string;
  description?: string;
  category: string;
  purchase_price: number;
  selling_price: number;
  stk_date: string;
  stk_qty: number;
  low_stock_threshold: number;
}

export function AddInventoryForm({
  onItemAdded,
  onItemUpdated,
  initialSku,
  itemToEdit,
}: {
  onItemAdded: () => void;
  onItemUpdated: () => void;
  initialSku: string;
  itemToEdit: InventoryItem | null;
}) {
  const [itemName, setItemName] = useState('');
  const [itemCode, setItemCode] = useState(initialSku);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stkDate, setStkDate] = useState(new Date().toISOString().split('T')[0]);
  const [stkQty, setStkQty] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!itemToEdit;

  useEffect(() => {
    if (isEditMode && itemToEdit) {
      setItemName(itemToEdit.name);
      setItemCode(itemToEdit.sku || '');
      setCategory(itemToEdit.category);
      setDescription(itemToEdit.description || '');
      setPurchasePrice(String(itemToEdit.purchase_price));
      setSellingPrice(String(itemToEdit.selling_price));
      setStkDate(itemToEdit.stk_date.split('T')[0]);
      setStkQty(String(itemToEdit.stk_qty));
      setLowStockThreshold(String(itemToEdit.low_stock_threshold));
    } else {
      setItemCode(initialSku);
    }
  }, [itemToEdit, isEditMode, initialSku]);

  const balanceQty = parseInt(stkQty, 10) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const inventoryItemData = {
      name: itemName,
      description,
      category,
      purchase_price: parseFloat(purchasePrice),
      selling_price: parseFloat(sellingPrice),
      stk_date: stkDate,
      stk_qty: parseInt(stkQty, 10),
      low_stock_threshold: parseInt(lowStockThreshold, 10),
    };

    try {
      const url = isEditMode ? `/api/inventory/${itemCode}` : '/api/inventory';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inventoryItemData),
      });

      if (res.ok) {
        if (isEditMode) {
          onItemUpdated();
        } else {
          onItemAdded();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="itemCode" className="text-right">
          Item Code
        </Label>
        <Input id="itemCode" value={itemCode} className="col-span-3" readOnly />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="itemName" className="text-right">
          Item Name
        </Label>
        <Input
          id="itemName"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="col-span-3"
        />
      </div>
       <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category
        </Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="purchasePrice" className="text-right">
          Purchase Price
        </Label>
        <Input
          id="purchasePrice"
          type="number"
          step="0.01"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="sellingPrice" className="text-right">
          Selling Price
        </Label>
        <Input
          id="sellingPrice"
          type="number"
          step="0.01"
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="stkDate" className="text-right">
          STK Date
        </Label>
        <Input
          id="stkDate"
          type="date"
          value={stkDate}
          onChange={(e) => setStkDate(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="stkQty" className="text-right">
          STK QTY
        </Label>
        <Input
          id="stkQty"
          type="number"
          value={stkQty}
          onChange={(e) => setStkQty(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Balance Qty</Label>
        <Input value={balanceQty} className="col-span-3" readOnly />
      </div>
       <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="lowStockThreshold" className="text-right">
            Low Stock Threshold
        </Label>
        <Input
            id="lowStockThreshold"
            type="number"
            value={lowStockThreshold}
            onChange={(e) => setLowStockThreshold(e.target.value)}
            className="col-span-3"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? isEditMode
            ? 'Saving...'
            : 'Adding...'
          : isEditMode
          ? 'Save Changes'
          : 'Add Inventory'}
      </Button>
    </form>
  );
}
