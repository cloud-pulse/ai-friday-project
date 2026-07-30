import React from 'react';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';
import { ShieldCheck, Award, CheckCircle2 } from 'lucide-react';

/**
 * QualityScoreCard Component
 * Displays overall batch quality score and sub-scores (Packaging Integrity, Label Accuracy, Seal Quality)
 */
export function QualityScoreCard({ scores, overallScore = 96.8, className = '' }) {
  const getScoreVariant = (val) => {
    if (val >= 95) return 'success';
    if (val >= 90) return 'warning';
    return 'danger';
  };

  return (
    <Card className={`bg-gradient-to-br from-white to-[#F0F9FF] ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-5 border-b border-[#E0F2FE]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-[16px] bg-[#0EA5E9] text-white flex flex-col items-center justify-center shadow-md shrink-0">
            <span className="text-[22px] font-extrabold leading-none">{overallScore}%</span>
            <span className="text-[10px] font-bold tracking-wider uppercase opacity-90">Score</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[18px] font-semibold text-[#075985]">Batch Quality Rating</h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-[#F0FDF4] text-[#22C55E] border border-[#BBF7D0]">
                <CheckCircle2 className="w-3 h-3" /> Target Passed
              </span>
            </div>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Deterministic Python Quality Engine Evaluation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-[#64748B] bg-white px-3 py-2 rounded-[10px] border border-[#E0F2FE]">
          <Award className="w-4 h-4 text-[#10B981]" />
          <span>GMP Threshold: <strong>≥ 95.0%</strong></span>
        </div>
      </div>

      {/* Sub-Score Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
        <div>
          <ProgressBar
            label="Packaging Integrity"
            sublabel={`${scores?.packagingIntegrity ?? 98.5}%`}
            progress={scores?.packagingIntegrity ?? 98.5}
            variant={getScoreVariant(scores?.packagingIntegrity ?? 98.5)}
            size="sm"
          />
        </div>
        <div>
          <ProgressBar
            label="Label & OCR Accuracy"
            sublabel={`${scores?.labelAccuracy ?? 99.2}%`}
            progress={scores?.labelAccuracy ?? 99.2}
            variant={getScoreVariant(scores?.labelAccuracy ?? 99.2)}
            size="sm"
          />
        </div>
        <div>
          <ProgressBar
            label="Seal Quality"
            sublabel={`${scores?.sealQuality ?? 92.4}%`}
            progress={scores?.sealQuality ?? 92.4}
            variant={getScoreVariant(scores?.sealQuality ?? 92.4)}
            size="sm"
          />
        </div>
      </div>
    </Card>
  );
}
