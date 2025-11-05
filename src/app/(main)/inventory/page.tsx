'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { inventory } from '@/lib/data';
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

export default function InventoryPage() {
  return (
    <>
      <PageHeader title="Inventory">
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add Inventory Item</SheetTitle>
              <SheetDescription>
                Add a new item to your shop's inventory.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">{/* Add Inventory Form will go here */}</div>
          </SheetContent>
        </Sheet>
      </PageHeader>
      <DataTable columns={columns} data={inventory} />
    </>
  );
}
