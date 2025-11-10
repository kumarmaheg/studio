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
import { AddInventoryForm } from './add-inventory-form';
import { StockAdjustmentForm } from './stock-adjustment-form';
import { useEffect, useState } from 'react';

// Define the shape of an inventory item
interface InventoryItem {
  sku: string;
  name: string;
  description?: string;
  category: string;
  purchase_price: number;
  selling_price: number;
  stk_date: string;
  stk_qty: number;
  low_stock_threshold: number;
}

export default function InventoryPage() {
  const [nextSku, setNextSku] = useState('');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
  const [isRemoveAlertOpen, setIsRemoveAlertOpen] = useState(false);
  const [skuToRemove, setSkuToRemove] = useState<string | null>(null);
  const [isStockAdjustmentSheetOpen, setIsStockAdjustmentSheetOpen] = useState(false);
  const [stockAdjustmentAction, setStockAdjustmentAction] = useState<'receive' | 'dispose'>('receive');
  const [skuToAdjust, setSkuToAdjust] = useState<string | null>(null);

  const fetchInventory = async () => {
    setLoading(true);
    const res = await fetch('/api/inventory');
    if (res.ok) {
      const data = await res.json();
      setInventory(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddInventoryClick = async () => {
    setItemToEdit(null);
    const res = await fetch('/api/inventory/next-sku');
    if (res.ok) {
      const data = await res.json();
      setNextSku(data.sku);
      setIsSheetOpen(true);
    }
  };

  const handleEditItem = async (sku: string) => {
    const res = await fetch(`/api/inventory/${sku}`);
    if (res.ok) {
      const data = await res.json();
      setItemToEdit(data);
      setIsSheetOpen(true);
    }
  };

  const handleRemoveItem = (sku: string) => {
    setSkuToRemove(sku);
    setIsRemoveAlertOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (skuToRemove) {
      const res = await fetch(`/api/inventory/${skuToRemove}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchInventory();
        setSkuToRemove(null);
        setIsRemoveAlertOpen(false);
      }
    }
  };

  const handleItemAdded = () => {
    setIsSheetOpen(false);
    fetchInventory();
  };

  const handleItemUpdated = () => {
    setIsSheetOpen(false);
    setItemToEdit(null);
    fetchInventory();
  };

  const handleReceiveStock = (sku: string) => {
    setSkuToAdjust(sku);
    setStockAdjustmentAction('receive');
    setIsStockAdjustmentSheetOpen(true);
  };

  const handleDisposeStock = (sku: string) => {
    setSkuToAdjust(sku);
    setStockAdjustmentAction('dispose');
    setIsStockAdjustmentSheetOpen(true);
  };

  const handleStockAdjustmentSuccess = () => {
    setIsStockAdjustmentSheetOpen(false);
    fetchInventory();
  };

  return (
    <>
      <PageHeader title="Inventory">
        <div className="flex items-center gap-4">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button onClick={handleAddInventoryClick}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Inventory
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  {itemToEdit ? 'Edit Inventory Item' : 'Add Inventory Item'}
                </SheetTitle>
                <SheetDescription>
                  {itemToEdit
                    ? 'Update the details of your inventory item.'
                    : "Add a new item to your shop's inventory."}
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <AddInventoryForm
                  onItemAdded={handleItemAdded}
                  onItemUpdated={handleItemUpdated}
                  initialSku={nextSku}
                  itemToEdit={itemToEdit}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </PageHeader>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable
          columns={columns({
            onEdit: handleEditItem,
            onRemove: handleRemoveItem,
            onReceive: handleReceiveStock,
            onDispose: handleDisposeStock,
          })}
          data={inventory}
        />
      )}
      <AlertDialog open={isRemoveAlertOpen} onOpenChange={setIsRemoveAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              inventory item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSkuToRemove(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRemove}>
              Yes, remove it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Sheet open={isStockAdjustmentSheetOpen} onOpenChange={setIsStockAdjustmentSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {stockAdjustmentAction === 'receive' ? 'Receive Stock' : 'Dispose Stock'}
            </SheetTitle>
            <SheetDescription>
              {stockAdjustmentAction === 'receive'
                ? 'Add to the quantity of an existing item in your inventory.'
                : 'Decrease the quantity of an item for reasons other than a sale.'}
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            {skuToAdjust && (
              <StockAdjustmentForm
                sku={skuToAdjust}
                action={stockAdjustmentAction}
                onSuccess={handleStockAdjustmentSuccess}
                onCancel={() => setIsStockAdjustmentSheetOpen(false)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
