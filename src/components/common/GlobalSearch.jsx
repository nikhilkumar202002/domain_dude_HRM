import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Briefcase, Users, FolderKanban, CheckSquare, UserCheck, FileText, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GlobalSearch = () => {
  const { isGlobalSearchOpen, setIsGlobalSearchOpen, enquiries, clients, projects, tasks, employees, invoices } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  if (!isGlobalSearchOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredEnquiries = q
    ? enquiries.filter((e) => e.clientName.toLowerCase().includes(q) || e.service.toLowerCase().includes(q) || e.id.toLowerCase().includes(q))
    : enquiries.slice(0, 2);

  const filteredClients = q
    ? clients.filter((c) => c.companyName.toLowerCase().includes(q) || c.contactName.toLowerCase().includes(q))
    : clients.slice(0, 2);

  const filteredProjects = q
    ? projects.filter((p) => p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q))
    : projects.slice(0, 2);

  const filteredTasks = q
    ? tasks.filter((t) => t.title.toLowerCase().includes(q) || t.project.toLowerCase().includes(q))
    : tasks.slice(0, 2);

  const filteredEmployees = q
    ? employees.filter((emp) => emp.name.toLowerCase().includes(q) || emp.role.toLowerCase().includes(q))
    : employees.slice(0, 2);

  const filteredInvoices = q
    ? invoices.filter((inv) => inv.id.toLowerCase().includes(q) || inv.clientName.toLowerCase().includes(q))
    : invoices.slice(0, 2);

  const handleSelect = (path) => {
    setIsGlobalSearchOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-popover overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Enquiries, Clients, Projects, Tasks, Employees, Invoices..."
            className="w-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 mr-2">
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-500 hover:bg-slate-200"
          >
            Esc
          </button>
        </div>

        {/* Search Results Categories */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-slate-100">
          {/* Enquiries */}
          {filteredEnquiries.length > 0 && (
            <div className="pt-2 first:pt-0">
              <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Briefcase className="h-3.5 w-3.5 mr-1.5" /> Enquiries ({filteredEnquiries.length})
              </div>
              <div className="space-y-1">
                {filteredEnquiries.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(`/enquiries/${item.id}`)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer group text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{item.clientName}</span>
                      <span className="text-slate-400 ml-2">#{item.id}</span>
                      <p className="text-slate-500">{item.service}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clients */}
          {filteredClients.length > 0 && (
            <div className="pt-3">
              <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Users className="h-3.5 w-3.5 mr-1.5" /> Clients ({filteredClients.length})
              </div>
              <div className="space-y-1">
                {filteredClients.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(`/clients/${item.id}`)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer group text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{item.companyName}</span>
                      <span className="text-slate-500 ml-2">({item.contactName})</span>
                      <p className="text-slate-400">{item.industry}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div className="pt-3">
              <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <FolderKanban className="h-3.5 w-3.5 mr-1.5" /> Projects ({filteredProjects.length})
              </div>
              <div className="space-y-1">
                {filteredProjects.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(`/projects/${item.id}`)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer group text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{item.name}</span>
                      <span className="text-slate-500 ml-2">• {item.client}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div className="pt-3">
              <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <CheckSquare className="h-3.5 w-3.5 mr-1.5" /> Tasks ({filteredTasks.length})
              </div>
              <div className="space-y-1">
                {filteredTasks.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect('/tasks')}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer group text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{item.title}</span>
                      <span className="text-slate-400 ml-2">({item.project})</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Employees */}
          {filteredEmployees.length > 0 && (
            <div className="pt-3">
              <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <UserCheck className="h-3.5 w-3.5 mr-1.5" /> Employees ({filteredEmployees.length})
              </div>
              <div className="space-y-1">
                {filteredEmployees.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(`/employees/${item.id}`)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer group text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{item.name}</span>
                      <span className="text-slate-500 ml-2">— {item.role}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoices */}
          {filteredInvoices.length > 0 && (
            <div className="pt-3">
              <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <FileText className="h-3.5 w-3.5 mr-1.5" /> Invoices ({filteredInvoices.length})
              </div>
              <div className="space-y-1">
                {filteredInvoices.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect('/invoices')}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer group text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{item.id}</span>
                      <span className="text-slate-500 ml-2">— {item.clientName}</span>
                      <span className="text-emerald-600 font-semibold ml-2">${item.amount.toLocaleString()}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Navigate with click or arrow keys</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
