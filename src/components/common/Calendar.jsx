import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import clsx from 'clsx';

export const Calendar = ({ events = [], onAddEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // Oct 2026

  const daysInMonth = 31;
  const startDayOfWeek = 4; // Thursday

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const leadingBlanks = Array.from({ length: startDayOfWeek }, (_, i) => i);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      {/* Calendar Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">October 2026</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 bg-white">
            <button className="p-1 text-slate-500 hover:bg-slate-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-xs font-semibold text-slate-700">Today</span>
            <button className="p-1 text-slate-500 hover:bg-slate-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          {onAddEvent && (
            <button
              onClick={onAddEvent}
              className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              <Plus className="h-3.5 w-3.5" /> Add Event
            </button>
          )}
        </div>
      </div>

      {/* Weekday Grid Header */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-400 border-b border-slate-200 pb-2">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 border-l border-slate-100 divide-x divide-y divide-slate-100">
        {leadingBlanks.map((b) => (
          <div key={`blank-${b}`} className="min-h-[90px] bg-slate-50/40 p-2" />
        ))}
        {days.map((day) => {
          const formattedDay = day < 10 ? `0${day}` : `${day}`;
          const dayEvents = events.filter((e) => e.date?.endsWith(`-${formattedDay}`));
          const isToday = day === 4;

          return (
            <div key={day} className="min-h-[90px] p-2 hover:bg-slate-50/60 transition-colors relative">
              <div className="flex items-center justify-between">
                <span
                  className={clsx(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                    isToday ? 'bg-indigo-600 text-white' : 'text-slate-700'
                  )}
                >
                  {day}
                </span>
              </div>
              <div className="mt-1 space-y-1">
                {dayEvents.map((evt, idx) => (
                  <div
                    key={idx}
                    className="truncate rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700 border border-indigo-200/50"
                  >
                    {evt.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
