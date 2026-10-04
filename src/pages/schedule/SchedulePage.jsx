import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Edit,
  RefreshCw,
  X,
  User,
  Briefcase,
  Layers,
  ArrowRight,
  TrendingUp,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Avatar } from '../../components/common/Avatar';

export const SchedulePage = () => {
  const { employees, projects, tasks, openQuickCreate } = useApp();

  // Date Navigation State
  const [currentDate, setCurrentDate] = useState(new Date('2026-10-04'));
  const [viewMode, setViewMode] = useState('day'); // 'day' | 'week' | 'month'
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Interactive Work Blocks state
  const initialBlocks = [
    {
      id: 'blk-101',
      employeeName: 'Alex Morgan',
      taskId: 'TSK-1001',
      title: 'Homepage UI & OAuth2 Architecture',
      project: 'Quantum Telemetry Portal v2',
      client: 'Quantum Dynamics',
      startHour: 9, // 09:00
      duration: 3, // 3 hours (09:00 - 12:00)
      timeDisplay: '09:00 – 12:00',
      status: 'In Progress',
      priority: 'Urgent',
      category: 'Core Tech',
      bgClass: 'bg-blue-50 border-blue-200 text-[#0066FF]',
    },
    {
      id: 'blk-102',
      employeeName: 'Alex Morgan',
      taskId: 'TSK-1003',
      title: 'Client Revision & Architecture Sync',
      project: 'AeroCloud Fleet Dispatch',
      client: 'AeroCloud Logistics',
      startHour: 13, // 13:00
      duration: 2.5, // 13:00 - 15:30
      timeDisplay: '13:00 – 15:30',
      status: 'In Progress',
      priority: 'High',
      category: 'Architecture',
      bgClass: 'bg-[#0066FF] text-white border-blue-600',
    },
    {
      id: 'blk-103',
      employeeName: 'Alex Morgan',
      taskId: 'TSK-1008',
      title: 'Executive Code Review',
      project: 'Strata Audit Suite',
      client: 'Strata Financials',
      startHour: 16, // 16:00
      duration: 1, // 16:00 - 17:00
      timeDisplay: '16:00 – 17:00',
      status: 'Completed',
      priority: 'Low',
      category: 'Audit',
      bgClass: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    },
    {
      id: 'blk-201',
      employeeName: 'Sophia Chen',
      taskId: 'TSK-1002',
      title: 'Dark Mode Tokens & Figma Spec',
      project: 'Quantum Telemetry Portal v2',
      client: 'Quantum Dynamics',
      startHour: 9,
      duration: 2.5,
      timeDisplay: '09:00 – 11:30',
      status: 'Review',
      priority: 'High',
      category: 'UI/UX',
      bgClass: 'bg-purple-50 border-purple-200 text-purple-700',
    },
    {
      id: 'blk-202',
      employeeName: 'Sophia Chen',
      taskId: 'TSK-1004',
      title: 'Medical Scan WebGL Canvas Audit',
      project: 'HealthViz Medical Imaging Interface',
      client: 'Nexus Global Health',
      startHour: 13,
      duration: 3.5,
      timeDisplay: '13:00 – 16:30',
      status: 'In Progress',
      priority: 'High',
      category: 'Healthcare',
      bgClass: 'bg-amber-50 border-amber-200 text-amber-700',
    },
    {
      id: 'blk-301',
      employeeName: 'Rahul',
      taskId: 'TSK-1003',
      title: 'WebSockets Telemetry Stream Worker',
      project: 'AeroCloud Fleet Dispatch',
      client: 'AeroCloud Logistics',
      startHour: 9.5,
      duration: 3,
      timeDisplay: '09:30 – 12:30',
      status: 'Assigned',
      priority: 'Urgent',
      category: 'Backend',
      bgClass: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    },
    {
      id: 'blk-302',
      employeeName: 'Rahul',
      taskId: 'TSK-1006',
      title: 'PCI Payment SDK Token Sanitization',
      project: 'FinTech Banking Mobile SDK',
      client: 'FinTech Nexus Corp',
      startHour: 13.5,
      duration: 2.5,
      timeDisplay: '13:30 – 16:00',
      status: 'In Progress',
      priority: 'Urgent',
      category: 'Security',
      bgClass: 'bg-rose-50 border-rose-200 text-rose-700',
    },
    {
      id: 'blk-401',
      employeeName: 'Anoop',
      taskId: 'TSK-1008',
      title: 'Automated RBI Rule Checking Parser',
      project: 'Strata Audit Suite',
      client: 'Strata Financials',
      startHour: 9,
      duration: 3,
      timeDisplay: '09:00 – 12:00',
      status: 'Completed',
      priority: 'High',
      category: 'QA Test',
      bgClass: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    },
    {
      id: 'blk-402',
      employeeName: 'Anoop',
      taskId: 'TSK-1006',
      title: 'E2E Penetration & Load Test',
      project: 'FinTech Banking Mobile SDK',
      client: 'FinTech Nexus Corp',
      startHour: 13,
      duration: 2.5,
      timeDisplay: '13:00 – 15:30',
      status: 'Blocked',
      priority: 'Urgent',
      category: 'QA Test',
      bgClass: 'bg-rose-50 border-rose-200 text-rose-700',
    },
    {
      id: 'blk-501',
      employeeName: 'Arjun',
      taskId: 'TSK-1007',
      title: 'Property Map Search Indexing',
      project: 'Urban Pulse Property Portal',
      client: 'Urban Pulse Real Estate',
      startHour: 10.5,
      duration: 3.5,
      timeDisplay: '10:30 – 14:00',
      status: 'In Progress',
      priority: 'Medium',
      category: 'Frontend',
      bgClass: 'bg-teal-50 border-teal-200 text-teal-700',
    },
  ];

  const [workBlocks, setWorkBlocks] = useState(initialBlocks);
  const [selectedBlock, setSelectedBlock] = useState(initialBlocks[0]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // New Work Block Form State
  const [newBlock, setNewBlock] = useState({
    employeeName: 'Alex Morgan',
    title: '',
    project: 'Quantum Telemetry Portal v2',
    startHour: 9,
    duration: 2,
    status: 'Assigned',
    priority: 'Medium',
  });

  // Timeline Hours Header: 09:00 to 17:00
  const hoursHeader = [
    { label: '09:00', hour: 9 },
    { label: '10:00', hour: 10 },
    { label: '11:00', hour: 11 },
    { label: '12:00', hour: 12 },
    { label: '13:00', hour: 13 },
    { label: '14:00', hour: 14 },
    { label: '15:00', hour: 15 },
    { label: '16:00', hour: 16 },
    { label: '17:00', hour: 17 },
  ];

  // Schedule Team Roster
  const scheduleTeam = [
    { name: 'Alex Morgan', role: 'Managing Director & Lead Architect', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', dept: 'Executive' },
    { name: 'Sophia Chen', role: 'Senior UI/UX Designer', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', dept: 'Design' },
    { name: 'Rahul', role: 'Full Stack Engineer', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', dept: 'Engineering' },
    { name: 'Anoop', role: 'QA Automation Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', dept: 'QA & Testing' },
    { name: 'Arjun', role: 'Frontend Engineer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', dept: 'Engineering' },
  ];

  // Date Navigation Handlers
  const handlePrevDay = () => {
    setCurrentDate((prev) => new Date(prev.getTime() - 24 * 60 * 60 * 1000));
  };
  const handleNextDay = () => {
    setCurrentDate((prev) => new Date(prev.getTime() + 24 * 60 * 60 * 1000));
  };
  const handleToday = () => {
    setCurrentDate(new Date('2026-10-04'));
  };

  const formattedDateStr = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Action Handlers for Selected Work Block
  const handleBlockComplete = () => {
    if (!selectedBlock) return;
    const updated = { ...selectedBlock, status: 'Completed', bgClass: 'bg-emerald-50 border-emerald-200 text-emerald-700' };
    setSelectedBlock(updated);
    setWorkBlocks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const handleCreateBlock = (e) => {
    e.preventDefault();
    if (!newBlock.title.trim()) return;

    const startH = Number(newBlock.startHour);
    const dur = Number(newBlock.duration);
    const endH = startH + dur;

    const created = {
      id: `blk-${Date.now()}`,
      employeeName: newBlock.employeeName,
      taskId: `TSK-${Math.floor(1000 + Math.random() * 900)}`,
      title: newBlock.title,
      project: newBlock.project,
      client: 'Domain Dude SaaS',
      startHour: startH,
      duration: dur,
      timeDisplay: `${String(startH).padStart(2, '0')}:00 – ${String(endH).padStart(2, '0')}:00`,
      status: newBlock.status,
      priority: newBlock.priority,
      category: 'Assigned Work',
      bgClass: 'bg-blue-50 border-blue-200 text-[#0066FF]',
    };

    setWorkBlocks((prev) => [...prev, created]);
    setSelectedBlock(created);
    setIsScheduleModalOpen(false);
    setNewBlock({ ...newBlock, title: '' });
  };

  // Compute Workload Summary Metrics for each Team Member
  const teamWorkloadSummary = scheduleTeam.map((emp) => {
    const empBlocks = workBlocks.filter((b) => b.employeeName === emp.name);
    const assignedHours = empBlocks.reduce((sum, b) => sum + b.duration, 0);
    const completedHours = empBlocks
      .filter((b) => b.status === 'Completed')
      .reduce((sum, b) => sum + b.duration, 0);
    const totalCapacity = 8.0; // Standard 8-hour workday
    const availableHours = Math.max(0, totalCapacity - assignedHours);
    const utilization = Math.min(100, Math.round((assignedHours / totalCapacity) * 100));

    let utilizationStatus = 'Balanced';
    let utilizationColor = 'bg-emerald-500 text-emerald-700';
    if (utilization >= 95) {
      utilizationStatus = 'Overloaded';
      utilizationColor = 'bg-rose-500 text-rose-700';
    } else if (utilization >= 85) {
      utilizationStatus = 'High Capacity';
      utilizationColor = 'bg-amber-500 text-amber-700';
    }

    return {
      ...emp,
      assignedHours,
      completedHours,
      availableHours,
      utilization,
      utilizationStatus,
      utilizationColor,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Work Schedule"
        subtitle="Plan team capacity and assign daily work."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {/* View Switcher Controls */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  viewMode === 'day' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  viewMode === 'week' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  viewMode === 'month' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Month
              </button>
            </div>

            {/* Date Navigation Controls */}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2 py-1 shadow-2xs">
              <button
                onClick={handlePrevDay}
                className="p-1 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleToday}
                className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md"
              >
                Today
              </button>
              <button
                onClick={handleNextDay}
                className="p-1 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <span className="text-xs font-bold text-slate-900 px-2 border-l border-slate-200">
                {formattedDateStr}
              </span>
            </div>

            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
            >
              <Plus className="h-3.5 w-3.5" /> Assign Work Block
            </button>
          </div>
        }
      />

      {/* Main Grid: Left Timeline Calendar vs Right Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT 3 COLUMNS: EMPLOYEE-ROW TIMELINE SCHEDULE */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-[#0066FF]" />
              <h3 className="text-sm font-bold text-slate-900">Daily Team Schedule Grid</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">Standard 8-Hour Work Window (09:00 - 17:00)</span>
          </div>

          {/* Timeline Grid Table */}
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Hours Header Row */}
              <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 py-2.5 px-4">
                <div className="col-span-3 text-left">Employee & Role</div>
                <div className="col-span-9 grid grid-cols-8 text-center divide-x divide-slate-200/60">
                  {hoursHeader.slice(0, 8).map((h) => (
                    <span key={h.hour} className="px-1">{h.label}</span>
                  ))}
                </div>
              </div>

              {/* Employee Row Grid */}
              <div className="divide-y divide-slate-100">
                {scheduleTeam.map((emp) => {
                  const empBlocks = workBlocks.filter((b) => b.employeeName === emp.name);

                  return (
                    <div key={emp.name} className="grid grid-cols-12 items-center py-3 px-4 hover:bg-slate-50/40 transition">
                      {/* Left Column: Employee Details */}
                      <div className="col-span-3 flex items-center gap-3 pr-2">
                        <Avatar name={emp.name} src={emp.avatar} size="sm" />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{emp.name}</h4>
                          <p className="text-[10px] text-slate-400 truncate font-medium">{emp.role}</p>
                        </div>
                      </div>

                      {/* Right Timeline Canvas (8-Hour Columns Container) */}
                      <div className="col-span-9 relative h-16 bg-slate-50/50 rounded-xl border border-slate-200/60 p-1 flex items-center overflow-hidden">
                        {/* Vertical hour marker lines */}
                        <div className="absolute inset-0 grid grid-cols-8 divide-x divide-slate-200/40 pointer-events-none" />

                        {/* Work Blocks */}
                        {empBlocks.map((block) => {
                          // Calculate left % and width % based on 09:00 to 17:00 (8 hours total)
                          const leftPercent = ((block.startHour - 9) / 8) * 100;
                          const widthPercent = (block.duration / 8) * 100;

                          const isSelected = selectedBlock?.id === block.id;

                          return (
                            <div
                              key={block.id}
                              onClick={() => setSelectedBlock(block)}
                              style={{
                                left: `${Math.max(0, leftPercent)}%`,
                                width: `${Math.min(100 - leftPercent, widthPercent)}%`,
                              }}
                              className={`absolute h-14 rounded-lg border p-2 text-xs font-bold shadow-2xs cursor-pointer transition-all flex flex-col justify-between overflow-hidden ${
                                block.bgClass
                              } ${isSelected ? 'ring-2 ring-[#0066FF] shadow-md z-10 scale-[1.01]' : 'hover:opacity-90'}`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-extrabold truncate text-[11px]">{block.title}</span>
                                <StatusBadge status={block.status} size="xs" className="scale-90 origin-right" />
                              </div>
                              <div className="flex items-center justify-between text-[10px] opacity-90 font-medium">
                                <span className="truncate">{block.project}</span>
                                <span className="font-mono font-semibold shrink-0">{block.timeDisplay}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 1 COLUMN: SELECTED WORK BLOCK INSPECTOR PANEL */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wider">Work Inspector</span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">Selected Block Details</h3>
              </div>
              <StatusBadge status={selectedBlock?.status || 'Assigned'} size="xs" />
            </div>

            {selectedBlock ? (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{selectedBlock.taskId}</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{selectedBlock.title}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{selectedBlock.project} • {selectedBlock.client}</p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Assigned Person:</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Avatar name={selectedBlock.employeeName} size="xs" />
                      <span>{selectedBlock.employeeName}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
                    <span className="text-slate-400 font-medium">Time Slot:</span>
                    <span className="font-mono font-bold text-[#0066FF]">{selectedBlock.timeDisplay}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
                    <span className="text-slate-400 font-medium">Duration:</span>
                    <span className="font-semibold text-slate-800">{selectedBlock.duration} Hours</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
                    <span className="text-slate-400 font-medium">Priority Level:</span>
                    <StatusBadge status={selectedBlock.priority} size="xs" />
                  </div>
                </div>

                {/* Inspector Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleBlockComplete}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Mark Completed
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => alert(`Reschedule block ${selectedBlock.id}`)}
                      className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <RefreshCw className="h-3.5 w-3.5 text-slate-400" /> Reschedule
                    </button>
                    <button
                      onClick={() => alert(`Edit work block ${selectedBlock.id}`)}
                      className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Edit className="h-3.5 w-3.5 text-slate-400" /> Edit
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                Click any work block on the timeline grid to inspect details and actions.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: TEAM WORKLOAD SUMMARY */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#0066FF]" /> Team Workload & Capacity Utilization
            </h3>
            <p className="text-xs text-slate-500">Live operational capacity metrics based on 8-hour daily baseline.</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">Standard Baseline: 40.0 Total Team Hours</span>
        </div>

        {/* Workload Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {teamWorkloadSummary.map((emp) => (
            <div key={emp.name} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3 shadow-2xs hover:border-blue-200 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar name={emp.name} src={emp.avatar} size="xs" />
                  <span className="text-xs font-bold text-slate-900 truncate">{emp.name}</span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  emp.utilization >= 95 ? 'bg-rose-100 text-rose-700' : emp.utilization >= 85 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {emp.utilizationStatus}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>Utilization</span>
                  <span className="font-bold text-slate-900">{emp.utilization}%</span>
                </div>
                <ProgressBar progress={emp.utilization} size="xs" />
              </div>

              <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 text-center">
                <div>
                  <span className="block text-slate-400">Assigned</span>
                  <span className="font-bold text-slate-900">{emp.assignedHours}h</span>
                </div>
                <div>
                  <span className="block text-slate-400">Done</span>
                  <span className="font-bold text-emerald-600">{emp.completedHours}h</span>
                </div>
                <div>
                  <span className="block text-slate-400">Avail</span>
                  <span className="font-bold text-[#0066FF]">{emp.availableHours}h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SCHEDULE WORK BLOCK MODAL */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus className="h-4 w-4 text-[#0066FF]" /> Assign New Work Block
              </h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBlock} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Employee</label>
                <select
                  value={newBlock.employeeName}
                  onChange={(e) => setNewBlock({ ...newBlock, employeeName: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                >
                  {scheduleTeam.map((e) => (
                    <option key={e.name} value={e.name}>
                      {e.name} ({e.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task / Work Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Homepage UI & System Design"
                  value={newBlock.title}
                  onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Project</label>
                <select
                  value={newBlock.project}
                  onChange={(e) => setNewBlock({ ...newBlock, project: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.client})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Hour</label>
                  <select
                    value={newBlock.startHour}
                    onChange={(e) => setNewBlock({ ...newBlock, startHour: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                  >
                    <option value={9}>09:00 AM</option>
                    <option value={10}>10:00 AM</option>
                    <option value={11}>11:00 AM</option>
                    <option value={12}>12:00 PM</option>
                    <option value={13}>01:00 PM</option>
                    <option value={14}>02:00 PM</option>
                    <option value={15}>03:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={newBlock.duration}
                    onChange={(e) => setNewBlock({ ...newBlock, duration: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#0066FF] px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
                >
                  Assign Work Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
