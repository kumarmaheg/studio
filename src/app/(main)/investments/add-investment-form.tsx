'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Investment } from '@/lib/types';

type AddInvestmentFormProps = {
  onSuccess: () => void;
};

export function AddInvestmentForm({ onSuccess }: AddInvestmentFormProps) {
  const { toast } = useToast();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [investedBy, setInvestedBy] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setReason('');
    setInvestedBy('');
    setAmount('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          reason,
          invested_by: investedBy,
          amount: parseFloat(amount),
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Investment added successfully.',
        });
        resetForm();
        onSuccess();
      } else {
        const errorData = await response.json();
        toast({
          variant: 'destructive',
          title: 'Error adding investment',
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
        <Label htmlFor="investedBy" className="text-right">
          Invested By
        </Label>
        <Input
          id="investedBy"
          value={investedBy}
          onChange={(e) => setInvestedBy(e.target.value)}
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
          value={reason}
          onChange={(e) => setReason(e.target.value)}
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
            'Add Investment'
          )}
        </Button>
      </div>
    </form>
  );
}
