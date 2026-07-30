import React from 'react';
import { Trash2, Image as ImageIcon, FileCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * ImageList Component for PharmaInspect AI
 * Displays selected production images with previews, status chips, and removal controls
 */
export function ImageList({ images = [], onRemoveImage, onClearAll, className = '' }) {
  if (!images || images.length === 0) return null;

  const formatFileSize = (bytes) => {
    if (!bytes) return '245 KB';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-[#075985]">
            Selected Production Images
          </span>
          <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-[#F0F9FF] text-[#0EA5E9] border border-[#E0F2FE]">
            {images.length} File{images.length !== 1 ? 's' : ''}
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          icon={Trash2}
          onClick={onClearAll}
          className="text-[#EF4444] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
        >
          Clear Selection
        </Button>
      </div>

      <div className="max-h-72 overflow-y-auto rounded-[12px] border border-[#E0F2FE] bg-white divide-y divide-[#E0F2FE]">
        {images.map((file, index) => {
          const previewUrl = file.preview || (file instanceof File ? URL.createObjectURL(file) : null);

          return (
            <div
              key={index}
              className="p-3 flex items-center justify-between gap-4 hover:bg-[#F0F9FF]/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="w-10 h-10 rounded-[8px] object-cover border border-[#E0F2FE] shrink-0 bg-[#F8FAFC]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-[8px] bg-[#F0F9FF] border border-[#E0F2FE] flex items-center justify-center text-[#0EA5E9] shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-[#075985] truncate">
                    {file.name}
                  </div>
                  <div className="text-[11px] text-[#64748B] flex items-center gap-2">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span className="text-[#10B981] flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="p-1.5 text-[#64748B] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                title="Remove image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
