import React, { useState } from 'react';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { KanbanBoard } from '../../components/common/KanbanBoard';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Avatar } from '../../components/common/Avatar';

export const TasksPage = () => {
  const { tasks, openQuickCreate } = useApp();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = tasks.filter((t) => {
    const matchesStatus = statusFilter === 'All' || t.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.project.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns = [
    {
      key: 'title',
      header: 'Task Title',
      render: (val, row) => (
        <div>
          <div className="font-semibold text-slate-900">{val}</div>
          <div className="text-[11px] text-slate-400">Project: {row.project}</div>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (val) => <span className="text-slate-600">{val}</span>,
    },
    {
      key: 'assignee',
      header: 'Assignee',
      render: (val) => (
        <div className="flex items-center gap-2">
          <Avatar name={val?.name} src={val?.avatar} size="xs" />
          <span className="text-slate-700">{val?.name}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks & Activity Kanban"
        subtitle="Manage sprint deliverables, task priorities, assignee workload, and status boards."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded ${viewMode === 'kanban' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => openQuickCreate('task')}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus className="h-3.5 w-3.5" /> Add Task
            </button>
          </div>
        }
      />

      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter tasks by title or project..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: ['All', 'To Do', 'In Progress', 'Review', 'Completed'],
          },
        ]}
        activeFilters={{ status: statusFilter }}
        onFilterChange={(key, val) => setStatusFilter(val)}
        onReset={() => {
          setSearch('');
          setStatusFilter('All');
        }}
      />

      {viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={filtered}
          onAddTask={(colId) => openQuickCreate('task')}
          onTaskClick={(task) => alert(`Opening task details: ${task.title}`)}
        />
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}
    </div>
  );
};
