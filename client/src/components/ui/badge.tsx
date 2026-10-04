import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'active' | 'inactive' | 'on_leave' | 'ongoing' | 'completed' | 'cancelled' | 'upcoming' | 'sky' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', children, ...props }) => {
  const variants = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
    inactive: 'bg-slate-100 text-slate-600 border-slate-200 font-medium',
    on_leave: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold',
    ongoing: 'bg-sky-50 text-[#2872A1] border-[#CBDDE9] font-bold',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
    upcoming: 'bg-purple-50 text-purple-700 border-purple-200 font-semibold',
    sky: 'bg-[#CBDDE9] text-[#172B3A] border-[#b5cee0] font-semibold',
    default: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
