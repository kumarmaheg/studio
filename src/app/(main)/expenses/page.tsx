'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
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
import { useEffect, useState } from 'react';
import type { Expense } from '@/lib/types';
import { AddExpenseForm } from './add-expense-form';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    setLoading(true);
    const res = await fetch('/api/expenses');
    if (res.ok) {
      const data = await res.json();
      setExpenses(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleExpenseAdded = () => {
    setIsSheetOpen(false);
    fetchExpenses();
  };

  return (
    <>
      <PageHeader title="Expenses">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={() => setIsSheetOpen(true)}>
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
            <div className="py-4">
              <AddExpenseForm onExpenseAdded={handleExpenseAdded} />
            </div>
          </SheetContent>
        </Sheet>
      </PageHeader>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={expenses} />
      )}
    </>
  );
}
