import React, { useState } from 'react';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { Eye, Check, X, Search, Filter, AlertTriangle, Layers } from 'lucide-react';

/**
 * InspectionTable Component
 * Displays package inspection results table with image preview drawer/modal support
 */
export function InspectionTable({ items = [], onSelectImage, className = '' }) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPreviewItem, setSelectedPreviewItem] = useState(null);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.defect.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === 'All' ||
      (filterStatus === 'Failed' && item.status === 'Failed') ||
      (filterStatus === 'Passed' && item.status === 'Passed');
    return matchesSearch && matchesFilter;
  });

  const handleOpenPreview = (item) => {
    setSelectedPreviewItem(item);
    if (onSelectImage) onSelectImage(item);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F0F9FF] p-3 rounded-[12px] border border-[#E0F2FE]">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search package ID or defect..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#E0F2FE] rounded-[8px] text-[13px] text-[#075985] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-[12px] font-medium text-[#64748B]">Filter Status:</span>
          <div className="inline-flex p-1 rounded-[8px] bg-white border border-[#E0F2FE] text-[12px]">
            <button
              type="button"
              onClick={() => setFilterStatus('All')}
              className={`px-2.5 py-1 rounded-[6px] font-semibold transition-colors ${
                filterStatus === 'All' ? 'bg-[#0EA5E9] text-white' : 'text-[#64748B] hover:text-[#075985]'
              }`}
            >
              All ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('Failed')}
              className={`px-2.5 py-1 rounded-[6px] font-semibold transition-colors ${
                filterStatus === 'Failed' ? 'bg-[#EF4444] text-white' : 'text-[#64748B] hover:text-[#EF4444]'
              }`}
            >
              Flagged ({items.filter((i) => i.status === 'Failed').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('Passed')}
              className={`px-2.5 py-1 rounded-[6px] font-semibold transition-colors ${
                filterStatus === 'Passed' ? 'bg-[#22C55E] text-white' : 'text-[#64748B] hover:text-[#22C55E]'
              }`}
            >
              Passed ({items.filter((i) => i.status === 'Passed').length})
            </button>
          </div>
        </div>
      </div>

      {/* Package Inspection Table */}
      <div className="overflow-x-auto rounded-[12px] border border-[#E0F2FE] bg-white">
        <table className="w-full text-left text-[13px] border-collapse">
          <thead className="bg-[#F0F9FF] text-[#075985] font-semibold border-b border-[#E0F2FE]">
            <tr>
              <th className="py-3 px-4">Package Item</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4">Detected Defect</th>
              <th className="py-3 px-4">OCR Extracted String</th>
              <th className="py-3 px-4 text-center">Confidence</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0F2FE]">
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                onClick={() => handleOpenPreview(item)}
                className={`hover:bg-[#F0F9FF]/60 transition-colors cursor-pointer ${
                  item.status === 'Failed' ? 'bg-[#FEF2F2]/30' : ''
                }`}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imagePreview}
                      alt={item.id}
                      className="w-11 h-11 rounded-[8px] object-cover border border-[#E0F2FE] bg-[#F8FAFC]"
                    />
                    <div>
                      <div className="font-semibold text-[#075985]">{item.id}</div>
                      <div className="text-[11px] text-[#64748B]">{item.filename}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <StatusBadge status={item.status} />
                </td>
                <td className="py-3 px-4 font-medium">
                  {item.defect !== 'None' ? (
                    <span className="text-[#EF4444] font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {item.defect}
                    </span>
                  ) : (
                    <span className="text-[#64748B]">None (Compliant)</span>
                  )}
                </td>
                <td className="py-3 px-4 text-[#075985] font-mono text-[12px]">
                  <div className="flex items-center gap-1.5">
                    {item.ocrMatched ? (
                      <Check className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-[#EF4444] shrink-0" />
                    )}
                    <span>{item.ocrText}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center font-bold text-[#0EA5E9]">
                  {item.confidence}%
                </td>
                <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Eye}
                    onClick={() => handleOpenPreview(item)}
                  >
                    Preview
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Image Preview Modal Placeholder */}
      {selectedPreviewItem && (
        <div
          className="fixed inset-0 z-50 bg-[#075985]/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedPreviewItem(null)}
        >
          <div
            className="bg-white rounded-[16px] border border-[#E0F2FE] max-w-xl w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E0F2FE]">
              <div>
                <h3 className="text-[18px] font-bold text-[#075985]">
                  Package Visual Preview — {selectedPreviewItem.id}
                </h3>
                <p className="text-[12px] text-[#64748B]">{selectedPreviewItem.filename}</p>
              </div>
              <StatusBadge status={selectedPreviewItem.status} />
            </div>

            {/* Bounding Box Image Preview Area */}
            <div className="relative rounded-[12px] overflow-hidden border border-[#E0F2FE] bg-[#F8FAFC]">
              <img
                src={selectedPreviewItem.imagePreview}
                alt={selectedPreviewItem.id}
                className="w-full h-64 object-cover"
              />
              {selectedPreviewItem.bbox && (
                <div
                  className="absolute border-2 border-[#EF4444] bg-[#EF4444]/20 rounded flex items-start justify-start p-1"
                  style={{
                    top: '25%',
                    left: '30%',
                    width: '40%',
                    height: '35%',
                  }}
                >
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EF4444] text-white">
                    {selectedPreviewItem.bbox.label} ({selectedPreviewItem.confidence}%)
                  </span>
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-[10px] bg-[#F0F9FF] border border-[#E0F2FE] space-y-1.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Defect Description:</span>
                <span className="font-semibold text-[#075985]">{selectedPreviewItem.defect}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">OCR String:</span>
                <span className="font-mono text-[#075985]">{selectedPreviewItem.ocrText}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Vision Confidence:</span>
                <span className="font-bold text-[#0EA5E9]">{selectedPreviewItem.confidence}%</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" onClick={() => setSelectedPreviewItem(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
