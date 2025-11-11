'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { InventoryItem } from '@/lib/types';

type AddPurchaseFormProps = {
  onPurchaseAdded: () => void;
};

export function AddPurchaseForm({ onPurchaseAdded }: AddPurchaseFormProps) {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedSku, setSelectedSku] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState('1');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [supplier, setSupplier] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchInventory() {
      const res = await fetch('/api/inventory');
      if (res.ok) {
        const data = await res.json();
        setInventory(data);
      }
    }
    fetchInventory();
  }, []);

  const selectedItem = selectedSku ? inventory.find((item) => item.sku === selectedSku) : null;
  const itemName = selectedItem?.name ?? '';
  const total = (parseFloat(purchasePrice) || 0) * (parseInt(quantity, 10) || 0);

  useEffect(() => {
    if (selectedItem) {
      setPurchasePrice(String(selectedItem.purchase_price || ''));
    } else {
      setPurchasePrice('');
    }
  }, [selectedItem]);

  const handleSkuChange = (sku: string) => {
    setSelectedSku(sku);
  };

  const resetForm = () => {
    setSelectedSku(undefined);
    setQuantity('1');
    setPurchasePrice('');
    setSupplier('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!selectedItem) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select an item.',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sku: selectedItem.sku,
          supplier,
          quantity: parseInt(quantity, 10),
          purchase_price: parseFloat(purchasePrice),
          date,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Purchase order added successfully.',
        });
        onPurchaseAdded();
        resetForm();
      } else {
        const errorData = await response.json();
        toast({
          variant: 'destructive',
          title: 'Error adding purchase order',
          description: errorData.error || 'An unexpected error occurred.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to connect to the server.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="itemCode" className="text-right">
          Item
        </Label>
        <Select onValueChange={handleSkuChange} value={selectedSku}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            {inventory.map((item) => (
              <SelectItem key={item.id} value={item.sku}>
                {item.name} ({item.sku})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="supplier" className="text-right">
          Supplier
        </Label>
        <Input
          id="supplier"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          className="col-span-3"
        />
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
          min="1"
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
        <Label htmlFor="total" className="text-right">
          Total
        </Label>
        <Input
          id="total"
          type="number"
          value={total.toFixed(2)}
          className="col-span-3"
          readOnly
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            'Add Purchase Order'
          )}
        </Button>
      </div>
    </form>
  );
}
