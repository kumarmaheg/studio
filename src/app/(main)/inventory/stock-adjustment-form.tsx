'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface StockAdjustmentFormProps {
  sku: string;
  action: 'receive' | 'dispose';
  onSuccess: () => void;
  onCancel: () => void;
}

export function StockAdjustmentForm({
  sku,
  action,
  onSuccess,
  onCancel,
}: StockAdjustmentFormProps) {
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch('/api/inventory/adjust-stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku, quantity: action === 'receive' ? quantity : -quantity }),
    });
    if (res.ok) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
