import React from 'react';

/**
 * StatusBadge Component for PharmaInspect AI
 * Supports: Approved, Passed, Pending Review, Flagged, Failed, Operational, Synced
 */
export function StatusBadge({ status, className = '' }) {
  const statusMap = {
    Approved: {
      label: 'Approved',
      style: 'bg-[#F0FDF4] text-[#22C55E] border-[#BBF7D0]',
      dot: 'bg-[#22C55E]',
    },
    Passed: {
      label: 'Passed',
      style: 'bg-[#F0FDF4] text-[#22C55E] border-[#BBF7D0]',
      dot: 'bg-[#22C55E]',
    },
    'Pending Review': {
      label: 'Pending Review',
      style: 'bg-[#FFFBEB] text-[#F59E0B] border-[#FDE68A]',
      dot: 'bg-[#F59E0B]',
    },
    Flagged: {
      label: 'Flagged',
      style: 'bg-[#FEF2F2] text-[#EF4444] border-[#FCA5A5]',
      dot: 'bg-[#EF4444]',
    },
    Failed: {
      label: 'Failed',
      style: 'bg-[#FEF2F2] text-[#EF4444] border-[#FCA5A5]',
      dot: 'bg-[#EF4444]',
    },
    Operational: {
      label: 'Operational',
      style: 'bg-[#ECFDF5] text-[#10B981] border-[#A7F3D0]',
      dot: 'bg-[#10B981]',
    },
    Synced: {
      label: 'Synced',
      style: 'bg-[#F0F9FF] text-[#0EA5E9] border-[#E0F2FE]',
      dot: 'bg-[#0EA5E9]',
    },
  };

  const current = statusMap[status] || {
    label: status,
    style: 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',
    dot: 'bg-[#64748B]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-semibold rounded-full border ${current.style} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`}></span>
      {current.label}
    </span>
  );
}
