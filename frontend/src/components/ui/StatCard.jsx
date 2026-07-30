import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Enterprise StatCard KPI Component
 * Displays key metrics, icons, change badges, and subtitle context
 */
export function StatCard({
  title,
  value,
  change,
  changeType = 'positive', // positive, negative, neutral
  icon: Icon,
  iconBg = 'bg-[#F0F9FF] text-[#0EA5E9]',
  subtitle,
  className = '',
}) {
  return (
    <Card className={`relative overflow-hidden card-elevation-hover ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[13px] font-semibold text-[#64748B] tracking-wide uppercase">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-[28px] font-bold text-[#075985] tracking-tight leading-none">
              {value}
            </h2>
            {change && (
              <span
                className={`inline-flex items-center text-[12px] font-semibold px-2 py-0.5 rounded-full ${
                  changeType === 'positive'
                    ? 'bg-[#F0FDF4] text-[#22C55E]'
                    : changeType === 'negative'
                    ? 'bg-[#FEF2F2] text-[#EF4444]'
                    : 'bg-[#F8FAFC] text-[#64748B]'
                }`}
              >
                {changeType === 'positive' ? (
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                ) : changeType === 'negative' ? (
                  <TrendingDown className="w-3.5 h-3.5 mr-1" />
                ) : null}
                {change}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 border border-[#E0F2FE] ${iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {subtitle && (
        <div className="mt-3 pt-3 border-t border-[#E0F2FE] text-[12px] text-[#64748B] flex items-center justify-between">
          <span>{subtitle}</span>
        </div>
      )}
    </Card>
  );
}
