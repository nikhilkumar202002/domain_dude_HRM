import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export const Dropdown = ({ trigger, items = [], align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={clsx(
            'absolute z-30 mt-1 min-w-[160px] rounded-xl border border-slate-200 bg-white p-1 shadow-popover animate-in fade-in duration-100',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  item.onClick && item.onClick();
                  setIsOpen(false);
                }}
                className={clsx(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors',
                  item.danger && 'text-rose-600 hover:bg-rose-50'
                )}
              >
                {Icon && <Icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600" />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
