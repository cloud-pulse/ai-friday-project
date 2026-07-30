import React, { useState, useEffect, useRef } from 'react';
import { chatApi } from '../api/chat';
import { PageHeader } from '../components/layout/PageHeader';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConversationPanel } from '../components/chat/ConversationPanel';
import { ChatInput } from '../components/chat/ChatInput';
import { SuggestedPrompt } from '../components/chat/SuggestedPrompt';
import { ReferenceCard } from '../components/chat/ReferenceCard';
import {
  Sparkles,
  Bot,
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  CheckCircle2,
} from 'lucide-react';

const exampleQuestions = [
  {
    category: "Batch Analysis",
    question: "Why did BATCH-2026-0888 fail inspection?",
  },
  {
    category: "Defect Trends",
    question: "What is the most common defect across production lines?",
  },
  {
    category: "Comparative Analytics",
    question: "Compare BATCH-2026-0891 with previous batches.",
  },
  {
    category: "Operational Guidance",
    question: "Should production on Line A continue?",
  },
  {
    category: "AI Explanation",
    question: "Explain the AI vision findings for package PKG-003.",
  },
];

export function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Welcome Dr. Sarah Chen. I am your AI Quality Copilot powered by single-pass Vision AI analysis and RAG retrieval. Ask me about batch defect trends, root cause explanations, or compliance recommendations.",
      timestamp: '11:45 AM',
      aiCard: {
        title: "AI Copilot Online & GMP Validated",
        recommendation: "Select a suggested question below or type a query to analyze packaging inspection data.",
        confidence: 99.4,
      },
    },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [activeContext, setActiveContext] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const session = await chatApi.createSession();
        setSessionId(session.id);
        
        // Fetch the most recent batch to provide conversational context
        const recentBatchesResponse = await batchesApi.getBatches();
        if (recentBatchesResponse && recentBatchesResponse.items && recentBatchesResponse.items.length > 0) {
          const latestBatch = recentBatchesResponse.items[0];
          const summary = await batchesApi.getBatchSummary(latestBatch.id);
          
          setActiveContext({
            ...latestBatch,
            totalImages: summary.total_images,
            passed: summary.passed,
            failed: summary.failed,
            qualityScore: summary.quality_score,
            status: summary.status
          });
        }
      } catch (err) {
        console.error('Failed to load chat history or batch context:', err);
      } finally {
        setLoading(false);
      }
    };
    initializeChat();
  }, []);

  const handleSendMessage = async (queryText) => {
    if (!queryText || isGenerating || !sessionId) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const response = await chatApi.sendMessage(sessionId, queryText);

      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: response.answer,
        aiCard: null,
        referenceBatch: response.context_used ? response.context_used.length > 0 ? response.context_used[0] : null : null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: 'assistant',
        text: "Sorry, I encountered an error while processing your request.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="AI Quality Assistant"
        description="Enterprise AI copilot for pharmaceutical packaging quality inspection, defect analysis, and compliance recommendations."
        badge={
          <Badge variant="accent" icon={Sparkles}>
            AI Copilot Active
          </Badge>
        }
      />

      {/* Main Copilot Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: Conversation Viewport & Input */}
        <div className="lg:col-span-3 space-y-4 flex flex-col h-[700px]">
          <Card className="flex-1 flex flex-col p-4 border border-[#E0F2FE] overflow-hidden">
            {/* Conversation Header */}
            <div className="pb-3 mb-4 border-b border-[#E0F2FE] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0EA5E9] to-[#10B981] text-white flex items-center justify-center font-bold shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#075985]">Quality Inspection Copilot</h3>
                  <p className="text-[11px] text-[#64748B]">Assisting QA Lead Dr. Sarah Chen</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={HelpCircle}
                  onClick={() => setShowPrompts((p) => !p)}
                >
                  {showPrompts ? 'Hide Suggestions' : 'Show Suggestions'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={RefreshCw}
                  onClick={() => {
                    setMessages([]);
                  }}
                >
                  Reset Chat
                </Button>
              </div>
            </div>

            {/* Conversation Messages Viewport */}
            <ConversationPanel
              messages={messages}
              isGenerating={isGenerating}
            />

            {/* Chat Input Bar */}
            <div className="pt-4 mt-2 border-t border-[#E0F2FE]">
              <ChatInput
                onSendMessage={handleSendMessage}
                onTogglePrompts={() => setShowPrompts((p) => !p)}
                isGenerating={isGenerating}
              />
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Suggested Questions & Context Reference Sidebar */}
        <div className="space-y-6">
          {showPrompts && (
            <Card className="space-y-3">
              <div className="pb-2 border-b border-[#E0F2FE] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#10B981]" />
                <h4 className="text-[14px] font-bold text-[#075985]">Suggested Questions</h4>
              </div>

              <div className="space-y-2.5">
                {exampleQuestions.map((q, idx) => (
                  <SuggestedPrompt
                    key={idx}
                    category={q.category}
                    question={q.question}
                    onClick={() => handleSendMessage(q.question)}
                  />
                ))}
              </div>
            </Card>
          )}

          {/* Active Reference Context Card */}
          <Card className="bg-gradient-to-br from-white to-[#F0F9FF]">
            <div className="pb-3 mb-3 border-b border-[#E0F2FE] flex items-center justify-between">
              <span className="text-[14px] font-bold text-[#075985] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#0EA5E9]" />
                Active Batch Context
              </span>
              <span className="text-[11px] font-semibold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                Synced
              </span>
            </div>

            {activeContext ? <ReferenceCard batch={activeContext} /> : <p className="text-sm text-gray-500">No active batch context.</p>}
          </Card>
        </div>
      </div>
    </div>
  );
}
