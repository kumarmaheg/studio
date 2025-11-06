'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export function AddSaleForm({ onSaleAdded }: { onSaleAdded: () => void }) {
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [customer, setCustomer] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newSale = {
      product,
      quantity: parseInt(quantity, 10),
      price: parseFloat(price),
      customer,
    };

    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSale),
    });

    if (res.ok) {
      onSaleAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="product" className="text-right">
          Product
        </Label>
        <Input
          id="product"
          name="product"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="quantity" className="text-right">
          Quantity
        </Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="price" className="text-right">
          Price
        </Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="customer" className="text-right">
          Customer
        </Label>
        <Input
          id="customer"
          name="customer"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="col-span-3"
        />
      </div>
      <Button type="submit" className="w-full">
        Add Sale
      </Button>
    </form>
  );
}
