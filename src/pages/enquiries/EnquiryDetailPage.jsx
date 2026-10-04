import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, DollarSign, User, Calendar, FileText, CheckCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Timeline } from '../../components/common/Timeline';

export const EnquiryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enquiries, addClient, openQuickCreate } = useApp();

  const enquiry = enquiries.find((e) => e.id === id) || enquiries[0];

  const handleConvertToClient = () => {
    addClient({
      companyName: enquiry.clientName,
      contactName: enquiry.contactPerson,
      email: enquiry.email,
      phone: enquiry.phone,
      industry: enquiry.service,
    });
    alert(`Enquiry #${enquiry.id} successfully converted to Active Client!`);
    navigate('/clients');
  };

  const timelineItems = [
    { title: 'Enquiry Received', timestamp: enquiry.createdAt?.split('T')[0] || '2026-10-02', description: 'Inbound submission via web portal form.', status: 'completed' },
    { title: 'Initial Discovery Call', timestamp: '2026-10-03', description: 'Discussed architectural scope and budget alignment with client.', status: 'completed', user: enquiry.assignedTo },
    { title: 'Proposal Creation', timestamp: 'Pending', description: 'Drafting formal project scope & milestone deliverables.', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/enquiries')} className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to Sales Enquiries
      </button>

      <PageHeader
        title={`${enquiry.clientName} (${enquiry.id})`}
        subtitle={`Service Requested: ${enquiry.service}`}
        actions={
          <>
            <button
              onClick={() => openQuickCreate('proposal')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
            >
              <FileText className="h-3.5 w-3.5 text-indigo-600" /> Create Proposal
            </button>
            <button
              onClick={handleConvertToClient}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              <CheckCircle className="h-3.5 w-3.5" /> Convert to Client
            </button>
          </>
        }
      />

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Primary Spec & Notes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Enquiry Overview</h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400">Status</span>
                <div className="mt-1"><StatusBadge status={enquiry.status} /></div>
              </div>
              <div>
                <span className="text-slate-400">Priority</span>
                <div className="mt-1"><StatusBadge status={enquiry.priority} /></div>
              </div>
              <div>
                <span className="text-slate-400">Estimated Budget</span>
                <p className="mt-1 text-base font-bold text-slate-900">${enquiry.estimatedBudget.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-400">Lead Source</span>
                <p className="mt-1 font-semibold text-slate-800">{enquiry.source || 'Website Lead'}</p>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4">
              <span className="text-xs text-slate-400 font-medium">Internal Notes & Scope Overview</span>
              <p className="mt-1.5 rounded-lg bg-slate-50 p-3 text-xs text-slate-700 leading-relaxed">
                {enquiry.notes || 'No notes provided yet.'}
              </p>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Deal History & Timeline</h3>
            <Timeline items={timelineItems} />
          </div>
        </div>

        {/* Right Column: Contact Info Card */}
        <div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Info</h3>
            
            <div className="flex items-center space-x-3 text-xs">
              <User className="h-4 w-4 text-slate-400" />
              <div>
                <span className="text-slate-400 text-[10px]">Contact Person</span>
                <p className="font-semibold text-slate-900">{enquiry.contactPerson}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <Mail className="h-4 w-4 text-slate-400" />
              <div>
                <span className="text-slate-400 text-[10px]">Email</span>
                <p className="font-semibold text-indigo-600">{enquiry.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <Phone className="h-4 w-4 text-slate-400" />
              <div>
                <span className="text-slate-400 text-[10px]">Phone</span>
                <p className="font-semibold text-slate-900">{enquiry.phone}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center space-x-3 text-xs">
              <User className="h-4 w-4 text-slate-400" />
              <div>
                <span className="text-slate-400 text-[10px]">Assigned Owner</span>
                <p className="font-semibold text-slate-900">{enquiry.assignedTo}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
