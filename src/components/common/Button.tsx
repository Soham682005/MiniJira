import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: ReactNode;
}

export function Button({ className, variant = 'primary', icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'primary' && 'bg-emerald-700 text-white shadow-sm hover:bg-emerald-800',
        variant === 'secondary' && 'border border-slate-300 bg-white text-slate-800 shadow-sm hover:border-slate-400 hover:bg-slate-50',
        variant === 'ghost' && 'text-slate-600 hover:bg-stone-100 hover:text-slate-900',
        variant === 'danger' && 'bg-rose-600 text-white hover:bg-rose-700',
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
