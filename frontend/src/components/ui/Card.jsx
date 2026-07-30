import React from 'react';

/**
 * Enterprise Surface Card Component
 * Follows locked-design.md: Surface #FFFFFF, Radius 14px, Border #E0F2FE, Soft elevation
 */
export function Card({ children, className = '', hoverable = false, ...props }) {
  return (
    <div
      className={`bg-white rounded-[14px] border border-[#E0F2FE] p-6 card-elevation ${
        hoverable ? 'card-elevation-hover cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-between pb-4 mb-4 border-b border-[#E0F2FE] ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-[18px] font-semibold text-[#075985] tracking-tight ${className}`}>
      {children}
    </h3>
  );
}
