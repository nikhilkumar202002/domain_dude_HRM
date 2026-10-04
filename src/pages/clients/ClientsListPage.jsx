import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Download,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Building2,
  Users,
  UserCheck,
  CreditCard,
  DollarSign,
  Mail,
  Phone,
  Clock,
  Upload,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Avatar } from '../../components/common/Avatar';
import { Modal } from '../../components/common/Modal';

export const ClientsListPage = () => {
  const { clients, addClient, openQuickCreate } = useApp();
  const navigate = useNavigate();

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [managerFilter, setManagerFilter] = useState('All');
  const [createdFilter, setCreatedFilter] = useState('');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClientForm, setNewClientForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    industry: 'Technology',
    location: 'Bangalore, India',
    assignedManager: 'Nikhil',
  });

  // Filter dataset
  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      (c.companyName || '').toLowerCase().includes(q) ||
      (c.contactName || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'All' || (c.status || '').toLowerCase() === statusFilter.toLowerCase();
    const matchesIndustry = industryFilter === 'All' || (c.industry || '').toLowerCase().includes(industryFilter.toLowerCase());
    const matchesManager = managerFilter === 'All' || (c.assignedManager || c.accountManager || '').toLowerCase() === managerFilter.toLowerCase();
    const matchesCreated = !createdFilter || c.joinedDate === createdFilter;

    return matchesSearch && matchesStatus && matchesIndustry && matchesManager && matchesCreated;
  });

  // Summary Metrics
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => (c.status || '').toLowerCase() === 'active').length;
  const newThisMonth = 1;
  const totalOutstandingSum = clients.reduce((acc, c) => acc + (c.outstanding || 0), 0);

  // Form Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    addClient({
      companyName: newClientForm.companyName || 'Acme Global',
      contactName: newClientForm.contactName || 'John Doe',
      email: newClientForm.email || 'john@acme.com',
      phone: newClientForm.phone || '+91 98765 00000',
      industry: newClientForm.industry,
      location: newClientForm.location,
      accountManager: newClientForm.assignedManager,
      assignedManager: newClientForm.assignedManager,
      status: 'Active',
      revenue: 0,
      outstanding: 0,
      activeProjectsCount: 0,
      lastActivity: 'Just now',
    });
    setIsAddModalOpen(false);
    setNewClientForm({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      industry: 'Technology',
      location: 'Bangalore, India',
      assignedManager: 'Nikhil',
    });
  };

  // Table Columns
  const columns = [
    {
      key: 'companyName',
      header: 'Client / Company',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={val} src={row.avatar} size="md" />
          <div>
            <div className="font-bold text-slate-900">{val}</div>
            <div className="text-[11px] text-slate-400">ID: {row.id} • {row.location}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'contactName',
      header: 'Contact',
      render: (val, row) => (
        <div>
          <div className="font-bold text-slate-900">{val}</div>
          <div className="text-[11px] text-slate-400">{row.email}</div>
          <div className="text-[10px] text-slate-400 font-mono">{row.phone}</div>
        </div>
      ),
    },
    {
      key: 'industry',
      header: 'Industry',
      render: (val) => (
        <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
          {val}
        </span>
      ),
    },
    {
      key: 'activeProjectsCount',
      header: 'Active Projects',
      align: 'center',
      render: (val) => (
        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#0066FF]">
          {val}
        </span>
      ),
    },
    {
      key: 'revenue',
      header: 'Revenue',
      align: 'right',
      render: (val) => <span className="font-bold text-slate-900">₹{(val / 100000).toFixed(2)}L</span>,
    },
    {
      key: 'outstanding',
      header: 'Outstanding',
      align: 'right',
      render: (val) => (
        <span className={`font-bold ${val > 0 ? 'text-amber-800' : 'text-slate-400'}`}>
          ₹{(val / 100000).toFixed(2)}L
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'lastActivity',
      header: 'Last Activity',
      render: (val) => <span className="text-slate-500 text-[11px] font-medium">{val || 'Recent'}</span>,
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
            navigate(`/clients/${row.id}`);
          }}
          className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0066FF] transition-colors"
        >
          <Eye className="h-3.5 w-3.5 text-slate-400" /> View
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <PageHeader
        title="Clients"
        subtitle="Manage your clients, relationships and business history."
        actions={
          <>
            <button
              onClick={() => alert('Import Client Contacts CSV triggered')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
            >
              <Upload className="h-3.5 w-3.5 text-slate-500" /> Import
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0052D4] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> + Add Client
            </button>
          </>
        }
      />

      {/* SUMMARY CARDS (4 Cards Grid) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-card">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Clients</span>
          <p className="mt-2 text-2xl font-bold text-slate-900">{totalClients}</p>
        </div>
        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-5 shadow-card">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Active Clients</span>
          <p className="mt-2 text-2xl font-bold text-emerald-700">{activeClients}</p>
        </div>
        <div className="rounded-xl border border-blue-200/80 bg-blue-50/40 p-5 shadow-card">
          <span className="text-xs font-semibold text-[#0066FF] uppercase tracking-wider">New This Month</span>
          <p className="mt-2 text-2xl font-bold text-[#0066FF]">{newThisMonth}</p>
        </div>
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-5 shadow-card">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Outstanding Balance</span>
          <p className="mt-2 text-2xl font-bold text-amber-800">₹{(totalOutstandingSum / 100000).toFixed(2)}L</p>
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
              placeholder="Search by client name, company, email or phone..."
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* Industry Filter */}
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white py-2 px-3 font-semibold text-slate-700 focus:border-[#0066FF] focus:outline-none"
            >
              <option value="All">Industry: All</option>
              <option value="Hardware">DeepTech & Hardware</option>
              <option value="Logistics">Logistics & Supply Chain</option>
              <option value="Healthcare">Healthcare Tech</option>
              <option value="Fintech">Fintech & Insurance</option>
            </select>

            {/* Manager Filter */}
            <select
              value={managerFilter}
              onChange={(e) => setManagerFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white py-2 px-3 font-semibold text-slate-700 focus:border-[#0066FF] focus:outline-none"
            >
              <option value="All">Manager: All</option>
              <option value="Nikhil">Nikhil</option>
              <option value="Rahul">Rahul</option>
              <option value="Elena">Elena</option>
            </select>

            {/* Created Date */}
            <input
              type="date"
              value={createdFilter}
              onChange={(e) => setCreatedFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-700 focus:border-[#0066FF] focus:outline-none"
            />

            {(search || statusFilter !== 'All' || industryFilter !== 'All' || managerFilter !== 'All' || createdFilter) && (
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('All');
                  setIndustryFilter('All');
                  setManagerFilter('All');
                  setCreatedFilter('');
                }}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              >
                <RefreshCw className="h-3 w-3" /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CLIENT TABLE */}
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(row) => navigate(`/clients/${row.id}`)}
        emptyTitle="No clients found"
        emptyDescription="Add a new client to start tracking active contracts and financial history."
      />

      {/* ADD CLIENT MODAL */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Client"
          subtitle="Create a new client profile in your CRM system."
        >
          <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Global Inc."
                  value={newClientForm.companyName}
                  onChange={(e) => setNewClientForm({ ...newClientForm, companyName: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#0066FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Contact Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Smith"
                  value={newClientForm.contactName}
                  onChange={(e) => setNewClientForm({ ...newClientForm, contactName: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#0066FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="john@acmeglobal.com"
                  value={newClientForm.email}
                  onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#0066FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={newClientForm.phone}
                  onChange={(e) => setNewClientForm({ ...newClientForm, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#0066FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Industry</label>
                <input
                  type="text"
                  placeholder="e.g. Technology"
                  value={newClientForm.industry}
                  onChange={(e) => setNewClientForm({ ...newClientForm, industry: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#0066FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Account Manager</label>
                <select
                  value={newClientForm.assignedManager}
                  onChange={(e) => setNewClientForm({ ...newClientForm, assignedManager: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-[#0066FF] focus:outline-none"
                >
                  <option value="Nikhil">Nikhil</option>
                  <option value="Rahul">Rahul</option>
                  <option value="Elena">Elena</option>
                  <option value="Anoop">Anoop</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0052D4]"
              >
                <Plus className="h-4 w-4" /> Save Client
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
