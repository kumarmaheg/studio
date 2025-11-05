import { DollarSign, ShoppingCart, CreditCard, TrendingUp, Package } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatsCard } from '@/components/dashboard/stats-card';
import { ProfitLossChart } from '@/components/dashboard/profit-loss-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { financialOverview, inventory } from '@/lib/data';

export default function DashboardPage() {
  const roi = financialOverview.totalInvestment > 0 ? (financialOverview.netProfit / financialOverview.totalInvestment) * 100 : 0;
  
  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={financialOverview.totalRevenue.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}
          icon={DollarSign}
          description="Total income from sales"
        />
        <StatsCard
          title="Net Profit"
          value={financialOverview.netProfit.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}
          icon={TrendingUp}
          description="After all costs and expenses"
        />
        <StatsCard
          title="Total Expenses"
          value={financialOverview.totalExpenses.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}
          icon={CreditCard}
          description="Rent, salaries, marketing etc."
        />
        <StatsCard
          title="ROI"
          value={`${roi.toFixed(2)}%`}
          icon={TrendingUp}
          description="Return on investment"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ProfitLossChart />
        </div>
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
      </div>
    </>
  );
}
