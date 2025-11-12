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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useEffect, useState } from 'react';
import type { Expense } from '@/lib/types';
import { AddExpenseForm } from './add-expense-form';
import { useToast } from '@/hooks/use-toast';

export default function ExpensesPage() {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [expenseIdToDelete, setExpenseIdToDelete] = useState<number | null>(null);

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

  const handleAddClick = () => {
    setExpenseToEdit(null);
    setIsSheetOpen(true);
  };

  const handleEditClick = (expense: Expense) => {
    setExpenseToEdit(expense);
    setIsSheetOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setExpenseIdToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!expenseIdToDelete) return;
    try {
      const response = await fetch(`/api/expenses/${expenseIdToDelete}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Expense deleted successfully.',
        });
        fetchExpenses();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete expense.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to connect to the server.',
      });
    } finally {
      setIsDeleteAlertOpen(false);
      setExpenseIdToDelete(null);
    }
  };

  const handleSuccess = () => {
    setIsSheetOpen(false);
    setExpenseToEdit(null);
    fetchExpenses();
  };

  return (
    <>
      <PageHeader title="Expenses">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={handleAddClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{expenseToEdit ? 'Edit Expense' : 'Add New Expense'}</SheetTitle>
              <SheetDescription>
                {expenseToEdit ? 'Update the details of your business expense.' : 'Record a new business expense.'}
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <AddExpenseForm
                key={expenseToEdit ? expenseToEdit.id : 'new'}
                onSuccess={handleSuccess}
                expenseToEdit={expenseToEdit}
              />
            </div>
          </SheetContent>
        </Sheet>
      </PageHeader>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable
          columns={columns({ onEdit: handleEditClick, onDelete: handleDeleteClick })}
          data={expenses}
        />
      )}
       <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this expense record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setExpenseIdToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Yes, delete it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
