import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Plus,
  ArrowLeft,
  Edit,
  FolderKanban,
  Receipt,
  FileText,
  CreditCard,
  MessageSquare,
  File,
  MoreHorizontal,
  Clock,
  Send,
  Upload,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Avatar } from '../../components/common/Avatar';
import { Tabs } from '../../components/common/Tabs';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Timeline } from '../../components/common/Timeline';
import { Dropdown } from '../../components/common/Dropdown';
import { FileUploader } from '../../components/common/FileUploader';

export const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, projects, enquiries, proposals, invoices, payments, openQuickCreate } = useApp();

  const [activeTab, setActiveTab] = useState('overview');

  const client = clients.find((c) => c.id === id) || clients[0];

  // Filter client-specific items
  const clientProjects = projects.filter((p) => p.client === client.companyName || p.clientId === client.id);
  const clientEnquiries = enquiries.filter((e) => e.company === client.companyName || e.clientName === client.companyName);
  const clientProposals = proposals.filter((p) => p.clientName === client.companyName || p.clientId === client.id);
  const clientInvoices = invoices.filter((inv) => inv.clientName === client.companyName || inv.clientId === client.id);
  const clientPayments = payments.filter((pay) => pay.client === client.companyName);

  // Client activity timeline
  const clientTimeline = [
    { title: 'Payment Received', timestamp: 'Yesterday, 4:30 PM', description: `Received payment for Invoice #${clientInvoices[0]?.id || 'INV-2026-042'}.`, status: 'completed' },
    { title: 'Project Review Call', timestamp: '01 Oct 2026', description: 'Discussed sprint milestone delivery with ' + client.contactName, status: 'completed' },
    { title: 'Proposal Accepted', timestamp: '22 Sep 2026', description: 'Client signed digital proposal contract.', status: 'completed' },
    { title: 'Client Onboarded', timestamp: client.joinedDate || '12 Mar 2025', description: 'Account registered and relationship manager assigned.', status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button onClick={() => navigate('/clients')} className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to Clients List
      </button>

      {/* CLIENT HEADER BANNER */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar name={client.companyName} src={client.avatar} size="xl" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{client.companyName}</h1>
                <StatusBadge status={client.status} />
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                <span className="font-semibold text-slate-700">{client.industry}</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1"><User className="h-3.5 w-3.5 text-slate-400" /> {client.contactName}</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-slate-400" /> {client.phone}</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-slate-400" /> {client.email}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => alert(`Edit client ${client.companyName}`)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Edit className="h-3.5 w-3.5 text-slate-500" /> Edit
            </button>
            <button
              onClick={() => openQuickCreate('project')}
              className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0052D4]"
            >
              <FolderKanban className="h-3.5 w-3.5" /> Create Project
            </button>
            <button
              onClick={() => openQuickCreate('invoice')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Receipt className="h-3.5 w-3.5 text-[#0066FF]" /> Create Invoice
            </button>
            <Dropdown
              align="right"
              trigger={
                <button className="flex items-center rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              }
              items={[
                { label: 'Send Email', icon: Mail, onClick: () => alert(`Sending email to ${client.email}`) },
                { label: 'Export Client History', icon: FileText, onClick: () => alert('Exporting history...') },
                { label: 'Delete Client', icon: Edit, danger: true, onClick: () => alert('Delete client trigger') },
              ]}
            />
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400">Total Revenue</span>
            <p className="text-lg font-bold text-slate-900 mt-0.5">₹{((client.revenue || client.totalSpent) / 100000).toFixed(2)}L</p>
          </div>
          <div>
            <span className="text-slate-400">Outstanding</span>
            <p className={`text-lg font-bold mt-0.5 ${client.outstanding > 0 ? 'text-amber-800' : 'text-slate-900'}`}>
              ₹{((client.outstanding || 0) / 100000).toFixed(2)}L
            </p>
          </div>
          <div>
            <span className="text-slate-400">Active Projects</span>
            <p className="text-lg font-bold text-[#0066FF] mt-0.5">{clientProjects.length}</p>
          </div>
          <div>
            <span className="text-slate-400">Relationship Manager</span>
            <div className="flex items-center gap-1.5 mt-0.5 font-bold text-slate-900">
              <Avatar name={client.assignedManager || client.accountManager} size="xs" />
              <span>{client.assignedManager || client.accountManager}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 8 TABS CONTAINER */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview', icon: Building2 },
            { id: 'projects', label: 'Projects', icon: FolderKanban, count: clientProjects.length },
            { id: 'enquiries', label: 'Enquiries', icon: MessageSquare, count: clientEnquiries.length },
            { id: 'proposals', label: 'Proposals', icon: FileText, count: clientProposals.length },
            { id: 'invoices', label: 'Invoices', icon: Receipt, count: clientInvoices.length },
            { id: 'payments', label: 'Payments', icon: CreditCard, count: clientPayments.length },
            { id: 'documents', label: 'Documents', icon: File },
            { id: 'activity', label: 'Activity', icon: Clock },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/50 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Primary Contact Person</span>
                    <p className="font-bold text-slate-900 mt-0.5">{client.contactName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Industry / Sector</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{client.industry}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Work Email</span>
                    <p className="font-semibold text-[#0066FF] mt-0.5">{client.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Phone Number</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{client.phone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Location / Address</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{client.location}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Client Since</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{client.joinedDate || client.createdDate}</p>
                  </div>
                </div>
              </div>

              {/* Related Active Projects Summary */}
              <div className="rounded-xl border border-slate-200 p-5 bg-white space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Projects Progress</h3>
                {clientProjects.length > 0 ? (
                  clientProjects.map((prj) => (
                    <div
                      key={prj.id}
                      onClick={() => navigate(`/projects/${prj.id}`)}
                      className="rounded-lg border border-slate-100 p-3 hover:border-blue-200 hover:bg-slate-50 cursor-pointer transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{prj.name}</span>
                        <StatusBadge status={prj.status} size="sm" />
                      </div>
                      <ProgressBar progress={prj.progress} size="sm" />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-2">No active projects registered.</p>
                )}
              </div>
            </div>

            {/* Right Side: Relationship Manager & Timeline */}
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/50 space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Relationship Manager</h3>
                <div className="flex items-center gap-3">
                  <Avatar name={client.assignedManager || client.accountManager} size="md" status="online" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{client.assignedManager || client.accountManager}</h4>
                    <p className="text-[11px] text-slate-500">Dedicated Account Owner</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-5 bg-white space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Interactions</h3>
                <Timeline items={clientTimeline} />
              </div>
            </div>
          </div>
        )}

        {/* 2. PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-3 text-xs">
            {clientProjects.length > 0 ? (
              clientProjects.map((prj) => (
                <div
                  key={prj.id}
                  onClick={() => navigate(`/projects/${prj.id}`)}
                  className="rounded-lg border border-slate-200 p-4 hover:border-[#0066FF] cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-slate-900">{prj.name}</span>
                      <span className="text-slate-400 text-xs ml-2">Budget: ₹{(prj.budget / 100000).toFixed(2)}L</span>
                    </div>
                    <StatusBadge status={prj.status} />
                  </div>
                  <ProgressBar progress={prj.progress} />
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    <span>Deadline: {prj.endDate || '30 Oct 2026'}</span>
                    <span>Manager: {prj.manager}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No project records found for this client.</p>
            )}
          </div>
        )}

        {/* 3. ENQUIRIES TAB */}
        {activeTab === 'enquiries' && (
          <div className="space-y-3 text-xs">
            {clientEnquiries.length > 0 ? (
              clientEnquiries.map((e) => (
                <div key={e.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                  <div>
                    <span className="font-bold text-slate-900">{e.service}</span>
                    <p className="text-slate-400 text-[11px]">Source: {e.source} • Created: {e.createdAt}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">₹{((e.budget || e.estimatedBudget) / 100000).toFixed(2)}L</span>
                    <div className="mt-1"><StatusBadge status={e.status} size="sm" /></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No enquiry records found for this client.</p>
            )}
          </div>
        )}

        {/* 4. PROPOSALS TAB */}
        {activeTab === 'proposals' && (
          <div className="space-y-3 text-xs">
            {clientProposals.length > 0 ? (
              clientProposals.map((prop) => (
                <div key={prop.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                  <div>
                    <span className="font-bold text-slate-900">{prop.title}</span>
                    <p className="text-slate-400 text-[11px]">Sent: {prop.sentDate} • Author: {prop.author}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">₹{(prop.amount / 100000).toFixed(2)}L</span>
                    <div className="mt-1"><StatusBadge status={prop.status} size="sm" /></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No proposal records found for this client.</p>
            )}
          </div>
        )}

        {/* 5. INVOICES TAB */}
        {activeTab === 'invoices' && (
          <div className="space-y-3 text-xs">
            {clientInvoices.length > 0 ? (
              clientInvoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                  <div>
                    <span className="font-bold text-slate-900">{inv.id}</span>
                    <p className="text-slate-400 text-[11px]">Issue Date: {inv.issueDate} • Due: {inv.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">₹{(inv.amount / 100000).toFixed(2)}L</span>
                    <div className="mt-1"><StatusBadge status={inv.status} size="sm" /></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No invoice records found for this client.</p>
            )}
          </div>
        )}

        {/* 6. PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="space-y-3 text-xs">
            {clientPayments.length > 0 ? (
              clientPayments.map((pay) => (
                <div key={pay.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                  <div>
                    <span className="font-bold text-slate-900">Ref: {pay.transactionRef}</span>
                    <p className="text-slate-400 text-[11px]">Method: {pay.method} • Date: {pay.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700">₹{(pay.amount / 100000).toFixed(2)}L</span>
                    <div className="mt-1"><StatusBadge status={pay.status} size="sm" /></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No payment history logged for this client.</p>
            )}
          </div>
        )}

        {/* 7. DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="space-y-6 text-xs">
            <FileUploader onFilesSelected={(files) => alert(`${files.length} document(s) uploaded for ${client.companyName}`)} />
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900">Attached Client Contracts & Agreements</h4>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div className="flex items-center space-x-2">
                  <File className="h-4 w-4 text-[#0066FF]" />
                  <span className="font-semibold text-slate-800">Master_Services_Agreement_2025.pdf</span>
                </div>
                <button onClick={() => alert('Downloading file...')} className="text-[#0066FF] font-semibold hover:underline">Download</button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div className="flex items-center space-x-2">
                  <File className="h-4 w-4 text-[#0066FF]" />
                  <span className="font-semibold text-slate-800">Non_Disclosure_Agreement_Signed.pdf</span>
                </div>
                <button onClick={() => alert('Downloading file...')} className="text-[#0066FF] font-semibold hover:underline">Download</button>
              </div>
            </div>
          </div>
        )}

        {/* 8. ACTIVITY TAB */}
        {activeTab === 'activity' && (
          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-slate-900">Complete Account Interaction History</h4>
            <Timeline items={clientTimeline} />
          </div>
        )}
      </div>
    </div>
  );
};
