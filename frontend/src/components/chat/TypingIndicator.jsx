import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * TypingIndicator Component
 * Animated 3-dot indicator showing AI Assistant is formulating response
 */
export function TypingIndicator({ className = '' }) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0EA5E9] to-[#10B981] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
        <Sparkles className="w-5 h-5 animate-pulse" />
      </div>

      <div className="p-4 rounded-[14px] rounded-tl-none bg-white border border-[#E0F2FE] shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-[12px] font-semibold text-[#10B981]">
          <span>AI Quality Copilot is searching inspection database...</span>
        </div>
        <div className="flex items-center gap-1.5 py-1">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-bounce"></span>
        </div>
      </div>
    </div>
  );
}
