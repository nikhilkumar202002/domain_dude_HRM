import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Edit,
  UserPlus,
  MoreVertical,
  CheckSquare,
  Users,
  Calendar,
  FileText,
  Clock,
  DollarSign,
  Flag,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  FolderKanban,
  Building2,
  ShieldCheck,
  Code
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { AvatarGroup, Avatar } from '../../components/common/Avatar';
import { Tabs } from '../../components/common/Tabs';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, openQuickCreate, addTask } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'tasks' | 'team' | 'timeline' | 'files' | 'activity'
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Frontend Developer');

  // Find project by id or fallback to first project
  const initialProject = projects.find((p) => p.id === id) || projects[0];
  const [project, setProject] = useState(initialProject);

  if (!project) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Project not found.</p>
        <button onClick={() => navigate('/projects')} className="mt-2 text-xs font-semibold text-[#0066FF]">
          Back to Projects List
        </button>
      </div>
    );
  }

  // Related tasks for this project
  const projectTasks = tasks.filter(
    (t) => t.project === project.name || t.projectId === project.id
  );

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMember = {
      name: newMemberName,
      role: newMemberRole,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      workload: 60,
      assignedTasks: 3,
    };

    setProject((prev) => ({
      ...prev,
      team: [...prev.team, newMember],
      activity: [
        {
          id: Date.now(),
          type: 'member',
          label: `Team Member Added: ${newMemberName}`,
          by: 'Nikhil',
          timestamp: 'Just now',
          details: `Assigned as ${newMemberRole}`,
        },
        ...prev.activity,
      ],
    }));

    setNewMemberName('');
    setIsAddingMember(false);
  };

  const tabsList = [
    { id: 'overview', label: 'Overview', icon: FolderKanban },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, count: projectTasks.length },
    { id: 'team', label: 'Team', icon: Users, count: project.team?.length || 0 },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'files', label: 'Files', icon: FileText, count: project.files?.length || 0 },
    { id: 'activity', label: 'Activity', icon: Clock, count: project.activity?.length || 0 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button */}
      <button
        onClick={() => navigate('/projects')}
        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </button>

      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0066FF] border border-blue-100 font-extrabold text-sm">
              {project.id.split('-').pop()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0066FF] uppercase tracking-wider">{project.id}</span>
                <StatusBadge status={project.status} />
                <StatusBadge status={project.priority} />
              </div>
              <h1 className="text-xl font-bold text-slate-900 mt-1">{project.name}</h1>
              <p className="text-xs text-slate-500">
                Client: <span className="font-semibold text-slate-800">{project.client}</span> • Project Lead:{' '}
                <span className="text-slate-800 font-semibold">{project.manager}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => openQuickCreate('task')}
              className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
            >
              <Plus className="h-3.5 w-3.5" /> Add Task
            </button>
            <button
              onClick={() => setIsAddingMember((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
            >
              <UserPlus className="h-3.5 w-3.5 text-slate-500" /> Add Member
            </button>
            <button
              onClick={() => alert(`Edit project details for ${project.id}`)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
            >
              <Edit className="h-3.5 w-3.5 text-slate-500" /> Edit
            </button>
          </div>
        </div>

        {/* Quick Header Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Overall Progress</span>
            <div className="mt-1 space-y-1">
              <ProgressBar progress={project.progress} size="sm" />
              <span className="text-xs font-bold text-slate-900">{project.progress}% Complete</span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Budget Burn</span>
            <p className="text-sm font-bold text-slate-900">
              ₹{(project.spent || 0).toLocaleString('en-IN')}{' '}
              <span className="text-xs font-normal text-slate-400">/ ₹{(project.budget || 0).toLocaleString('en-IN')}</span>
            </p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Target Deadline</span>
            <p className="text-sm font-bold text-slate-900">{project.deadline || project.endDate}</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Assigned Team</span>
            <div className="mt-1">
              <AvatarGroup users={project.team} size="xs" max={4} />
            </div>
          </div>
        </div>
      </div>

      {/* Add Team Member Modal/Drawer inline */}
      {isAddingMember && (
        <form onSubmit={handleAddMember} className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <UserPlus className="h-4 w-4 text-[#0066FF]" /> Add Team Member to Project
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Member Name (e.g. Rahul Sharma)"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
            />
            <input
              type="text"
              required
              placeholder="Role (e.g. Senior Frontend Engineer)"
              value={newMemberRole}
              onChange={(e) => setNewMemberRole(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingMember(false)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#0066FF] px-4 py-1 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Save Member
            </button>
          </div>
        </form>
      )}

      {/* Navigation Tabs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
        <Tabs tabs={tabsList} activeTab={activeTab} onChange={setActiveTab} />

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Milestones Section */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Project Milestone Roadmap</span>
                <span className="text-slate-500 font-medium">6 Phase Deliverables</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(project.milestones || []).map((m, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3 hover:border-blue-200 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phase 0{idx + 1}</span>
                      <StatusBadge status={m.status} size="xs" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{m.name}</h4>
                    <div className="space-y-1">
                      <ProgressBar progress={m.progress} size="xs" />
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                        <span>Due: {m.dueDate}</span>
                        <span className="font-bold text-slate-700">{m.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial & Overview Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                <span className="text-xs font-bold text-slate-800 block mb-1">Financial & Budget Breakdown</span>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Contract Budget:</span>
                  <span className="font-bold text-slate-900">₹{(project.budget || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Spent to Date:</span>
                  <span className="font-bold text-emerald-600">₹{(project.spent || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Remaining Balance:</span>
                  <span className="font-bold text-[#0066FF]">₹{((project.budget || 0) - (project.spent || 0)).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                <span className="text-xs font-bold text-slate-800 block mb-1">Project Lead & Manager</span>
                <div className="flex items-center gap-3 pt-1">
                  <Avatar name={project.manager} size="md" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{project.manager}</h4>
                    <p className="text-[11px] text-slate-500">Lead Project Manager & Technical Architect</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TASKS */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Tasks & Action Items</h3>
              <button
                onClick={() => openQuickCreate('task')}
                className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0066FF] hover:bg-blue-100 transition"
              >
                <Plus className="h-3.5 w-3.5" /> Add Task
              </button>
            </div>

            <div className="space-y-2">
              {projectTasks.length > 0 ? (
                projectTasks.map((tsk) => (
                  <div
                    key={tsk.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 hover:border-blue-200 transition text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <CheckSquare className="h-4 w-4 text-[#0066FF]" />
                      <div>
                        <span className="font-bold text-slate-900">{tsk.title}</span>
                        <p className="text-[11px] text-slate-400">
                          Due: {tsk.dueDate} • Estimated: {tsk.estimatedHours} hrs
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <StatusBadge status={tsk.priority} size="xs" />
                      <StatusBadge status={tsk.status} size="xs" />
                      <Avatar name={tsk.assignee?.name} src={tsk.assignee?.avatar} size="xs" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                  No tasks assigned to this project yet. Click "+ Add Task" to create one.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TEAM */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Team Members & Workload</h3>
              <button
                onClick={() => setIsAddingMember(true)}
                className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0066FF] hover:bg-blue-100 transition"
              >
                <UserPlus className="h-3.5 w-3.5" /> Add Team Member
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(project.team || []).map((m, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <Avatar name={m.name} src={m.avatar} size="md" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{m.name}</h4>
                      <p className="text-[11px] text-[#0066FF] font-semibold">{m.role || 'Contributor'}</p>
                    </div>
                  </div>
                  <div className="space-y-1 pt-1 border-t border-slate-100">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Workload Allocation</span>
                      <span className="font-bold text-slate-700">{m.workload || 75}%</span>
                    </div>
                    <ProgressBar progress={m.workload || 75} size="xs" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Milestone Schedule</h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {(project.milestones || []).map((m, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-6 top-0 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      m.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : m.status === 'In Progress' ? 'bg-blue-100 text-[#0066FF]' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{m.name}</h4>
                      <StatusBadge status={m.status} size="xs" />
                    </div>
                    <p className="text-[11px] text-slate-500">Target Due Date: {m.dueDate} • Progress: {m.progress}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FILES */}
        {activeTab === 'files' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Assets & Documentation</h3>
              <button
                onClick={() => alert('Upload new project file')}
                className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0066FF] hover:bg-blue-100 transition"
              >
                <Upload className="h-3.5 w-3.5" /> Upload File
              </button>
            </div>

            <div className="space-y-2">
              {(project.files || []).length > 0 ? (
                project.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-[#0066FF]" />
                      <div>
                        <h4 className="font-bold text-slate-900">{file.name}</h4>
                        <p className="text-[11px] text-slate-400">
                          {file.size} • Uploaded by {file.uploadedBy} on {file.date}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Downloading file ${file.name}`)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                  No uploaded files yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: ACTIVITY */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Activity Log</h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {(project.activity || []).map((act) => (
                <div key={act.id} className="relative">
                  <div className="absolute -left-6 top-0 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold bg-blue-100 text-[#0066FF]">
                    ✓
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{act.label}</h4>
                      <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{act.details}</p>
                    <span className="text-[10px] text-slate-400 font-medium">By: {act.by}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
