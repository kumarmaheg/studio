'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Expense } from '@/lib/types';

type AddExpenseFormProps = {
  onSuccess: () => void;
  expenseToEdit?: Expense | null;
};

const expenseCategories: Expense['category'][] = [
  'Rent',
  'Utilities',
  'Salaries',
  'Marketing',
  'Supplies',
  'Other',
];

export function AddExpenseForm({ onSuccess, expenseToEdit }: AddExpenseFormProps) {
  const { toast } = useToast();
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!expenseToEdit;

  useEffect(() => {
    if (expenseToEdit) {
      setDate(new Date(expenseToEdit.date).toISOString().split('T')[0]);
      setCategory(expenseToEdit.category);
      setDescription(expenseToEdit.description || '');
      setAmount(String(expenseToEdit.amount));
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setCategory(undefined);
      setDescription('');
      setAmount('');
    }
  }, [expenseToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!category) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a category.',
      });
      setIsLoading(false);
      return;
    }

    const url = isEditMode ? `/api/expenses/${expenseToEdit.id}` : '/api/expenses';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          category,
          description,
          amount: parseFloat(amount),
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Expense ${isEditMode ? 'updated' : 'added'} successfully.`,
        });
        onSuccess();
      } else {
        const errorData = await response.json();
        toast({
          variant: 'destructive',
          title: `Error ${isEditMode ? 'updating' : 'adding'} expense`,
          description: errorData.error || 'An unexpected error occurred.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to connect to the server.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="date" className="text-right">
          Date
        </Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category
        </Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {expenseCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="col-span-3"
          placeholder="e.g., Office rent for May"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="amount" className="text-right">
          Amount
        </Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="col-span-3"
          placeholder="0.00"
          required
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            isEditMode ? 'Save Changes' : 'Add Expense'
          )}
        </Button>
      </div>
    </form>
  );
}
