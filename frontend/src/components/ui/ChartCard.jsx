import React from 'react';
import { Card } from './Card';

/**
 * Reusable Chart Container Card
 * Includes header, subtitle, actions slot, and responsive viewport wrapper
 */
export function ChartCard({
  title,
  subtitle,
  actions,
  children,
  className = '',
}) {
  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E0F2FE]">
        <div>
          <h3 className="text-[18px] font-semibold text-[#075985] tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[13px] text-[#64748B] mt-0.5">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      <div className="w-full flex-1 min-h-[280px] flex items-center justify-center">
        {children}
      </div>
    </Card>
  );
}
