import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Receipt,
  Download,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  Code2,
  Cloud,
  Megaphone,
  Plane,
  Users,
  Briefcase,
  HelpCircle,
  X,
  Check,
  Trash2,
  Edit,
  ExternalLink,
  Layers,
  FileText,
  BarChart3,
  PieChart as PieIcon,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockProjects, mockEmployees } from '../../data/mockData';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const ExpensesListPage = () => {
  const { expenses, setExpenses } = useApp();

  // Filters state
  const [activeCategoryTab, setActiveCategoryTab] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer & Modals state
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRejectInputOpen, setIsRejectInputOpen] = useState(false);
  const [rejectReasonText, setRejectReasonText] = useState('');

  // Add Expense Form state
  const [addForm, setAddForm] = useState({
    category: 'Software',
    vendor: '',
    description: '',
    project: 'Internal Operations',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    submitter: 'Alex Morgan',
  });

  // Action Handlers
  const handleApprove = (id, e) => {
    if (e) e.stopPropagation();
    setExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Approved' } : item))
    );
    if (selectedExpense && selectedExpense.id === id) {
      setSelectedExpense((prev) => ({ ...prev, status: 'Approved' }));
    }
  };

  const handleRejectSubmit = (id) => {
    setExpenses((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Rejected',
              rejectionReason: rejectReasonText || 'Budget limit exceeded.',
            }
          : item
      )
    );
    if (selectedExpense && selectedExpense.id === id) {
      setSelectedExpense((prev) => ({
        ...prev,
        status: 'Rejected',
        rejectionReason: rejectReasonText || 'Budget limit exceeded.',
      }));
    }
    setIsRejectInputOpen(false);
    setRejectReasonText('');
  };

  const handleDelete = (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete expense record ${id}?`)) {
      setExpenses((prev) => prev.filter((item) => item.id !== id));
      if (selectedExpense && selectedExpense.id === id) {
        setIsDrawerOpen(false);
        setSelectedExpense(null);
      }
    }
  };

  const handleOpenDrawer = (item) => {
    setSelectedExpense(item);
    setIsDrawerOpen(true);
    setIsRejectInputOpen(false);
    setRejectReasonText('');
  };

  const handleAddExpenseSubmit = (e) => {
    e.preventDefault();
    const emp = mockEmployees.find((m) => m.name === addForm.submitter) || mockEmployees[0];

    const newExp = {
      id: `EXP-${Math.floor(510 + Math.random() * 90)}`,
      category: addForm.category,
      vendor: addForm.vendor || 'Vendor Service',
      description: addForm.description || 'Operational business expenditure.',
      project: addForm.project,
      amount: parseFloat(addForm.amount) || 0,
      date: addForm.date,
      status: 'Pending',
      submitter: emp.name,
      submitterAvatar: emp.avatar,
      receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    };

    setExpenses([newExp, ...expenses]);
    setIsAddModalOpen(false);
    setAddForm({
      category: 'Software',
      vendor: '',
      description: '',
      project: 'Internal Operations',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      submitter: 'Alex Morgan',
    });
  };

  // Category Icon & Styling Helper
  const getCategoryInfo = (cat) => {
    switch (cat) {
      case 'Office':
        return { icon: Building2, color: 'text-amber-600 bg-amber-50 border-amber-200' };
      case 'Software':
        return { icon: Code2, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
      case 'Hosting':
        return { icon: Cloud, color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'Marketing':
        return { icon: Megaphone, color: 'text-purple-600 bg-purple-50 border-purple-200' };
      case 'Travel':
        return { icon: Plane, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' };
      case 'Employee':
        return { icon: Users, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
      case 'Project':
        return { icon: Briefcase, color: 'text-rose-600 bg-rose-50 border-rose-200' };
      default:
        return { icon: HelpCircle, color: 'text-slate-600 bg-slate-100 border-slate-200' };
    }
  };

  // Metrics summary calculations
  const totalExpenses = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const thisMonthExpenses = useMemo(() => {
    return expenses
      .filter((e) => e.date.startsWith('2026-10'))
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const projectExpenses = useMemo(() => {
    return expenses
      .filter((e) => e.project !== 'Internal Operations' && e.project !== 'Engineering')
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const pendingApprovalCount = useMemo(() => {
    return expenses.filter((e) => e.status === 'Pending').length;
  }, [expenses]);

  // Category breakdown distribution calculation
  const categoryBreakdown = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    const categories = ['Office', 'Software', 'Hosting', 'Marketing', 'Travel', 'Employee', 'Project', 'Other'];
    return categories.map((cat) => {
      const amt = map[cat] || 0;
      const pct = totalExpenses > 0 ? Math.round((amt / totalExpenses) * 100) : 0;
      return { category: cat, amount: amt, percentage: pct };
    });
  }, [expenses, totalExpenses]);

  // Filtered expenses list
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      // Category tab
      if (activeCategoryTab !== 'All' && e.category !== activeCategoryTab) return false;

      // Status filter
      if (statusFilter !== 'All' && e.status !== statusFilter) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = e.id.toLowerCase().includes(q);
        const matchesVendor = e.vendor.toLowerCase().includes(q);
        const matchesDesc = e.description.toLowerCase().includes(q);
        const matchesSubmitter = e.submitter.toLowerCase().includes(q);
        if (!matchesId && !matchesVendor && !matchesDesc && !matchesSubmitter) return false;
      }

      return true;
    });
  }, [expenses, activeCategoryTab, statusFilter, searchQuery]);

  const columns = [
    {
      key: 'id',
      header: 'Expense ID',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900 font-mono text-xs hover:text-blue-600 cursor-pointer">
            {val}
          </span>
          <span className="text-[10px] text-slate-400 block">{row.date}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (val) => {
        const info = getCategoryInfo(val);
        const IconComponent = info.icon;
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium border ${info.color}`}>
            <IconComponent className="h-3.5 w-3.5" />
            {val}
          </span>
        );
      },
    },
    {
      key: 'vendor',
      header: 'Description & Vendor',
      render: (val, row) => (
        <div className="max-w-xs">
          <div className="font-semibold text-slate-900 leading-tight">{val}</div>
          <div className="text-[11px] text-slate-500 truncate" title={row.description}>
            {row.description}
          </div>
        </div>
      ),
    },
    {
      key: 'project',
      header: 'Project / Dept',
      render: (val) => (
        <span className="text-xs font-medium text-slate-700 truncate max-w-[160px] block" title={val}>
          {val}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (val) => (
        <span className="font-bold text-slate-900 text-sm tracking-tight">${val.toLocaleString()}</span>
      ),
    },
    {
      key: 'submitter',
      header: 'Submitted By',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.submitterAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={val}
            className="h-6 w-6 rounded-full object-cover border border-slate-200"
          />
          <span className="text-xs text-slate-700 font-medium truncate max-w-[120px]">{val}</span>
        </div>
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
          {row.status === 'Pending' && (
            <>
              <button
                onClick={(e) => handleApprove(row.id, e)}
                title="Approve Expense"
                className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={(e) => handleDelete(row.id, e)}
                title="Delete Record"
                className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Expenses"
        subtitle="Track company and project expenses."
        actions={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#0066FF] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Expense
          </button>
        }
      />

      {/* SUMMARY CARDS (4 Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Expenses */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Expenses
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              ${totalExpenses.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-500">{expenses.length} Records</span>
          </div>
        </div>

        {/* This Month */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              This Month
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              ${thisMonthExpenses.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Oct 2026
            </span>
          </div>
        </div>

        {/* Project Expenses */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-purple-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Project Expenses
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              ${projectExpenses.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
              Billable Client Ops
            </span>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Approval
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              {pendingApprovalCount}
            </span>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              Action Req.
            </span>
          </div>
        </div>
      </div>

      {/* MONTHLY CHART & CATEGORY BREAKDOWN VISUALS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Expense Trend Chart (2 Cols) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" /> Monthly Expense Trend
              </h3>
              <p className="text-xs text-slate-500">Expenditure trajectory May 2026 - Oct 2026</p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
              H2 2026
            </span>
          </div>

          {/* Simple Clean Bar Chart Representation */}
          <div className="pt-2 flex items-end justify-between gap-4 h-48 px-2 border-b border-slate-100">
            {[
              { month: 'May', amt: 42000, height: '65%' },
              { month: 'Jun', amt: 45000, height: '70%' },
              { month: 'Jul', amt: 48000, height: '76%' },
              { month: 'Aug', amt: 51000, height: '82%' },
              { month: 'Sep', amt: 53000, height: '88%' },
              { month: 'Oct', amt: 54200, height: '94%', active: true },
            ].map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  ${(item.amt / 1000).toFixed(1)}k
                </span>
                <div
                  style={{ height: item.height }}
                  className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 ${
                    item.active ? 'bg-[#0066FF] shadow-md' : 'bg-slate-200 group-hover:bg-blue-300'
                  }`}
                />
                <span className={`text-xs font-semibold ${item.active ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown (1 Col) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-blue-600" /> Category Breakdown
            </h3>
            <span className="text-xs font-semibold text-slate-500">Distribution</span>
          </div>

          <div className="space-y-3">
            {categoryBreakdown.map((item) => {
              const info = getCategoryInfo(item.category);
              const IconComp = info.icon;
              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <IconComp className="h-3.5 w-3.5 text-slate-500" /> {item.category}
                    </span>
                    <span className="font-bold text-slate-900">
                      ${item.amount.toLocaleString()} <span className="text-slate-400 font-normal text-[10px]">({item.percentage}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${item.percentage}%` }}
                      className={`h-full rounded-full ${
                        item.category === 'Hosting'
                          ? 'bg-blue-600'
                          : item.category === 'Marketing'
                          ? 'bg-purple-600'
                          : item.category === 'Office'
                          ? 'bg-amber-600'
                          : item.category === 'Software'
                          ? 'bg-indigo-600'
                          : 'bg-emerald-600'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CATEGORY TABS & SEARCH BAR */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['All', 'Office', 'Software', 'Hosting', 'Marketing', 'Travel', 'Employee', 'Project', 'Other'].map(
            (cat) => {
              const isActive = activeCategoryTab === cat;
              let count = 0;
              if (cat === 'All') count = expenses.length;
              else count = expenses.filter((e) => e.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryTab(cat)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0066FF] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            }
          )}
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search vendor, description, submitter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <DataTable
        columns={columns}
        data={filteredExpenses}
        onRowClick={(row) => handleOpenDrawer(row)}
      />

      {/* EXPENSE DETAIL DRAWER */}
      {isDrawerOpen && selectedExpense && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
          <div
            className="w-full max-w-xl bg-white shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-200 border-l border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-slate-400">{selectedExpense.id}</span>
                  <StatusBadge status={selectedExpense.status} size="xs" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">{selectedExpense.vendor}</h2>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Receipt Preview */}
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-900 relative group">
                <img
                  src={selectedExpense.receiptUrl}
                  alt="Expense Receipt Preview"
                  className="w-full h-44 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent flex items-end p-4 justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-blue-400" /> Vendor Receipt Attached
                  </span>
                  <a
                    href={selectedExpense.receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 rounded bg-white/20 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/30 backdrop-blur-xs"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Fullscreen
                  </a>
                </div>
              </div>

              {/* Amount Highlight Box */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-900 block">
                    Expense Claim Amount
                  </span>
                  <span className="text-[11px] text-blue-700">Submitted on {selectedExpense.date}</span>
                </div>
                <span className="text-2xl font-extrabold text-[#0066FF]">
                  ${selectedExpense.amount.toLocaleString()}
                </span>
              </div>

              {/* Expense Details Grid */}
              <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                  Expense Parameters
                </h4>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Category</span>
                    <span className="font-semibold text-slate-900 mt-0.5 block">{selectedExpense.category}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] block">Allocated Project</span>
                    <span className="font-semibold text-slate-900 mt-0.5 block">{selectedExpense.project}</span>
                  </div>

                  <div className="col-span-2 pt-2 border-t border-slate-100">
                    <span className="text-slate-400 text-[11px] block">Description & Justification</span>
                    <p className="mt-1 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                      "{selectedExpense.description}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Submitter Profile Header */}
              <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                  Submitted By
                </h4>

                <div className="flex items-center gap-3">
                  <img
                    src={selectedExpense.submitterAvatar}
                    alt={selectedExpense.submitter}
                    className="h-10 w-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{selectedExpense.submitter}</div>
                    <div className="text-[11px] text-slate-500">Employee Claim Submitter</div>
                  </div>
                </div>
              </div>

              {/* Rejection Note (If Rejected) */}
              {selectedExpense.rejectionReason && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 space-y-1 text-xs text-rose-900">
                  <span className="font-bold flex items-center gap-1.5 text-rose-700">
                    <XCircle className="h-4 w-4" /> Rejection Justification:
                  </span>
                  <p className="text-xs italic bg-white p-2.5 rounded-lg border border-rose-200 mt-1">
                    "{selectedExpense.rejectionReason}"
                  </p>
                </div>
              )}

              {/* Reject Form toggle */}
              {isRejectInputOpen && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 space-y-3">
                  <label className="text-xs font-semibold text-rose-900 block">
                    State reason for rejection:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Specify rejection grounds..."
                    value={rejectReasonText}
                    onChange={(e) => setRejectReasonText(e.target.value)}
                    className="w-full rounded-lg border border-rose-200 p-2.5 text-xs text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsRejectInputOpen(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRejectSubmit(selectedExpense.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-slate-200 p-4 bg-slate-50 flex items-center justify-between gap-2">
              <button
                onClick={(e) => handleDelete(selectedExpense.id, e)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>

              <div className="flex items-center gap-2">
                {selectedExpense.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => setIsRejectInputOpen(!isRejectInputOpen)}
                      className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition-colors"
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                    <button
                      onClick={() => handleApprove(selectedExpense.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD EXPENSE MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Expense Claim"
        subtitle="Log a new company or project expenditure."
      >
        <form onSubmit={handleAddExpenseSubmit} className="space-y-4 pt-2 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expense Category
              </label>
              <select
                value={addForm.category}
                onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              >
                <option value="Office">Office</option>
                <option value="Software">Software</option>
                <option value="Hosting">Hosting</option>
                <option value="Marketing">Marketing</option>
                <option value="Travel">Travel</option>
                <option value="Employee">Employee</option>
                <option value="Project">Project</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vendor / Service Name
              </label>
              <input
                type="text"
                placeholder="e.g. AWS, GitHub, Apple Store..."
                value={addForm.vendor}
                onChange={(e) => setAddForm({ ...addForm, vendor: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expense Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 1450"
                value={addForm.amount}
                onChange={(e) => setAddForm({ ...addForm, amount: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expense Date
              </label>
              <input
                type="date"
                value={addForm.date}
                onChange={(e) => setAddForm({ ...addForm, date: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Allocated Project / Dept
              </label>
              <select
                value={addForm.project}
                onChange={(e) => setAddForm({ ...addForm, project: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              >
                <option value="Internal Operations">Internal Operations</option>
                <option value="Engineering">Engineering</option>
                {mockProjects.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Submitted By
              </label>
              <select
                value={addForm.submitter}
                onChange={(e) => setAddForm({ ...addForm, submitter: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              >
                {mockEmployees.map((emp) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name} ({emp.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Justification
            </label>
            <textarea
              rows={3}
              placeholder="Provide reason for expense claim..."
              value={addForm.description}
              onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0066FF] hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="h-4 w-4" /> Submit Expense Claim
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
