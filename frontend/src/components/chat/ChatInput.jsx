import React, { useState } from 'react';
import { Send, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * ChatInput Component
 * Text bar with send action and prompt shortcuts trigger
 */
export function ChatInput({ onSendMessage, onTogglePrompts, isGenerating = false, className = '' }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || isGenerating) return;
    onSendMessage(query);
    setQuery('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        {onTogglePrompts && (
          <button
            type="button"
            onClick={onTogglePrompts}
            className="p-3 text-[#64748B] hover:text-[#0EA5E9] hover:bg-[#F0F9FF] border border-[#E0F2FE] rounded-[10px] transition-colors shrink-0"
            title="Show suggested questions"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        )}

        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about batch defects, quality trends, or recommended corrective actions..."
            className="w-full pl-4 pr-12 py-3 bg-[#F0F9FF] border border-[#E0F2FE] rounded-[10px] text-[14px] text-[#075985] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:bg-white shadow-2xs transition-all"
            disabled={isGenerating}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          icon={Send}
          isLoading={isGenerating}
          disabled={!query.trim() || isGenerating}
          className="px-6 py-3 shadow-md"
        >
          Send
        </Button>
      </form>

      <div className="flex items-center justify-between text-[11px] text-[#64748B] px-1">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
          Llama-3.3 70B Assistant Active
        </span>
        <span className="flex items-center gap-1 font-medium text-[#075985]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0EA5E9]" />
          Human-in-the-Loop AI Copilot
        </span>
      </div>
    </div>
  );
}
