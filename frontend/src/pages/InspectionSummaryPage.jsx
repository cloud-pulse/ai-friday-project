import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { QualityScoreCard } from '../components/ui/QualityScoreCard';
import { RecommendationCard } from '../components/ui/RecommendationCard';
import { ChartCard } from '../components/ui/ChartCard';
import { InspectionTable } from '../components/inspection/InspectionTable';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  mockBatchDetails,
  mockPackageItems,
  mockDefectBreakdown,
} from '../data/mockData';
import {
  FileCheck,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Cpu,
  ArrowRight,
  Download,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
} from 'recharts';

export function InspectionSummaryPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Page Header */}
      <PageHeader
        title={`Inspection Summary — ${mockBatchDetails.id}`}
        description={`Automated packaging quality analysis for ${mockBatchDetails.name} (${mockBatchDetails.shift}).`}
        badge={
          <Badge variant="warning" icon={AlertTriangle}>
            Human Validation Required
          </Badge>
        }
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              icon={Download}
              onClick={() => {
                alert('Downloading structured inspection JSON metadata...');
              }}
            >
              Export Inspection JSON
            </Button>

            <Button
              variant="primary"
              icon={UserCheck}
              onClick={() => navigate('/human-review')}
              className="shadow-md"
            >
              Proceed to Human Review
            </Button>
          </div>
        }
      />

      {/* 2. Quality Score & Pass/Fail KPI Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QualityScoreCard
          scores={mockBatchDetails.scores}
          overallScore={mockBatchDetails.qualityScore}
          className="lg:col-span-2"
        />

        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Passed Packages"
            value={mockBatchDetails.passedImages}
            change="96.8%"
            changeType="positive"
            icon={CheckCircle2}
            iconBg="bg-[#F0FDF4] text-[#22C55E]"
            subtitle="Compliant packaging"
          />
          <StatCard
            title="Flagged Defective"
            value={mockBatchDetails.failedImages}
            change="3.2%"
            changeType="negative"
            icon={AlertTriangle}
            iconBg="bg-[#FEF2F2] text-[#EF4444]"
            subtitle="Requires inspection"
          />
        </div>
      </div>

      {/* 3. AI Findings Recommendation Banner */}
      <RecommendationCard
        summary={mockBatchDetails.aiSummary}
        recommendation={mockBatchDetails.aiRecommendation}
        confidence={mockBatchDetails.confidenceAvg}
        requiresReview={true}
      />

      {/* 4. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Defect Anomaly Breakdown"
          subtitle="Identified defects across 8 flagged packages"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={mockDefectBreakdown} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" vertical={false} />
              <XAxis dataKey="category" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E0F2FE',
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(7, 89, 133, 0.08)',
                  fontSize: '13px',
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {mockDefectBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Vision AI Confidence Distribution"
          subtitle="Package inspection sequence confidence scores"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={mockPackageItems.map((item, idx) => ({
                name: item.id,
                confidence: item.confidence,
              }))}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" vertical={false} />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis domain={[90, 100]} stroke="#64748B" fontSize={11} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E0F2FE',
                  borderRadius: '10px',
                  fontSize: '13px',
                }}
                formatter={(val) => [`${val}%`, 'Confidence']}
              />
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="#0EA5E9"
                strokeWidth={3}
                dot={{ fill: '#0EA5E9', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* 5. Detailed Package Inspection Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[20px] font-bold text-[#075985]">
              Package Inspection Records
            </h3>
            <p className="text-[13px] text-[#64748B]">
              Full list of analyzed packages with bounding box defect previews and OCR text extraction.
            </p>
          </div>
          <Button
            variant="accent"
            icon={ArrowRight}
            onClick={() => navigate('/human-review')}
          >
            Review & Validate Flagged Items
          </Button>
        </div>

        <InspectionTable items={mockPackageItems} />
      </div>
    </div>
  );
}
