'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { investments } from '@/lib/data';
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

export default function InvestmentsPage() {
  return (
    <>
      <PageHeader title="Investments">
        <Sheet>
          <SheetTrigger asChild>
            <Button>
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
            <div className="py-4">{/* Add Investment Form will go here */}</div>
          </SheetContent>
        </Sheet>
      </PageHeader>
      <DataTable columns={columns} data={investments} />
    </>
  );
}
