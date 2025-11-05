'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { profitLossData } from '@/lib/data';

const chartConfig = {
  profit: {
    label: 'Profit',
    color: 'hsl(var(--chart-1))',
  },
  loss: {
    label: 'Loss',
    color: 'hsl(var(--destructive))',
  },
};

export function ProfitLossChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit & Loss Overview</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={profitLossData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
              <Bar dataKey="loss" fill="var(--color-loss)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
