'use server';

import { financialSummaryReport } from '@/ai/flows/financial-summary-report';
import { sales, expenses, investments } from '@/lib/data';
import { z } from 'zod';

const FormSchema = z.object({});

export type State = {
  message?: string;
  report?: {
    summary: string;
    predictedRevenue: string;
    cashFlowAnalysis: string;
  };
  errors?: {
    _form?: string[];
  };
};

export async function generateReport(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const input = {
      salesData: JSON.stringify(sales),
      expensesData: JSON.stringify(expenses),
      investmentData: JSON.stringify(investments),
    };

    const report = await financialSummaryReport(input);

    return {
      message: 'Successfully generated report.',
      report: {
        summary: report.summary,
        predictedRevenue: report.predictedRevenue,
        cashFlowAnalysis: report.cashFlowAnalysis,
      },
    };
  } catch (e: any) {
    console.error(e);
    return {
      message: 'Failed to generate report.',
      errors: {
        _form: [e.message || 'An unexpected error occurred.'],
      },
    };
  }
}
