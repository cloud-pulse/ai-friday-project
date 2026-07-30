import React from 'react';
import { Card } from './Card';

/**
 * Enterprise EmptyState Component
 * Displays empty placeholder screens with icons, titles, and call-to-action buttons
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <Card className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border-dashed ${className}`}>
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-[#F0F9FF] border border-[#E0F2FE] flex items-center justify-center text-[#0EA5E9] mb-4">
          <Icon className="w-8 h-8" />
        </div>
      )}
      {title && (
        <h3 className="text-[18px] font-semibold text-[#075985] mb-1.5">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-[14px] text-[#64748B] max-w-md mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </Card>
  );
}
