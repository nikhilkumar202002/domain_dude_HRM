import React, { useState } from 'react';
import {
  Globe,
  Building2,
  Building,
  Briefcase,
  Clock,
  Calendar,
  DollarSign,
  CreditCard,
  Bell,
  ShieldCheck,
  Lock,
  Cpu,
  Save,
  Plus,
  Edit2,
  Trash2,
  Check,
  CheckCircle2,
  Smartphone,
  Laptop,
  Key,
  ShieldAlert,
  UserCheck,
  Layers,
  Upload,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { mockRolesList } from '../../data/mockData';

export const SettingsPage = () => {
  // Navigation active tab
  const [activeNav, setActiveNav] = useState('General');

  // Success Toast Notification State
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // 1. General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    language: 'English (US)',
    timezone: 'Asia/Kolkata (UTC+05:30)',
    dateFormat: 'DD/MM/YYYY',
    currency: 'USD ($)',
    theme: 'Royal Blue (System Sync)',
  });

  // 2. Company Settings State
  const [companySettings, setCompanySettings] = useState({
    name: 'Domain Dude Business OS Inc.',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    email: 'admin@domaindude.com',
    phone: '+91 98765 43210',
    address: '100 Tech Boulevard, Suite 400, Bangalore, KA 560001, India',
    website: 'https://domaindude.com',
    taxId: 'US-EIN-9872104',
    gstin: '29AAAAA0000A1Z5',
  });

  // 3. Departments State
  const [departments, setDepartments] = useState([
    { id: 'dept-1', name: 'Executive Management', head: 'Nikhil', count: 2 },
    { id: 'dept-2', name: 'Engineering & Tech', head: "Liam O'Connor", count: 18 },
    { id: 'dept-3', name: 'UI/UX & Product Design', head: 'Sophia Chen', count: 6 },
    { id: 'dept-4', name: 'Project Operations', head: 'Marcus Vance', count: 5 },
    { id: 'dept-5', name: 'Quality Assurance', head: 'Priya Sharma', count: 4 },
  ]);
  const [newDeptModal, setNewDeptModal] = useState(false);
  const [deptFormName, setDeptFormName] = useState('');

  // 4. Designations State
  const [designations, setDesignations] = useState([
    { id: 'des-1', title: 'Managing Director & Lead Architect', department: 'Executive Management', level: 'Level 5 (Exec)' },
    { id: 'des-2', title: 'Full Stack Tech Lead', department: 'Engineering & Tech', level: 'Level 4 (Lead)' },
    { id: 'des-3', title: 'Senior UI/UX Designer', department: 'UI/UX & Product Design', level: 'Level 3 (Senior)' },
    { id: 'des-4', title: 'Technical Project Manager', department: 'Project Operations', level: 'Level 4 (Lead)' },
    { id: 'des-5', title: 'Frontend Web Developer', department: 'Engineering & Tech', level: 'Level 2 (Mid)' },
    { id: 'des-6', title: 'QA Lead & Test Engineer', department: 'Quality Assurance', level: 'Level 3 (Senior)' },
  ]);
  const [newDesigModal, setNewDesigModal] = useState(false);
  const [desigForm, setDesigForm] = useState({ title: '', department: 'Engineering & Tech', level: 'Level 3 (Senior)' });

  // 5. Working Hours State
  const [workingHours, setWorkingHours] = useState({
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    dailyHours: '8.0',
    startTime: '09:00',
    endTime: '18:00',
    breakTime: '1.0 Hour (Lunch)',
    overtimeMultiplier: '1.5x',
    maxDailyOT: '4.0',
    requireApproval: true,
  });

  // 6. Leave Settings State
  const [leaveSettings, setLeaveSettings] = useState({
    annualQuota: 18,
    sickQuota: 7,
    casualQuota: 6,
    maxRollover: 5,
    approvalWorkflow: 'Manager Approval Required',
  });

  // 7. Payroll Settings State
  const [payrollSettings, setPayrollSettings] = useState({
    payCycle: 'Monthly (Last Working Day)',
    taxDeductionRate: 12,
    autoPayslipGen: true,
    currencySymbol: '$',
  });

  // 8. Notifications Settings State
  const [notifSettings, setNotifSettings] = useState({
    emailNotifs: true,
    inAppNotifs: true,
    followUpReminders: true,
    taskReminders: true,
    invoiceReminders: true,
  });

  // 9. Security Settings State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Nav Items Definition
  const navItems = [
    { id: 'General', label: 'General', icon: Globe },
    { id: 'Company', label: 'Company', icon: Building2 },
    { id: 'Departments', label: 'Departments', icon: Building },
    { id: 'Designations', label: 'Designations', icon: Briefcase },
    { id: 'Working Hours', label: 'Working Hours', icon: Clock },
    { id: 'Leave', label: 'Leave', icon: Calendar },
    { id: 'Payroll', label: 'Payroll', icon: DollarSign },
    { id: 'Billing', label: 'Billing', icon: CreditCard },
    { id: 'Notifications', label: 'Notifications', icon: Bell },
    { id: 'Roles & Permissions', label: 'Roles & Permissions', icon: ShieldCheck },
    { id: 'Security', label: 'Security', icon: Lock },
    { id: 'System', label: 'System', icon: Cpu },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Settings"
        subtitle="Manage company information, departments, working hours, security and system preferences."
      />

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 shadow-xl border border-slate-700 animate-in slide-in-from-bottom duration-200 text-xs font-semibold">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MAIN SETTINGS LAYOUT (LEFT SIDEBAR NAV + RIGHT CONTENT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SETTINGS NAVIGATION */}
        <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xs space-y-1 sticky top-20">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            System Configuration
          </div>

          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#0066FF] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <IconComp className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* RIGHT SETTINGS CONTENT AREA */}
        <div className="lg:col-span-9 rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          {/* 1. GENERAL SECTION */}
          {activeNav === 'General' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">General Preferences</h3>
                <p className="text-xs text-slate-500">Configure global platform localization, currency, and date formats.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">System Language</label>
                  <select
                    value={generalSettings.language}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="English (US)">English (US)</option>
                    <option value="English (UK)">English (UK)</option>
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="French">French (Français)</option>
                    <option value="German">German (Deutsch)</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Default Timezone</label>
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Asia/Kolkata (UTC+05:30)">Asia/Kolkata (UTC+05:30 IST)</option>
                    <option value="America/New_York (UTC-05:00)">America/New_York (UTC-05:00 EST)</option>
                    <option value="America/Los_Angeles (UTC-08:00)">America/Los_Angeles (UTC-08:00 PST)</option>
                    <option value="Europe/London (UTC+00:00)">Europe/London (UTC+00:00 GMT)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date Format</label>
                  <select
                    value={generalSettings.dateFormat}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, dateFormat: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 04/10/2026)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-10-04)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 10/04/2026)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Base Currency</label>
                  <select
                    value={generalSettings.currency}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="USD ($)">USD ($) — US Dollar</option>
                    <option value="INR (₹)">INR (₹) — Indian Rupee</option>
                    <option value="EUR (€)">EUR (€) — Euro</option>
                    <option value="GBP (£)">GBP (£) — British Pound</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Theme Interface</label>
                  <select
                    value={generalSettings.theme}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, theme: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Royal Blue (System Sync)">Royal Blue (System Sync)</option>
                    <option value="Light SaaS Clean">Light SaaS Clean</option>
                    <option value="Dark Mode Executive">Dark Mode Executive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => triggerToast('General settings saved successfully!')}
                  className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {/* 2. COMPANY SECTION */}
          {activeNav === 'Company' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Company Information</h3>
                <p className="text-xs text-slate-500">Legal business entity profile, brand logo, and billing tax IDs.</p>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <img
                  src={companySettings.logo}
                  alt="Company Logo"
                  className="h-16 w-16 rounded-xl object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{companySettings.name}</h4>
                  <p className="text-xs text-slate-500">Corporate Branding Badge</p>
                  <button
                    onClick={() => alert('Logo upload dialog...')}
                    className="mt-2 flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <Upload className="h-3 w-3" /> Change Logo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Legal Name</label>
                  <input
                    type="text"
                    value={companySettings.name}
                    onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Contact Email</label>
                  <input
                    type="email"
                    value={companySettings.email}
                    onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={companySettings.phone}
                    onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Website URL</label>
                  <input
                    type="text"
                    value={companySettings.website}
                    onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Headquarters Address</label>
                  <input
                    type="text"
                    value={companySettings.address}
                    onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tax ID / EIN</label>
                  <input
                    type="text"
                    value={companySettings.taxId}
                    onChange={(e) => setCompanySettings({ ...companySettings, taxId: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GSTIN / Registration Number</label>
                  <input
                    type="text"
                    value={companySettings.gstin}
                    onChange={(e) => setCompanySettings({ ...companySettings, gstin: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => triggerToast('Company information updated successfully!')}
                  className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4" /> Save Company Profile
                </button>
              </div>
            </div>
          )}

          {/* 3. DEPARTMENTS SECTION */}
          {activeNav === 'Departments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Departments Management</h3>
                  <p className="text-xs text-slate-500">Define organizational units, department leads, and headcounts.</p>
                </div>
                <button
                  onClick={() => setNewDeptModal(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Department
                </button>
              </div>

              <div className="space-y-3">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-xs hover:border-blue-200 transition-all"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{dept.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Department Head: <strong>{dept.head}</strong> • {dept.count} Members
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`Editing department ${dept.name}...`)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDepartments(departments.filter((d) => d.id !== dept.id));
                          triggerToast(`Deleted ${dept.name} department.`);
                        }}
                        className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. DESIGNATIONS SECTION */}
          {activeNav === 'Designations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Designations & Job Titles</h3>
                  <p className="text-xs text-slate-500">Manage employee job roles, seniority levels, and department mapping.</p>
                </div>
                <button
                  onClick={() => setNewDesigModal(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Designation
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                <div className="bg-slate-50 px-4 py-2.5 font-bold text-slate-700 grid grid-cols-12 gap-2 border-b border-slate-200">
                  <div className="col-span-5">Job Designation Title</div>
                  <div className="col-span-4">Department</div>
                  <div className="col-span-3 text-right">Seniority Level</div>
                </div>

                <div className="divide-y divide-slate-100">
                  {designations.map((des) => (
                    <div key={des.id} className="px-4 py-3 grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5 font-semibold text-slate-900">{des.title}</div>
                      <div className="col-span-4 text-slate-600">{des.department}</div>
                      <div className="col-span-3 text-right font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block justify-self-end">
                        {des.level}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. WORKING HOURS SECTION */}
          {activeNav === 'Working Hours' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Working Hours & Overtime Rules</h3>
                <p className="text-xs text-slate-500">Configure official company working hours, shift timings, and overtime multipliers.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shift Start Time</label>
                  <input
                    type="time"
                    value={workingHours.startTime}
                    onChange={(e) => setWorkingHours({ ...workingHours, startTime: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shift End Time</label>
                  <input
                    type="time"
                    value={workingHours.endTime}
                    onChange={(e) => setWorkingHours({ ...workingHours, endTime: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Daily Regular Hours</label>
                  <input
                    type="text"
                    value={workingHours.dailyHours}
                    onChange={(e) => setWorkingHours({ ...workingHours, dailyHours: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lunch & Break Time</label>
                  <input
                    type="text"
                    value={workingHours.breakTime}
                    onChange={(e) => setWorkingHours({ ...workingHours, breakTime: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2 pt-2 border-t border-slate-100 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs">Overtime Rules & Multipliers</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-600 mb-1">Overtime Pay Rate Multiplier</label>
                      <input
                        type="text"
                        value={workingHours.overtimeMultiplier}
                        onChange={(e) => setWorkingHours({ ...workingHours, overtimeMultiplier: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-600 mb-1">Max Daily Overtime (Hours)</label>
                      <input
                        type="text"
                        value={workingHours.maxDailyOT}
                        onChange={(e) => setWorkingHours({ ...workingHours, maxDailyOT: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => triggerToast('Working hours & overtime rules saved!')}
                  className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4" /> Save Schedule Rules
                </button>
              </div>
            </div>
          )}

          {/* 6. LEAVE SECTION */}
          {activeNav === 'Leave' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Leave Policies & Quotas</h3>
                <p className="text-xs text-slate-500">Configure annual paid leave allocations, sick leave quotas, and rollover limits.</p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs text-center">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-slate-500 font-medium block">Annual Vacation</span>
                  <input
                    type="number"
                    value={leaveSettings.annualQuota}
                    onChange={(e) => setLeaveSettings({ ...leaveSettings, annualQuota: parseInt(e.target.value, 10) || 0 })}
                    className="mt-2 w-20 text-center text-xl font-bold text-slate-900 rounded-lg border border-slate-300 p-1 mx-auto"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">Days / Year</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-slate-500 font-medium block">Sick Leave</span>
                  <input
                    type="number"
                    value={leaveSettings.sickQuota}
                    onChange={(e) => setLeaveSettings({ ...leaveSettings, sickQuota: parseInt(e.target.value, 10) || 0 })}
                    className="mt-2 w-20 text-center text-xl font-bold text-slate-900 rounded-lg border border-slate-300 p-1 mx-auto"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">Days / Year</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-slate-500 font-medium block">Casual Leave</span>
                  <input
                    type="number"
                    value={leaveSettings.casualQuota}
                    onChange={(e) => setLeaveSettings({ ...leaveSettings, casualQuota: parseInt(e.target.value, 10) || 0 })}
                    className="mt-2 w-20 text-center text-xl font-bold text-slate-900 rounded-lg border border-slate-300 p-1 mx-auto"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">Days / Year</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => triggerToast('Leave quotas and rules saved!')}
                  className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4" /> Save Leave Quotas
                </button>
              </div>
            </div>
          )}

          {/* 7. PAYROLL SECTION */}
          {activeNav === 'Payroll' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Payroll & Salary Configuration</h3>
                <p className="text-xs text-slate-500">Tax withholding setup, pay cycle dates, and automated payslip generation.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Standard Pay Cycle</label>
                  <input
                    type="text"
                    value={payrollSettings.payCycle}
                    onChange={(e) => setPayrollSettings({ ...payrollSettings, payCycle: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Standard TDS / Tax Withholding Rate (%)</label>
                  <input
                    type="number"
                    value={payrollSettings.taxDeductionRate}
                    onChange={(e) => setPayrollSettings({ ...payrollSettings, taxDeductionRate: parseInt(e.target.value, 10) || 0 })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => triggerToast('Payroll settings saved successfully!')}
                  className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4" /> Save Payroll Rules
                </button>
              </div>
            </div>
          )}

          {/* 8. BILLING SECTION */}
          {activeNav === 'Billing' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">SaaS Subscription & Billing</h3>
                <p className="text-xs text-slate-500">Manage your Domain Dude Business OS subscription and payment method.</p>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block">Current Plan</span>
                  <h4 className="text-xl font-extrabold text-[#0066FF] mt-0.5">Enterprise Pro Tier</h4>
                  <p className="text-xs text-blue-800 mt-1">$299.00 / month • 25 Active User Seats Included</p>
                </div>
                <button
                  onClick={() => alert('Upgrade Plan Dialog...')}
                  className="rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
                >
                  Upgrade Plan
                </button>
              </div>
            </div>
          )}

          {/* 9. NOTIFICATIONS SECTION */}
          {activeNav === 'Notifications' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Notification Preferences</h3>
                <p className="text-xs text-slate-500">Control automated alerts for sales follow-ups, task deadlines, and invoice overdue warnings.</p>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { key: 'emailNotifs', title: 'Email Notifications', desc: 'Receive instant email alerts for critical business updates' },
                  { key: 'inAppNotifs', title: 'In-App Popover Notifications', desc: 'Real-time topbar notifications and unread badges' },
                  { key: 'followUpReminders', title: 'Sales Follow-up Reminders', desc: 'Daily notifications for scheduled lead follow-ups' },
                  { key: 'taskReminders', title: 'Task Deadline Warnings', desc: 'Alerts 24 hours before project task deadlines' },
                  { key: 'invoiceReminders', title: 'Invoice Overdue Reminders', desc: 'Automated client reminder notices for past-due bills' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white">
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() =>
                        setNotifSettings({ ...notifSettings, [item.key]: !notifSettings[item.key] })
                      }
                      className={`h-6 w-11 rounded-full transition-colors p-0.5 ${
                        notifSettings[item.key] ? 'bg-[#0066FF]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white transition-transform ${
                          notifSettings[item.key] ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. ROLES & PERMISSIONS SECTION */}
          {activeNav === 'Roles & Permissions' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Roles & Permissions (RBAC)</h3>
                <p className="text-xs text-slate-500">Configure role permissions, user access limits, and security scope.</p>
              </div>

              <div className="space-y-3 text-xs">
                {mockRolesList.map((role) => (
                  <div key={role.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{role.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{role.description}</p>
                      </div>
                      <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-bold text-[#0066FF]">
                        {role.usersCount} Users
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {role.permissions.map((perm) => (
                        <span key={perm} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-700">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. SECURITY SECTION */}
          {activeNav === 'Security' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Security & Authentication</h3>
                <p className="text-xs text-slate-500">Manage account passwords, 2FA authentication, active sessions, and login logs.</p>
              </div>

              {/* Password update form */}
              <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-4">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
                  Change Password
                </h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-xs"
                    />
                  </div>
                </div>
                <button
                  onClick={() => triggerToast('Password changed successfully!')}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Update Password
                </button>
              </div>

              {/* Active Sessions */}
              <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
                  Active User Sessions
                </h4>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Laptop className="h-5 w-5 text-blue-600" />
                    <div>
                      <span className="font-bold text-slate-900 block">Chrome on Windows 11 (Current Session)</span>
                      <span className="text-[11px] text-slate-500">Bangalore, India • IP: 157.48.12.9</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                </div>
              </div>
            </div>
          )}

          {/* 12. SYSTEM SECTION */}
          {activeNav === 'System' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">System & API Management</h3>
                <p className="text-xs text-slate-500">Platform release version, REST API tokens, and audit log configuration.</p>
              </div>

              <div className="rounded-xl border border-slate-200 p-5 bg-slate-50 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Platform Version</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200">
                    Domain Dude OS v4.8.2 (Build 20261004)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700">API Key Token</span>
                  <span className="font-mono text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200">
                    dd_live_sec_99018241...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NEW DEPARTMENT MODAL */}
      <Modal
        isOpen={newDeptModal}
        onClose={() => setNewDeptModal(false)}
        title="Add Department"
        subtitle="Create a new organizational department."
      >
        <div className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department Name</label>
            <input
              type="text"
              placeholder="e.g. Sales & Business Development"
              value={deptFormName}
              onChange={(e) => setDeptFormName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => setNewDeptModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (deptFormName.trim()) {
                  setDepartments([
                    ...departments,
                    { id: `dept-${Date.now()}`, name: deptFormName, head: 'Alex Morgan', count: 1 },
                  ]);
                  setDeptFormName('');
                  setNewDeptModal(false);
                  triggerToast('New department created successfully!');
                }
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0066FF] hover:bg-blue-700 rounded-lg shadow-sm"
            >
              Create Department
            </button>
          </div>
        </div>
      </Modal>

      {/* NEW DESIGNATION MODAL */}
      <Modal
        isOpen={newDesigModal}
        onClose={() => setNewDesigModal(false)}
        title="Add Designation"
        subtitle="Define a new employee job title."
      >
        <div className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Designation Title</label>
            <input
              type="text"
              placeholder="e.g. Senior DevOps Engineer"
              value={desigForm.title}
              onChange={(e) => setDesigForm({ ...desigForm, title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
            <select
              value={desigForm.department}
              onChange={(e) => setDesigForm({ ...desigForm, department: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => setNewDesigModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (desigForm.title.trim()) {
                  setDesignations([
                    ...designations,
                    { id: `des-${Date.now()}`, title: desigForm.title, department: desigForm.department, level: desigForm.level },
                  ]);
                  setDesigForm({ title: '', department: 'Engineering & Tech', level: 'Level 3 (Senior)' });
                  setNewDesigModal(false);
                  triggerToast('New designation created successfully!');
                }
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0066FF] hover:bg-blue-700 rounded-lg shadow-sm"
            >
              Create Designation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
