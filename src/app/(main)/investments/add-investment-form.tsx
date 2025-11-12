'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Investment } from '@/lib/types';

type AddInvestmentFormProps = {
  onSuccess: () => void;
  investmentToEdit?: Investment | null;
};

const getInitialFormData = (investment: Investment | null | undefined) => {
  if (investment) {
    return {
      date: new Date(investment.date).toISOString().split('T')[0],
      reason: investment.reason || '',
      invested_by: investment.invested_by || '',
      amount: String(investment.amount),
    };
  }
  return {
    date: new Date().toISOString().split('T')[0],
    reason: '',
    invested_by: '',
    amount: '',
  };
};

export function AddInvestmentForm({ onSuccess, investmentToEdit }: AddInvestmentFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState(getInitialFormData(investmentToEdit));
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!investmentToEdit;

  useEffect(() => {
    setFormData(getInitialFormData(investmentToEdit));
  }, [investmentToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const url = isEditMode ? `/api/investments/${investmentToEdit.id}` : '/api/investments';
    const method = isEditMode ? 'PUT' : 'POST';
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Investment ${isEditMode ? 'updated' : 'added'} successfully.`,
        });
        onSuccess();
      } else {
        const errorData = await response.json();
        toast({
          variant: 'destructive',
          title: `Error ${isEditMode ? 'updating' : 'adding'} investment`,
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
          value={formData.date}
          onChange={handleInputChange}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="invested_by" className="text-right">
          Invested By
        </Label>
        <Input
          id="invested_by"
          value={formData.invested_by}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="e.g., John Doe"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="reason" className="text-right">
          Investment Reason
        </Label>
        <Textarea
          id="reason"
          value={formData.reason}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="e.g., Initial capital investment"
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
          value={formData.amount}
          onChange={handleInputChange}
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
            isEditMode ? 'Save Changes' : 'Add Investment'
          )}
        </Button>
      </div>
    </form>
  );
}
