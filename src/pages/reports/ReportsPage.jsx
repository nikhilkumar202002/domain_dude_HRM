import React from 'react';
import { Download, BarChart2, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { ChartCard } from '../../components/common/ChartCard';
import { StatCard } from '../../components/common/StatCard';
import { mockRevenueData, mockProjectPerformanceData } from '../../data/mockData';

export const ReportsPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Executive Insights"
        subtitle="High-density financial forecasts, operational profitability, client acquisition velocity, and HR retention stats."
        actions={
          <button
            onClick={() => alert('Exporting Executive Quarterly Report PDF...')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <Download className="h-3.5 w-3.5 text-indigo-600" /> Export PDF Summary
          </button>
        }
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Average Deal Size" value={78500} format="currency" trend={9.4} trendLabel="vs Q1" icon={TrendingUp} />
        <StatCard title="Client Retention Rate" value={94} format="percent" trend={2.1} trendLabel="quarterly" icon={BarChart2} />
        <StatCard title="Gross Margin %" value={63.5} format="percent" trend={4.8} trendLabel="operating efficiency" icon={PieIcon} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Revenue vs Operating Expenses"
          subtitle="Trailing 6-month gross cash flow performance ($ USD)"
          data={mockRevenueData}
          type="area"
          dataKey="revenue"
          secondaryKey="expenses"
          height={300}
        />

        <ChartCard
          title="Revenue by Industry Domain"
          subtitle="Revenue contribution split across core target client sectors"
          data={mockProjectPerformanceData}
          type="bar"
          dataKey="revenue"
          xAxisKey="category"
          height={300}
        />
      </div>
    </div>
  );
};
