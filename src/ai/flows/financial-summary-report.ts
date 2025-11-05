'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a financial summary report of a sports shop.
 *
 * The flow analyzes sales, expenses, and investments to provide a concise overview of the shop's financial performance.
 * It exports:
 *   - financialSummaryReport: The main function to trigger the report generation.
 *   - FinancialSummaryReportInput: The TypeScript type definition for the input to the function.
 *   - FinancialSummaryReportOutput: The TypeScript type definition for the output of the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the financial summary report
const FinancialSummaryReportInputSchema = z.object({
  salesData: z.string().describe('Sales data including items sold, quantities, prices, and dates.'),
  expensesData: z.string().describe('Expense data including rent, utilities, salaries, and marketing costs.'),
  investmentData: z.string().describe('Investment data including initial investment and any additional investments.'),
});
export type FinancialSummaryReportInput = z.infer<typeof FinancialSummaryReportInputSchema>;

// Define the output schema for the financial summary report
const FinancialSummaryReportOutputSchema = z.object({
  summary: z.string().describe('A summary report of the shop\'s financial performance.'),
  predictedRevenue: z.string().describe('Predicted future revenue based on current trends.'),
  cashFlowAnalysis: z.string().describe('An analysis of the shop\'s cash flow.'),
});
export type FinancialSummaryReportOutput = z.infer<typeof FinancialSummaryReportOutputSchema>;

// Define the Genkit prompt for generating the financial summary report
const financialSummaryReportPrompt = ai.definePrompt({
  name: 'financialSummaryReportPrompt',
  input: {schema: FinancialSummaryReportInputSchema},
  output: {schema: FinancialSummaryReportOutputSchema},
  prompt: `You are an expert financial analyst specializing in sports shops.

  Analyze the following sales, expenses, and investment data to generate a summary report of the shop\'s financial performance.
  Also, predict future revenue and provide a cash flow analysis.

  Sales Data: {{{salesData}}}
  Expenses Data: {{{expensesData}}}
  Investment Data: {{{investmentData}}}

  Ensure the summary includes key metrics such as profit margins, ROI, and significant trends.
  Structure the summary in a clear and concise manner, suitable for presentation to the shop owner.
  Include predicted revenue and cash flow analysis as well.
  `,
});

// Define the Genkit flow for generating the financial summary report
const financialSummaryReportFlow = ai.defineFlow(
  {
    name: 'financialSummaryReportFlow',
    inputSchema: FinancialSummaryReportInputSchema,
    outputSchema: FinancialSummaryReportOutputSchema,
  },
  async input => {
    const {output} = await financialSummaryReportPrompt(input);
    return output!;
  }
);

/**
 * Generates a financial summary report for a sports shop using AI analysis.
 * @param input - The input data containing sales, expenses, and investment information.
 * @returns A promise that resolves to the financial summary report.
 */
export async function financialSummaryReport(input: FinancialSummaryReportInput): Promise<FinancialSummaryReportOutput> {
  return financialSummaryReportFlow(input);
}
