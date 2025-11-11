
'use client';

import type { Sale } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: 'id',
    header: 'Sale ID',
  },
  {
    accessorKey: 'item_name',
    header: 'Item Name',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
  },
  {
    accessorKey: 'price',
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      const formatted = date.toLocaleDateString();
      return <div>{formatted}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const sale = row.original;

      return (
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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(String(sale.id))}
              >
                Copy sale ID
              </DropdownMenuItem>
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Edit Sale</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete Sale
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
