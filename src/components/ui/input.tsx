import * as React from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-[#c8d7f2] bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-[#1d4ed8] focus:ring-2 focus:ring-[#1d4ed8]/20',
        className
      )}
      {...props}
    />
  );
}
