'use client';

import { DollarSign, ShoppingCart, CreditCard, TrendingUp, Package } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatsCard } from '@/components/dashboard/stats-card';
import { ProfitLossChart } from '@/components/dashboard/profit-loss-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { useEffect, useState } from 'react';

interface FinancialOverview {
  totalRevenue: number;
  netProfit: number;
  totalExpenses: number;
  roi: number;
}

export default function DashboardPage() {
  const [overview, setOverview] = useState<FinancialOverview | null>(null);

  useEffect(() => {
    async function fetchOverview() {
      const res = await fetch('/api/dashboard/overview');
      if (res.ok) {
        const data = await res.json();
        setOverview(data);
      }
    }
    fetchOverview();
  }, []);
  
  return (
    <div className="w-full">
      <PageHeader title="Dashboard" />
      {overview ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value={overview.totalRevenue.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
            })}
            icon={DollarSign}
            description="Total income from sales"
          />
          <StatsCard
            title="Net Profit"
            value={overview.netProfit.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
            })}
            icon={TrendingUp}
            description="After all costs and expenses"
          />
          <StatsCard
            title="Total Expenses"
            value={overview.totalExpenses.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
            })}
            icon={CreditCard}
            description="Rent, salaries, marketing etc."
          />
          <StatsCard
            title="ROI"
            value={`${overview.roi.toFixed(2)}%`}
            icon={TrendingUp}
            description="Return on investment"
          />
        </div>
      ) : (
        <p>Loading financial overview...</p>
      )}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ProfitLossChart />
        </div>
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}
