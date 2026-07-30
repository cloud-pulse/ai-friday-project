import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { UserCheck, FileText, AlertTriangle, ShieldCheck, Check, X, Edit3 } from 'lucide-react';

/**
 * ReviewForm Component
 * Form allowing QA inspector to validate AI observations, edit findings, record root causes, define corrective actions, and grant final sign-off
 */
export function ReviewForm({
  initialData = {},
  onSubmit,
  isSubmitted = false,
  className = '',
}) {
  const [formData, setFormData] = useState({
    inspectorNotes: initialData.inspectorNotes || '',
    rootCause: initialData.rootCause || 'Sealing Roller Temperature Fluctuation',
    correctiveActions: initialData.correctiveActions || '',
    finalDecision: initialData.finalDecision || 'Approved with Conditions',
    acceptedFindings: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <Card className={`border-l-4 border-l-[#F59E0B] ${className}`}>
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E0F2FE]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFFBEB] text-[#F59E0B] border border-[#FDE68A] flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-[#075985]">Human Validation & Sign-Off Form</h3>
            <p className="text-[12px] text-[#64748B]">Inspector manual observation and corrective action log</p>
          </div>
        </div>

        {isSubmitted ? (
          <StatusBadge status="Approved" />
        ) : (
          <StatusBadge status="Pending Review" />
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Review & Edit AI Findings Toggle */}
        <div className="p-4 rounded-[12px] bg-[#F0F9FF] border border-[#E0F2FE] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#075985]">AI Findings Validation</span>
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#075985] cursor-pointer">
                <input
                  type="radio"
                  name="acceptedFindings"
                  checked={formData.acceptedFindings === true}
                  onChange={() => setFormData((p) => ({ ...p, acceptedFindings: true }))}
                  className="text-[#0EA5E9] focus:ring-[#0EA5E9]"
                />
                Accept AI Observations
              </label>
              <label className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#075985] cursor-pointer ml-3">
                <input
                  type="radio"
                  name="acceptedFindings"
                  checked={formData.acceptedFindings === false}
                  onChange={() => setFormData((p) => ({ ...p, acceptedFindings: false }))}
                  className="text-[#0EA5E9] focus:ring-[#0EA5E9]"
                />
                Override Findings
              </label>
            </div>
          </div>
        </div>

        {/* 2. Root Cause Classification */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-[#075985] flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
            Root Cause Category <span className="text-[#EF4444]">*</span>
          </label>
          <select
            name="rootCause"
            value={formData.rootCause}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-white border border-[#E0F2FE] rounded-[10px] text-[14px] text-[#075985] font-medium focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
            required
          >
            <option value="Sealing Roller Temperature Fluctuation">Sealing Roller Temperature Fluctuation</option>
            <option value="Raw Foil Material Defect">Raw Foil Material Defect</option>
            <option value="OCR Ribbon Printer Smudge">OCR Ribbon Printer Smudge</option>
            <option value="Machine Mechanical Calibration Drift">Machine Mechanical Calibration Drift</option>
            <option value="Operator Feed Alignment Issue">Operator Feed Alignment Issue</option>
            <option value="None / False Positive AI Alarm">None / False Positive AI Alarm</option>
          </select>
        </div>

        {/* 3. Inspector Notes */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-[#075985] flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5 text-[#0EA5E9]" />
            Inspector Observations & Notes <span className="text-[#EF4444]">*</span>
          </label>
          <textarea
            name="inspectorNotes"
            rows={3}
            value={formData.inspectorNotes}
            onChange={handleChange}
            placeholder="Document your physical verification of the flagged units..."
            className="w-full px-3.5 py-2.5 bg-white border border-[#E0F2FE] rounded-[10px] text-[14px] text-[#075985] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
            required
          />
        </div>

        {/* 4. Corrective Actions */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-[#075985] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#10B981]" />
            Required Corrective & Preventive Actions (CAPA) <span className="text-[#EF4444]">*</span>
          </label>
          <textarea
            name="correctiveActions"
            rows={3}
            value={formData.correctiveActions}
            onChange={handleChange}
            placeholder="Detail lot quarantine actions, machine recalibrations, or isolation protocols..."
            className="w-full px-3.5 py-2.5 bg-white border border-[#E0F2FE] rounded-[10px] text-[14px] text-[#075985] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
            required
          />
        </div>

        {/* 5. Final Decision Toggles */}
        <div className="space-y-2 pt-2 border-t border-[#E0F2FE]">
          <label className="text-[13px] font-bold text-[#075985] uppercase tracking-wider">
            Final QA Approval Decision
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label
              className={`p-3.5 rounded-[12px] border text-center cursor-pointer transition-all ${
                formData.finalDecision === 'Approved' || formData.finalDecision === 'Approved with Conditions'
                  ? 'bg-[#F0FDF4] border-[#22C55E] text-[#22C55E] font-bold ring-2 ring-[#22C55E]/20'
                  : 'bg-white border-[#E0F2FE] text-[#64748B] hover:border-[#22C55E]'
              }`}
            >
              <input
                type="radio"
                name="finalDecision"
                value="Approved with Conditions"
                checked={formData.finalDecision.includes('Approved')}
                onChange={handleChange}
                className="sr-only"
              />
              <Check className="w-5 h-5 mx-auto mb-1" />
              <div className="text-[13px]">Approve Batch</div>
              <div className="text-[10px] font-normal opacity-80">Release for distribution</div>
            </label>

            <label
              className={`p-3.5 rounded-[12px] border text-center cursor-pointer transition-all ${
                formData.finalDecision === 'Quarantine Sub-Lot'
                  ? 'bg-[#FFFBEB] border-[#F59E0B] text-[#F59E0B] font-bold ring-2 ring-[#F59E0B]/20'
                  : 'bg-white border-[#E0F2FE] text-[#64748B] hover:border-[#F59E0B]'
              }`}
            >
              <input
                type="radio"
                name="finalDecision"
                value="Quarantine Sub-Lot"
                checked={formData.finalDecision === 'Quarantine Sub-Lot'}
                onChange={handleChange}
                className="sr-only"
              />
              <AlertTriangle className="w-5 h-5 mx-auto mb-1" />
              <div className="text-[13px]">Quarantine Sub-Lot</div>
              <div className="text-[10px] font-normal opacity-80">Isolate defect units</div>
            </label>

            <label
              className={`p-3.5 rounded-[12px] border text-center cursor-pointer transition-all ${
                formData.finalDecision === 'Reject Batch'
                  ? 'bg-[#FEF2F2] border-[#EF4444] text-[#EF4444] font-bold ring-2 ring-[#EF4444]/20'
                  : 'bg-white border-[#E0F2FE] text-[#64748B] hover:border-[#EF4444]'
              }`}
            >
              <input
                type="radio"
                name="finalDecision"
                value="Reject Batch"
                checked={formData.finalDecision === 'Reject Batch'}
                onChange={handleChange}
                className="sr-only"
              />
              <X className="w-5 h-5 mx-auto mb-1" />
              <div className="text-[13px]">Reject Entire Batch</div>
              <div className="text-[10px] font-normal opacity-80">Rework or destroy</div>
            </label>
          </div>
        </div>

        {/* Submit Sign-off Button */}
        <div className="pt-3">
          <Button
            type="submit"
            variant="accent"
            size="lg"
            icon={ShieldCheck}
            className="w-full justify-center text-[15px] font-bold shadow-md"
          >
            Authorize E-Signature & Generate Final Report
          </Button>
        </div>
      </form>
    </Card>
  );
}
