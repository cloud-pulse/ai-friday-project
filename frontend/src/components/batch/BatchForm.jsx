import React from 'react';
import { Layers, Calendar, User, FileText, Activity } from 'lucide-react';

/**
 * BatchForm Component for PharmaInspect AI
 * Manages metadata input for new packaging inspection batches
 */
export function BatchForm({ formData, onChange, className = '' }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  return (
    <div className={`space-y-5 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Batch Name Field */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#075985]">
            <Layers className="w-3.5 h-3.5 text-[#0EA5E9]" />
            Batch Reference Name <span className="text-[#EF4444]">*</span>
          </label>
          <input
            type="text"
            name="batchName"
            value={formData.batchName}
            onChange={handleChange}
            placeholder="e.g. BATCH-2026-0892"
            className="w-full px-3.5 py-2.5 bg-white border border-[#E0F2FE] rounded-[10px] text-[14px] text-[#075985] font-medium placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:bg-white shadow-2xs"
            required
          />
        </div>

        {/* Production Line Field */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#075985]">
            <Activity className="w-3.5 h-3.5 text-[#0EA5E9]" />
            Production Line <span className="text-[#EF4444]">*</span>
          </label>
          <select
            name="productionLine"
            value={formData.productionLine}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-white border border-[#E0F2FE] rounded-[10px] text-[14px] text-[#075985] font-medium focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] shadow-2xs"
          >
            <option value="Line A - Blister Packaging">Line A - Blister Packaging (Solid Oral Dose)</option>
            <option value="Line B - Bottle Labeling & OCR">Line B - Bottle Labeling & OCR</option>
            <option value="Line C - Vial Integrity & Seal">Line C - Vial Integrity & Seal</option>
            <option value="Line D - Liquid Carton Inspection">Line D - Liquid Carton Inspection</option>
          </select>
        </div>

        {/* Shift Field */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#075985]">
            <Calendar className="w-3.5 h-3.5 text-[#0EA5E9]" />
            Production Shift <span className="text-[#EF4444]">*</span>
          </label>
          <select
            name="shift"
            value={formData.shift}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-white border border-[#E0F2FE] rounded-[10px] text-[14px] text-[#075985] font-medium focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] shadow-2xs"
          >
            <option value="Morning Shift (06:00 - 14:00)">Morning Shift (06:00 - 14:00)</option>
            <option value="Evening Shift (14:00 - 22:00)">Evening Shift (14:00 - 22:00)</option>
            <option value="Night Shift (22:00 - 06:00)">Night Shift (22:00 - 06:00)</option>
          </select>
        </div>

        {/* Inspector Name Field */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#075985]">
            <User className="w-3.5 h-3.5 text-[#0EA5E9]" />
            Lead QA Inspector <span className="text-[#EF4444]">*</span>
          </label>
          <input
            type="text"
            name="inspectorName"
            value={formData.inspectorName}
            onChange={handleChange}
            placeholder="Inspector Full Name"
            className="w-full px-3.5 py-2.5 bg-white border border-[#E0F2FE] rounded-[10px] text-[14px] text-[#075985] font-medium placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] shadow-2xs"
            required
          />
        </div>
      </div>

      {/* Optional Notes Field */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#075985]">
          <FileText className="w-3.5 h-3.5 text-[#0EA5E9]" />
          Shift Notes & Special Inspection Instructions (Optional)
        </label>
        <textarea
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          placeholder="Include any specific line conditions, recent maintenance remarks, or lot-specific target parameters..."
          className="w-full px-3.5 py-2.5 bg-white border border-[#E0F2FE] rounded-[10px] text-[14px] text-[#075985] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] shadow-2xs"
        />
      </div>
    </div>
  );
}
