'use client';

import type { Expense } from '@/lib/types';
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
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'description', header: 'Description' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: (row: Expense) => (
      <div className="font-medium text-right">
        {row.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
      </div>
    ),
  },
  {
    accessorKey: 'actions',
    header: '',
    cell: (row: Expense) => (
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
            <DropdownMenuItem>Edit Expense</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete Expense</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
