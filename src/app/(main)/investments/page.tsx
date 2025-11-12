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
import type { Investment } from '@/lib/types';
import { AddInvestmentForm } from './add-investment-form';

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleSuccess = () => {
    setIsSheetOpen(false);
    fetchInvestments();
  };

  return (
    <>
      <PageHeader title="Investments">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={() => setIsSheetOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Investment
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Investment</SheetTitle>
              <SheetDescription>
                Record a new investment into the business.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <AddInvestmentForm onSuccess={handleSuccess} />
            </div>
          </SheetContent>
        </Sheet>
      </PageHeader>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={investments} />
      )}
    </>
  );
}
