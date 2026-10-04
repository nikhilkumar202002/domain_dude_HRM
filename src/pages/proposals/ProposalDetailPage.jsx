import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Send,
  CheckCircle,
  XCircle,
  Copy,
  Edit,
  Eye,
  Building2,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  FileText,
  DollarSign,
  ShieldCheck,
  Check,
  MoreVertical,
  Printer,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ProposalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { proposals, addProposal } = useApp();

  // Find proposal by id or fallback to first proposal
  const initialProposal = proposals.find((p) => p.id === id) || proposals[0];
  const [proposal, setProposal] = useState(initialProposal);
  const [activeTab, setActiveTab] = useState('detail'); // 'detail' | 'preview'
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  if (!proposal) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Proposal not found.</p>
        <button onClick={() => navigate('/proposals')} className="mt-2 text-xs font-semibold text-[#0066FF]">
          Back to Proposals List
        </button>
      </div>
    );
  }

  // Formatters
  const grandTotal = proposal.grandTotal || proposal.amount || 0;
  const subtotal = proposal.subtotal || grandTotal;
  const taxAmount = proposal.taxAmount || (subtotal * 0.18);
  const discountAmount = proposal.discountAmount || 0;

  const handleActionSend = () => {
    setProposal((prev) => ({
      ...prev,
      status: 'Sent',
      sentDate: new Date().toISOString().split('T')[0],
      activity: [
        {
          id: Date.now(),
          type: 'sent',
          label: 'Proposal Sent to Client',
          by: 'Nikhil',
          timestamp: 'Just now',
          details: `Sent via email to ${prev.email || prev.clientName}`,
        },
        ...prev.activity,
      ],
    }));
  };

  const handleActionAccept = () => {
    setProposal((prev) => ({
      ...prev,
      status: 'Accepted',
      activity: [
        {
          id: Date.now(),
          type: 'accepted',
          label: 'Proposal Marked as Accepted',
          by: 'Client Sign-off',
          timestamp: 'Just now',
          details: 'Client confirmed commercial acceptance & contract initiation',
        },
        ...prev.activity,
      ],
    }));
  };

  const handleActionDuplicate = () => {
    const dup = {
      ...proposal,
      id: `PROP-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: `${proposal.title} (Copy)`,
      status: 'Draft',
      createdDate: new Date().toISOString().split('T')[0],
      sentDate: 'Pending',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      activity: [{ id: 1, type: 'created', label: 'Duplicated from ' + proposal.id, by: 'Nikhil', timestamp: 'Just now' }],
    };
    addProposal(dup);
    navigate(`/proposals/${dup.id}`);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button */}
      <button
        onClick={() => navigate('/proposals')}
        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Proposals
      </button>

      {/* Main Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0066FF] border border-blue-100 font-extrabold text-sm">
              {proposal.id.split('-').pop()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0066FF] uppercase tracking-wider">{proposal.id}</span>
                <StatusBadge status={proposal.status} />
              </div>
              <h1 className="text-xl font-bold text-slate-900 mt-1">{proposal.title}</h1>
              <p className="text-xs text-slate-500">
                Client: <span className="font-semibold text-slate-800">{proposal.clientName}</span> • Service:{' '}
                <span className="text-slate-700">{proposal.service || 'Commercial Scope'}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'detail' ? 'preview' : 'detail')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
            >
              <Eye className="h-3.5 w-3.5 text-slate-500" /> {activeTab === 'detail' ? 'Preview PDF' : 'Edit View'}
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" /> Download PDF
            </button>
            <button
              onClick={handleActionDuplicate}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
            >
              <Copy className="h-3.5 w-3.5 text-slate-500" /> Duplicate
            </button>
            {proposal.status !== 'Accepted' && (
              <button
                onClick={handleActionSend}
                className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
              >
                <Send className="h-3.5 w-3.5" /> Send to Client
              </button>
            )}
            {proposal.status !== 'Accepted' && (
              <button
                onClick={handleActionAccept}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
              >
                <CheckCircle className="h-3.5 w-3.5" /> Accept Proposal
              </button>
            )}
          </div>
        </div>

        {/* Financial Header Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Value</span>
            <p className="text-xl font-extrabold text-[#0066FF]">₹{grandTotal.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Created Date</span>
            <p className="text-sm font-semibold text-slate-800">{proposal.createdDate || '2026-09-20'}</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Valid Until</span>
            <p className="text-sm font-semibold text-slate-800">{proposal.validUntil}</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Assigned Manager</span>
            <p className="text-sm font-semibold text-slate-800">{proposal.author || proposal.assignedTo || 'Nikhil'}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Detail Content vs Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Detail Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client & Project Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="h-4 w-4 text-[#0066FF]" /> Client & Project Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div>
                  <span className="text-slate-400 block font-medium">Company Name:</span>
                  <span className="font-bold text-slate-900">{proposal.clientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Primary Contact:</span>
                  <span className="font-semibold text-slate-800">{proposal.contactPerson || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{proposal.email || 'contact@client.com'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{proposal.phone || '+91 98000 00000'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-slate-400 block font-medium">Scope Category:</span>
                  <span className="font-semibold text-slate-800">{proposal.service || 'Enterprise Tech'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Prepared By:</span>
                  <span className="font-semibold text-slate-800">{proposal.author || 'Nikhil'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Proposal Status:</span>
                  <div className="mt-1"><StatusBadge status={proposal.status} /></div>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#0066FF]" /> Proposal Line Items & Deliverables
              </span>
              <span className="text-slate-500 text-[11px] font-normal">{proposal.items?.length || 0} Modules</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Item / Module</th>
                    <th className="p-3">Deliverable Description</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Rate (₹)</th>
                    <th className="p-3 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {proposal.items && proposal.items.length > 0 ? (
                    proposal.items.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50/50">
                        <td className="p-3 text-slate-400 font-semibold">{index + 1}</td>
                        <td className="p-3 font-semibold text-slate-900">{item.name}</td>
                        <td className="p-3 text-slate-500 max-w-xs">{item.description}</td>
                        <td className="p-3 text-right font-medium">{item.qty}</td>
                        <td className="p-3 text-right text-slate-600">₹{item.rate.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right font-bold text-slate-900">
                          ₹{(item.amount || item.qty * item.rate).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-slate-400">
                        No line items detailed.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Financial Breakdown Table */}
            <div className="flex justify-end pt-2">
              <div className="w-full sm:w-72 rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({proposal.discountPercent}%):</span>
                    <span className="font-semibold">- ₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>GST Tax ({proposal.taxRate || 18}%):</span>
                  <span className="font-semibold text-slate-900">+ ₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Grand Total:</span>
                  <span className="text-[#0066FF] text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Notes */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="h-4 w-4 text-[#0066FF]" /> Terms, Payment Schedule & Notes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <span className="font-bold text-slate-800 block mb-1">Payment Terms & Milestones</span>
                <p className="text-slate-600 leading-relaxed">{proposal.terms || 'Standard payment terms apply.'}</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <span className="font-bold text-slate-800 block mb-1">Notes & Guarantees</span>
                <p className="text-slate-600 leading-relaxed">{proposal.notes || '12 months post-handover warranty and SLA maintenance.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Activity Timeline */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#0066FF]" /> Activity & Audit Log
              </span>
              <span className="text-[10px] font-semibold text-slate-400">{proposal.activity?.length || 0} events</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {proposal.activity && proposal.activity.length > 0 ? (
                proposal.activity.map((act) => {
                  let badgeBg = 'bg-blue-100 text-[#0066FF]';
                  if (act.type === 'accepted') badgeBg = 'bg-emerald-100 text-emerald-700';
                  if (act.type === 'rejected') badgeBg = 'bg-red-100 text-red-700';
                  if (act.type === 'viewed') badgeBg = 'bg-purple-100 text-purple-700';

                  return (
                    <div key={act.id} className="relative">
                      <div
                        className={`absolute -left-6 top-0 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${badgeBg}`}
                      >
                        ✓
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900">{act.label}</h4>
                          <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{act.details}</p>
                        {act.by && <span className="text-[10px] text-slate-400 font-medium">By: {act.by}</span>}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400">No recorded activity yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
