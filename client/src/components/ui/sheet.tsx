import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  side?: 'right' | 'left';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  side = 'right',
  size = 'lg',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
    full: 'max-w-full',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className={cn('fixed inset-y-0 flex max-w-full w-full', side === 'right' ? 'right-0 pl-0 sm:pl-10' : 'left-0 pr-0 sm:pr-10')}>
        <div
          className={cn(
            'w-full sm:w-screen bg-white shadow-2xl transition-transform animate-in duration-300 flex flex-col',
            side === 'right' ? 'slide-in-from-right' : 'slide-in-from-left',
            sizeClasses[size]
          )}
        >
          {/* Sheet Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 sm:px-6 py-4 bg-[#F7FAFC]">
            <div>
              {title && <h2 className="text-base sm:text-lg font-bold text-[#172B3A]">{title}</h2>}
              {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sheet Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};
