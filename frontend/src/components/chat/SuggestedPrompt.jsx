import React from 'react';
import { HelpCircle, ChevronRight } from 'lucide-react';

/**
 * SuggestedPrompt Component
 * Displays clickable prompt chips for quick sample questions
 */
export function SuggestedPrompt({ question, category = 'Inspection Query', onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between p-3.5 rounded-[12px] bg-white border border-[#E0F2FE] hover:border-[#0EA5E9] hover:bg-[#F0F9FF] text-left transition-all group shadow-2xs ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#F0F9FF] text-[#0EA5E9] border border-[#E0F2FE] flex items-center justify-center shrink-0 group-hover:bg-[#0EA5E9] group-hover:text-white transition-colors">
          <HelpCircle className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
            {category}
          </span>
          <span className="text-[13px] font-semibold text-[#075985] group-hover:text-[#0EA5E9] transition-colors">
            {question}
          </span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-[#0EA5E9] group-hover:translate-x-0.5 transition-all shrink-0" />
    </button>
  );
}
