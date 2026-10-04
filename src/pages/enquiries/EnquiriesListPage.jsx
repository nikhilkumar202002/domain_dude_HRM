import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Download,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  Building2,
  User,
  Calendar,
  DollarSign,
  Send,
  UserPlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Briefcase,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Avatar } from '../../components/common/Avatar';
import { Drawer, Modal } from '../../components/common/Modal';
import { Timeline } from '../../components/common/Timeline';

export const EnquiriesListPage = () => {
  const { enquiries, addEnquiry, openQuickCreate } = useApp();
  const navigate = useNavigate();

  // Search & Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [assignedFilter, setAssignedFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  // Drawer & Modal state
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New Enquiry Form State
  const [newForm, setNewForm] = useState({
    client: '',
    company: '',
    phone: '',
    email: '',
    source: 'Website',
    service: '',
    budget: '',
    priority: 'Medium',
    assignedTo: 'Nikhil',
    description: '',
  });

  // Filtered dataset
  const filtered = enquiries.filter((e) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      (e.client || e.contactPerson || '').toLowerCase().includes(q) ||
      (e.company || e.clientName || '').toLowerCase().includes(q) ||
      (e.id || '').toLowerCase().includes(q) ||
      (e.phone || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'All' || (e.status || '').toLowerCase() === statusFilter.toLowerCase();
    const matchesSource = sourceFilter === 'All' || (e.source || '').toLowerCase() === sourceFilter.toLowerCase();
    const matchesAssigned = assignedFilter === 'All' || (e.assignedTo || '').toLowerCase() === assignedFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'All' || (e.priority || '').toLowerCase() === priorityFilter.toLowerCase();
    const matchesDate = !dateFilter || e.createdAt === dateFilter;

    return matchesSearch && matchesStatus && matchesSource && matchesAssigned && matchesPriority && matchesDate;
  });

  // Calculate Summary Cards metrics
  const totalCount = enquiries.length;
  const newCount = enquiries.filter((e) => (e.status || '').toLowerCase() === 'new').length;
  const proposalSentCount = enquiries.filter((e) => (e.status || '').toLowerCase() === 'proposal sent').length;
  const followUpDueCount = enquiries.filter((e) => ['follow-up', 'discussion', 'negotiation'].includes((e.status || '').toLowerCase())).length;
  const wonCount = enquiries.filter((e) => (e.status || '').toLowerCase() === 'won').length;
  const lostCount = enquiries.filter((e) => (e.status || '').toLowerCase() === 'lost').length;

  // Open Drawer Handler
  const handleOpenDrawer = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsDrawerOpen(true);
  };

  // Create New Enquiry submit
  const handleCreateNewEnquiry = (evt) => {
    evt.preventDefault();
    addEnquiry({
      client: newForm.client || 'Prospective Lead',
      company: newForm.company || 'Enterprise Business',
      clientName: newForm.company || 'Enterprise Business',
      contactPerson: newForm.client || 'Prospective Lead',
      phone: newForm.phone || '+91 98000 00000',
      email: newForm.email || 'lead@business.com',
      source: newForm.source,
      service: newForm.service || 'Web Software System',
      budget: Number(newForm.budget) || 500000,
      estimatedBudget: Number(newForm.budget) || 500000,
      priority: newForm.priority,
      assignedTo: newForm.assignedTo,
      description: newForm.description || 'New incoming sales enquiry.',
    });
    setIsNewModalOpen(false);
    setNewForm({
      client: '',
      company: '',
      phone: '',
      email: '',
      source: 'Website',
      service: '',
      budget: '',
      priority: 'Medium',
      assignedTo: 'Nikhil',
      description: '',
    });
  };

  // Source Badge Styling
  const getSourceBadge = (source) => {
    const s = (source || '').toLowerCase();
    if (s.includes('whatsapp')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s.includes('instagram')) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (s.includes('facebook')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (s.includes('referral')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (s.includes('website')) return 'bg-sky-50 text-[#0066FF] border-sky-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  // Table Columns Definition
  const columns = [
    {
      key: 'id',
      header: 'Enquiry ID',
      render: (val) => <span className="font-bold text-slate-900">{val}</span>,
    },
    {
      key: 'client',
      header: 'Client',
      render: (val, row) => (
        <div>
          <div className="font-bold text-slate-900">{val || row.contactPerson}</div>
          <div className="text-[11px] text-slate-400">{row.email}</div>
        </div>
      ),
    },
    {
      key: 'company',
      header: 'Company',
      render: (val, row) => (
        <span className="font-semibold text-slate-800">{val || row.clientName}</span>
      ),
    },
    {
      key: 'service',
      header: 'Service',
      render: (val) => <span className="text-slate-700">{val}</span>,
    },
    {
      key: 'source',
      header: 'Source',
      render: (val) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getSourceBadge(val)}`}>
          {val || 'Direct'}
        </span>
      ),
    },
    {
      key: 'assignedTo',
      header: 'Assigned To',
      render: (val) => (
        <div className="flex items-center gap-1.5">
          <Avatar name={val} size="xs" />
          <span className="font-medium text-slate-700">{val || 'Unassigned'}</span>
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
      key: 'nextFollowUp',
      header: 'Follow-up',
      render: (val) => (
        <span className="text-slate-600 font-mono text-[11px]">{val || 'Not Scheduled'}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (val) => <span className="text-slate-500 text-[11px]">{val}</span>,
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
            handleOpenDrawer(row);
          }}
          className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0066FF] transition-colors"
        >
          <Eye className="h-3.5 w-3.5 text-slate-400" /> View Drawer
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <PageHeader
        title="Enquiries"
        subtitle="Track incoming opportunities and manage follow-ups."
        actions={
          <>
            <button
              onClick={() => alert(`Exporting ${filtered.length} enquiry records to CSV...`)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" /> Export
            </button>
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0052D4] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> + New Enquiry
            </button>
          </>
        }
      />

      {/* SUMMARY CARDS (6 Metric Cards Grid) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-card">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Enquiries</span>
          <p className="mt-2 text-2xl font-bold text-slate-900">{totalCount}</p>
        </div>
        <div className="rounded-xl border border-blue-200/60 bg-blue-50/40 p-4 shadow-card">
          <span className="text-[11px] font-semibold text-[#0066FF] uppercase tracking-wider">New</span>
          <p className="mt-2 text-2xl font-bold text-[#0066FF]">{newCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-card">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Proposal Sent</span>
          <p className="mt-2 text-2xl font-bold text-slate-900">{proposalSentCount}</p>
        </div>
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 shadow-card">
          <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">Follow-up Due</span>
          <p className="mt-2 text-2xl font-bold text-amber-800">{followUpDueCount}</p>
        </div>
        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4 shadow-card">
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Won</span>
          <p className="mt-2 text-2xl font-bold text-emerald-700">{wonCount}</p>
        </div>
        <div className="rounded-xl border border-rose-200/80 bg-rose-50/40 p-4 shadow-card">
          <span className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider">Lost</span>
          <p className="mt-2 text-2xl font-bold text-rose-700">{lostCount}</p>
        </div>
      </div>

      {/* SEARCH + FILTER BAR */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Client, Company, Enquiry ID, Phone..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#0066FF] focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
            />
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white py-2 px-3 font-semibold text-slate-700 focus:border-[#0066FF] focus:outline-none"
            >
              <option value="All">Status: All</option>
              {['New', 'Contacted', 'Discussion', 'Proposal Pending', 'Proposal Sent', 'Follow-up', 'Negotiation', 'Won', 'Lost', 'On Hold'].map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            {/* Source Filter */}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white py-2 px-3 font-semibold text-slate-700 focus:border-[#0066FF] focus:outline-none"
            >
              <option value="All">Source: All</option>
              {['Website', 'Instagram', 'WhatsApp', 'Referral', 'Facebook', 'Direct', 'Call'].map((src) => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>

            {/* Assigned To Filter */}
            <select
              value={assignedFilter}
              onChange={(e) => setAssignedFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white py-2 px-3 font-semibold text-slate-700 focus:border-[#0066FF] focus:outline-none"
            >
              <option value="All">Assigned: All</option>
              {['Nikhil', 'Rahul', 'Anoop', 'Arjun', 'Elena'].map((emp) => (
                <option key={emp} value={emp}>{emp}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white py-2 px-3 font-semibold text-slate-700 focus:border-[#0066FF] focus:outline-none"
            >
              <option value="All">Priority: All</option>
              {['Low', 'Medium', 'High', 'Urgent'].map((pr) => (
                <option key={pr} value={pr}>{pr}</option>
              ))}
            </select>

            {/* Date Filter */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-700 focus:border-[#0066FF] focus:outline-none"
            />

            {(search || statusFilter !== 'All' || sourceFilter !== 'All' || assignedFilter !== 'All' || priorityFilter !== 'All' || dateFilter) && (
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('All');
                  setSourceFilter('All');
                  setAssignedFilter('All');
                  setPriorityFilter('All');
                  setDateFilter('');
                }}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              >
                <RefreshCw className="h-3 w-3" /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ENQUIRIES TABLE */}
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(row) => handleOpenDrawer(row)}
        emptyTitle="No business enquiries found"
        emptyDescription="Try clearing your filters or click '+ New Enquiry' to add one."
      />

      {/* RIGHT-SIDE DETAIL DRAWER */}
      {selectedEnquiry && (
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={`Enquiry Detail - ${selectedEnquiry.id}`}
        >
          <div className="space-y-6 text-xs">
            {/* Header Title & Status Badge */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedEnquiry.company || selectedEnquiry.clientName}</h3>
                <p className="text-slate-500">Service: <strong className="text-slate-800">{selectedEnquiry.service}</strong></p>
              </div>
              <StatusBadge status={selectedEnquiry.status} size="lg" />
            </div>

            {/* Client & Deal Information Grid */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-500 border-b border-slate-200/60 pb-1">
                Client & Contact Info
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400">Client Contact</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedEnquiry.client || selectedEnquiry.contactPerson}</p>
                </div>
                <div>
                  <span className="text-slate-400">Company</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedEnquiry.company || selectedEnquiry.clientName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Phone</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedEnquiry.phone}</p>
                </div>
                <div>
                  <span className="text-slate-400">Email</span>
                  <p className="font-semibold text-[#0066FF] mt-0.5 truncate">{selectedEnquiry.email}</p>
                </div>
                <div>
                  <span className="text-slate-400">Lead Source</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedEnquiry.source}</p>
                </div>
                <div>
                  <span className="text-slate-400">Estimated Budget</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    ₹{((selectedEnquiry.budget || selectedEnquiry.estimatedBudget) / 100000).toFixed(2)} Lakhs
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Priority</span>
                  <div className="mt-0.5"><StatusBadge status={selectedEnquiry.priority} size="sm" /></div>
                </div>
                <div>
                  <span className="text-slate-400">Assigned Employee</span>
                  <p className="font-bold text-[#0066FF] mt-0.5">{selectedEnquiry.assignedTo}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-slate-400 text-[10px]">Description & Scope</span>
                <p className="mt-1 text-slate-700 leading-relaxed font-normal bg-white p-2.5 rounded border border-slate-200/60">
                  {selectedEnquiry.description || selectedEnquiry.notes || 'No notes added.'}
                </p>
              </div>
            </div>

            {/* ACTIVITY TIMELINE */}
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-500 mb-3">
                Sales Journey Timeline
              </h4>
              <Timeline
                items={[
                  { title: 'Enquiry Created', timestamp: selectedEnquiry.createdAt, description: `Inbound enquiry from ${selectedEnquiry.source}.`, status: 'completed' },
                  { title: 'Client Contacted', timestamp: '2026-10-02', description: 'Phone discovery call completed.', status: 'completed', user: selectedEnquiry.assignedTo },
                  { title: 'Requirement Discussed', timestamp: '2026-10-03', description: 'Technical scope alignment meeting.', status: 'completed', user: selectedEnquiry.assignedTo },
                  { title: 'Proposal Created & Sent', timestamp: selectedEnquiry.lastFollowUp || '2026-10-03', description: 'Milestone quotation delivered.', status: 'completed' },
                  { title: 'Follow-up & Negotiation', timestamp: selectedEnquiry.nextFollowUp || '2026-10-05', description: 'Scheduled follow-up review.', status: 'pending' },
                ]}
              />
            </div>

            {/* FOLLOW-UP SECTION */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-3">
              <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-700" /> Follow-Up Tracker
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-amber-700/80">Last Follow-up:</span>
                  <p className="font-semibold text-slate-900">{selectedEnquiry.lastFollowUp || 'Pending'}</p>
                </div>
                <div>
                  <span className="text-amber-700/80">Next Follow-up Date:</span>
                  <p className="font-bold text-amber-900">{selectedEnquiry.nextFollowUp || 'Not Scheduled'}</p>
                </div>
              </div>
              <div>
                <span className="text-amber-700/80 text-[11px]">Follow-up Method:</span>
                <span className="ml-2 font-semibold text-slate-900 bg-white px-2 py-0.5 rounded border border-amber-200">
                  Phone Call / WhatsApp
                </span>
              </div>
            </div>

            {/* DRAWER ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-4">
              <button
                onClick={() => alert(`Schedule Follow-up for Enquiry ${selectedEnquiry.id}`)}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Calendar className="h-3.5 w-3.5 text-slate-500" /> Schedule Follow-up
              </button>
              <button
                onClick={() => {
                  alert(`Proposal generated for ${selectedEnquiry.company}`);
                  setIsDrawerOpen(false);
                  navigate('/proposals');
                }}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-[#0066FF] p-2 text-xs font-semibold text-white hover:bg-[#0052D4]"
              >
                <Send className="h-3.5 w-3.5" /> Send Proposal
              </button>
              <button
                onClick={() => alert(`Change status for ${selectedEnquiry.id}`)}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Change Status
              </button>
              <button
                onClick={() => alert(`Assign employee modal for ${selectedEnquiry.id}`)}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <UserPlus className="h-3.5 w-3.5 text-[#0066FF]" /> Assign Employee
              </button>
            </div>
          </div>
        </Drawer>
      )}

      {/* NEW ENQUIRY MODAL */}
      {isNewModalOpen && (
        <Modal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          title="Create New Enquiry"
          subtitle="Add an incoming sales lead to track follow-ups and proposals."
        >
          <form onSubmit={handleCreateNewEnquiry} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Client Person Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Vance"
                  value={newForm.client}
                  onChange={(e) => setNewForm({ ...newForm, client: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#0066FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FinTech Nexus Corp"
                  value={newForm.company}
                  onChange={(e) => setNewForm({ ...newForm, company: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#0066FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={newForm.phone}
                  onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#0066FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="d.vance@fintechnexus.io"
                  value={newForm.email}
                  onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#0066FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lead Source</label>
                <select
                  value={newForm.source}
                  onChange={(e) => setNewForm({ ...newForm, source: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#0066FF] focus:outline-none"
                >
                  {['Website', 'Instagram', 'WhatsApp', 'Referral', 'Facebook', 'Direct', 'Call'].map((src) => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Required</label>
                <input
                  type="text"
                  placeholder="e.g. Mobile Banking App"
                  value={newForm.service}
                  onChange={(e) => setNewForm({ ...newForm, service: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#0066FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Budget (₹)</label>
                <input
                  type="number"
                  placeholder="850000"
                  value={newForm.budget}
                  onChange={(e) => setNewForm({ ...newForm, budget: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#0066FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  value={newForm.priority}
                  onChange={(e) => setNewForm({ ...newForm, priority: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#0066FF] focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned To</label>
                <select
                  value={newForm.assignedTo}
                  onChange={(e) => setNewForm({ ...newForm, assignedTo: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#0066FF] focus:outline-none"
                >
                  {['Nikhil', 'Rahul', 'Anoop', 'Arjun', 'Elena'].map((emp) => (
                    <option key={emp} value={emp}>{emp}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description / Notes</label>
              <textarea
                rows={3}
                placeholder="Enter initial client scope requirements and deal notes..."
                value={newForm.description}
                onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#0066FF] focus:outline-none"
              />
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0052D4]"
              >
                <Plus className="h-4 w-4" /> Save Enquiry
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
