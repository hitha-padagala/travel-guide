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
        variant === 'default' && 'bg-emerald-200 text-slate-950 hover:bg-emerald-100',
        variant === 'outline' && 'border border-white/15 bg-white/5 text-white hover:bg-white/10',
        className
      )}
      {...props}
    />
  );
}
