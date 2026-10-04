import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Eye,
  List,
  Kanban,
  Calendar,
  FolderKanban,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  UserCheck
} from 'lucide-react';
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

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'board' | 'timeline'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');
  const [managerFilter, setManagerFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Local mutable state for drag and drop Kanban board experience
  const [projectItems, setProjectItems] = useState(projects);

  // Sync when global context updates
  React.useEffect(() => {
    setProjectItems(projects);
  }, [projects]);

  // Filters Options
  const uniqueClients = Array.from(new Set(projectItems.map((p) => p.client)));
  const uniqueManagers = Array.from(new Set(projectItems.map((p) => p.manager)));

  // Filtered dataset
  const filteredProjects = projectItems.filter((p) => {
    const matchesStatus = statusFilter === 'All' || p.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesClient = clientFilter === 'All' || p.client === clientFilter;
    const matchesManager = managerFilter === 'All' || p.manager === managerFilter;
    const matchesPriority = priorityFilter === 'All' || p.priority.toLowerCase() === priorityFilter.toLowerCase();
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesClient && matchesManager && matchesPriority && matchesSearch;
  });

  // Kanban Drag & Drop Handlers
  const handleDragStart = (e, projectId) => {
    e.dataTransfer.setData('text/plain', projectId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData('text/plain');
    if (!projectId) return;

    setProjectItems((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
    );
  };

  const boardColumns = [
    { id: 'Planning', label: 'Planning', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { id: 'In Progress', label: 'In Progress', color: 'bg-blue-50 text-[#0066FF] border-blue-200' },
    { id: 'Review', label: 'Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'Client Approval', label: 'Client Approval', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { id: 'Completed', label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ];

  // List View Columns
  const columns = [
    {
      key: 'name',
      header: 'Project',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0066FF] font-bold text-xs border border-blue-100">
            {row.id.split('-').pop()}
          </div>
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/projects/${row.id}`);
              }}
              className="font-bold text-slate-900 hover:text-[#0066FF] transition text-xs block text-left"
            >
              {val}
            </button>
            <span className="text-[11px] text-slate-400 font-mono">{row.id}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Client',
      render: (val) => <span className="font-semibold text-slate-800 text-xs">{val}</span>,
    },
    {
      key: 'manager',
      header: 'Manager',
      render: (val) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
          <UserCheck className="h-3.5 w-3.5 text-slate-400" /> {val}
        </div>
      ),
    },
    {
      key: 'progress',
      header: 'Progress',
      render: (val) => (
        <div className="w-36 space-y-1">
          <ProgressBar progress={val} size="xs" />
          <span className="text-[10px] font-bold text-slate-500">{val}% completed</span>
        </div>
      ),
    },
    {
      key: 'team',
      header: 'Team',
      render: (val) => <AvatarGroup users={val} size="xs" max={3} />,
    },
    {
      key: 'deadline',
      header: 'Deadline',
      render: (val, row) => <span className="text-xs text-slate-600 font-medium">{val || row.endDate}</span>,
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} />,
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
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0066FF]"
        >
          <Eye className="h-3.5 w-3.5" /> View
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Projects"
        subtitle="Plan, track and deliver projects across your team."
        actions={
          <div className="flex items-center gap-3">
            {/* View Switcher Controls */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === 'list' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <List className="h-3.5 w-3.5" /> List
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === 'board' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Kanban className="h-3.5 w-3.5" /> Board
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === 'timeline' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Calendar className="h-3.5 w-3.5" /> Timeline
              </button>
            </div>

            <button
              onClick={() => openQuickCreate('project')}
              className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
            >
              <Plus className="h-3.5 w-3.5" /> + New Project
            </button>
          </div>
        }
      />

      {/* Filter Bar */}
      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter projects by name, client, ID..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: ['All', 'Planning', 'In Progress', 'Review', 'Client Approval', 'Completed'],
          },
          {
            key: 'client',
            label: 'Client',
            options: ['All', ...uniqueClients],
          },
          {
            key: 'manager',
            label: 'Project Manager',
            options: ['All', ...uniqueManagers],
          },
          {
            key: 'priority',
            label: 'Priority',
            options: ['All', 'Urgent', 'High', 'Medium', 'Low'],
          },
        ]}
        activeFilters={{
          status: statusFilter,
          client: clientFilter,
          manager: managerFilter,
          priority: priorityFilter,
        }}
        onFilterChange={(key, val) => {
          if (key === 'status') setStatusFilter(val);
          if (key === 'client') setClientFilter(val);
          if (key === 'manager') setManagerFilter(val);
          if (key === 'priority') setPriorityFilter(val);
        }}
        onReset={() => {
          setSearch('');
          setStatusFilter('All');
          setClientFilter('All');
          setManagerFilter('All');
          setPriorityFilter('All');
        }}
      />

      {/* VIEW 1: LIST VIEW */}
      {viewMode === 'list' && (
        <DataTable
          columns={columns}
          data={filteredProjects}
          onRowClick={(row) => navigate(`/projects/${row.id}`)}
          emptyTitle="No projects match your filter"
          emptyDescription="Create a new project or adjust your filters above."
        />
      )}

      {/* VIEW 2: BOARD VIEW (Kanban Draggable Columns) */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {boardColumns.map((col) => {
            const columnProjects = filteredProjects.filter((p) => p.status === col.id);

            return (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 flex flex-col h-[70vh]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${col.color}`}>
                      {col.label}
                    </span>
                    <span className="text-xs font-bold text-slate-500">({columnProjects.length})</span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {columnProjects.length > 0 ? (
                    columnProjects.map((prj) => (
                      <div
                        key={prj.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, prj.id)}
                        onClick={() => navigate(`/projects/${prj.id}`)}
                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-card hover:shadow-soft hover:border-[#0066FF] cursor-grab active:cursor-grabbing transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{prj.id}</span>
                          <StatusBadge status={prj.priority} size="xs" />
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1 hover:text-[#0066FF] transition-colors">
                            {prj.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{prj.client}</p>
                        </div>

                        <div className="space-y-1">
                          <ProgressBar progress={prj.progress} size="xs" />
                          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                            <span>Progress</span>
                            <span className="font-bold text-slate-700">{prj.progress}%</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                          <AvatarGroup users={prj.team} size="xs" max={3} />
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span>{prj.deadline || prj.endDate}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-[11px] text-slate-400">
                      Drop projects here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: TIMELINE VIEW (Gantt Visualization) */}
      {viewMode === 'timeline' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Project Delivery Gantt Timeline</h3>
              <p className="text-xs text-slate-500">Visual schedule of active projects across Q3 & Q4 2026 milestones.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-blue-600">
                <div className="h-2.5 w-2.5 rounded-full bg-[#0066FF]" /> In Progress
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Completed
              </div>
              <div className="flex items-center gap-1.5 text-amber-600">
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Review / Approval
              </div>
            </div>
          </div>

          {/* Timeline Grid Header (Months) */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-12 gap-2 border-b border-slate-200 pb-2 text-center text-xs font-bold text-slate-500">
                <div className="col-span-4 text-left pl-2">Project & Client</div>
                <div className="col-span-1">Aug '26</div>
                <div className="col-span-2">Sep '26</div>
                <div className="col-span-2">Oct '26</div>
                <div className="col-span-2">Nov '26</div>
                <div className="col-span-1">Dec '26</div>
              </div>

              {/* Today Marker Banner */}
              <div className="relative py-2 space-y-4">
                {filteredProjects.map((prj, idx) => {
                  let barColor = 'bg-[#0066FF]';
                  if (prj.status === 'Completed') barColor = 'bg-emerald-500';
                  if (prj.status === 'Review' || prj.status === 'Client Approval') barColor = 'bg-amber-500';
                  if (prj.status === 'Planning') barColor = 'bg-purple-500';

                  return (
                    <div
                      key={prj.id}
                      onClick={() => navigate(`/projects/${prj.id}`)}
                      className="grid grid-cols-12 gap-2 items-center rounded-xl p-2.5 hover:bg-slate-50 cursor-pointer transition border border-slate-100"
                    >
                      <div className="col-span-4">
                        <h4 className="text-xs font-bold text-slate-900 hover:text-[#0066FF]">{prj.name}</h4>
                        <span className="text-[11px] text-slate-500">{prj.client} • Lead: {prj.manager}</span>
                      </div>
                      <div className="col-span-8 relative flex items-center h-8 bg-slate-100 rounded-lg overflow-hidden px-1">
                        <div
                          className={`h-6 rounded-md ${barColor} text-white text-[10px] font-bold flex items-center px-3 shadow-xs transition-all`}
                          style={{
                            width: `${Math.max(20, prj.progress)}%`,
                            marginLeft: idx % 2 === 0 ? '0%' : '15%',
                          }}
                        >
                          <span className="truncate">{prj.progress}% Done ({prj.endDate})</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
