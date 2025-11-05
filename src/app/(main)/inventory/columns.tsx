'use client';

import type { InventoryItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const columns = [
  { accessorKey: 'sku', header: 'SKU' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'category', header: 'Category' },
  {
    accessorKey: 'stock',
    header: 'Stock',
    cell: (row: InventoryItem) => {
      const isLowStock = row.stock < row.lowStockThreshold;
      return (
        <div className="flex items-center">
          <span>{row.stock}</span>
          {isLowStock && <Badge variant="destructive" className="ml-2">Low</Badge>}
        </div>
      );
    },
  },
  { accessorKey: 'lowStockThreshold', header: 'Low Stock Threshold' },
  {
    accessorKey: 'actions',
    header: '',
    cell: (row: InventoryItem) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Receive Stock</DropdownMenuItem>
            <DropdownMenuItem>Dispose Stock</DropdownMenuItem>
            <DropdownMenuItem>Edit Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
