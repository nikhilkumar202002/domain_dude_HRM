import React from 'react';
import { Circle, CheckCircle, Clock } from 'lucide-react';
import clsx from 'clsx';

export const Timeline = ({ items = [] }) => {
  return (
    <div className="relative space-y-4 pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {items.map((item, idx) => (
        <div key={idx} className="relative flex flex-col gap-1">
          <span className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-indigo-600 ring-4 ring-white">
            {item.status === 'completed' ? (
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            ) : (
              <Circle className="h-3.5 w-3.5 fill-indigo-600 text-indigo-600" />
            )}
          </span>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-900">{item.title}</span>
            <span className="text-[11px] text-slate-400">{item.timestamp}</span>
          </div>
          {item.description && <p className="text-xs text-slate-500">{item.description}</p>}
          {item.user && <span className="text-[11px] text-indigo-600 font-medium">by {item.user}</span>}
        </div>
      ))}
    </div>
  );
};

export const ActivityFeed = ({ activities = [] }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((act, i) => (
          <div key={i} className="flex items-start space-x-3 text-xs">
            <div className="h-2 w-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
            <div className="flex-1">
              <p className="text-slate-800">
                <span className="font-semibold text-slate-900">{act.user}</span> {act.action}{' '}
                <span className="font-medium text-slate-900">{act.target}</span>
              </p>
              <span className="text-[11px] text-slate-400">{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
