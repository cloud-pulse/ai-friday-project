import React from 'react';
import { Breadcrumb } from './Breadcrumb';

/**
 * Enterprise Page Header Component
 * Follows locked-design.md: 32px Page Title, Subtitle, optional Badge and Action buttons
 */
export function PageHeader({
  title,
  description,
  badge,
  actions,
  showBreadcrumb = true,
  className = '',
}) {
  return (
    <div className={`mb-6 pb-6 border-b border-[#E0F2FE] ${className}`}>
      {showBreadcrumb && <Breadcrumb />}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-[32px] font-bold text-[#075985] tracking-tight leading-none">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {description && (
            <p className="text-[16px] text-[#64748B] font-normal max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
