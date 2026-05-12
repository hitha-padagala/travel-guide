import * as React from 'react';
import { cn } from '@/lib/utils';

export function Button({
  className,
  variant = 'default',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition',
        variant === 'default' && 'bg-[#1d4ed8] text-white hover:bg-[#1e40af]',
        variant === 'outline' && 'border border-[#c8d7f2] bg-white text-slate-900 hover:bg-[#eff6ff]',
        className
      )}
      {...props}
    />
  );
}
