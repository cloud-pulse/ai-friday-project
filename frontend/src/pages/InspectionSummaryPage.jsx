import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { batchesApi } from '../api/batches';
import { dashboardApi } from '../api/dashboard';
import { PageHeader } from '../components/layout/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { QualityScoreCard } from '../components/ui/QualityScoreCard';
import { RecommendationCard } from '../components/ui/RecommendationCard';
import { ChartCard } from '../components/ui/ChartCard';
import { InspectionTable } from '../components/inspection/InspectionTable';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
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
  const [searchParams] = useSearchParams();
  const batchId = searchParams.get('batchId');

  const [batchDetails, setBatchDetails] = useState(null);
  const [packageItems, setPackageItems] = useState([]);
  const [defectBreakdown, setDefectBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!batchId) {
        navigate('/');
        return;
      }
      
      try {
        const [batch, summary, results, defects] = await Promise.all([
          batchesApi.getBatchDetails(batchId),
          batchesApi.getBatchSummary(batchId),
          batchesApi.getBatchResults(batchId),
          dashboardApi.getDefects()
        ]);

        setBatchDetails({
          id: batch.id,
          name: batch.name,
          line: batch.production_line,
          shift: batch.shift,
          date: new Date(batch.created_at).toLocaleString(),
          inspector: "System",
          totalImages: summary.total_images,
          passedImages: summary.passed ?? 0,
          failedImages: (summary.failed ?? 0) + (summary.needs_review ?? 0),
          qualityScore: summary.quality_score ?? 0,
          scores: {
            packagingIntegrity: summary.avg_packaging_integrity ?? 0,
            labelAccuracy: summary.avg_label_accuracy ?? 0,
            sealQuality: summary.avg_seal_quality ?? 0,
            ocrValidation: summary.avg_label_accuracy ?? 0,
          },
          aiSummary: `${summary.failed} packages flagged for manual review. AI recommends verification of seal integrity and label alignment.`,
          aiRecommendation: summary.failed > 0 ? "Review flagged items." : "All packages passed.",
          confidenceAvg: 98.5,
          status: summary.status === 'ready_for_review' ? 'Pending Review' : (summary.status === 'completed' ? 'Approved' : summary.status),
        });

        setPackageItems(results);
        setDefectBreakdown(defects);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [batchId]);

  if (loading) {
    return <div className="p-8 text-center">Loading inspection summary...</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Page Header */}
      <PageHeader
        title={`Inspection Summary — ${batchDetails.name}`}
        description={`Automated packaging quality analysis for ${batchDetails.name} (${batchDetails.shift}).`}
        badge={
          <Badge variant={batchDetails.failedImages > 0 ? "warning" : "success"} icon={batchDetails.failedImages > 0 ? AlertTriangle : CheckCircle2}>
            {batchDetails.failedImages > 0 ? "Human Validation Required" : "All Packages Passed"}
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
              onClick={() => navigate(batchId ? `/human-review?batchId=${batchId}` : '/human-review')}
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
          scores={batchDetails.scores}
          overallScore={batchDetails.qualityScore}
          className="lg:col-span-2"
        />

        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Passed Packages"
            value={batchDetails.passedImages}
            change="Compliant"
            changeType="positive"
            icon={CheckCircle2}
            iconBg="bg-[#F0FDF4] text-[#22C55E]"
            subtitle="Packaging verified"
          />
          <StatCard
            title="Flagged Defective"
            value={batchDetails.failedImages}
            change="Requires Review"
            changeType="negative"
            icon={AlertTriangle}
            iconBg="bg-[#FEF2F2] text-[#EF4444]"
            subtitle="Anomalies detected"
          />
        </div>
      </div>

      {/* 3. AI Findings Recommendation Banner */}
      <RecommendationCard
        summary={batchDetails.aiSummary}
        recommendation={batchDetails.aiRecommendation}
        confidence={batchDetails.confidenceAvg}
        requiresReview={batchDetails.failedImages > 0}
      />

      {/* 4. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Defect Anomaly Breakdown"
          subtitle="Identified defects across 8 flagged packages"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={defectBreakdown} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                {defectBreakdown.map((entry, index) => (
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
              data={packageItems.map((item, idx) => ({
                name: `IMG-${idx + 1}`,
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
            onClick={() => navigate(batchId ? `/human-review?batchId=${batchId}` : '/human-review')}
          >
            Review & Validate Flagged Items
          </Button>
        </div>

        <InspectionTable items={packageItems} />
      </div>
    </div>
  );
}
