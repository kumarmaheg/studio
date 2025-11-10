'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

interface InventoryItem {
  sku: string;
  name: string;
  category: string;
  stk_qty: number;
  low_stock_threshold: number;
}

export const columns = ({
  onEdit,
  onRemove,
  onReceive,
  onDispose,
}: {
  onEdit: (sku: string) => void;
  onRemove: (sku: string) => void;
  onReceive: (sku: string) => void;
  onDispose: (sku: string) => void;
}): ColumnDef<InventoryItem>[] => [
  { accessorKey: 'sku', header: 'Item Code' },
  { accessorKey: 'name', header: 'Item Name' },
  { accessorKey: 'category', header: 'Category' },
  {
    accessorKey: 'stk_qty',
    header: 'Stock',
    cell: ({ row }) => {
      const { stk_qty, low_stock_threshold } = row.original;

      if (stk_qty === null || stk_qty === undefined) {
        return null;
      }

      const isLowStock = stk_qty < low_stock_threshold;

      return (
        <div className="flex items-center">
          <span>{stk_qty}</span>
          {isLowStock && (
            <Badge variant="destructive" className="ml-2">
              Low
            </Badge>
          )}
        </div>
      );
    },
  },
  { accessorKey: 'low_stock_threshold', header: 'Low Stock Threshold' },
  {
    id: 'actions',
    cell: ({ row }) => (
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
            <DropdownMenuItem onClick={() => onEdit(row.original.sku)}>
              Edit Item
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onReceive(row.original.sku)}>
              Receive Stock
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDispose(row.original.sku)}>
              Dispose Stock
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => onRemove(row.original.sku)}
            >
              Remove Inventory
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
