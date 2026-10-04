import React, { useState, useMemo } from 'react';
import {
  Plus,
  Check,
  X,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  Search,
  Filter,
  User,
  Briefcase,
  FileText,
  ChevronLeft,
  ChevronRight,
  Info,
  Layers,
  Send,
} from 'lucide-react';
import { mockLeaveRequests, mockEmployees } from '../../data/mockData';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const LeavePage = () => {
  const [leaveList, setLeaveList] = useState(mockLeaveRequests);
  const [activeTab, setActiveTab] = useState('All Requests');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'calendar'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  
  // Drawer & Detail state
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Clarification state inside drawer
  const [clarificationText, setClarificationText] = useState('');
  const [isClarificationInputOpen, setIsClarificationInputOpen] = useState(false);

  // New Request Modal state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newRequestForm, setNewRequestForm] = useState({
    empId: 'EMP-02',
    leaveType: 'Annual Vacation',
    startDate: '2026-10-15',
    endDate: '2026-10-18',
    reason: '',
  });

  // Action handlers
  const handleApprove = (id, e) => {
    if (e) e.stopPropagation();
    setLeaveList((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'Approved' } : l))
    );
    if (selectedLeave && selectedLeave.id === id) {
      setSelectedLeave((prev) => ({ ...prev, status: 'Approved' }));
    }
  };

  const handleReject = (id, e) => {
    if (e) e.stopPropagation();
    setLeaveList((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'Rejected' } : l))
    );
    if (selectedLeave && selectedLeave.id === id) {
      setSelectedLeave((prev) => ({ ...prev, status: 'Rejected' }));
    }
  };

  const handleRequestClarification = (id) => {
    if (!clarificationText.trim()) return;
    setLeaveList((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: 'Clarification',
              clarificationNote: clarificationText,
            }
          : l
      )
    );
    if (selectedLeave && selectedLeave.id === id) {
      setSelectedLeave((prev) => ({
        ...prev,
        status: 'Clarification',
        clarificationNote: clarificationText,
      }));
    }
    setClarificationText('');
    setIsClarificationInputOpen(false);
  };

  const handleOpenDrawer = (leaveItem) => {
    setSelectedLeave(leaveItem);
    setIsDrawerOpen(true);
    setIsClarificationInputOpen(false);
    setClarificationText('');
  };

  const handleCreateLeaveRequest = (e) => {
    e.preventDefault();
    const emp = mockEmployees.find((m) => m.id === newRequestForm.empId) || mockEmployees[1];
    
    // Calculate days
    const start = new Date(newRequestForm.startDate);
    const end = new Date(newRequestForm.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = {
      id: `LR-${Math.floor(300 + Math.random() * 900)}`,
      empId: emp.id,
      employeeName: emp.name,
      role: emp.role,
      department: emp.department,
      email: emp.email,
      avatar: emp.avatar,
      leaveType: newRequestForm.leaveType,
      startDate: newRequestForm.startDate,
      endDate: newRequestForm.endDate,
      days: diffDays > 0 ? diffDays : 1,
      reason: newRequestForm.reason || 'Personal time off request.',
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
      availableBalance: {
        annual: { total: 18, used: 4, remaining: 14 },
        sick: { total: 7, used: 1, remaining: 6 },
        casual: { total: 6, used: 2, remaining: 4 },
      },
      previousHistory: [
        { id: `LH-${Date.now()}`, leaveType: 'Casual Leave', dates: 'Sep 02, 2026', days: 1, status: 'Approved' }
      ]
    };

    setLeaveList([newLeave, ...leaveList]);
    setIsNewModalOpen(false);
    setNewRequestForm({
      empId: 'EMP-02',
      leaveType: 'Annual Vacation',
      startDate: '2026-10-15',
      endDate: '2026-10-18',
      reason: '',
    });
  };

  // Metrics summary
  const pendingCount = useMemo(() => leaveList.filter((l) => l.status === 'Pending' || l.status === 'Clarification').length, [leaveList]);
  const approvedCount = useMemo(() => leaveList.filter((l) => l.status === 'Approved').length, [leaveList]);
  const rejectedCount = useMemo(() => leaveList.filter((l) => l.status === 'Rejected').length, [leaveList]);
  const employeesOnLeaveCount = useMemo(() => {
    // Count distinct employees with approved leave
    const setEmp = new Set(leaveList.filter((l) => l.status === 'Approved').map((l) => l.empId));
    return setEmp.size;
  }, [leaveList]);

  // Tab filtering
  const filteredLeaveList = useMemo(() => {
    return leaveList.filter((item) => {
      // Tab filter
      if (activeTab === 'Pending' && item.status !== 'Pending' && item.status !== 'Clarification') return false;
      if (activeTab === 'Approved' && item.status !== 'Approved') return false;
      if (activeTab === 'Rejected' && item.status !== 'Rejected') return false;

      // Type filter
      if (selectedTypeFilter !== 'All' && item.leaveType !== selectedTypeFilter) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.employeeName.toLowerCase().includes(query);
        const matchesEmpId = item.empId.toLowerCase().includes(query);
        const matchesType = item.leaveType.toLowerCase().includes(query);
        const matchesReason = item.reason.toLowerCase().includes(query);
        if (!matchesName && !matchesEmpId && !matchesType && !matchesReason) return false;
      }

      return true;
    });
  }, [leaveList, activeTab, selectedTypeFilter, searchQuery]);

  // Leave Type Color map
  const getLeaveTypeStyle = (type) => {
    switch (type) {
      case 'Annual Vacation':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Sick Leave':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Casual Leave':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Conference / Event':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Unpaid Leave':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  const columns = [
    {
      key: 'employeeName',
      header: 'Employee',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar}
            alt={row.employeeName}
            className="h-9 w-9 rounded-full object-cover border border-slate-200 shadow-xs"
          />
          <div>
            <div className="font-semibold text-slate-900 leading-tight">{row.employeeName}</div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span>{row.role}</span>
              <span>•</span>
              <span className="font-mono text-slate-400">{row.empId}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'leaveType',
      header: 'Leave Type',
      render: (val) => (
        <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium border ${getLeaveTypeStyle(val)}`}>
          {val}
        </span>
      ),
    },
    {
      key: 'startDate',
      header: 'Start Date',
      render: (val) => <span className="font-medium text-slate-800">{val}</span>,
    },
    {
      key: 'endDate',
      header: 'End Date',
      render: (val) => <span className="font-medium text-slate-800">{val}</span>,
    },
    {
      key: 'days',
      header: 'Days',
      render: (val) => (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
          {val} {val === 1 ? 'Day' : 'Days'}
        </span>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (val) => (
        <span className="text-slate-600 truncate max-w-xs block text-xs" title={val}>
          {val}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} size="xs" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleOpenDrawer(row)}
            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Review
          </button>
          {row.status === 'Pending' || row.status === 'Clarification' ? (
            <>
              <button
                onClick={(e) => handleApprove(row.id, e)}
                title="Approve Leave"
                className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200"
              >
                <Check className="h-3.5 w-3.5" /> Approve
              </button>
              <button
                onClick={(e) => handleReject(row.id, e)}
                title="Reject Leave"
                className="flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors border border-rose-200"
              >
                <X className="h-3.5 w-3.5" /> Reject
              </button>
            </>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium px-2">Processed</span>
          )}
        </div>
      ),
    },
  ];

  // Calendar setup for October 2026
  const daysInOctober = 31;
  const calendarDays = Array.from({ length: daysInOctober }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Leave Management"
        subtitle="Review and manage employee leave requests."
        actions={
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#0066FF] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> Request Leave
          </button>
        }
      />

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Requests
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900">{pendingCount}</span>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              Needs Review
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Approved
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900">{approvedCount}</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Granted
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-rose-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Rejected
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
              <XCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900">{rejectedCount}</span>
            <span className="text-xs font-medium text-slate-500">Processed</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Employees on Leave
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <User className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900">{employeesOnLeaveCount}</span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              Oct 2026
            </span>
          </div>
        </div>
      </div>

      {/* TABS & VIEW TOGGLE BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3">
        {/* Left Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {['All Requests', 'Pending', 'Approved', 'Rejected'].map((tab) => {
            const isActive = activeTab === tab;
            let badgeVal = 0;
            if (tab === 'All Requests') badgeVal = leaveList.length;
            if (tab === 'Pending') badgeVal = pendingCount;
            if (tab === 'Approved') badgeVal = approvedCount;
            if (tab === 'Rejected') badgeVal = rejectedCount;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {badgeVal}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right View Switcher & Filters */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee, type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-48 rounded-lg border border-slate-200 pl-9 pr-3 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Leave Type Dropdown */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="All">All Leave Types</option>
            <option value="Annual Vacation">Annual Vacation</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Conference / Event">Conference / Event</option>
            <option value="Unpaid Leave">Unpaid Leave</option>
          </select>

          {/* Table / Calendar Toggle */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="h-3.5 w-3.5" /> Table
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" /> Team Calendar
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={filteredLeaveList}
          onRowClick={(row) => handleOpenDrawer(row)}
        />
      ) : (
        /* TEAM LEAVE CALENDAR VIEW */
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-blue-600" /> Team Leave Calendar
              </h3>
              <p className="text-xs text-slate-500">October 2026 scheduled time-off and approvals</p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span> Annual Vacation
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span> Sick Leave
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span> Casual Leave
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-500"></span> Conference / Event
              </span>
            </div>
          </div>

          {/* Month grid view */}
          <div className="overflow-x-auto">
            <div className="min-w-[768px]">
              {/* Day header numbers 1 to 31 */}
              <div className="grid grid-cols-[180px_repeat(31,minmax(28px,1fr))] border-b border-slate-200 bg-slate-50 text-center text-[11px] font-semibold text-slate-600">
                <div className="p-2.5 text-left border-r border-slate-200">Employee</div>
                {calendarDays.map((d) => (
                  <div key={d} className={`p-2 border-r border-slate-200 ${d === 4 || d === 11 || d === 18 || d === 25 ? 'bg-slate-100 text-slate-400' : ''}`}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Rows for employees who have leaves in October */}
              {leaveList.map((req) => {
                const startDay = parseInt(req.startDate.split('-')[2], 10);
                const endDay = parseInt(req.endDate.split('-')[2], 10);

                return (
                  <div
                    key={req.id}
                    onClick={() => handleOpenDrawer(req)}
                    className="grid grid-cols-[180px_repeat(31,minmax(28px,1fr))] border-b border-slate-100 items-center text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {/* Employee cell */}
                    <div className="p-2.5 border-r border-slate-200 flex items-center gap-2 overflow-hidden">
                      <img
                        src={req.avatar}
                        alt={req.employeeName}
                        className="h-6 w-6 rounded-full object-cover shrink-0"
                      />
                      <div className="truncate">
                        <div className="font-semibold text-slate-800 text-[11px] truncate">{req.employeeName}</div>
                        <div className="text-[10px] text-slate-400 truncate">{req.leaveType}</div>
                      </div>
                    </div>

                    {/* 31 days grid timeline */}
                    {calendarDays.map((day) => {
                      const isOnLeave = day >= startDay && day <= endDay;
                      const isStart = day === startDay;
                      const isEnd = day === endDay;

                      return (
                        <div
                          key={day}
                          className="h-10 border-r border-slate-100 flex items-center justify-center relative"
                        >
                          {isOnLeave && (
                            <div
                              className={`h-6 w-full flex items-center justify-center text-[10px] font-semibold text-white px-1 shadow-2xs ${
                                isStart ? 'rounded-l-md' : ''
                              } ${isEnd ? 'rounded-r-md' : ''} ${
                                req.leaveType === 'Annual Vacation'
                                  ? 'bg-blue-600'
                                  : req.leaveType === 'Sick Leave'
                                  ? 'bg-rose-600'
                                  : req.leaveType === 'Casual Leave'
                                  ? 'bg-amber-600'
                                  : 'bg-purple-600'
                              }`}
                              title={`${req.employeeName} - ${req.leaveType} (${req.startDate} to ${req.endDate})`}
                            >
                              {isStart && <span className="truncate">{req.days}d</span>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* REQUEST DETAIL DRAWER */}
      {isDrawerOpen && selectedLeave && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
          <div
            className="w-full max-w-lg bg-white shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-200 border-l border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">{selectedLeave.id}</span>
                  <StatusBadge status={selectedLeave.status} size="xs" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">Leave Request Details</h2>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Employee Header Info */}
              <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <img
                  src={selectedLeave.avatar}
                  alt={selectedLeave.employeeName}
                  className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedLeave.employeeName}</h3>
                  <p className="text-xs font-medium text-slate-600">{selectedLeave.role}</p>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3 text-slate-400" /> {selectedLeave.department}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-slate-500">ID: {selectedLeave.empId}</span>
                  </div>
                </div>
              </div>

              {/* Leave Details Grid */}
              <div className="rounded-xl border border-slate-200 p-4 space-y-3.5 bg-white">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                  Leave Parameters
                </h4>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Leave Category</span>
                    <span className={`inline-block mt-1 font-semibold rounded-md px-2.5 py-0.5 border ${getLeaveTypeStyle(selectedLeave.leaveType)}`}>
                      {selectedLeave.leaveType}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Duration</span>
                    <span className="font-bold text-slate-900 mt-1 block">
                      {selectedLeave.days} {selectedLeave.days === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Start Date</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">{selectedLeave.startDate}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">End Date</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">{selectedLeave.endDate}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Reason / Justification</span>
                  <p className="mt-1 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed font-normal">
                    "{selectedLeave.reason}"
                  </p>
                </div>
              </div>

              {/* Available Balance Card */}
              <div className="rounded-xl border border-slate-200 bg-blue-50/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                    <Info className="h-4 w-4 text-blue-600" /> Available Leave Balance
                  </h4>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    2026 Quota
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white rounded-lg p-2.5 border border-blue-100 shadow-2xs">
                    <span className="text-[10px] font-medium text-slate-500 block">Annual</span>
                    <span className="text-base font-bold text-slate-900 block mt-0.5">
                      {selectedLeave.availableBalance?.annual?.remaining ?? 12}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      of {selectedLeave.availableBalance?.annual?.total ?? 18} left
                    </span>
                  </div>

                  <div className="bg-white rounded-lg p-2.5 border border-blue-100 shadow-2xs">
                    <span className="text-[10px] font-medium text-slate-500 block">Sick</span>
                    <span className="text-base font-bold text-slate-900 block mt-0.5">
                      {selectedLeave.availableBalance?.sick?.remaining ?? 5}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      of {selectedLeave.availableBalance?.sick?.total ?? 7} left
                    </span>
                  </div>

                  <div className="bg-white rounded-lg p-2.5 border border-blue-100 shadow-2xs">
                    <span className="text-[10px] font-medium text-slate-500 block">Casual</span>
                    <span className="text-base font-bold text-slate-900 block mt-0.5">
                      {selectedLeave.availableBalance?.casual?.remaining ?? 4}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      of {selectedLeave.availableBalance?.casual?.total ?? 6} left
                    </span>
                  </div>
                </div>
              </div>

              {/* Previous Leave History */}
              <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-white">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                  Previous Leave History
                </h4>

                {selectedLeave.previousHistory && selectedLeave.previousHistory.length > 0 ? (
                  <div className="space-y-2">
                    {selectedLeave.previousHistory.map((hist) => (
                      <div
                        key={hist.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                      >
                        <div>
                          <span className="font-semibold text-slate-800">{hist.leaveType}</span>
                          <span className="text-[11px] text-slate-500 block mt-0.5">{hist.dates} ({hist.days}d)</span>
                        </div>
                        <StatusBadge status={hist.status} size="xs" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No prior leave history recorded.</p>
                )}
              </div>

              {/* Clarification Notes Thread */}
              {selectedLeave.clarificationNote && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-2">
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4 text-amber-600" /> Manager Clarification Request:
                  </span>
                  <p className="text-xs text-amber-900 italic bg-white p-2.5 rounded-lg border border-amber-200">
                    "{selectedLeave.clarificationNote}"
                  </p>
                </div>
              )}

              {/* Clarification Input Form toggle */}
              {isClarificationInputOpen && (
                <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-3">
                  <label className="text-xs font-semibold text-blue-900 block">
                    Write clarification question for employee:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Please provide doctor's prescription note or clarify client project coverage during this duration..."
                    value={clarificationText}
                    onChange={(e) => setClarificationText(e.target.value)}
                    className="w-full rounded-lg border border-blue-200 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsClarificationInputOpen(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRequestClarification(selectedLeave.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs"
                    >
                      <Send className="h-3.5 w-3.5" /> Send Request
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="border-t border-slate-200 p-4 bg-slate-50 flex items-center justify-between gap-2">
              <button
                onClick={() => setIsClarificationInputOpen(!isClarificationInputOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <MessageSquare className="h-4 w-4 text-amber-600" /> Clarification
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReject(selectedLeave.id)}
                  className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition-colors"
                >
                  <XCircle className="h-4 w-4" /> Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedLeave.id)}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW REQUEST MODAL */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Request Leave"
        subtitle="Submit a new paid time-off or leave application."
      >
        <form onSubmit={handleCreateLeaveRequest} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Employee
            </label>
            <select
              value={newRequestForm.empId}
              onChange={(e) => setNewRequestForm({ ...newRequestForm, empId: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            >
              {mockEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.designation})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Leave Category
            </label>
            <select
              value={newRequestForm.leaveType}
              onChange={(e) => setNewRequestForm({ ...newRequestForm, leaveType: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            >
              <option value="Annual Vacation">Annual Vacation</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Conference / Event">Conference / Event</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={newRequestForm.startDate}
                onChange={(e) => setNewRequestForm({ ...newRequestForm, startDate: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={newRequestForm.endDate}
                onChange={(e) => setNewRequestForm({ ...newRequestForm, endDate: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason / Justification
            </label>
            <textarea
              rows={3}
              placeholder="State the reason for leave request..."
              value={newRequestForm.reason}
              onChange={(e) => setNewRequestForm({ ...newRequestForm, reason: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0066FF] hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              Submit Leave Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
