import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Enterprise Button Component
 * Follows locked-design.md: Radius 10px, Primary #0EA5E9, Secondary Outline, Ghost, Danger
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-[10px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-[#0EA5E9] text-white hover:bg-[#0284C7] shadow-sm',
    secondary: 'bg-white text-[#075985] border border-[#E0F2FE] hover:bg-[#F0F9FF] hover:border-[#38BDF8]',
    accent: 'bg-[#10B981] text-white hover:bg-[#059669] shadow-sm',
    ghost: 'bg-transparent text-[#075985] hover:bg-[#F0F9FF] hover:text-[#0EA5E9]',
    danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-sm',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-[13px] gap-1.5',
    md: 'px-4 py-2 text-[14px] gap-2',
    lg: 'px-5 py-2.5 text-[16px] gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}
