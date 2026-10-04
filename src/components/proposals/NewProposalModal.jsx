import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Plus, Trash2, FileText, User, Briefcase, DollarSign, Calendar, ShieldCheck, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NewProposalModal = ({ isOpen, onClose }) => {
  const { clients, addProposal } = useApp();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    contactPerson: '',
    email: '',
    phone: '',
    title: '',
    service: 'Enterprise Software Development',
    summary: '',
    items: [
      { id: Date.now(), name: 'Phase 1: Discovery & System Architecture', description: 'Technical design, database schema and Figma design system.', qty: 1, rate: 200000 },
      { id: Date.now() + 1, name: 'Phase 2: Core Engineering & Modules', description: 'Frontend UI, API integration and backend business logic.', qty: 1, rate: 500000 },
    ],
    discountPercent: 5,
    taxRate: 18,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    terms: '30% Advance on signing, 40% upon Phase 2 milestone delivery, 30% on production launch. Valid for 30 days.',
    notes: 'Includes 12 months post-deployment maintenance and 99.9% uptime SLA guarantee.',
  });

  if (!isOpen) return null;

  // Handle Client Selection
  const handleClientSelect = (clientId) => {
    if (!clientId) {
      setFormData((prev) => ({ ...prev, clientId: '', clientName: '', contactPerson: '', email: '', phone: '' }));
      return;
    }
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setFormData((prev) => ({
        ...prev,
        clientId: client.id,
        clientName: client.companyName,
        contactPerson: client.contactName,
        email: client.email,
        phone: client.phone,
      }));
    }
  };

  // Item Handlers
  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: Date.now(), name: '', description: '', qty: 1, rate: 0 },
      ],
    }));
  };

  const handleRemoveItem = (id) => {
    if (formData.items.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handleItemChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  // Financial Computations
  const subtotal = formData.items.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.rate) || 0), 0);
  const discountAmount = (subtotal * (Number(formData.discountPercent) || 0)) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * (Number(formData.taxRate) || 0)) / 100;
  const grandTotal = taxableAmount + taxAmount;

  const steps = [
    { number: 1, label: 'Client', icon: User },
    { number: 2, label: 'Project / Service', icon: Briefcase },
    { number: 3, label: 'Items', icon: FileText },
    { number: 4, label: 'Pricing', icon: DollarSign },
    { number: 5, label: 'Terms', icon: Calendar },
    { number: 6, label: 'Preview', icon: Eye },
  ];

  const handleFinalSubmit = (status = 'Draft') => {
    const formattedItems = formData.items.map((item, idx) => ({
      id: idx + 1,
      name: item.name || 'Service Deliverable',
      description: item.description || '',
      qty: Number(item.qty) || 1,
      rate: Number(item.rate) || 0,
      amount: (Number(item.qty) || 1) * (Number(item.rate) || 0),
    }));

    addProposal({
      title: formData.title || 'New Business Proposal',
      service: formData.service,
      clientName: formData.clientName || 'Valued Client',
      clientId: formData.clientId || 'CLI-NEW',
      contactPerson: formData.contactPerson || 'Primary Contact',
      email: formData.email,
      phone: formData.phone,
      amount: subtotal,
      subtotal,
      discountPercent: Number(formData.discountPercent) || 0,
      discountAmount,
      taxRate: Number(formData.taxRate) || 18,
      taxAmount,
      grandTotal,
      status,
      sentDate: status === 'Sent' ? new Date().toISOString().split('T')[0] : 'Pending',
      validUntil: formData.validUntil,
      itemsCount: formattedItems.length,
      items: formattedItems,
      terms: formData.terms,
      notes: formData.notes,
      activity: [
        {
          id: 1,
          type: status === 'Sent' ? 'sent' : 'created',
          label: status === 'Sent' ? 'Proposal Created & Sent' : 'Draft Proposal Created',
          by: 'Nikhil',
          timestamp: 'Just now',
          details: `Generated via Proposal Builder`,
        },
      ],
    });

    onClose();
    setCurrentStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0066FF] border border-blue-100">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Commercial Proposal Builder</h2>
              <p className="text-xs text-slate-500">Create, customize and issue milestone proposals in 6 simple steps.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wizard Progress Bar */}
        <div className="border-b border-slate-100 bg-white px-6 py-3">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.number;
              const isActive = currentStep === step.number;

              return (
                <React.Fragment key={step.number}>
                  <div
                    onClick={() => setCurrentStep(step.number)}
                    className={`flex items-center gap-2 cursor-pointer group ${
                      isActive ? 'text-[#0066FF]' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#0066FF] text-white ring-4 ring-blue-100 shadow-sm'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : step.number}
                    </div>
                    <span className="hidden sm:inline text-xs font-semibold">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 transition-all ${
                        currentStep > step.number ? 'bg-emerald-500' : 'bg-slate-100'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Body Step Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* STEP 1: CLIENT */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="h-4 w-4 text-[#0066FF]" /> Select Client & Contact Information
              </h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Existing Client</label>
                <select
                  value={formData.clientId}
                  onChange={(e) => handleClientSelect(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                >
                  <option value="">-- Choose from Client Directory or Enter Custom Below --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName} ({c.contactName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization Name *</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="e.g. AeroCloud Logistics"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Contact Person *</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="s.jenkins@aerocloud.com"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98123 45678"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PROJECT / SERVICE */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[#0066FF]" /> Proposal Title & Scope Definition
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Proposal Title / Project Name *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Enterprise ERP Custom Dashboard System"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Service Category</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                >
                  <option value="Enterprise Software Development">Enterprise Software Development</option>
                  <option value="Mobile & Web App">Mobile & Web App</option>
                  <option value="Healthcare AI / Analytics">Healthcare AI / Analytics</option>
                  <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                  <option value="Media & Digital Platform">Media & Digital Platform</option>
                  <option value="Financial Risk Systems">Financial Risk Systems</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Executive Summary / Proposal Scope</label>
                <textarea
                  rows={4}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Provide a high-level overview of the proposed solution, business objectives, technical stack, and expected deliverables..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: ITEMS */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#0066FF]" /> Proposal Line Items & Deliverables
                </h3>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0066FF] hover:bg-blue-100 transition"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Item
                </button>
              </div>

              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 relative space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Item #{index + 1}</span>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Item / Module Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                          placeholder="e.g. Phase 1: System Design"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Unit Rate (₹)</label>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                          placeholder="0"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Deliverables & Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        placeholder="Detailed scope or specifications for this milestone..."
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: PRICING */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#0066FF]" /> Pricing, Discounts & Taxes
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Discount Rate (%)</label>
                  <input
                    type="number"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Applicable Tax / GST (%)</label>
                  <input
                    type="number"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                  />
                </div>
              </div>

              {/* Financial Calculation Summary Card */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 mt-4">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600">
                    <span>Discount ({formData.discountPercent}%):</span>
                    <span className="font-semibold">- ₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Tax ({formData.taxRate}% GST):</span>
                  <span className="font-semibold text-slate-900">+ ₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
                  <span>Grand Total Amount:</span>
                  <span className="text-[#0066FF] text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: TERMS */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#0066FF]" /> Validity, Payment Terms & Special Notes
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Proposal Validity Expiry Date</label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Schedule & Terms</label>
                <textarea
                  rows={3}
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes & SLA Guarantees</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 6: PREVIEW */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Proposal Draft</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{formData.title || 'Untitled Proposal'}</h3>
                    <p className="text-xs text-slate-500">Prepared for: <span className="font-semibold text-slate-700">{formData.clientName || 'N/A'}</span> ({formData.contactPerson})</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Grand Total</span>
                    <p className="text-xl font-extrabold text-[#0066FF]">₹{grandTotal.toLocaleString('en-IN')}</p>
                    <span className="text-[11px] text-slate-500">Valid until: {formData.validUntil}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Deliverable Breakdown</h4>
                  <table className="w-full text-left text-xs border border-slate-100 rounded-lg">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                      <tr>
                        <th className="p-2.5">Item</th>
                        <th className="p-2.5">Deliverable Scope</th>
                        <th className="p-2.5 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {formData.items.map((item, i) => (
                        <tr key={i}>
                          <td className="p-2.5 font-semibold text-slate-900">{item.name}</td>
                          <td className="p-2.5 text-slate-500">{item.description}</td>
                          <td className="p-2.5 text-right font-bold text-slate-900">₹{(Number(item.qty) * Number(item.rate)).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Payment Schedule</span>
                    <p className="text-slate-600">{formData.terms}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Notes & Guarantee</span>
                    <p className="text-slate-600">{formData.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </button>

          <div className="flex items-center gap-2">
            {currentStep < 6 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
                className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
              >
                Next Step <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleFinalSubmit('Draft')}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleFinalSubmit('Sent')}
                  className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
                >
                  <Check className="h-4 w-4" /> Save & Send to Client
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
