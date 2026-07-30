import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { batchesApi } from '../api/batches';
import { inspectionApi } from '../api/inspection';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { BatchForm } from '../components/batch/BatchForm';
import { UploadZone } from '../components/batch/UploadZone';
import { ImageList } from '../components/batch/ImageList';
import {
  FolderPlus,
  Play,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileCheck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export function CreateBatchPage() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    batchName: `BATCH-${new Date().getFullYear()}-0${Math.floor(Math.random() * 800 + 100)}`,
    productionLine: 'Line A - Blister Packaging',
    shift: 'Morning Shift (06:00 - 14:00)',
    inspectorName: 'Dr. Sarah Chen',
    notes: '',
  });

  // Images State
  const [images, setImages] = useState([]);

  // Mock Analysis Progress State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  // Handle file addition
  const handleFilesAdded = (newFiles) => {
    setImages((prev) => [...prev, ...newFiles]);
  };

  // Handle demo folder load
  const handleLoadDemoFolder = () => {
    const mockFiles = Array.from({ length: 12 }).map((_, idx) => ({
      name: `pkg_inspect_${String(idx + 1).padStart(3, '0')}.jpg`,
      size: 245000 + idx * 12500,
      preview: `https://picsum.photos/seed/pharma_${idx + 101}/400/300`,
    }));
    setImages(mockFiles);
  };

  // Remove single image
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear all images
  const handleClearAll = () => {
    setImages([]);
  };

  // Trigger Mock Analysis Workflow
  const handleAnalyzeBatch = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert('Please upload or select at least one production image for analysis.');
      return;
    }

    try {
      setIsAnalyzing(true);
      setAnalysisProgress(5);
      setCurrentStep('Creating batch record...');

      const newBatch = await batchesApi.createBatch({
        name: formData.batchName,
        production_line: formData.productionLine,
        shift: formData.shift,
        notes: formData.inspectorName + (formData.notes ? ' - ' + formData.notes : '')
      });

      setCurrentStep('Uploading and analyzing images...');

      let completed = 0;
      for (const image of images) {
        let uploadFile = image;
        if (!image.slice && image.preview) {
          const response = await fetch(image.preview);
          const blob = await response.blob();
          uploadFile = new File([blob], image.name, { type: 'image/jpeg' });
        }
        await inspectionApi.uploadImage(newBatch.id, uploadFile);
        completed += 1;
        setAnalysisProgress(Math.floor(5 + (completed / images.length) * 90));
      }

      setCurrentStep('Batch analysis complete!');
      setAnalysisProgress(100);

      setTimeout(() => {
        navigate(`/inspection-summary?batchId=${newBatch.id}`);
      }, 600);

    } catch (error) {
      console.error('Error during analysis:', error);
      alert('An error occurred during batch analysis.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Create Inspection Batch"
        description="Configure production line parameters, upload factory image captures, and launch AI-assisted packaging quality analysis."
        badge={
          <Badge variant="info" icon={FolderPlus}>
            New Batch Workflow
          </Badge>
        }
      />

      {/* Analysis Loading Overlay Modal / Banner when Analyzing */}
      {isAnalyzing && (
        <Card className="bg-gradient-to-r from-[#075985] to-[#0EA5E9] text-white p-8 border-none shadow-xl animate-fade-in">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-[20px] font-bold">Analyzing Packaging Batch</h3>
                  <p className="text-[13px] text-[#E0F2FE]">{formData.batchName} • {images.length} Images</p>
                </div>
              </div>
              <span className="text-[18px] font-extrabold text-white">{analysisProgress}%</span>
            </div>

            <ProgressBar
              progress={analysisProgress}
              variant="accent"
              size="lg"
            />

            <div className="flex items-center justify-between text-[13px] text-[#E0F2FE] font-medium pt-1">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#10B981] animate-spin" />
                {currentStep}
              </span>
              <span>Analyze Once, Reuse Everywhere Strategy</span>
            </div>
          </div>
        </Card>
      )}

      {/* Main Workflow Form Container */}
      <form onSubmit={handleAnalyzeBatch} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form Controls (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1: Batch Identification & Metadata */}
            <Card>
              <div className="pb-4 mb-5 border-b border-[#E0F2FE]">
                <h3 className="text-[18px] font-semibold text-[#075985]">
                  1. Batch Details & Production Parameters
                </h3>
                <p className="text-[13px] text-[#64748B] mt-0.5">
                  Define production line parameters, shift metadata, and inspector assignment.
                </p>
              </div>

              <BatchForm
                formData={formData}
                onChange={setFormData}
              />
            </Card>

            {/* Section 2: Folder & Drag-and-Drop Image Upload */}
            <Card>
              <div className="pb-4 mb-5 border-b border-[#E0F2FE]">
                <h3 className="text-[18px] font-semibold text-[#075985]">
                  2. Upload Production Line Images
                </h3>
                <p className="text-[13px] text-[#64748B] mt-0.5">
                  Select a production image folder captured by factory line cameras.
                </p>
              </div>

              <UploadZone
                onFilesAdded={handleFilesAdded}
                onLoadDemoFolder={handleLoadDemoFolder}
                isUploading={isAnalyzing}
              />

              {/* Selected Images Preview List */}
              <div className="mt-6">
                {images.length > 0 ? (
                  <ImageList
                    images={images}
                    onRemoveImage={handleRemoveImage}
                    onClearAll={handleClearAll}
                  />
                ) : (
                  <EmptyState
                    icon={UploadCloud}
                    title="No Images Selected Yet"
                    description="Drag & drop a production folder above, or click 'Load Demo Shift Folder' to test with sample images."
                  />
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Summary Panel & Actions (1 col) */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <div className="pb-4 mb-4 border-b border-[#E0F2FE]">
                <h3 className="text-[18px] font-semibold text-[#075985]">
                  Batch Summary
                </h3>
                <p className="text-[12px] text-[#64748B]">Ready for Vision AI processing</p>
              </div>

              <div className="space-y-4 text-[13px]">
                <div className="flex justify-between py-2 border-b border-[#E0F2FE]">
                  <span className="text-[#64748B]">Batch Name:</span>
                  <span className="font-semibold text-[#075985]">{formData.batchName}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-[#E0F2FE]">
                  <span className="text-[#64748B]">Production Line:</span>
                  <span className="font-medium text-[#075985] truncate max-w-[150px]">{formData.productionLine}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-[#E0F2FE]">
                  <span className="text-[#64748B]">Shift:</span>
                  <span className="font-medium text-[#075985]">{formData.shift.split(' ')[0]}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-[#E0F2FE]">
                  <span className="text-[#64748B]">Inspector:</span>
                  <span className="font-medium text-[#075985]">{formData.inspectorName}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-[#E0F2FE]">
                  <span className="text-[#64748B]">Images Loaded:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[12px] ${
                    images.length > 0 ? 'bg-[#F0FDF4] text-[#22C55E]' : 'bg-[#FFFBEB] text-[#F59E0B]'
                  }`}>
                    {images.length} Image{images.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="pt-3 space-y-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    icon={Play}
                    isLoading={isAnalyzing}
                    disabled={images.length === 0 || isAnalyzing}
                    className="w-full justify-center shadow-md text-[15px]"
                  >
                    {isAnalyzing ? 'Analyzing Batch...' : 'Analyze Batch'}
                  </Button>

                  <p className="text-[11px] text-[#64748B] text-center leading-relaxed">
                    Triggers single-pass Vision AI & OCR extraction. Local quality score will be computed deterministically.
                  </p>
                </div>
              </div>
            </Card>

            {/* Compliance Note */}
            <div className="p-4 rounded-[14px] bg-white border border-[#E0F2FE] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
              <p className="text-[12px] text-[#64748B] leading-relaxed">
                All batch creation events are timestamped and logged into the 21 CFR Part 11 audit log.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
