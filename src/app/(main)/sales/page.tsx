'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { sales } from '@/lib/data';
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

export default function SalesPage() {
  return (
    <>
      <PageHeader title="Sales">
        <Sheet>
          <SheetTrigger asChild>
            <Button>
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
            <div className="py-4">{/* Add Sale Form will go here */}</div>
          </SheetContent>
        </Sheet>
      </PageHeader>
      <DataTable columns={columns} data={sales} />
    </>
  );
}
