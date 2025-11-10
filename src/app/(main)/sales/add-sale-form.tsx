'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  purchase_price: number;
  selling_price: number;
  [key: string]: any;
}

type AddSaleFormProps = {
  onSaleAdded: () => void;
};

export function AddSaleForm({ onSaleAdded }: AddSaleFormProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedSku, setSelectedSku] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState('1');
  const [sellingPrice, setSellingPrice] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [discount, setDiscount] = useState('0');
  const [customer, setCustomer] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    async function fetchInventory() {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      setInventory(data);
    }
    fetchInventory();
  }, []);

  const selectedItem = selectedSku
    ? inventory.find((item) => item.sku === selectedSku)
    : null;

  const itemName = selectedItem?.name ?? '';
  
  useEffect(() => {
    if (selectedItem) {
      setPurchasePrice(String(selectedItem.purchase_price || ''));
      setSellingPrice(String(selectedItem.selling_price || ''));
    } else {
        setPurchasePrice('');
        setSellingPrice('');
    }
  }, [selectedItem]);

  const numericQuantity = parseFloat(quantity) || 0;
  const numericSellingPrice = parseFloat(sellingPrice) || 0;
  const numericDiscount = parseFloat(discount) || 0;
  const numericPurchasePrice = parseFloat(purchasePrice) || 0;

  const finalPrice = numericSellingPrice * numericQuantity - numericDiscount;
  const profitAmount = finalPrice - numericPurchasePrice * numericQuantity;

  const handleSkuChange = (sku: string) => {
    setSelectedSku(sku);
  };

  const resetForm = () => {
    setSelectedSku(undefined);
    setQuantity('1');
    setSellingPrice('');
    setPurchasePrice('');
    setDiscount('0');
    setCustomer('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedItem) {
      console.error('No item selected');
      return;
    }

    const response = await fetch('/api/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product: selectedItem.id,
        quantity: parseInt(quantity, 10),
        price: numericSellingPrice,
        customer,
        date,
        item_name: selectedItem.name,
        item_code: selectedItem.sku,
        purchase_price: numericPurchasePrice,
        discount: numericDiscount,
        final_price: finalPrice,
        profit_amount: profitAmount,
      }),
    });

    if (response.ok) {
      onSaleAdded();
      resetForm();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="itemCode" className="text-right">
            Item Code
          </Label>
          <Select onValueChange={handleSkuChange} value={selectedSku}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select an item code" />
            </SelectTrigger>
            <SelectContent>
              {inventory.map((item) => (
                <SelectItem key={item.id} value={item.sku}>
                  {item.sku}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="itemName" className="text-right">
            Item Name
          </Label>
          <Input id="itemName" value={itemName} className="col-span-3" readOnly />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="date" className="text-right">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="quantity" className="text-right">
            Quantity
          </Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
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
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className="col-span-3"
            readOnly
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
          <Label htmlFor="discount" className="text-right">
            Discount
          </Label>
          <Input
            id="discount"
            type="number"
            step="0.01"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="finalPrice" className="text-right">
            Final Price
          </Label>
          <Input
            id="finalPrice"
            type="number"
            value={finalPrice.toFixed(2)}
            className="col-span-3"
            readOnly
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="profitAmount" className="text-right">
            Profit Amount
          </Label>
          <Input
            id="profitAmount"
            type="number"
            value={profitAmount.toFixed(2)}
            className="col-span-3"
            readOnly
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="customer" className="text-right">
            Customer
          </Label>
          <Input
            id="customer"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Add Sale</Button>
        </div>
      </div>
    </form>
  );
}
