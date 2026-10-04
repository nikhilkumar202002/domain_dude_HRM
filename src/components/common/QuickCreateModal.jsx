import React, { useState } from 'react';
import { X, Briefcase, Users, FileText, FolderKanban, CheckSquare, UserPlus, Receipt, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import clsx from 'clsx';

export const QuickCreateModal = () => {
  const {
    isQuickCreateOpen,
    quickCreateInitialType,
    closeQuickCreate,
    addEnquiry,
    addClient,
    addProposal,
    addProject,
    addTask,
    addEmployee,
    addInvoice,
  } = useApp();

  const [activeTab, setActiveTab] = useState(quickCreateInitialType || 'enquiry');

  // Form states
  const [formData, setFormData] = useState({
    // Generic fields
    clientName: '',
    companyName: '',
    contactName: '',
    contactPerson: '',
    email: '',
    phone: '',
    service: '',
    estimatedBudget: '',
    title: '',
    amount: '',
    name: '',
    budget: '',
    role: '',
    department: 'Engineering',
    priority: 'Medium',
    notes: '',
  });

  if (!isQuickCreateOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'enquiry') {
      addEnquiry({
        clientName: formData.clientName || 'Acme Digital',
        contactPerson: formData.contactPerson || 'John Doe',
        email: formData.email || 'john@acme.com',
        phone: formData.phone || '+1 555 0192',
        service: formData.service || 'Web Application Development',
        estimatedBudget: Number(formData.estimatedBudget) || 45000,
        priority: formData.priority,
        notes: formData.notes,
      });
    } else if (activeTab === 'client') {
      addClient({
        companyName: formData.companyName || 'Acme Global',
        contactName: formData.contactName || 'Jane Smith',
        email: formData.email || 'jane@acmeglobal.com',
        phone: formData.phone || '+1 555 9821',
        industry: formData.service || 'Technology',
        location: 'San Francisco, CA',
      });
    } else if (activeTab === 'proposal') {
      addProposal({
        title: formData.title || 'Enterprise Portal Development',
        clientName: formData.clientName || 'Quantum Dynamics',
        amount: Number(formData.amount) || 75000,
        validUntil: '2026-11-30',
        itemsCount: 3,
      });
    } else if (activeTab === 'project') {
      addProject({
        name: formData.name || 'Cloud Architecture Upgrade',
        client: formData.clientName || 'Quantum Dynamics',
        budget: Number(formData.budget) || 90000,
        priority: formData.priority,
      });
    } else if (activeTab === 'task') {
      addTask({
        title: formData.title || 'Implement API Authentication Middleware',
        project: formData.name || 'Quantum Portal v2 Redesign',
        priority: formData.priority,
        dueDate: '2026-10-15',
        estimatedHours: 8,
      });
    } else if (activeTab === 'employee') {
      addEmployee({
        name: formData.name || 'Robert Paulson',
        role: formData.role || 'Full Stack Engineer',
        email: formData.email || 'robert.p@domaindude.com',
        department: formData.department,
        salary: 120000,
      });
    } else if (activeTab === 'invoice') {
      addInvoice({
        clientName: formData.clientName || 'AeroCloud Logistics',
        amount: Number(formData.amount) || 28000,
        dueDate: '2026-11-15',
      });
    }

    // Reset and close
    closeQuickCreate();
  };

  const tabs = [
    { id: 'enquiry', label: 'New Enquiry', icon: Briefcase },
    { id: 'client', label: 'New Client', icon: Users },
    { id: 'proposal', label: 'New Proposal', icon: FileText },
    { id: 'project', label: 'New Project', icon: FolderKanban },
    { id: 'task', label: 'New Task', icon: CheckSquare },
    { id: 'invoice', label: 'New Invoice', icon: Receipt },
    { id: 'employee', label: 'Add Employee', icon: UserPlus },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-popover overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Quick Create</h2>
            <p className="text-xs text-slate-500">Create a new item in Domain Dude Business OS</p>
          </div>
          <button onClick={closeQuickCreate} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50/70 px-4 py-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                  isActive
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* ENQUIRY FORM */}
          {activeTab === 'enquiry' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700">Client / Company Name *</label>
                <input
                  type="text"
                  name="clientName"
                  required
                  placeholder="e.g. Apex Global Tech"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Contact Person *</label>
                <input
                  type="text"
                  name="contactPerson"
                  required
                  placeholder="e.g. Sarah Miller"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="s.miller@apex.com"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Service Required</label>
                <input
                  type="text"
                  name="service"
                  placeholder="e.g. React Web Application"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Estimated Budget ($)</label>
                <input
                  type="number"
                  name="estimatedBudget"
                  placeholder="50000"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Priority Level</label>
                <select
                  name="priority"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
          )}

          {/* CLIENT FORM */}
          {activeTab === 'client' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  required
                  placeholder="e.g. Nexus FinTech Inc."
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Primary Contact Person</label>
                <input
                  type="text"
                  name="contactName"
                  placeholder="e.g. Jonathan Vance"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="j.vance@nexus.io"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Industry / Domain</label>
                <input
                  type="text"
                  name="service"
                  placeholder="e.g. Financial Technology"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* PROPOSAL FORM */}
          {activeTab === 'proposal' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700">Proposal Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Enterprise Cloud ERP & UI System"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Client Name *</label>
                <input
                  type="text"
                  name="clientName"
                  required
                  placeholder="e.g. AeroCloud Logistics"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Total Amount ($) *</label>
                <input
                  type="number"
                  name="amount"
                  required
                  placeholder="85000"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* PROJECT FORM */}
          {activeTab === 'project' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700">Project Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. AI Medical Analytics Dashboard"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Client *</label>
                <input
                  type="text"
                  name="clientName"
                  required
                  placeholder="e.g. BioHealth Analytics"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Total Budget ($)</label>
                <input
                  type="number"
                  name="budget"
                  placeholder="95000"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TASK FORM */}
          {activeTab === 'task' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700">Task Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Build Redux Slice for Live Telemetry"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Project Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Quantum Portal v2"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Priority</label>
                <select
                  name="priority"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
          )}

          {/* INVOICE FORM */}
          {activeTab === 'invoice' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700">Client Name *</label>
                <input
                  type="text"
                  name="clientName"
                  required
                  placeholder="e.g. Quantum Dynamics"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Total Invoice Amount ($) *</label>
                <input
                  type="number"
                  name="amount"
                  required
                  placeholder="35000"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* EMPLOYEE FORM */}
          {activeTab === 'employee' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700">Employee Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Michael Scott"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Job Title / Role *</label>
                <input
                  type="text"
                  name="role"
                  required
                  placeholder="e.g. Senior Backend Engineer"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Work Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="m.scott@domaindude.com"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Department</label>
                <select
                  name="department"
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={closeQuickCreate}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Create Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
