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
import { AddSaleForm } from './add-sale-form';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  async function fetchSales() {
    const res = await fetch('/api/sales');
    const data = await res.json();
    setSales(data);
  }

  useEffect(() => {
    fetchSales();
  }, []);

  const handleSaleAdded = () => {
    fetchSales();
    setIsSheetOpen(false);
  };

  return (
    <div>
      <PageHeader title="Sales">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={() => setIsSheetOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Sale
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Sale</SheetTitle>
              <SheetDescription>
                Record a new sales transaction. Fill in the details below.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <AddSaleForm onSaleAdded={handleSaleAdded} />
            </div>
          </SheetContent>
        </Sheet>
      </PageHeader>
      <DataTable columns={columns} data={sales} />
    </div>
  );
}
