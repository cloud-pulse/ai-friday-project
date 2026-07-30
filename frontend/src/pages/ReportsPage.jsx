import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ReportCard } from '../components/inspection/ReportCard';
import {
  mockBatchDetails,
  mockDefaultReviewData,
} from '../data/mockData';
import {
  FileText,
  Download,
  Save,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Share2,
} from 'lucide-react';

export function ReportsPage() {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  const handleDownloadPdf = () => {
    alert(`Downloading official PDF Certificate of Analysis for ${mockBatchDetails.id} (QA-REP-2026-0891.pdf)...`);
  };

  const handleSaveReport = () => {
    setIsSaved(true);
    alert(`Report for ${mockBatchDetails.id} successfully saved to LanceDB vector store with 21 CFR Part 11 signature hash.`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Page Header */}
      <PageHeader
        title={`Inspection Report — ${mockBatchDetails.id}`}
        description={`Formal pharmaceutical Certificate of Analysis for ${mockBatchDetails.name}. Approved by Lead QA Inspector ${mockDefaultReviewData.approvedBy}.`}
        badge={
          <Badge variant="success" icon={CheckCircle2}>
            Final Approved Certificate
          </Badge>
        }
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              icon={ArrowLeft}
              onClick={() => navigate('/human-review')}
            >
              Back to Human Review
            </Button>

            <Button
              variant="secondary"
              icon={Save}
              onClick={handleSaveReport}
            >
              {isSaved ? 'Report Saved to LanceDB' : 'Save to LanceDB'}
            </Button>

            <Button
              variant="primary"
              icon={Download}
              onClick={handleDownloadPdf}
              className="shadow-md"
            >
              Download PDF Certificate
            </Button>
          </div>
        }
      />

      {/* 2. Formatted Official Report Card */}
      <ReportCard
        batch={mockBatchDetails}
        review={mockDefaultReviewData}
        onDownloadPdf={handleDownloadPdf}
        onSaveReport={handleSaveReport}
      />
    </div>
  );
}
