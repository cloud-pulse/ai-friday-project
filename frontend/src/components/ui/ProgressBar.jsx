import React from 'react';

/**
 * Enterprise ProgressBar Component
 * Follows locked-design.md: rounded 10px, primary #0EA5E9 fill, optional status label
 */
export function ProgressBar({
  progress = 0,
  label,
  sublabel,
  variant = 'primary', // primary, success, warning, danger
  size = 'md', // sm, md, lg
  className = '',
}) {
  const variantFills = {
    primary: 'bg-[#0EA5E9]',
    success: 'bg-[#22C55E]',
    accent: 'bg-[#10B981]',
    warning: 'bg-[#F59E0B]',
    danger: 'bg-[#EF4444]',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`space-y-1.5 ${className}`}>
      {(label || sublabel) && (
        <div className="flex items-center justify-between text-[13px] font-medium">
          {label && <span className="text-[#075985]">{label}</span>}
          {sublabel && <span className="text-[#64748B]">{sublabel}</span>}
        </div>
      )}
      <div className={`w-full bg-[#E0F2FE] rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} rounded-full transition-all duration-300 ease-out ${
            variantFills[variant] || variantFills.primary
          }`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
