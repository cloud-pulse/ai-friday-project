import React from 'react';
import { Sparkles, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

/**
 * AIResponseCard Component
 * Highlighting AI findings, recommendations, and human validation guardrails using Accent colors
 */
export function AIResponseCard({ title, recommendation, confidence = 98.4, className = '' }) {
  return (
    <div className={`p-4 rounded-[14px] bg-gradient-to-r from-[#ECFDF5] to-white border border-[#A7F3D0] space-y-3 ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-[#A7F3D0]/60">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#10B981]" />
          <span className="font-bold text-[#075985] text-[13px]">{title || 'AI Copilot Recommendation'}</span>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#10B981] text-white">
          {confidence}% Confidence
        </span>
      </div>

      {recommendation && (
        <p className="text-[13px] text-[#075985] font-medium leading-relaxed">
          {recommendation}
        </p>
      )}

      {/* Human Validation Reminder Note (Warning Colors) */}
      <div className="p-2.5 rounded-[8px] bg-[#FFFBEB] border border-[#FDE68A] flex items-center gap-2 text-[11px] text-[#92400E]">
        <ShieldAlert className="w-4 h-4 text-[#F59E0B] shrink-0" />
        <span>
          <strong>Human Oversight Required:</strong> AI recommendations assist analysis; final batch release decisions must be validated by Lead QA.
        </span>
      </div>
    </div>
  );
}
