'use client';

import type { Investment } from '@/lib/types';
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
  { accessorKey: 'description', header: 'Description' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: (row: Investment) => (
      <div className="font-medium text-right">
        {row.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
      </div>
    ),
  },
  {
    accessorKey: 'actions',
    header: '',
    cell: (row: Investment) => (
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
            <DropdownMenuItem>Edit Investment</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete Investment</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
