'use server';

/**
 * @fileOverview Predicts future revenues and cash flow based on historical data.
 *
 * - predictRevenueCashFlow - A function that handles the prediction process.
 * - PredictRevenueCashFlowInput - The input type for the predictRevenueCashFlow function.
 * - PredictRevenueCashFlowOutput - The return type for the predictRevenueCashFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictRevenueCashFlowInputSchema = z.object({
  salesData: z.string().describe('Historical sales data in JSON format.'),
  expenseData: z.string().describe('Historical expense data in JSON format.'),
  investmentData: z.string().describe('Historical investment data in JSON format.'),
  predictionHorizon: z.number().describe('The number of months to predict into the future.'),
});
export type PredictRevenueCashFlowInput = z.infer<typeof PredictRevenueCashFlowInputSchema>;

const PredictRevenueCashFlowOutputSchema = z.object({
  revenueForecast: z.string().describe('Predicted revenue for each month in the forecast horizon in JSON format.'),
  cashFlowForecast: z.string().describe('Predicted cash flow for each month in the forecast horizon in JSON format.'),
  summary: z.string().describe('A summary of the predicted financial performance.'),
});
export type PredictRevenueCashFlowOutput = z.infer<typeof PredictRevenueCashFlowOutputSchema>;

export async function predictRevenueCashFlow(input: PredictRevenueCashFlowInput): Promise<PredictRevenueCashFlowOutput> {
  return predictRevenueCashFlowFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictRevenueCashFlowPrompt',
  input: {schema: PredictRevenueCashFlowInputSchema},
  output: {schema: PredictRevenueCashFlowOutputSchema},
  prompt: `You are an AI assistant designed to predict future revenues and cash flow for a sports shop based on historical data.

  Analyze the provided sales, expense, and investment data to forecast future financial performance.
  Provide the revenue forecast, cash flow forecast, and a summary of the predicted financial performance.

  Sales Data: {{{salesData}}}
  Expense Data: {{{expenseData}}}
  Investment Data: {{{investmentData}}}
  Prediction Horizon (months): {{{predictionHorizon}}}

  Ensure the revenueForecast and cashFlowForecast are returned as JSON format.
`,
});

const predictRevenueCashFlowFlow = ai.defineFlow(
  {
    name: 'predictRevenueCashFlowFlow',
    inputSchema: PredictRevenueCashFlowInputSchema,
    outputSchema: PredictRevenueCashFlowOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
