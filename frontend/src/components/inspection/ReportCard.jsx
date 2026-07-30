import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { ApprovalBadge } from '../ui/ApprovalBadge';
import {
  ShieldCheck,
  Download,
  Save,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  UserCheck,
  Lock,
  Calendar,
  Layers,
  FileText,
} from 'lucide-react';

/**
 * ReportCard Component
 * Formatted regulatory compliance document displaying AI findings, human review log, and digital e-signature block
 */
export function ReportCard({
  batch = {},
  review = {},
  onDownloadPdf,
  onSaveReport,
  className = '',
}) {
  return (
    <Card className={`space-y-8 bg-white border border-[#E0F2FE] p-8 md:p-12 shadow-md ${className}`}>
      {/* 1. Official Report Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b-2 border-[#075985]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0EA5E9] to-[#10B981] text-white flex items-center justify-center font-bold shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-[24px] font-extrabold text-[#075985] tracking-tight">
                PharmaInspect AI — Quality Inspection Certificate
              </h2>
              <p className="text-[12px] font-medium text-[#64748B]">
                GMP & 21 CFR Part 11 Validated Certificate of Analysis (CoA)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ApprovalBadge status="Approved" />
        </div>
      </div>

      {/* 2. Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-[12px] bg-[#F0F9FF] border border-[#E0F2FE] text-[13px]">
        <div>
          <span className="text-[#64748B] block text-[11px]">Batch Reference:</span>
          <span className="font-bold text-[#075985]">{batch.id || 'BATCH-2026-0891'}</span>
        </div>
        <div>
          <span className="text-[#64748B] block text-[11px]">Production Line:</span>
          <span className="font-semibold text-[#075985]">{batch.line || 'Line A - Blister'}</span>
        </div>
        <div>
          <span className="text-[#64748B] block text-[11px]">Shift & Date:</span>
          <span className="font-semibold text-[#075985]">{batch.date || '2026-07-30'}</span>
        </div>
        <div>
          <span className="text-[#64748B] block text-[11px]">Lead Inspector:</span>
          <span className="font-semibold text-[#075985]">{review.approvedBy || batch.inspector || 'Dr. Sarah Chen'}</span>
        </div>
      </div>

      {/* 3. Quality Scorecard Metrics */}
      <div className="space-y-3">
        <h3 className="text-[16px] font-bold text-[#075985] flex items-center gap-2 border-b border-[#E0F2FE] pb-2">
          <Layers className="w-4 h-4 text-[#0EA5E9]" />
          1. Batch Inspection Metrics & Scorecard
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-[10px] bg-white border border-[#E0F2FE] text-center">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase">Total Inspected</span>
            <div className="text-[24px] font-bold text-[#075985] mt-0.5">{batch.totalImages || 250}</div>
          </div>
          <div className="p-4 rounded-[10px] bg-[#F0FDF4] border border-[#BBF7D0] text-center">
            <span className="text-[11px] font-semibold text-[#22C55E] uppercase">Passed Units</span>
            <div className="text-[24px] font-bold text-[#22C55E] mt-0.5">{batch.passedImages || 242}</div>
          </div>
          <div className="p-4 rounded-[10px] bg-[#FEF2F2] border border-[#FCA5A5] text-center">
            <span className="text-[11px] font-semibold text-[#EF4444] uppercase">Defect Anomalies</span>
            <div className="text-[24px] font-bold text-[#EF4444] mt-0.5">{batch.failedImages || 8}</div>
          </div>
          <div className="p-4 rounded-[10px] bg-[#ECFDF5] border border-[#A7F3D0] text-center">
            <span className="text-[11px] font-semibold text-[#10B981] uppercase">Final Quality Score</span>
            <div className="text-[24px] font-bold text-[#10B981] mt-0.5">{batch.qualityScore || 96.8}%</div>
          </div>
        </div>
      </div>

      {/* 4. Visual Distinction: AI Findings vs Human Review */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Findings Column */}
        <div className="p-5 rounded-[12px] bg-[#ECFDF5]/50 border border-[#A7F3D0] space-y-3">
          <div className="flex items-center gap-2 text-[#10B981] font-bold text-[14px]">
            <Cpu className="w-4 h-4" />
            2. AI Vision & OCR Findings
          </div>
          <p className="text-[13px] text-[#075985] leading-relaxed">
            {batch.aiSummary || 'Single-pass Vision AI identified 8 seal integrity anomalies on blister pocket rows 3 & 4. OCR verified batch code #AMX-9941 and expiry date EXP:09/2028 with 99.1% text match confidence.'}
          </p>
          <div className="text-[11px] text-[#047857] font-semibold">
            • AI Model: Llama-3.2 90B Vision Instruct
            <br />
            • Avg Confidence: {batch.confidenceAvg || 98.4}%
          </div>
        </div>

        {/* Inspector Review Column */}
        <div className="p-5 rounded-[12px] bg-[#FFFBEB]/60 border border-[#FDE68A] space-y-3">
          <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-[14px]">
            <UserCheck className="w-4 h-4" />
            3. Inspector Manual Validation
          </div>
          <p className="text-[13px] text-[#075985] leading-relaxed">
            {review.inspectorNotes || 'Inspected 8 flagged packages manually. Confirmed minor foil tear on 3 units due to temporary temperature drop on sealing roller #2. Defect isolated to sub-lot 4.'}
          </p>
          <div className="text-[11px] text-[#92400E] font-semibold">
            • Validated By: {review.approvedBy || 'Dr. Sarah Chen'}
            <br />
            • Decision: {review.finalDecision || 'Approved with Conditions'}
          </div>
        </div>
      </div>

      {/* 5. Root Cause & Corrective Actions */}
      <div className="space-y-4 pt-2">
        <h3 className="text-[16px] font-bold text-[#075985] flex items-center gap-2 border-b border-[#E0F2FE] pb-2">
          <FileText className="w-4 h-4 text-[#10B981]" />
          4. Root Cause & Corrective Actions (CAPA)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
          <div className="p-4 rounded-[10px] bg-[#F8FAFC] border border-[#E0F2FE]">
            <span className="font-bold text-[#075985] block mb-1">Identified Root Cause:</span>
            <span className="text-[#64748B]">{review.rootCause || 'Sealing Roller Temperature Fluctuation'}</span>
          </div>

          <div className="p-4 rounded-[10px] bg-[#F8FAFC] border border-[#E0F2FE]">
            <span className="font-bold text-[#075985] block mb-1">Preventive Actions Taken:</span>
            <pre className="text-[#64748B] font-sans whitespace-pre-wrap leading-relaxed">
              {review.correctiveActions || '1. Recalibrated sealing roller #2 temperature controller.\n2. Quarantined sub-lot 4 for manual destruction.\n3. Verified remaining 242 packages meet 100% compliance.'}
            </pre>
          </div>
        </div>
      </div>

      {/* 6. Electronic Signature & Compliance Hash Block */}
      <div className="p-6 rounded-[14px] bg-[#F0F9FF] border border-[#E0F2FE] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E0F2FE]">
          <div className="flex items-center gap-2 text-[#075985] font-bold text-[14px]">
            <Lock className="w-4 h-4 text-[#10B981]" />
            Electronic Signature & 21 CFR Part 11 Audit Record
          </div>
          <span className="text-[12px] font-semibold text-[#22C55E] bg-[#F0FDF4] px-2.5 py-1 rounded-full border border-[#BBF7D0]">
            Audit Trail Cryptographically Signed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[12px] text-[#64748B]">
          <div>
            <span className="block font-semibold text-[#075985]">Signed By:</span>
            <span>{review.approvedBy || 'Dr. Sarah Chen'}</span>
          </div>
          <div>
            <span className="block font-semibold text-[#075985]">Timestamp:</span>
            <span>{review.approvalTimestamp || '2026-07-30 12:45 PM'}</span>
          </div>
          <div>
            <span className="block font-semibold text-[#075985]">Signature Hash:</span>
            <span className="font-mono text-[11px] text-[#0EA5E9] truncate block">
              {review.digitalSignatureHash || '0x8F92A14B903C7E12D456F9812A'}
            </span>
          </div>
        </div>
      </div>

      {/* 7. Document Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-[#E0F2FE]">
        <Button
          variant="secondary"
          icon={Save}
          onClick={onSaveReport}
        >
          Save Report to LanceDB
        </Button>

        <Button
          variant="primary"
          icon={Download}
          onClick={onDownloadPdf}
          className="shadow-md"
        >
          Download Official PDF Report
        </Button>
      </div>
    </Card>
  );
}
