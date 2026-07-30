import React from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FolderUp, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * UploadZone Component for PharmaInspect AI
 * Integrates react-dropzone with folder selection & drag-and-drop support
 */
export function UploadZone({ onFilesAdded, onLoadDemoFolder, isUploading = false, className = '' }) {
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFilesAdded(acceptedFiles);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
  });

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-[14px] p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-[#0EA5E9] bg-[#F0F9FF] scale-[1.005]'
            : 'border-[#E0F2FE] bg-white hover:border-[#38BDF8] hover:bg-[#F0F9FF]/40'
        }`}
      >
        <input {...getInputProps()} directory="" webkitdirectory="" />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
            isDragActive ? 'bg-[#0EA5E9] text-white' : 'bg-[#F0F9FF] text-[#0EA5E9] border border-[#E0F2FE]'
          }`}>
            <UploadCloud className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-[16px] font-semibold text-[#075985]">
              {isDragActive ? 'Drop production images here...' : 'Drag & drop image folder here'}
            </h4>
            <p className="text-[13px] text-[#64748B] mt-1 max-w-sm">
              Upload production line image captures. Supports complete batch folders containing JPEG, PNG, or WEBP inspection files.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              accept=".png, .jpg, .jpeg" 
              variant="secondary"
              size="sm"
              icon={FolderUp}
              onClick={(e) => {
                e.stopPropagation();
                // trigger file dialog
                document.querySelector('input[type="file"]')?.click();
              }}
            >
              Browse Folder / Files
            </Button>

            <span className="text-[12px] text-[#64748B] font-medium">or</span>

            <Button
              type="button"
              variant="accent"
              size="sm"
              icon={Sparkles}
              onClick={(e) => {
                e.stopPropagation();
                if (onLoadDemoFolder) onLoadDemoFolder();
              }}
            >
              Load Demo Shift Folder (12 Images)
            </Button>
          </div>

          <div className="pt-2 flex items-center gap-4 text-[11px] text-[#64748B]">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Up to 500 images per batch
            </span>
            <span className="inline-flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-[#0EA5E9]" /> Single-pass Vision AI & OCR
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
