import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Building2, Plus, ArrowLeft, FolderKanban, Receipt, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Avatar } from '../../components/common/Avatar';
import { Tabs } from '../../components/common/Tabs';
import { ProgressBar } from '../../components/common/ProgressBar';

export const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, projects, proposals, invoices, openQuickCreate } = useApp();

  const [activeTab, setActiveTab] = useState('projects');

  const client = clients.find((c) => c.id === id) || clients[0];
  const clientProjects = projects.filter((p) => p.client === client.companyName || p.clientId === client.id);
  const clientProposals = proposals.filter((p) => p.clientName === client.companyName || p.clientId === client.id);
  const clientInvoices = invoices.filter((inv) => inv.clientName === client.companyName || inv.clientId === client.id);

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/clients')} className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to Clients Directory
      </button>

      <PageHeader
        title={client.companyName}
        subtitle={`${client.industry} • Account Manager: ${client.accountManager}`}
        actions={
          <button
            onClick={() => openQuickCreate('project')}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" /> New Client Project
          </button>
        }
      />

      {/* Top Banner Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar name={client.companyName} src={client.avatar} size="xl" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{client.companyName}</h2>
              <StatusBadge status={client.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-slate-400" /> {client.location}
              <span className="text-slate-300">•</span> Joined {client.joinedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 text-xs">
          <div>
            <span className="text-slate-400">Total Lifetime Value</span>
            <p className="text-xl font-bold text-slate-900 mt-0.5">${client.totalSpent.toLocaleString()}</p>
          </div>
          <div className="border-l border-slate-200 pl-6">
            <span className="text-slate-400">Active Contracts</span>
            <p className="text-xl font-bold text-indigo-600 mt-0.5">{clientProjects.length}</p>
          </div>
        </div>
      </div>

      {/* Detail Tabs */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-card p-6">
        <Tabs
          tabs={[
            { id: 'projects', label: 'Active Projects', icon: FolderKanban, count: clientProjects.length },
            { id: 'proposals', label: 'Proposals', icon: FileText, count: clientProposals.length },
            { id: 'invoices', label: 'Invoices & Billing', icon: Receipt, count: clientInvoices.length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-6"
        />

        {activeTab === 'projects' && (
          <div className="space-y-4">
            {clientProjects.length > 0 ? (
              clientProjects.map((prj) => (
                <div
                  key={prj.id}
                  onClick={() => navigate(`/projects/${prj.id}`)}
                  className="rounded-lg border border-slate-200 p-4 hover:border-indigo-300 hover:shadow-soft cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-sm text-slate-900">{prj.name}</span>
                      <span className="text-xs text-slate-400 ml-2">Budget: ${prj.budget.toLocaleString()}</span>
                    </div>
                    <StatusBadge status={prj.status} />
                  </div>
                  <ProgressBar progress={prj.progress} />
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No active projects registered for this client.</p>
            )}
          </div>
        )}

        {activeTab === 'proposals' && (
          <div className="space-y-3">
            {clientProposals.length > 0 ? (
              clientProposals.map((prop) => (
                <div key={prop.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-900">{prop.title}</span>
                    <p className="text-slate-400">Sent: {prop.sentDate}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">${prop.amount.toLocaleString()}</span>
                    <div className="mt-1"><StatusBadge status={prop.status} size="sm" /></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No proposal records found.</p>
            )}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-3">
            {clientInvoices.length > 0 ? (
              clientInvoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-900">{inv.id}</span>
                    <p className="text-slate-400">Due: {inv.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">${inv.amount.toLocaleString()}</span>
                    <div className="mt-1"><StatusBadge status={inv.status} size="sm" /></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No invoice records found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
