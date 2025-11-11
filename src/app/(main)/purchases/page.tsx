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
import { AddPurchaseForm } from './add-purchase-form';
import { useToast } from '@/hooks/use-toast';
import type { Purchase } from '@/lib/types';

export default function PurchasesPage() {
  const { toast } = useToast();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const fetchPurchases = async () => {
    const res = await fetch('/api/purchases');
    if (res.ok) {
      const data = await res.json();
      setPurchases(data);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handlePurchaseAdded = () => {
    fetchPurchases();
    setIsSheetOpen(false);
  };

  const handleStatusChange = async (id: number, status: string) => {
    const res = await fetch(`/api/purchases/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      toast({
        title: 'Success',
        description: `Purchase order status updated to ${status}. ${status === 'Received' ? 'Inventory updated.' : ''}`,
      });
      fetchPurchases();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update purchase order status.',
      });
    }
  };

  return (
    <>
      <PageHeader title="Purchases">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={() => setIsSheetOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Purchase Order
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create Purchase Order</SheetTitle>
              <SheetDescription>
                Fill in the details to create a new purchase order.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <AddPurchaseForm onPurchaseAdded={handlePurchaseAdded} />
            </div>
          </SheetContent>
        </Sheet>
      </PageHeader>
      <DataTable columns={columns({ onStatusChange: handleStatusChange })} data={purchases} />
    </>
  );
}
