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
import type { Investment } from '@/lib/types';
import { AddInvestmentForm } from './add-investment-form';
import { useToast } from '@/hooks/use-toast';

export default function InvestmentsPage() {
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [investmentToEdit, setInvestmentToEdit] = useState<Investment | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [investmentIdToDelete, setInvestmentIdToDelete] = useState<number | null>(null);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/investments');
      if (res.ok) {
        const data = await res.json();
        setInvestments(data);
      } else {
        console.error('Failed to fetch investments');
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);
  
  const handleAddClick = () => {
    setInvestmentToEdit(null);
    setIsSheetOpen(true);
  };

  const handleEditClick = (investment: Investment) => {
    setInvestmentToEdit(investment);
    setIsSheetOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setInvestmentIdToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!investmentIdToDelete) return;
    try {
      const response = await fetch(`/api/investments/${investmentIdToDelete}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Investment deleted successfully.',
        });
        fetchInvestments();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete investment.',
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
      setInvestmentIdToDelete(null);
    }
  };

  const handleSuccess = () => {
    setIsSheetOpen(false);
    setInvestmentToEdit(null);
    fetchInvestments();
  };

  return (
    <>
      <PageHeader title="Investments">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={handleAddClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Investment
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{investmentToEdit ? 'Edit Investment' : 'Add New Investment'}</SheetTitle>
              <SheetDescription>
                {investmentToEdit ? 'Update the details of your business investment.' : 'Record a new investment into the business.'}
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <AddInvestmentForm
                key={investmentToEdit ? investmentToEdit.id : 'new'}
                onSuccess={handleSuccess}
                investmentToEdit={investmentToEdit}
              />
            </div>
          </SheetContent>
        </Sheet>
      </PageHeader>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns({ onEdit: handleEditClick, onDelete: handleDeleteClick })} data={investments} />
      )}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this investment record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setInvestmentIdToDelete(null)}>
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
