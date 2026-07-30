import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { batchesApi } from '../api/batches';
import { reviewsApi } from '../api/reviews';
import { PageHeader } from '../components/layout/PageHeader';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ReviewForm } from '../components/inspection/ReviewForm';
import {
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Eye,
} from 'lucide-react';

export function HumanReviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const batchId = searchParams.get('batchId');

  const [reviewState, setReviewState] = useState({
    inspectorNotes: '',
    rootCause: '',
    correctiveActions: '',
    finalDecision: 'Approved',
  });
  
  const [flaggedItems, setFlaggedItems] = useState([]);
  const [batchDetails, setBatchDetails] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!batchId) {
        navigate('/');
        return;
      }
      try {
        const [batch, results] = await Promise.all([
          batchesApi.getBatchDetails(batchId),
          batchesApi.getBatchResults(batchId)
        ]);
        setBatchDetails(batch);
        setFlaggedItems(results.filter(item => item.status !== 'Passed'));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [batchId]);

  const handleReviewSubmit = async (formData) => {
    if (!batchId) {
      navigate('/reports');
      return;
    }
    try {
      await reviewsApi.submitReview(batchId, {
        inspector_name: "Dr. Sarah Chen",
        notes: formData.inspectorNotes,
        root_cause: formData.rootCause,
        corrective_actions: formData.correctiveActions.split('\n').filter(s => s.trim()),
        decision: formData.finalDecision === "Approved" ? "approved" : (formData.finalDecision.includes("Approved") ? "approved" : "rejected")
      });
      navigate(`/reports?batchId=${batchId}`);
    } catch (err) {
      console.error(err);
      alert('Failed to submit review');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Page Header */}
      <PageHeader
        title={`Human Review & Validation — ${batchDetails.name || 'Unknown Batch'}`}
        description={`Inspector sign-off panel for ${batchDetails.name || 'Unknown Batch'}. Validate AI findings, log root cause, and define corrective action protocols.`}
        badge={
          <Badge variant="warning" icon={UserCheck}>
            Validation Required
          </Badge>
        }
        actions={
          <Button
            variant="secondary"
            icon={FileText}
            onClick={() => navigate(batchId ? `/inspection-summary?batchId=${batchId}` : '/inspection-summary')}
          >
            View Inspection Summary
          </Button>
        }
      />

      {/* 2. Visual Workflow Progress Pipeline */}
      <Card className="bg-[#F0F9FF] border border-[#E0F2FE] p-6">
        <div className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-4">
          Human-in-the-Loop Workflow Progress
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {/* Step 1 */}
          <div className="p-4 rounded-[12px] bg-white border border-[#BBF7D0] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#22C55E] text-white flex items-center justify-center font-bold text-[14px]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#22C55E]">1. AI Inspection (Completed)</div>
              <div className="text-[11px] text-[#64748B]">8 Anomalies Flagged</div>
            </div>
          </div>

          {/* Step 2 (Active) */}
          <div className="p-4 rounded-[12px] bg-white border-2 border-[#F59E0B] shadow-md flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F59E0B] text-white flex items-center justify-center font-bold text-[14px]">
              2
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#075985]">2. Human Review (Active)</div>
              <div className="text-[11px] text-[#F59E0B] font-semibold">Inspector Sign-Off Needed</div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-[12px] bg-[#F8FAFC] border border-[#E0F2FE] flex items-center gap-3 opacity-70">
            <div className="w-8 h-8 rounded-full bg-[#64748B] text-white flex items-center justify-center font-bold text-[14px]">
              3
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#64748B]">3. Approved Report (Next)</div>
              <div className="text-[11px] text-[#64748B]">Signed PDF Certificate</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Review Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Flagged Package Anomalies List (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-bold text-[#075985]">
              Flagged Anomalies ({flaggedItems.length})
            </h3>
            <span className="text-[11px] font-semibold text-[#EF4444] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FCA5A5]">
              Action Required
            </span>
          </div>

          <div className="space-y-3">
            {flaggedItems.map((item) => (
              <Card key={item.id} className="p-4 border-l-4 border-l-[#EF4444] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#075985]">{item.id}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FEF2F2] text-[#EF4444]">
                    {item.confidence}% AI Conf.
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={item.imagePreview}
                    alt={item.id}
                    className="w-14 h-14 rounded-[8px] object-cover border border-[#E0F2FE]"
                  />
                  <div className="text-[12px]">
                    <div className="font-semibold text-[#EF4444]">{item.defect}</div>
                    <div className="text-[#64748B] font-mono text-[11px] mt-0.5">{item.ocrText}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E0F2FE] flex items-center justify-between text-[11px]">
                  <span className="text-[#64748B]">AI Detection: Foil Tear</span>
                  <button
                    type="button"
                    onClick={() => alert(`Reviewing image preview for ${item.id}`)}
                    className="text-[#0EA5E9] font-semibold hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" /> Zoom
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: ReviewForm Inspector Input (2 cols) */}
        <div className="lg:col-span-2">
          <ReviewForm
            initialData={reviewState}
            onSubmit={handleReviewSubmit}
          />
        </div>
      </div>
    </div>
  );
}
