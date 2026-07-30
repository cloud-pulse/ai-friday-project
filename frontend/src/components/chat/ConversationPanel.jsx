import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { EmptyState } from '../ui/EmptyState';
import { Sparkles } from 'lucide-react';

/**
 * ConversationPanel Component
 * Manages message scrolling, typing state, and empty screen rendering
 */
export function ConversationPanel({ messages = [], isGenerating = false, className = '' }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  return (
    <div className={`flex-1 overflow-y-auto p-6 space-y-6 bg-[#F0F9FF]/30 rounded-[14px] border border-[#E0F2FE] ${className}`}>
      {messages.length > 0 ? (
        messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))
      ) : (
        <EmptyState
          icon={Sparkles}
          title="AI Quality Copilot Ready"
          description="Ask questions about batch defect trends, line parameters, or recommended corrective actions to assist your QA decisions."
        />
      )}

      {isGenerating && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
}
