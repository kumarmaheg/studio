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
import { useEffect, useState } from 'react';

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

type ProfitLossData = {
  month: string;
  profit: number;
  loss: number;
};

export function ProfitLossChart() {
  const [data, setData] = useState<ProfitLossData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/dashboard/profit-loss');
      if (res.ok) {
        const jsonData = await res.json();
        setData(jsonData);
      }
    }
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit & Loss Overview</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
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
        ) : (
          <div className="flex h-[350px] w-full items-center justify-center">
            <p>No profit and loss data available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
