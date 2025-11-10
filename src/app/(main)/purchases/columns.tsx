'use client';

import type { Purchase } from '@/lib/types';
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
import { type ColumnDef } from '@tanstack/react-table';

const statusVariantMap: { [key: string]: string } = {
  Pending: 'secondary',
  Ordered: 'outline',
  Received: 'default',
  Cancelled: 'destructive',
};

export const columns: ColumnDef<Purchase>[] = [
  { accessorKey: 'id', header: 'PO ID' },
  { accessorKey: 'supplier', header: 'Supplier' },
  { accessorKey: 'itemName', header: 'Item Name' },
  {
    accessorKey: 'total',
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => (
      <div className="font-medium text-right">
        {row.original.total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={statusVariantMap[row.original.status] as any}>{row.original.status}</Badge>
    ),
  },
  { accessorKey: 'date', header: 'Date' },
  {
    id: 'actions',
    cell: ({ row }) => {
      const purchase = row.original;
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
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Mark as Received</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
    )},
  },
];
