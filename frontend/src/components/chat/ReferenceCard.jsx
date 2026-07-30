import React from 'react';
import { Database, FileText, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

/**
 * ReferenceCard / ContextCard Component
 * Displays referenced historical batch data, quality metrics, and inspector notes
 */
export function ReferenceCard({ batch, className = '' }) {
  if (!batch) return null;

  return (
    <div className={`p-3.5 rounded-[12px] bg-[#F0F9FF] border border-[#E0F2FE] space-y-2.5 text-[12px] ${className}`}>
      <div className="flex items-center justify-between border-b border-[#E0F2FE] pb-2">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-[#0EA5E9]" />
          <span className="font-bold text-[#075985]">{batch.id} — {batch.name}</span>
        </div>
        <StatusBadge status={batch.status || 'Approved'} />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center bg-white p-2 rounded-[8px] border border-[#E0F2FE]">
        <div>
          <span className="text-[#64748B] block text-[10px]">Quality Score</span>
          <span className="font-bold text-[#10B981] text-[13px]">{batch.qualityScore || '96.8'}%</span>
        </div>
        <div>
          <span className="text-[#64748B] block text-[10px]">Passed / Total</span>
          <span className="font-semibold text-[#075985] text-[12px]">{batch.passed || 242}/{batch.totalImages || 250}</span>
        </div>
        <div>
          <span className="text-[#64748B] block text-[10px]">Defect Count</span>
          <span className="font-bold text-[#EF4444] text-[12px]">{batch.failed || 8}</span>
        </div>
      </div>

      {batch.defectSummary && (
        <div className="flex items-center gap-1.5 text-[#64748B]">
          <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
          <span>Defects: <strong className="text-[#075985]">{batch.defectSummary}</strong></span>
        </div>
      )}

      {batch.inspectorNotes && (
        <div className="p-2 rounded bg-[#FFFBEB] border border-[#FDE68A] text-[#78350F] flex items-start gap-2">
          <FileText className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#92400E] block text-[11px]">Inspector Validation Notes:</span>
            <span>{batch.inspectorNotes}</span>
          </div>
        </div>
      )}
    </div>
  );
}
