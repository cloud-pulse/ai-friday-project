import React from 'react';
import { Card } from './Card';
import { Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

/**
 * RecommendationCard Component
 * Displays AI summary findings, model confidence, and requires review indicators using Accent colors
 */
export function RecommendationCard({
  title = 'AI Vision & OCR Recommendation',
  summary,
  recommendation,
  confidence = 98.4,
  requiresReview = true,
  className = '',
}) {
  return (
    <Card className={`bg-gradient-to-r from-[#ECFDF5] to-white border-[#A7F3D0] ${className}`}>
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-4 border-b border-[#A7F3D0]/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center shadow-xs shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[16px] font-semibold text-[#075985]">{title}</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#10B981] text-white">
                {confidence}% Confidence
              </span>
            </div>
            <p className="text-[12px] text-[#047857] font-medium">Llama-3.2 Vision + EasyOCR Engine</p>
          </div>
        </div>

        {requiresReview && (
          <StatusBadge status="Pending Review" />
        )}
      </div>

      <div className="pt-4 space-y-3">
        {summary && (
          <div>
            <span className="text-[12px] font-bold text-[#075985] uppercase tracking-wider">AI Observation Summary</span>
            <p className="text-[14px] text-[#075985] mt-1 leading-relaxed">{summary}</p>
          </div>
        )}

        {recommendation && (
          <div className="p-3.5 rounded-[10px] bg-white border border-[#A7F3D0] flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
            <div>
              <span className="text-[12px] font-semibold text-[#92400E]">Action Recommendation</span>
              <p className="text-[13px] text-[#075985] mt-0.5">{recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
