'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { expenses } from '@/lib/data';
import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function ExpensesPage() {
  return (
    <>
      <PageHeader title="Expenses">
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Expense</SheetTitle>
              <SheetDescription>
                Record a new business expense.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">{/* Add Expense Form will go here */}</div>
          </SheetContent>
        </Sheet>
      </PageHeader>
      <DataTable columns={columns} data={expenses} />
    </>
  );
}
