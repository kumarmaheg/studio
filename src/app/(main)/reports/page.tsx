'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateReport, type State } from './actions';
import { Bot, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Bot className="mr-2 h-4 w-4" />
          Generate Financial Summary
        </>
      )}
    </Button>
  );
}

export default function ReportsPage() {
  const initialState: State = { message: '' };
  const [state, formAction] = useFormState(generateReport, initialState);

  return (
    <>
      <PageHeader title="AI Financial Reports" />
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Use our AI-powered tool to analyze your shop's financial data and
              generate a summary report, including revenue predictions and cash
              flow analysis.
            </p>
            <form action={formAction}>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>

        {state.errors?._form && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.errors._form.join(', ')}</AlertDescription>
          </Alert>
        )}

        {state.report && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{state.report.summary}</p>
              </CardContent>
            </Card>
            <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Predicted Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{state.report.predictedRevenue}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{state.report.cashFlowAnalysis}</p>
              </CardContent>
            </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
