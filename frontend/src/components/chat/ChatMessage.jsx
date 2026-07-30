import React from 'react';
import { Sparkles, User, Database, ShieldAlert } from 'lucide-react';
import { AIResponseCard } from './AIResponseCard';
import { ReferenceCard } from './ReferenceCard';

/**
 * ChatMessage Component
 * Displays user prompts, assistant messages, AIResponseCards, and ReferenceCards
 */
export function ChatMessage({ message, className = '' }) {
  const isUser = message.sender === 'user';

  return (
    <div
      className={`flex items-start gap-3 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      } ${className}`}
    >
      {/* Avatar Icon */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold shadow-xs ${
          isUser
            ? 'bg-[#075985] text-white'
            : 'bg-gradient-to-tr from-[#0EA5E9] to-[#10B981] text-white'
        }`}
      >
        {isUser ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
      </div>

      {/* Bubble Container */}
      <div className="max-w-2xl space-y-3">
        <div
          className={`p-4 rounded-[14px] shadow-2xs ${
            isUser
              ? 'bg-[#0EA5E9] text-white rounded-tr-none'
              : 'bg-white border border-[#E0F2FE] text-[#075985] rounded-tl-none'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] opacity-80 pb-1.5 mb-2 border-b border-current/20">
            <span className="font-semibold">{isUser ? 'Dr. Sarah Chen (Lead QA)' : 'PharmaInspect AI Copilot'}</span>
            <span>{message.timestamp}</span>
          </div>

          <p className="text-[14px] leading-relaxed whitespace-pre-wrap">
            {message.text}
          </p>
        </div>

        {/* Optional AI High-Level Response Card */}
        {!isUser && message.aiCard && (
          <AIResponseCard
            title={message.aiCard.title}
            recommendation={message.aiCard.recommendation}
            confidence={message.aiCard.confidence}
          />
        )}

        {/* Optional Referenced Batch Card */}
        {!isUser && message.referenceBatch && (
          <ReferenceCard batch={message.referenceBatch} />
        )}
      </div>
    </div>
  );
}
