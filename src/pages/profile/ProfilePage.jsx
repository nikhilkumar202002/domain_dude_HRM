import React, { useState } from 'react';
import {
  User,
  Shield,
  Lock,
  Smartphone,
  Globe,
  Bell,
  Clock,
  Key,
  CheckCircle2,
  Camera,
  Save,
  Laptop,
  Check,
  AlertCircle,
  LogOut,
  Sparkles,
  QrCode,
  Download,
  Copy,
  Activity,
  History,
  Building,
  Mail,
  Phone,
  Briefcase,
  ShieldCheck,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useApp } from '../../context/AppContext';

export const ProfilePage = () => {
  const { currentUser } = useApp();

  // Active Tab: 'profile', 'security', 'preferences', 'activity'
  const [activeTab, setActiveTab] = useState('profile');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState('');
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // ----------------------------------------------------------------------
  // 1. PERSONAL INFO FORM STATE
  // ----------------------------------------------------------------------
  const [profileForm, setProfileForm] = useState({
    firstName: 'Alex',
    lastName: 'Morgan',
    email: currentUser.email || 'alex.morgan@domaindude.com',
    phone: '+91 98765 43210',
    role: currentUser.role || 'Managing Director & Lead Architect',
    department: currentUser.department || 'Executive Management',
    employeeId: 'EMP-2024-001',
    location: 'Headquarters — Bangalore, KA',
    bio: 'Lead software architect and executive director overseeing core product delivery, technical strategy, and client relations across SaaS applications.',
    avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  // ----------------------------------------------------------------------
  // 2. SECURITY STATE
  // ----------------------------------------------------------------------
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);

  const [activeSessions, setActiveSessions] = useState([
    {
      id: 'sess-1',
      device: 'Chrome 128 on macOS Sonoma',
      ip: '182.72.10.45',
      location: 'Mumbai, India',
      lastActive: 'Active Now',
      current: true,
      icon: Laptop,
    },
    {
      id: 'sess-2',
      device: 'Safari Mobile on iPhone 15 Pro',
      ip: '182.72.10.45',
      location: 'Mumbai, India',
      lastActive: '2 hours ago',
      current: false,
      icon: Smartphone,
    },
    {
      id: 'sess-3',
      device: 'Firefox 125 on Windows 11 Pro',
      ip: '106.210.44.12',
      location: 'Bangalore, India',
      lastActive: '3 days ago',
      current: false,
      icon: Laptop,
    },
  ]);

  // ----------------------------------------------------------------------
  // 3. PREFERENCES STATE
  // ----------------------------------------------------------------------
  const [prefState, setPrefState] = useState({
    theme: 'light',
    language: 'English (US)',
    timezone: 'Asia/Kolkata (UTC+05:30)',
    dateFormat: 'DD/MM/YYYY',
    currency: 'USD ($)',
    emailNotifs: true,
    desktopNotifs: true,
    weeklyDigest: true,
    soundAlerts: false,
  });

  // ----------------------------------------------------------------------
  // 4. ACTIVITY & AUDIT LOGS MOCK DATA
  // ----------------------------------------------------------------------
  const recentLogins = [
    { id: 'log-1', time: 'Today, 09:15 AM', ip: '182.72.10.45', location: 'Mumbai, India', device: 'Chrome / macOS', status: 'Success' },
    { id: 'log-2', time: 'Yesterday, 08:45 AM', ip: '182.72.10.45', location: 'Mumbai, India', device: 'Chrome / macOS', status: 'Success' },
    { id: 'log-3', time: 'Oct 02, 2026, 06:12 PM', ip: '182.72.10.45', location: 'Mumbai, India', device: 'Safari / iPhone 15', status: 'Success' },
    { id: 'log-4', time: 'Sep 29, 2026, 11:30 AM', ip: '106.210.44.12', location: 'Bangalore, India', device: 'Firefox / Windows 11', status: 'Success' },
  ];

  const recentActions = [
    { id: 'act-1', action: 'Approved Leave Request', detail: 'Sophia Chen (Annual Paid Leave - 4 Days)', time: '2 hours ago', category: 'HR' },
    { id: 'act-2', action: 'Issued Customer Invoice', detail: 'Invoice #INV-2026-104 for FinTech Nexus Corp ($24,500)', time: '5 hours ago', category: 'Finance' },
    { id: 'act-3', action: 'Created Commercial Proposal', detail: 'Proposal #PROP-2026-042 for Vertex Health App', time: 'Yesterday at 4:30 PM', category: 'Sales' },
    { id: 'act-4', action: 'Assigned Project Task', detail: '"Implement Stripe Webhook Handlers" assigned to Liam O\'Connor', time: 'Oct 02, 2026', category: 'Projects' },
    { id: 'act-5', action: 'Updated Security Credentials', detail: 'Password changed and 2FA verified', time: 'Sep 28, 2026', category: 'Security' },
  ];

  // Revoke Session Handler
  const handleRevokeSession = (sessionId) => {
    setActiveSessions(activeSessions.filter((s) => s.id !== sessionId));
    triggerToast('Session revoked successfully.');
  };

  const handleRevokeAllOtherSessions = () => {
    setActiveSessions(activeSessions.filter((s) => s.current));
    triggerToast('All other active sessions have been terminated.');
  };

  // Password Update Form Submit
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      triggerToast('Please fill in current and new password.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      triggerToast('New password and confirm password do not match.');
      return;
    }
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    triggerToast('Your password has been updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <PageHeader
        title="User Profile & Account"
        subtitle="Manage your personal profile, security credentials, active sessions, and system preferences."
      />

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 shadow-xl border border-slate-700 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HERO PROFILE HEADER BANNER */}
      <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xs overflow-hidden">
        {/* Background gradient banner */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-[#0066FF] via-indigo-600 to-purple-600" />

        <div className="relative pt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            {/* Avatar Container with Upload overlay */}
            <div className="relative shrink-0">
              <img
                src={profileForm.avatar}
                alt={profileForm.firstName}
                className="h-24 w-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
              />
              <button
                onClick={() => alert('Photo upload dialog...')}
                className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white shadow-md hover:bg-[#0066FF] transition-colors"
                title="Change Profile Photo"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">
                  {profileForm.firstName} {profileForm.lastName}
                </h1>
                <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-bold text-[#0066FF]">
                  Super Admin
                </span>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-600">{profileForm.role}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-slate-400" /> {profileForm.department}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> {profileForm.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400" /> {profileForm.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => triggerToast('Profile information synced.')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Quick Status
            </button>
          </div>
        </div>
      </div>

      {/* TAB NAVIGATION BAR */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        {[
          { id: 'profile', label: 'Profile & Info', icon: User },
          { id: 'security', label: 'Security & 2FA', icon: Lock },
          { id: 'preferences', label: 'Preferences', icon: Globe },
          { id: 'activity', label: 'Activity Logs', icon: History },
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#0066FF] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <TabIcon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* TAB 1: PROFILE / PERSONAL INFORMATION */}
      {/* =================================================================== */}
      {activeTab === 'profile' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Personal & Work Information</h3>
            <p className="text-xs text-slate-500">Update your account identity, contact details, and organization metadata.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Corporate Email Address *</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Role / Designation</label>
              <input
                type="text"
                readOnly
                value={profileForm.role}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-700 font-semibold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Department</label>
              <input
                type="text"
                readOnly
                value={profileForm.department}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-700 font-semibold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Employee ID</label>
              <input
                type="text"
                readOnly
                value={profileForm.employeeId}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-700 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Work Location</label>
              <input
                type="text"
                value={profileForm.location}
                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Executive Summary / Bio</label>
              <textarea
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => triggerToast('Personal profile information updated successfully!')}
              className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" /> Save Profile Details
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: SECURITY & AUTHENTICATION */}
      {/* =================================================================== */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* CHANGE PASSWORD FORM */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Change Account Password</h3>
              <p className="text-xs text-slate-500">Ensure your password is at least 8 characters with numbers and symbols.</p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs max-w-lg">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
                <div className="mt-1 flex items-center gap-2 text-[10px]">
                  <span className="text-slate-500">Password Strength:</span>
                  <span className="font-bold text-emerald-600">Strong</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                <Key className="h-4 w-4" /> Update Password
              </button>
            </form>
          </div>

          {/* TWO-FACTOR AUTHENTICATION (2FA) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Two-Factor Authentication (2FA)</h3>
                <p className="text-xs text-slate-500">Add an extra layer of security to your account using TOTP Authenticator Apps.</p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold border ${
                  twoFactorEnabled
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {twoFactorEnabled ? '2FA Enabled' : '2FA Disabled'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-[#0066FF]">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">TOTP Authenticator App</h4>
                  <p className="text-[11px] text-slate-500">Google Authenticator, 1Password, or Authy connected</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIs2FAModalOpen(true)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Configure 2FA
                </button>
                <button
                  onClick={() => {
                    setTwoFactorEnabled(!twoFactorEnabled);
                    triggerToast(twoFactorEnabled ? '2FA disabled.' : '2FA activated.');
                  }}
                  className={`h-6 w-11 rounded-full transition-colors p-0.5 ${
                    twoFactorEnabled ? 'bg-[#0066FF]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white transition-transform ${
                      twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* ACTIVE SESSIONS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Active Login Sessions</h3>
                <p className="text-xs text-slate-500">Devices currently logged into your Domain Dude Business OS account.</p>
              </div>

              {activeSessions.length > 1 && (
                <button
                  onClick={handleRevokeAllOtherSessions}
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                >
                  Revoke All Other Sessions
                </button>
              )}
            </div>

            <div className="space-y-3 text-xs">
              {activeSessions.map((session) => {
                const SessionIcon = session.icon;
                return (
                  <div
                    key={session.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 shrink-0">
                        <SessionIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900">{session.device}</h4>
                          {session.current && (
                            <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                              Current Device
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          IP: <strong className="font-mono text-slate-700">{session.ip}</strong> • Location: {session.location} • {session.lastActive}
                        </p>
                      </div>
                    </div>

                    {!session.current && (
                      <button
                        onClick={() => handleRevokeSession(session.id)}
                        className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 shrink-0"
                      >
                        <LogOut className="h-3.5 w-3.5" /> Revoke
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: PREFERENCES & LOCALIZATION */}
      {/* =================================================================== */}
      {activeTab === 'preferences' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">UI Theme & Regional Preferences</h3>
            <p className="text-xs text-slate-500">Configure visual mode, language localization, timezone, and notification channels.</p>
          </div>

          {/* Theme Selector Cards */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">Interface Theme</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'light', label: 'Light Mode', desc: 'Clean royal blue corporate look', icon: Sun },
                { id: 'dark', label: 'Dark Mode', desc: 'Sleek executive low-light theme', icon: Moon },
                { id: 'system', label: 'System Sync', desc: 'Matches system OS mode', icon: Monitor },
              ].map((theme) => {
                const ThemeIcon = theme.icon;
                const isSelected = prefState.theme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setPrefState({ ...prefState, theme: theme.id })}
                    className={`flex flex-col p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#0066FF] bg-blue-50/70 ring-1 ring-[#0066FF]'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <ThemeIcon className={`h-5 w-5 ${isSelected ? 'text-[#0066FF]' : 'text-slate-500'}`} />
                      <input
                        type="radio"
                        name="themePreference"
                        checked={isSelected}
                        onChange={() => setPrefState({ ...prefState, theme: theme.id })}
                        className="h-4 w-4 text-[#0066FF] focus:ring-[#0066FF]"
                      />
                    </div>
                    <span className="font-bold text-xs text-slate-900">{theme.label}</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">{theme.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language & Timezone Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Display Language</label>
              <select
                value={prefState.language}
                onChange={(e) => setPrefState({ ...prefState, language: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
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
              <label className="block font-semibold text-slate-700 mb-1">Timezone</label>
              <select
                value={prefState.timezone}
                onChange={(e) => setPrefState({ ...prefState, timezone: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
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
                value={prefState.dateFormat}
                onChange={(e) => setPrefState({ ...prefState, dateFormat: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 04/10/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-10-04)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 10/04/2026)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Base Currency Symbol</label>
              <select
                value={prefState.currency}
                onChange={(e) => setPrefState({ ...prefState, currency: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="USD ($)">USD ($) — US Dollar</option>
                <option value="INR (₹)">INR (₹) — Indian Rupee</option>
                <option value="EUR (€)">EUR (€) — Euro</option>
                <option value="GBP (£)">GBP (£) — British Pound</option>
              </select>
            </div>
          </div>

          {/* Notifications Toggles */}
          <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Personal Notification Channels</h4>

            {[
              { key: 'emailNotifs', title: 'Email Instant Notifications', desc: 'Receive real-time email alerts for direct mentions and assigned task deadlines' },
              { key: 'desktopNotifs', title: 'Browser Push Notifications', desc: 'Pop-up browser notifications when active on Domain Dude' },
              { key: 'weeklyDigest', title: 'Weekly Business Digest', desc: 'Receive a Monday morning summary report of project and financial KPIs' },
              { key: 'soundAlerts', title: 'In-App Sound Effects', desc: 'Play subtle audio chime on new notification popover' },
            ].map((nItem) => (
              <div key={nItem.key} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white">
                <div>
                  <h5 className="font-bold text-slate-900">{nItem.title}</h5>
                  <p className="text-[11px] text-slate-500">{nItem.desc}</p>
                </div>
                <button
                  onClick={() => setPrefState({ ...prefState, [nItem.key]: !prefState[nItem.key] })}
                  className={`h-6 w-11 rounded-full transition-colors p-0.5 ${
                    prefState[nItem.key] ? 'bg-[#0066FF]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white transition-transform ${
                      prefState[nItem.key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => triggerToast('Preferences saved successfully!')}
              className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" /> Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 4: ACTIVITY & AUDIT LOGS */}
      {/* =================================================================== */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          {/* RECENT ACTIONS LOG */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Operational Actions</h3>
                <p className="text-xs text-slate-500">Audit trail of your recent actions performed across business modules.</p>
              </div>
              <button
                onClick={() => triggerToast('Exporting activity log to CSV...')}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Download className="h-3.5 w-3.5" /> Export Log (CSV)
              </button>
            </div>

            <div className="relative pl-6 space-y-4 text-xs before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {recentActions.map((act) => (
                <div key={act.id} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all">
                  <div className="absolute -left-6 top-4 h-3 w-3 rounded-full bg-[#0066FF] ring-4 ring-white" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{act.action}</span>
                      <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 font-mono">
                        {act.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{act.detail}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 shrink-0">{act.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT LOGINS HISTORY */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Sign-in History</h3>
              <p className="text-xs text-slate-500">Log of recent successful login attempts and authenticated access points.</p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Device / Browser</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {recentLogins.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-slate-900">{log.time}</td>
                      <td className="p-3 font-mono">{log.ip}</td>
                      <td className="p-3">{log.location}</td>
                      <td className="p-3">{log.device}</td>
                      <td className="p-3 text-right">
                        <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: 2FA CONFIGURATION DIALOG */}
      {/* =================================================================== */}
      <Modal
        isOpen={is2FAModalOpen}
        onClose={() => setIs2FAModalOpen(false)}
        title="Configure Two-Factor Authentication (2FA)"
        subtitle="Scan QR code using Google Authenticator or 1Password app."
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs text-center">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 inline-block mx-auto">
            <div className="h-40 w-40 bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-center mx-auto shadow-2xs">
              <QrCode className="h-32 w-32 text-slate-900" />
            </div>
            <span className="text-[10px] text-slate-500 font-mono block mt-2">
              Secret Key: <strong className="text-slate-900">JBSWY3DPEHPK3PXP</strong>
            </span>
          </div>

          <div className="text-left space-y-2 bg-blue-50 p-3 rounded-xl border border-blue-200">
            <h5 className="font-bold text-blue-900">Backup Emergency Recovery Code</h5>
            <div className="flex items-center justify-between font-mono bg-white p-2 rounded border border-blue-200 text-slate-800 font-bold">
              <span>8492-1094-8271-9923</span>
              <button
                onClick={() => triggerToast('Recovery code copied to clipboard!')}
                className="text-[#0066FF] hover:underline flex items-center gap-1 font-sans text-xs"
              >
                <Copy className="h-3 w-3" /> Copy
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              onClick={() => setIs2FAModalOpen(false)}
              className="rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Done & Save 2FA
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
