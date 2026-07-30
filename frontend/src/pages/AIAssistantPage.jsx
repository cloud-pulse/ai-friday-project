import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConversationPanel } from '../components/chat/ConversationPanel';
import { ChatInput } from '../components/chat/ChatInput';
import { SuggestedPrompt } from '../components/chat/SuggestedPrompt';
import { ReferenceCard } from '../components/chat/ReferenceCard';
import { mockBatchDetails, mockRecentBatches } from '../data/mockData';
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
    response: {
      text: "Analysis of BATCH-2026-0888 (Metformin 850mg):\n\n• Quality Score: 90.0% (Failed target threshold ≥ 95.0%)\n• Primary Anomaly: 32 Seal Integrity Failures concentrated on sealing jaw #2 during Night Shift.\n• Secondary Anomaly: 13 Misaligned Labels caused by feed roller mechanical drift.\n\nInspector Note (Marcus Vance): 'Sub-lot 2 quarantined due to roller temperature drop to 165°C.'",
      aiCard: {
        title: "Root Cause Finding: Sealing Roller Temperature Drop",
        recommendation: "Recalibrate sealing jaw heater block #2 to 185°C ± 2°C and isolate sub-lot 2 before resuming line operations.",
        confidence: 98.6,
      },
      referenceBatch: mockRecentBatches[3], // BATCH-2026-0888
    },
  },
  {
    category: "Defect Trends",
    question: "What is the most common defect across production lines?",
    response: {
      text: "Across 148 analyzed batches (37,250 packages), the defect distribution is:\n\n1. Seal Integrity Failures — 38% (48 occurrences)\n2. Unreadable OCR Expiry Dates — 25% (32 occurrences)\n3. Label Misalignment — 19% (24 occurrences)\n4. Carton Damage — 11% (14 occurrences)\n5. Print Smudge — 7% (9 occurrences)\n\nSeal defects occur predominantly on Production Line A during night shifts when ambient temperature drops below 18°C.",
      aiCard: {
        title: "Trend Finding: Line A Night Shift Seal Anomalies",
        recommendation: "Schedule preventative maintenance for Line A sealing rollers and install automated ambient temperature sensors.",
        confidence: 99.1,
      },
    },
  },
  {
    category: "Comparative Analytics",
    question: "Compare BATCH-2026-0891 with previous batches.",
    response: {
      text: "Comparative Analysis: BATCH-2026-0891 vs Historical Baseline:\n\n• BATCH-2026-0891: Quality Score 96.8% (Passed) | 8 Defects | 98.5% Packaging Integrity\n• BATCH-2026-0889: Quality Score 99.0% (Passed) | 2 Defects | 99.4% Packaging Integrity\n• BATCH-2026-0888: Quality Score 90.0% (Flagged) | 45 Defects | 85.2% Packaging Integrity\n\nBATCH-2026-0891 shows a +1.4% pass rate improvement compared to last week's average.",
      referenceBatch: mockBatchDetails,
    },
  },
  {
    category: "Operational Guidance",
    question: "Should production on Line A continue?",
    response: {
      text: "Current Status for Production Line A:\n\n• Current Batch (BATCH-2026-0891) achieved a 96.8% Quality Score (Compliant).\n• 8 minor seal anomalies were isolated to sub-lot 4 during Morning Shift.\n• EasyOCR verified 100% batch text consistency (BATCH: AMX-9941 | EXP: 09/2028).\n\nAssessment: Production may continue under active monitoring, provided sub-lot 4 units are destroyed per QA protocol.",
      aiCard: {
        title: "Line A Readiness: Approved with Conditions",
        recommendation: "Maintain line speed at 250 units/min and re-verify sealing jaw temperature at 13:00.",
        confidence: 97.8,
      },
    },
  },
  {
    category: "AI Explanation",
    question: "Explain the AI vision findings for package PKG-003.",
    response: {
      text: "Package PKG-003 Visual Inspection Breakdown:\n\n• Vision AI Confidence: 97.8%\n• Bounding Box Location: X:120, Y:80 (Top-right blister pocket)\n• Defect Classification: Foil Tear / Micro-leak\n• OCR Result: BATCH: AMX-9941 | EXP: 09/2028 (Text Verified)\n\nSingle-pass vision analysis detected a 1.2mm foil fracture across blister cavity 3. EasyOCR confirmed label text matches master batch records.",
    },
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

  const handleSendMessage = (queryText) => {
    if (!queryText || isGenerating) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    // Find matched mock response or generate realistic mock response
    const matched = exampleQuestions.find(
      (q) => q.question.toLowerCase() === queryText.toLowerCase()
    );

    setTimeout(() => {
      let assistantMsg;
      if (matched) {
        assistantMsg = {
          id: Date.now() + 1,
          sender: 'assistant',
          text: matched.response.text,
          aiCard: matched.response.aiCard,
          referenceBatch: matched.response.referenceBatch,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      } else {
        assistantMsg = {
          id: Date.now() + 1,
          sender: 'assistant',
          text: `Analysis for "${queryText}":\n\nHistorical inspection data across 148 production batches shows an overall 96.8% compliance rate. Vision AI confidence averages 98.4% across Line A, B, C, and D.\n\nInspector validation note: All anomalies require final inspector sign-off prior to batch release per 21 CFR Part 11 requirements.`,
          aiCard: {
            title: "Analysis Result: Quality Score Compliant",
            recommendation: "Review recent batch summary in Dashboard or proceed to Human Review panel for manual sign-off.",
            confidence: 98.2,
          },
          referenceBatch: mockBatchDetails,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }

      setMessages((prev) => [...prev, assistantMsg]);
      setIsGenerating(false);
    }, 1000);
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

            <ReferenceCard batch={mockBatchDetails} />
          </Card>
        </div>
      </div>
    </div>
  );
}
