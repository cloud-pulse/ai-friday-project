import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { ChartCard } from '../components/ui/ChartCard';
import { DashboardCard } from '../components/ui/DashboardCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SectionHeader } from '../components/dashboard/SectionHeader';
import { RecentBatchTable } from '../components/dashboard/RecentBatchTable';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import {
  mockDashboardMetrics,
  mockRecentBatches,
  mockInspectionTrends,
  mockDefectBreakdown,
  mockSystemStatus,
} from '../data/mockData';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Sparkles,
  RefreshCw,
  FileCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Page Header */}
      <PageHeader
        title="Inspection Dashboard"
        description="Real-time pharmaceutical packaging quality metrics, defect analytics, and human review validation pipeline."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[13px] font-medium rounded-full bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]">
            <Sparkles className="w-3.5 h-3.5" />
            AI Inspector Active
          </span>
        }
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              icon={RefreshCw}
              onClick={() => {}}
            >
              Sync Live Data
            </Button>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => navigate('/create-batch')}
            >
              Start Inspection Batch
            </Button>
          </div>
        }
      />

      {/* 2. Primary KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Batches Analyzed"
          value={mockDashboardMetrics.totalBatches}
          change="+12 this week"
          changeType="positive"
          icon={Layers}
          iconBg="bg-[#F0F9FF] text-[#0EA5E9]"
          subtitle="37,250 total packages inspected"
        />
        <StatCard
          title="Overall Pass Rate"
          value={`${mockDashboardMetrics.overallPassRate}%`}
          change={mockDashboardMetrics.passRateChange}
          changeType="positive"
          icon={CheckCircle2}
          iconBg="bg-[#F0FDF4] text-[#22C55E]"
          subtitle="Target: ≥ 95.0% threshold"
        />
        <StatCard
          title="Active Defect Alerts"
          value={mockDashboardMetrics.activeDefectsCount}
          change="3 Pending Review"
          changeType="negative"
          icon={AlertTriangle}
          iconBg="bg-[#FEF2F2] text-[#EF4444]"
          subtitle="Requires human validation"
        />
        <StatCard
          title="Avg Inspection Speed"
          value={mockDashboardMetrics.avgInspectionTime}
          change="75% faster"
          changeType="positive"
          icon={Clock}
          iconBg="bg-[#ECFDF5] text-[#10B981]"
          subtitle="Single-pass Vision AI engine"
        />
      </div>

      {/* 3. Inspection Trends & Defect Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quality Trend Line/Area Chart */}
        <ChartCard
          title="7-Day Inspection Pass Rate Trend"
          subtitle="Daily quality score comparison against 95% target baseline"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={mockInspectionTrends} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="passRateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" vertical={false} />
              <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis domain={[90, 100]} stroke="#64748B" fontSize={12} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E0F2FE',
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(7, 89, 133, 0.08)',
                  fontSize: '13px',
                  color: '#075985',
                }}
                formatter={(val) => [`${val}%`, 'Pass Rate']}
              />
              <Area
                type="monotone"
                dataKey="passRate"
                stroke="#0EA5E9"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#passRateGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Defect Category Breakdown Bar Chart */}
        <ChartCard
          title="Defect Category Overview"
          subtitle="Distribution of identified packaging defects"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={mockDefectBreakdown} layout="vertical" margin={{ top: 0, right: 20, left: 30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" horizontal={false} />
              <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis dataKey="category" type="category" stroke="#075985" fontSize={11} tickLine={false} width={110} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E0F2FE',
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(7, 89, 133, 0.08)',
                  fontSize: '13px',
                }}
                formatter={(val) => [`${val} defect occurrences`, 'Count']}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {mockDefectBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* 4. Recent Production Batches Table Section */}
      <div className="space-y-4">
        <SectionHeader
          title="Recent Production Line Batches"
          subtitle="Real-time status of submitted package inspection batches"
          actions={
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowRight}
              onClick={() => navigate('/inspection-summary')}
            >
              View All Inspection Records
            </Button>
          }
        />
        <RecentBatchTable batches={mockRecentBatches} />
      </div>

      {/* 5. System Status & AI Engine Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="AI Inspection Pipeline"
          subtitle="Core model runtime services"
          icon={Cpu}
          className="md:col-span-2"
        >
          <div className="space-y-3">
            {mockSystemStatus.map((sys, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-[10px] bg-[#F0F9FF]/60 border border-[#E0F2FE]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#075985]">{sys.name}</div>
                    <div className="text-[11px] text-[#64748B]">{sys.detail}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[12px] font-medium text-[#64748B]">{sys.latency}</span>
                  <StatusBadge status={sys.status} />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Human-in-the-Loop Review Banner Card */}
        <DashboardCard
          title="Human Validation Queue"
          subtitle="Quality Inspector Approval Status"
          icon={ShieldCheck}
          className="bg-gradient-to-br from-white to-[#F0F9FF] border-[#E0F2FE]"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-[12px] bg-[#FFFBEB] border border-[#FDE68A]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] font-semibold text-[#F59E0B]">
                  3 Batches Await Sign-Off
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FDE68A] text-[#92400E]">
                  Action Needed
                </span>
              </div>
              <p className="text-[12px] text-[#78350F] leading-relaxed">
                Packaging defect anomalies require inspector observation notes and root cause confirmation before generating final compliance reports.
              </p>
            </div>

            <Button
              variant="primary"
              className="w-full justify-center"
              icon={FileCheck}
              onClick={() => navigate('/human-review')}
            >
              Open Human Review Queue
            </Button>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
