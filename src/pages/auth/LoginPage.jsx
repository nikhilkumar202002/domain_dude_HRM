import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  X,
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const LoginPage = () => {
  const navigate = useNavigate();

  // Form State
  const [email, setEmail] = useState('alex.morgan@domaindude.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Forgot Password Modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Handle Login Submit
  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    // Simulate authenticating against backend API
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  // Demo Role Presets
  const applyDemoRole = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('demoPass123!');
  };

  // Handle Forgot Password
  const handleSendReset = (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setIsForgotModalOpen(false);
      setResetEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans antialiased flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* CENTERED LOGIN CARD */}
      <div className="w-full max-w-md space-y-6">
        {/* BRAND LOGO HEADER */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0066FF] text-white shadow-lg shadow-blue-500/20 mb-1">
            <ShieldCheck className="h-7 w-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Domain Dude</h1>
          <p className="text-xs font-semibold text-slate-500">Business Operations Platform</p>
        </div>

        {/* MAIN LOGIN CARD */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Sign in to your account</h2>
            <p className="text-xs text-slate-500">
              Enter your corporate email and password to access your workspace.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700 flex items-center gap-2">
              <X className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* EMAIL FIELD */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Corporate Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2.5 text-xs text-slate-900 shadow-2xs focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs font-semibold text-[#0066FF] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-10 py-2.5 text-xs text-slate-900 shadow-2xs focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* REMEMBER ME OPTION */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#0066FF] focus:ring-[#0066FF] cursor-pointer"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            {/* SIGN IN BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <span>Sign in to Workspace</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* DEMO LOGIN PRESETS */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Quick Demo Login Presets
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => applyDemoRole('alex.morgan@domaindude.com')}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-all"
              >
                <span className="font-bold text-slate-900 block truncate">Alex Morgan</span>
                <span className="text-[10px] text-blue-600 font-semibold block">Super Admin</span>
              </button>

              <button
                type="button"
                onClick={() => applyDemoRole('s.chen@domaindude.com')}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-all"
              >
                <span className="font-bold text-slate-900 block truncate">Sophia Chen</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">HR Manager</span>
              </button>

              <button
                type="button"
                onClick={() => applyDemoRole('l.oconnor@domaindude.com')}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-all"
              >
                <span className="font-bold text-slate-900 block truncate">Liam O'Connor</span>
                <span className="text-[10px] text-indigo-600 font-semibold block">Project Lead</span>
              </button>

              <button
                type="button"
                onClick={() => applyDemoRole('v.mehta@domaindude.com')}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-all"
              >
                <span className="font-bold text-slate-900 block truncate">Vikram Mehta</span>
                <span className="text-[10px] text-teal-600 font-semibold block">Accounts</span>
              </button>
            </div>
          </div>

          {/* SECURITY FOOTER TEXT */}
          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <Lock className="h-3 w-3 text-slate-400" />
              <span>Protected by 256-bit SSL encryption. Encrypted enterprise authentication.</span>
            </p>
          </div>
        </div>

        {/* FOOTER LINKS */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-slate-800 hover:underline">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-slate-800 hover:underline">
            Terms of Service
          </a>
          <span>•</span>
          <a href="#security" onClick={(e) => e.preventDefault()} className="hover:text-slate-800 hover:underline">
            Security Overview
          </a>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Reset Account Password"
        subtitle="Enter your corporate email address to receive password reset instructions."
        maxWidth="max-w-md"
      >
        {resetSent ? (
          <div className="p-6 text-center space-y-3 text-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto">
              <Check className="h-6 w-6 stroke-[3]" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Reset Link Dispatched</h4>
            <p className="text-slate-500">
              We have sent password recovery instructions to <strong>{resetEmail}</strong>. Please check your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendReset} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Corporate Email Address *</label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-[#0066FF] focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Send Instructions
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
