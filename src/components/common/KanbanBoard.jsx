import React from 'react';
import { Plus, MoreHorizontal, Clock } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Avatar } from './Avatar';
import clsx from 'clsx';

export const KanbanBoard = ({ tasks = [], onTaskClick, onAddTask }) => {
  const columns = [
    { id: 'To Do', label: 'To Do', color: 'border-slate-300' },
    { id: 'In Progress', label: 'In Progress', color: 'border-amber-400' },
    { id: 'Review', label: 'Review', color: 'border-indigo-500' },
    { id: 'Completed', label: 'Completed', color: 'border-emerald-500' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {columns.map((col) => {
        const columnTasks = tasks.filter(
          (t) => (t.status || '').toLowerCase() === col.id.toLowerCase()
        );

        return (
          <div key={col.id} className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 p-3 shadow-soft">
            {/* Column Header */}
            <div className={clsx('flex items-center justify-between border-b-2 pb-2 mb-3', col.color)}>
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                <span>{col.label}</span>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-600 font-semibold">
                  {columnTasks.length}
                </span>
              </div>
              <button
                onClick={() => onAddTask && onAddTask(col.id)}
                className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Task List Cards */}
            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[600px] pr-1">
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onTaskClick && onTaskClick(task)}
                  className="group rounded-lg border border-slate-200/80 bg-white p-3 shadow-sm hover:border-indigo-300 hover:shadow-soft cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-slate-400">{task.project || 'General'}</span>
                    <StatusBadge status={task.priority} size="sm" />
                  </div>

                  <h4 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 line-clamp-2">
                    {task.title}
                  </h4>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>{task.dueDate}</span>
                    </div>
                    {task.assignee && (
                      <Avatar name={task.assignee.name} src={task.assignee.avatar} size="xs" />
                    )}
                  </div>
                </div>
              ))}

              {columnTasks.length === 0 && (
                <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  No tasks in {col.label}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
