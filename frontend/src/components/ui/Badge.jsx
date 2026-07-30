import React from 'react';

/**
 * Enterprise Badge / Status Chip Component
 * Follows locked-design.md color usage (Primary, Secondary, Accent, Success, Warning, Danger, Info)
 */
export function Badge({ children, variant = 'primary', className = '', icon: Icon }) {
  const variantStyles = {
    primary: 'bg-[#F0F9FF] text-[#0EA5E9] border-[#E0F2FE]',
    secondary: 'bg-[#F0F9FF] text-[#38BDF8] border-[#E0F2FE]',
    accent: 'bg-[#ECFDF5] text-[#10B981] border-[#A7F3D0]', // AI Features / Success Highlights
    success: 'bg-[#F0FDF4] text-[#22C55E] border-[#BBF7D0]', // Passed / Approved
    warning: 'bg-[#FFFBEB] text-[#F59E0B] border-[#FDE68A]', // Needs Review / Human Validation
    danger: 'bg-[#FEF2F2] text-[#EF4444] border-[#FCA5A5]',  // Failed / Critical Defects
    info: 'bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD]',    // Info / Metadata
    muted: 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',   // Neutral
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium rounded-full border ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
}
