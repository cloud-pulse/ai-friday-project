import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  UserCheck,
  FileText,
  Search,
  Zap,
  Activity,
  ChevronRight,
  Check,
  Layers,
  Lock,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F9FF] text-[#075985] font-sans antialiased flex flex-col">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E0F2FE] px-6 lg:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0EA5E9] to-[#10B981] flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[18px] text-[#075985] tracking-tight">
                PharmaInspect
              </span>
              <span className="text-[11px] font-extrabold px-1.5 py-0.5 rounded bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]">
                AI
              </span>
            </div>
            <p className="text-[11px] font-medium text-[#64748B]">Packaging Quality Platform</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[14px] font-semibold text-[#64748B]">
          <a href="#overview" className="hover:text-[#0EA5E9] transition-colors">
            Overview
          </a>
          <a href="#features" className="hover:text-[#0EA5E9] transition-colors">
            Key Features
          </a>
          <a href="#workflow" className="hover:text-[#0EA5E9] transition-colors">
            AI + Human Workflow
          </a>
          <a href="#compliance" className="hover:text-[#0EA5E9] transition-colors">
            Compliance
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/')}
          >
            Launch Dashboard
          </Button>
          <Button
            variant="primary"
            icon={ArrowRight}
            onClick={() => navigate('/create-batch')}
          >
            Start Inspection
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="overview" className="relative pt-16 pb-20 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E0F2FE] shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#10B981]" />
            <span className="text-[13px] font-semibold text-[#075985]">
              AI-Powered Pharmaceutical Quality Control
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
            <span className="text-[12px] font-medium text-[#64748B]">Human-in-the-Loop</span>
          </div>

          <h1 className="text-[42px] sm:text-[54px] lg:text-[62px] font-extrabold text-[#075985] tracking-tight leading-[1.1]">
            Intelligent Packaging Inspection & Quality Assurance
          </h1>

          <p className="text-[18px] sm:text-[20px] text-[#64748B] font-normal leading-relaxed max-w-3xl mx-auto">
            Combines Vision AI, local OCR verification, and deterministic quality scoring to accelerate packaging inspections while keeping expert human QA inspectors in total control.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              className="w-full sm:w-auto px-8"
              onClick={() => navigate('/create-batch')}
            >
              Start New Inspection Batch
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto px-8"
              onClick={() => navigate('/')}
            >
              Explore Dashboard
            </Button>
          </div>

          {/* Key Metrics Pill Badges */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-[14px] bg-white border border-[#E0F2FE] shadow-2xs text-center">
              <div className="text-[26px] font-extrabold text-[#0EA5E9]">99.4%</div>
              <div className="text-[12px] font-medium text-[#64748B]">Defect Accuracy</div>
            </div>
            <div className="p-4 rounded-[14px] bg-white border border-[#E0F2FE] shadow-2xs text-center">
              <div className="text-[26px] font-extrabold text-[#10B981]">75%</div>
              <div className="text-[12px] font-medium text-[#64748B]">Faster Review Time</div>
            </div>
            <div className="p-4 rounded-[14px] bg-white border border-[#E0F2FE] shadow-2xs text-center">
              <div className="text-[26px] font-extrabold text-[#075985]">100%</div>
              <div className="text-[12px] font-medium text-[#64748B]">Human Validation</div>
            </div>
            <div className="p-4 rounded-[14px] bg-white border border-[#E0F2FE] shadow-2xs text-center">
              <div className="text-[26px] font-extrabold text-[#22C55E]">21 CFR</div>
              <div className="text-[12px] font-medium text-[#64748B]">Part 11 Audit Trail</div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Description Section */}
      <section className="py-16 bg-white border-y border-[#E0F2FE] px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F9FF] text-[#0EA5E9] border border-[#E0F2FE] text-[12px] font-semibold">
              <Activity className="w-3.5 h-3.5" />
              Industry Challenge & Solution
            </div>
            <h2 className="text-[32px] sm:text-[38px] font-bold text-[#075985] tracking-tight leading-tight">
              Solving Packaging Defect Oversight in High-Speed Production Lines
            </h2>
            <p className="text-[16px] text-[#64748B] leading-relaxed">
              Pharmaceutical manufacturing lines produce thousands of medicine packages per hour. Manual inspection is slow, fatigue-prone, and inconsistent, while fully autonomous AI lacks regulatory accountability.
            </p>
            <p className="text-[16px] text-[#64748B] leading-relaxed">
              <strong className="text-[#075985]">PharmaInspect AI</strong> bridges this gap with a single-pass visual inspection model, deterministic quality scoring, and mandatory human sign-off for final compliance reports.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-[14px] font-medium text-[#075985]">
                  Detects broken seals, damaged cartons, misaligned labels, and illegible expiry dates.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-[14px] font-medium text-[#075985]">
                  Calculates batch quality scores deterministically using local Python business rules.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-[14px] font-medium text-[#075985]">
                  Preserves inspector authority with dedicated root cause and corrective action forms.
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[16px] bg-[#F0F9FF] border border-[#E0F2FE] space-y-6">
            <h3 className="text-[20px] font-bold text-[#075985] border-b border-[#E0F2FE] pb-3">
              Optimized Token Architecture
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-[12px] bg-white border border-[#E0F2FE]">
                <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] text-[#10B981] flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold text-[#075985]">Analyze Once</h4>
                  <p className="text-[13px] text-[#64748B] mt-0.5">
                    Vision AI processes images once to generate structured inspection JSON containing defect coordinates and confidence scores.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-[12px] bg-white border border-[#E0F2FE]">
                <div className="w-10 h-10 rounded-lg bg-[#F0F9FF] text-[#0EA5E9] flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold text-[#075985]">Reuse Everywhere</h4>
                  <p className="text-[13px] text-[#64748B] mt-0.5">
                    Structured JSON powers dashboard statistics, local pass rate rules, human validation logs, and RAG chat without re-querying Vision AI.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-[12px] bg-white border border-[#E0F2FE]">
                <div className="w-10 h-10 rounded-lg bg-[#FFFBEB] text-[#F59E0B] flex items-center justify-center font-bold shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold text-[#075985]">Human Validation</h4>
                  <p className="text-[13px] text-[#64748B] mt-0.5">
                    Inspectors validate anomalies, record observations, and authorize final regulatory compliance reports.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] text-[12px] font-semibold">
            <Zap className="w-3.5 h-3.5" />
            Platform Capabilities
          </div>
          <h2 className="text-[32px] sm:text-[40px] font-bold text-[#075985] tracking-tight">
            Enterprise Quality Inspection Features
          </h2>
          <p className="text-[16px] text-[#64748B]">
            Built specifically for pharmaceutical manufacturers operating under strict GMP and FDA regulatory guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-[14px] bg-white border border-[#E0F2FE] shadow-2xs space-y-4 hover:border-[#0EA5E9] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#F0F9FF] text-[#0EA5E9] flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-[18px] font-semibold text-[#075985]">Single-Pass Vision AI</h3>
            <p className="text-[14px] text-[#64748B] leading-relaxed">
              Detects packaging defects including broken seals, dented cartons, print smudges, and missing blister pack tablets.
            </p>
          </div>

          <div className="p-6 rounded-[14px] bg-white border border-[#E0F2FE] shadow-2xs space-y-4 hover:border-[#0EA5E9] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-[18px] font-semibold text-[#075985]">Automated OCR Validation</h3>
            <p className="text-[14px] text-[#64748B] leading-relaxed">
              Extracts batch numbers, manufacturing dates, and expiration dates from packaging labels with precision.
            </p>
          </div>

          <div className="p-6 rounded-[14px] bg-white border border-[#E0F2FE] shadow-2xs space-y-4 hover:border-[#0EA5E9] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FFFBEB] text-[#F59E0B] flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-[18px] font-semibold text-[#075985]">Human-in-the-Loop Review</h3>
            <p className="text-[14px] text-[#64748B] leading-relaxed">
              Allows quality inspectors to confirm or override AI findings, add observation notes, and specify root cause actions.
            </p>
          </div>

          <div className="p-6 rounded-[14px] bg-white border border-[#E0F2FE] shadow-2xs space-y-4 hover:border-[#0EA5E9] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#F0F9FF] text-[#0284C7] flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-[18px] font-semibold text-[#075985]">Local Quality Scoring</h3>
            <p className="text-[14px] text-[#64748B] leading-relaxed">
              Calculates packaging integrity and overall batch pass rates deterministically via Python business logic.
            </p>
          </div>

          <div className="p-6 rounded-[14px] bg-white border border-[#E0F2FE] shadow-2xs space-y-4 hover:border-[#0EA5E9] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] text-[#22C55E] flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-[18px] font-semibold text-[#075985]">AI Draft Report Generator</h3>
            <p className="text-[14px] text-[#64748B] leading-relaxed">
              Generates formal compliance reports combining aggregated batch metrics, inspector observations, and PDF downloads.
            </p>
          </div>

          <div className="p-6 rounded-[14px] bg-white border border-[#E0F2FE] shadow-2xs space-y-4 hover:border-[#0EA5E9] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-[18px] font-semibold text-[#075985]">RAG Quality Assistant</h3>
            <p className="text-[14px] text-[#64748B] leading-relaxed">
              Enables natural language queries over LanceDB historical inspection vectors to investigate defect trends.
            </p>
          </div>
        </div>
      </section>

      {/* AI + Human Review Workflow Overview */}
      <section id="workflow" className="py-20 bg-white border-y border-[#E0F2FE] px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F9FF] text-[#0EA5E9] border border-[#E0F2FE] text-[12px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Inspection Workflow
            </div>
            <h2 className="text-[32px] sm:text-[40px] font-bold text-[#075985] tracking-tight">
              End-to-End Human-in-the-Loop Pipeline
            </h2>
            <p className="text-[16px] text-[#64748B]">
              From production line image capture to final signed compliance certificate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-[14px] bg-[#F0F9FF] border border-[#E0F2FE] relative">
              <div className="text-[12px] font-bold text-[#0EA5E9] uppercase tracking-wider mb-2">Step 1</div>
              <h4 className="text-[16px] font-semibold text-[#075985] mb-2">Upload Batch Images</h4>
              <p className="text-[13px] text-[#64748B]">
                Inspector creates batch metadata and uploads production image folder from line scanner.
              </p>
            </div>

            <div className="p-6 rounded-[14px] bg-[#ECFDF5] border border-[#A7F3D0] relative">
              <div className="text-[12px] font-bold text-[#10B981] uppercase tracking-wider mb-2">Step 2</div>
              <h4 className="text-[16px] font-semibold text-[#075985] mb-2">Vision AI & OCR</h4>
              <p className="text-[13px] text-[#64748B]">
                Llama Vision AI analyzes packaging defects while EasyOCR verifies printed batch numbers.
              </p>
            </div>

            <div className="p-6 rounded-[14px] bg-[#FFFBEB] border border-[#FDE68A] relative">
              <div className="text-[12px] font-bold text-[#F59E0B] uppercase tracking-wider mb-2">Step 3</div>
              <h4 className="text-[16px] font-semibold text-[#075985] mb-2">Human Validation</h4>
              <p className="text-[13px] text-[#64748B]">
                Inspector validates flag anomalies, confirms root causes, and inputs corrective actions.
              </p>
            </div>

            <div className="p-6 rounded-[14px] bg-[#F0FDF4] border border-[#BBF7D0] relative">
              <div className="text-[12px] font-bold text-[#22C55E] uppercase tracking-wider mb-2">Step 4</div>
              <h4 className="text-[16px] font-semibold text-[#075985] mb-2">Approved PDF Report</h4>
              <p className="text-[13px] text-[#64748B]">
                GPT-4o generates formal report draft and saves signed PDF audit trail into LanceDB.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="p-10 md:p-14 rounded-[20px] bg-gradient-to-r from-[#075985] to-[#0EA5E9] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <h2 className="text-[30px] sm:text-[38px] font-extrabold tracking-tight leading-tight">
              Ready to Upgrade Packaging Inspection Quality?
            </h2>
            <p className="text-[16px] text-[#E0F2FE]">
              Deploy PharmaInspect AI on your production lines to reduce defect rates and streamline QA compliance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
            <Button
              variant="accent"
              size="lg"
              icon={ArrowRight}
              className="w-full sm:w-auto px-8"
              onClick={() => navigate('/create-batch')}
            >
              Start Inspection Batch
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto px-8 bg-white/10 text-white border-white/30 hover:bg-white/20"
              onClick={() => navigate('/')}
            >
              Open Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="compliance" className="mt-auto bg-white border-t border-[#E0F2FE] py-10 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-[13px] text-[#64748B]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#0EA5E9] text-white flex items-center justify-center font-bold text-[12px]">
              PI
            </div>
            <span className="font-semibold text-[#075985]">PharmaInspect AI System</span>
            <span>© 2026 Enterprise Healthcare Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#10B981]" />
              21 CFR Part 11 Compliant
            </span>
            <span className="inline-flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#22C55E]" />
              GMP Validated Engine
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0EA5E9]" />
              ISO 13485 Standards
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
