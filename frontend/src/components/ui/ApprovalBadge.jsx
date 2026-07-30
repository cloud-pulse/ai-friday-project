import React from 'react';
import { CheckCircle2, Clock, XCircle, ShieldCheck } from 'lucide-react';

/**
 * ApprovalBadge Component
 * Visually distinguishes workflow stages: Draft AI Finding, Under Human Review, Approved by QA, Rejected
 */
export function ApprovalBadge({ status = 'Pending Review', className = '' }) {
  const badgeMap = {
    'Draft AI Result': {
      label: 'Draft AI Result',
      icon: Clock,
      style: 'bg-[#F0F9FF] text-[#0EA5E9] border-[#E0F2FE]',
    },
    'Pending Review': {
      label: 'Under Human Review',
      icon: Clock,
      style: 'bg-[#FFFBEB] text-[#F59E0B] border-[#FDE68A]',
    },
    Approved: {
      label: 'Approved by Lead QA',
      icon: ShieldCheck,
      style: 'bg-[#F0FDF4] text-[#22C55E] border-[#BBF7D0]',
    },
    Rejected: {
      label: 'Rejected / Quarantined',
      icon: XCircle,
      style: 'bg-[#FEF2F2] text-[#EF4444] border-[#FCA5A5]',
    },
  };

  const current = badgeMap[status] || badgeMap['Pending Review'];
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-[12px] font-bold rounded-full border shadow-2xs ${current.style} ${className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {current.label}
    </span>
  );
}
