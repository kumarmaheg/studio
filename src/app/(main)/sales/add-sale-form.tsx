'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { InventoryItem } from '@/lib/types';
import { useEffect, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AddSaleForm({ onSaleAdded }: { onSaleAdded: () => void }) {
  const [itemName, setItemName] = useState('');
  const [itemCode, setItemCode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [customer, setCustomer] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      setInventory(data);
    };

    fetchInventory();
  }, []);

  const handleItemSelect = (currentItemName: string) => {
    const selectedItem = inventory.find(
      (item) => item.name.toLowerCase() === currentItemName.toLowerCase()
    );
    if (selectedItem) {
      setItemName(selectedItem.name);
      setItemCode(selectedItem.sku);
    }
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedItem = inventory.find((item) => item.name === itemName);

    if (!selectedItem) {
      console.error('Invalid item selected');
      return;
    }

    const newSale = {
      product: selectedItem.id,
      quantity: parseInt(quantity, 10),
      price: parseFloat(price),
      customer,
      date,
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
        <Label htmlFor="itemName" className="text-right">
          Item Name
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="col-span-3 justify-between"
            >
              {itemName
                ? inventory.find((item) => item.name === itemName)?.name
                : 'Select an item'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Search item..." />
              <CommandEmpty>No item found.</CommandEmpty>
              <CommandGroup>
                {inventory.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={handleItemSelect}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        itemName === item.name ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {item.name} ({item.sku})
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="itemCode" className="text-right">
          Item Code
        </Label>
        <Input
          id="itemCode"
          name="itemCode"
          value={itemCode}
          className="col-span-3"
          readOnly
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="date" className="text-right">
          Date
        </Label>
        <Input
          id="date"
          name="date"
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
