import React, { useState } from 'react';
import {
  Plus,
  List,
  Kanban,
  UserCheck,
  CheckSquare,
  Square,
  MessageSquare,
  Paperclip,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  X,
  User,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Avatar } from '../../components/common/Avatar';

export const TasksPage = () => {
  const { tasks, currentUser, openQuickCreate } = useApp();

  const [viewMode, setViewMode] = useState('board'); // 'list' | 'board' | 'mytasks'
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const [taskItems, setTaskItems] = useState(tasks);
  const [selectedTask, setSelectedTask] = useState(null); // Selected task for drawer detail

  // Sync state when global context updates
  React.useEffect(() => {
    setTaskItems(tasks);
  }, [tasks]);

  const uniqueProjects = Array.from(new Set(taskItems.map((t) => t.project)));
  const uniqueAssignees = Array.from(new Set(taskItems.map((t) => t.assignee?.name).filter(Boolean)));

  // Filtered dataset
  const filteredTasks = taskItems.filter((t) => {
    const matchesProject = projectFilter === 'All' || t.project === projectFilter;
    const matchesAssignee = assigneeFilter === 'All' || t.assignee?.name === assigneeFilter;
    const matchesStatus = statusFilter === 'All' || t.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'All' || t.priority.toLowerCase() === priorityFilter.toLowerCase();
    const matchesSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.project.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());

    return matchesProject && matchesAssignee && matchesStatus && matchesPriority && matchesSearch;
  });

  // 7 Kanban Board Columns
  const boardColumns = [
    { id: 'Todo', label: 'Todo', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { id: 'Assigned', label: 'Assigned', color: 'bg-blue-50 text-[#0066FF] border-blue-200' },
    { id: 'In Progress', label: 'In Progress', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { id: 'Review', label: 'Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'Correction', label: 'Correction', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { id: 'Completed', label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'Blocked', label: 'Blocked', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  ];

  // Drag & Drop Handlers for Kanban
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    setTaskItems((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus, progress: newStatus === 'Completed' ? 100 : t.progress } : t))
    );
  };

  // Toggle Checkbox Status
  const handleToggleComplete = (taskId) => {
    setTaskItems((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isComp = t.status === 'Completed';
          return {
            ...t,
            status: isComp ? 'In Progress' : 'Completed',
            progress: isComp ? 50 : 100,
          };
        }
        return t;
      })
    );
  };

  // List View Columns
  const listColumns = [
    {
      key: 'checkbox',
      header: '',
      sortable: false,
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleComplete(row.id);
          }}
          className="text-slate-400 hover:text-[#0066FF] transition"
        >
          {row.status === 'Completed' ? (
            <CheckSquare className="h-4 w-4 text-emerald-600" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </button>
      ),
    },
    {
      key: 'title',
      header: 'Task',
      render: (val, row) => (
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTask(row);
            }}
            className={`font-bold text-xs text-left block hover:text-[#0066FF] transition ${
              row.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900'
            }`}
          >
            {val}
          </button>
          <span className="text-[10px] font-mono text-slate-400">{row.id}</span>
        </div>
      ),
    },
    {
      key: 'project',
      header: 'Project',
      render: (val) => <span className="text-xs font-semibold text-slate-700">{val}</span>,
    },
    {
      key: 'assignee',
      header: 'Assignee',
      render: (val) => (
        <div className="flex items-center gap-1.5">
          <Avatar name={val?.name} src={val?.avatar} size="xs" />
          <span className="text-xs text-slate-700 font-medium">{val?.name || 'Unassigned'}</span>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (val) => <StatusBadge status={val} size="xs" />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} size="xs" />,
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (val) => <span className="text-xs text-slate-600 font-medium">{val}</span>,
    },
    {
      key: 'createdDate',
      header: 'Created',
      render: (val) => <span className="text-xs text-slate-400">{val || '2026-09-25'}</span>,
    },
  ];

  // Categorize tasks for "My Tasks" view
  const myName = currentUser.name || 'Nikhil';
  const myTasksList = taskItems.filter((t) => t.assignee?.name === myName || t.assignee?.name === 'Nikhil');

  const todayStr = '2026-10-04'; // Simulated current date

  const overdueTasks = myTasksList.filter((t) => t.status !== 'Completed' && t.dueDate < todayStr);
  const dueTodayTasks = myTasksList.filter((t) => t.status !== 'Completed' && t.dueDate === todayStr);
  const upcomingTasks = myTasksList.filter((t) => t.status !== 'Completed' && t.dueDate > todayStr);
  const completedTasks = myTasksList.filter((t) => t.status === 'Completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Tasks"
        subtitle="Manage work across projects and teams."
        actions={
          <div className="flex items-center gap-3">
            {/* View Switcher Tabs */}
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
                onClick={() => setViewMode('mytasks')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === 'mytasks' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <UserCheck className="h-3.5 w-3.5" /> My Tasks
              </button>
            </div>

            <button
              onClick={() => openQuickCreate('task')}
              className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
            >
              <Plus className="h-3.5 w-3.5" /> + New Task
            </button>
          </div>
        }
      />

      {/* Filter Bar */}
      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search task title, project or ID..."
        filters={[
          {
            key: 'project',
            label: 'Project',
            options: ['All', ...uniqueProjects],
          },
          {
            key: 'assignee',
            label: 'Assignee',
            options: ['All', ...uniqueAssignees],
          },
          {
            key: 'status',
            label: 'Status',
            options: ['All', 'Todo', 'Assigned', 'In Progress', 'Review', 'Correction', 'Completed', 'Blocked'],
          },
          {
            key: 'priority',
            label: 'Priority',
            options: ['All', 'Urgent', 'High', 'Medium', 'Low'],
          },
        ]}
        activeFilters={{
          project: projectFilter,
          assignee: assigneeFilter,
          status: statusFilter,
          priority: priorityFilter,
        }}
        onFilterChange={(key, val) => {
          if (key === 'project') setProjectFilter(val);
          if (key === 'assignee') setAssigneeFilter(val);
          if (key === 'status') setStatusFilter(val);
          if (key === 'priority') setPriorityFilter(val);
        }}
        onReset={() => {
          setSearch('');
          setProjectFilter('All');
          setAssigneeFilter('All');
          setStatusFilter('All');
          setPriorityFilter('All');
        }}
      />

      {/* VIEW 1: LIST VIEW */}
      {viewMode === 'list' && (
        <DataTable
          columns={listColumns}
          data={filteredTasks}
          onRowClick={(row) => setSelectedTask(row)}
          emptyTitle="No tasks found"
          emptyDescription="Create a new task or adjust your filters above."
        />
      )}

      {/* VIEW 2: BOARD VIEW (7 Columns Kanban) */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3 overflow-x-auto pb-4">
          {boardColumns.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 flex flex-col h-[72vh] min-w-[200px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5 mb-3 px-1">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${col.color}`}>
                    {col.label}
                  </span>
                  <span className="text-xs font-bold text-slate-500">({columnTasks.length})</span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {columnTasks.length > 0 ? (
                    columnTasks.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onClick={() => setSelectedTask(task)}
                        className="rounded-xl border border-slate-200 bg-white p-3 shadow-card hover:shadow-soft hover:border-[#0066FF] cursor-grab active:cursor-grabbing transition-all space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{task.id}</span>
                          <StatusBadge status={task.priority} size="xs" />
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-2 hover:text-[#0066FF] transition-colors">
                            {task.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 mt-0.5 font-medium line-clamp-1">{task.project}</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <ProgressBar progress={task.progress || 0} size="xs" />
                        </div>

                        {/* Footer Info */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Avatar name={task.assignee?.name} src={task.assignee?.avatar} size="xs" />
                            <span className="font-semibold text-slate-700">{task.assignee?.name?.split(' ')[0]}</span>
                          </div>

                          <div className="flex items-center gap-2 text-slate-400">
                            {task.commentsCount > 0 && (
                              <span className="flex items-center gap-0.5">
                                <MessageSquare className="h-3 w-3" /> {task.commentsCount}
                              </span>
                            )}
                            {task.attachmentsCount > 0 && (
                              <span className="flex items-center gap-0.5">
                                <Paperclip className="h-3 w-3" /> {task.attachmentsCount}
                              </span>
                            )}
                            <span className="flex items-center gap-0.5 text-slate-600 font-semibold">
                              <Clock className="h-3 w-3" /> {task.dueDate?.split('-').slice(1).join('/')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-28 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-[10px] text-slate-400">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: MY TASKS (Categorized Sections) */}
      {viewMode === 'mytasks' && (
        <div className="space-y-6">
          {/* OVERDUE SECTION */}
          <div className="rounded-2xl border border-red-200 bg-red-50/40 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-red-100 pb-2">
              <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" /> Overdue Tasks ({overdueTasks.length})
              </h3>
              <span className="text-[11px] font-semibold text-red-600">Requires Immediate Action</span>
            </div>

            <div className="space-y-2">
              {overdueTasks.length > 0 ? (
                overdueTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTask(t)}
                    className="flex items-center justify-between rounded-xl border border-red-200 bg-white p-3 hover:border-red-400 transition cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleComplete(t.id);
                        }}
                      >
                        <Square className="h-4 w-4 text-red-400" />
                      </button>
                      <div>
                        <h4 className="font-bold text-slate-900">{t.title}</h4>
                        <span className="text-[11px] text-slate-500">{t.project}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-red-600 font-bold text-[11px]">Due {t.dueDate}</span>
                      <StatusBadge status={t.priority} size="xs" />
                      <StatusBadge status={t.status} size="xs" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-2">No overdue tasks! You are all caught up.</p>
              )}
            </div>
          </div>

          {/* DUE TODAY SECTION */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-blue-100 pb-2">
              <h3 className="text-xs font-bold text-[#0066FF] uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#0066FF]" /> Due Today ({dueTodayTasks.length})
              </h3>
              <span className="text-[11px] font-semibold text-[#0066FF]">Scheduled for Oct 4, 2026</span>
            </div>

            <div className="space-y-2">
              {dueTodayTasks.length > 0 ? (
                dueTodayTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTask(t)}
                    className="flex items-center justify-between rounded-xl border border-blue-200 bg-white p-3 hover:border-[#0066FF] transition cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleComplete(t.id);
                        }}
                      >
                        <Square className="h-4 w-4 text-[#0066FF]" />
                      </button>
                      <div>
                        <h4 className="font-bold text-slate-900">{t.title}</h4>
                        <span className="text-[11px] text-slate-500">{t.project}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={t.priority} size="xs" />
                      <StatusBadge status={t.status} size="xs" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-2">No tasks scheduled for today.</p>
              )}
            </div>
          </div>

          {/* UPCOMING SECTION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-card">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-600" /> Upcoming Tasks ({upcomingTasks.length})
              </h3>
            </div>

            <div className="space-y-2">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTask(t)}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-white hover:border-slate-300 transition cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleComplete(t.id);
                        }}
                      >
                        <Square className="h-4 w-4 text-slate-400" />
                      </button>
                      <div>
                        <h4 className="font-bold text-slate-900">{t.title}</h4>
                        <span className="text-[11px] text-slate-500">{t.project}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 text-[11px]">Due {t.dueDate}</span>
                      <StatusBadge status={t.priority} size="xs" />
                      <StatusBadge status={t.status} size="xs" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-2">No upcoming tasks scheduled.</p>
              )}
            </div>
          </div>

          {/* COMPLETED SECTION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-card">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Recently Completed ({completedTasks.length})
              </h3>
            </div>

            <div className="space-y-2">
              {completedTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTask(t)}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/30 p-3 text-xs opacity-75 hover:opacity-100 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleComplete(t.id);
                      }}
                    >
                      <CheckSquare className="h-4 w-4 text-emerald-600" />
                    </button>
                    <div>
                      <h4 className="font-bold text-slate-900 line-through">{t.title}</h4>
                      <span className="text-[11px] text-slate-500">{t.project}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status="Completed" size="xs" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TASK DETAIL DRAWER */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wider">{selectedTask.id}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedTask.title}</h3>
                  <p className="text-xs text-slate-500">Project: <span className="font-semibold text-slate-800">{selectedTask.project}</span></p>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status & Priority Controls */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => {
                      const updated = { ...selectedTask, status: e.target.value };
                      setSelectedTask(updated);
                      setTaskItems((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:border-[#0066FF] focus:outline-none"
                  >
                    {boardColumns.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Priority</label>
                  <select
                    value={selectedTask.priority}
                    onChange={(e) => {
                      const updated = { ...selectedTask, priority: e.target.value };
                      setSelectedTask(updated);
                      setTaskItems((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:border-[#0066FF] focus:outline-none"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Details & Specs */}
              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Description</span>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedTask.description || 'No additional specifications provided.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-slate-400 font-medium block">Assignee:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar name={selectedTask.assignee?.name} src={selectedTask.assignee?.avatar} size="xs" />
                      <span className="font-bold text-slate-800">{selectedTask.assignee?.name || 'Unassigned'}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Due Date:</span>
                    <span className="font-bold text-slate-800 mt-1 block">{selectedTask.dueDate}</span>
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-slate-500 font-semibold">
                    <span>Task Progress</span>
                    <span>{selectedTask.progress || 0}%</span>
                  </div>
                  <ProgressBar progress={selectedTask.progress || 0} size="sm" />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-between">
              <button
                onClick={() => {
                  handleToggleComplete(selectedTask.id);
                  setSelectedTask(null);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
              >
                <CheckCircle2 className="h-4 w-4" /> Toggle Complete
              </button>

              <button
                onClick={() => setSelectedTask(null)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
