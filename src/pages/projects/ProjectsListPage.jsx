import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, LayoutGrid, List, FolderKanban, Users, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { AvatarGroup } from '../../components/common/Avatar';

export const ProjectsListPage = () => {
  const { projects, openQuickCreate } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const filtered = projects.filter((p) => {
    const matchesStatus = statusFilter === 'All' || p.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns = [
    {
      key: 'name',
      header: 'Project Name',
      render: (val, row) => (
        <div>
          <div className="font-semibold text-slate-900">{val}</div>
          <div className="text-[11px] text-slate-400">Client: {row.client}</div>
        </div>
      ),
    },
    {
      key: 'progress',
      header: 'Completion',
      render: (val) => <div className="w-36"><ProgressBar progress={val} size="sm" /></div>,
    },
    {
      key: 'budget',
      header: 'Budget',
      align: 'right',
      render: (val, row) => (
        <div>
          <div className="font-bold text-slate-900">${val.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">Spent: ${row.spent.toLocaleString()}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'manager',
      header: 'Project Lead',
      render: (val) => <span className="text-slate-600">{val}</span>,
    },
    {
      key: 'team',
      header: 'Team',
      render: (val) => <AvatarGroup users={val} size="xs" max={3} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/projects/${row.id}`);
          }}
          className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          <Eye className="h-3.5 w-3.5 text-slate-400" /> View
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Management"
        subtitle="Track software development projects, delivery progress, team allocation, and budgets."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}
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
              onClick={() => openQuickCreate('project')}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus className="h-3.5 w-3.5" /> New Project
            </button>
          </div>
        }
      />

      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter projects by name or client..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: ['All', 'In Progress', 'Review', 'Completed'],
          },
        ]}
        activeFilters={{ status: statusFilter }}
        onFilterChange={(key, val) => setStatusFilter(val)}
        onReset={() => {
          setSearch('');
          setStatusFilter('All');
        }}
      />

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((prj) => (
            <div
              key={prj.id}
              onClick={() => navigate(`/projects/${prj.id}`)}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-card hover:border-indigo-300 hover:shadow-soft cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{prj.id}</span>
                  <StatusBadge status={prj.status} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {prj.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Client: {prj.client}</p>

                <div className="mt-4 space-y-2">
                  <ProgressBar progress={prj.progress} />
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Tasks: {prj.taskStats.completed}/{prj.taskStats.total}</span>
                    <span>Deadline: {prj.endDate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3">
                <AvatarGroup users={prj.team} size="xs" max={3} />
                <span className="text-xs font-bold text-slate-900">${prj.budget.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(row) => navigate(`/projects/${row.id}`)}
        />
      )}
    </div>
  );
};
