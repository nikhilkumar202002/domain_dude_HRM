import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Send, CheckCircle, XCircle, ArrowLeft, Download, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ProposalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { proposals } = useApp();

  const proposal = proposals.find((p) => p.id === id) || proposals[0];

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/proposals')} className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to Proposals
      </button>

      <PageHeader
        title={`${proposal.title} (${proposal.id})`}
        subtitle={`Client: ${proposal.clientName} • Author: ${proposal.author}`}
        actions={
          <>
            <button
              onClick={() => alert(`PDF generated for proposal ${proposal.id}`)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5" /> Download PDF
            </button>
            <button
              onClick={() => alert(`Proposal #${proposal.id} marked as Sent!`)}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              <Send className="h-3.5 w-3.5" /> Send to Client
            </button>
          </>
        }
      />

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs text-slate-400">Proposal Status</span>
            <div className="mt-1"><StatusBadge status={proposal.status} size="lg" /></div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Grand Total Amount</span>
            <p className="text-2xl font-bold text-slate-900">${proposal.amount.toLocaleString()}</p>
          </div>
        </div>

        {/* Line Items Table Mock */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Scope & Milestone Deliverables</h4>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Item / Module</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right">Est. Hours</th>
                  <th className="p-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3 font-semibold">Phase 1: Discovery & System Architecture</td>
                  <td className="p-3 text-slate-500">Technical design doc, database schema, and Figma design tokens.</td>
                  <td className="p-3 text-right">40 hrs</td>
                  <td className="p-3 text-right font-bold">${(proposal.amount * 0.25).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Phase 2: Core Engineering & Integrations</td>
                  <td className="p-3 text-slate-500">React frontend, REST API layers, authentication & RBAC system.</td>
                  <td className="p-3 text-right">120 hrs</td>
                  <td className="p-3 text-right font-bold">${(proposal.amount * 0.55).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Phase 3: QA, Deployment & Training</td>
                  <td className="p-3 text-slate-500">Automated E2E tests, CI/CD pipeline setup, team handoff.</td>
                  <td className="p-3 text-right">30 hrs</td>
                  <td className="p-3 text-right font-bold">${(proposal.amount * 0.20).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
