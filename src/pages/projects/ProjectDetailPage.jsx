import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, CheckSquare, Clock, Users, DollarSign, Calendar, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { AvatarGroup, Avatar } from '../../components/common/Avatar';
import { Tabs } from '../../components/common/Tabs';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, openQuickCreate } = useApp();

  const [activeTab, setActiveTab] = useState('tasks');

  const project = projects.find((p) => p.id === id) || projects[0];
  const projectTasks = tasks.filter((t) => t.project === project.name || t.projectId === project.id);

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/projects')} className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </button>

      <PageHeader
        title={`${project.name} (${project.id})`}
        subtitle={`Client: ${project.client} • Lead: ${project.manager}`}
        actions={
          <button
            onClick={() => openQuickCreate('task')}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" /> Add Task
          </button>
        }
      />

      {/* Top Banner Overview */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <span className="text-xs text-slate-400 font-medium">Status</span>
          <div className="mt-1"><StatusBadge status={project.status} size="lg" /></div>
        </div>
        <div>
          <span className="text-xs text-slate-400 font-medium">Overall Progress</span>
          <div className="mt-1.5"><ProgressBar progress={project.progress} size="md" /></div>
        </div>
        <div>
          <span className="text-xs text-slate-400 font-medium">Budget & Burn</span>
          <p className="mt-1 text-sm font-bold text-slate-900">${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-xs text-slate-400 font-medium">Assigned Team</span>
          <div className="mt-1.5"><AvatarGroup users={project.team} size="sm" /></div>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-card p-6">
        <Tabs
          tabs={[
            { id: 'tasks', label: 'Tasks & Deliverables', icon: CheckSquare, count: projectTasks.length },
            { id: 'team', label: 'Team Members', icon: Users, count: project.team.length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-6"
        />

        {activeTab === 'tasks' && (
          <div className="space-y-3">
            {projectTasks.length > 0 ? (
              projectTasks.map((tsk) => (
                <div key={tsk.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors text-xs">
                  <div className="flex items-center space-x-3">
                    <CheckSquare className="h-4 w-4 text-slate-400" />
                    <div>
                      <span className="font-semibold text-slate-900">{tsk.title}</span>
                      <p className="text-slate-400 text-[11px]">Due: {tsk.dueDate} • Est: {tsk.estimatedHours} hrs</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StatusBadge status={tsk.priority} size="sm" />
                    <StatusBadge status={tsk.status} size="sm" />
                    <Avatar name={tsk.assignee?.name} src={tsk.assignee?.avatar} size="xs" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No tasks assigned to this project yet.</p>
            )}
          </div>
        )}

        {activeTab === 'team' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.team.map((member, idx) => (
              <div key={idx} className="flex items-center space-x-3 rounded-lg border border-slate-200 p-3 bg-slate-50/50">
                <Avatar name={member.name} src={member.avatar} size="md" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{member.name}</h4>
                  <p className="text-[11px] text-slate-500">Project Contributor</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
