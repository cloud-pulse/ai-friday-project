import React from 'react';
import { Card } from './Card';

/**
 * General Dashboard Modular Card Component
 */
export function DashboardCard({
  title,
  subtitle,
  icon: Icon,
  actions,
  children,
  className = '',
}) {
  return (
    <Card className={`${className}`}>
      {(title || Icon || actions) && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E0F2FE]">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-8 h-8 rounded-lg bg-[#F0F9FF] text-[#0EA5E9] border border-[#E0F2FE] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-[16px] font-semibold text-[#075985] tracking-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[12px] text-[#64748B] mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </Card>
  );
}
