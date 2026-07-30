import React from 'react';

/**
 * Reusable Section Header Component for Dashboard Subsections
 */
export function SectionHeader({
  title,
  subtitle,
  actions,
  className = '',
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 ${className}`}>
      <div>
        <h2 className="text-[20px] font-bold text-[#075985] tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[13px] text-[#64748B]">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
