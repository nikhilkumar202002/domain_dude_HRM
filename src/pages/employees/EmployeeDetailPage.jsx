import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  User,
  CheckSquare,
  Clock,
  FileText,
  Shield,
  Award,
  Download,
  Plus,
  Edit,
  TrendingUp,
  UserCheck,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Avatar } from '../../components/common/Avatar';
import { Tabs } from '../../components/common/Tabs';

export const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees, tasks, openQuickCreate } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'tasks' | 'attendance' | 'leave' | 'payroll' | 'documents' | 'activity'

  const employee = employees.find((e) => e.id === id) || employees[0];

  if (!employee) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Employee profile not found.</p>
        <button onClick={() => navigate('/employees')} className="mt-2 text-xs font-semibold text-[#0066FF]">
          Back to Employee Directory
        </button>
      </div>
    );
  }

  // Related tasks for this employee
  const employeeTasks = tasks.filter((t) => t.assignee?.name === employee.name);

  // Tabs List
  const tabsList = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, count: employeeTasks.length },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'leave', label: 'Leave', icon: Calendar, count: employee.leaveBalance },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
    { id: 'documents', label: 'Documents', icon: FileText, count: employee.documents?.length || 0 },
    { id: 'activity', label: 'Activity', icon: Clock, count: employee.activity?.length || 0 },
  ];

  // Financial Payroll Math
  const annualSalary = employee.salary || 1800000;
  const monthlyBase = Math.round(annualSalary / 12);
  const hraAllowance = Math.round(monthlyBase * 0.4);
  const specialAllowance = Math.round(monthlyBase * 0.2);
  const pfDeduction = Math.round(monthlyBase * 0.12);
  const taxDeduction = Math.round(monthlyBase * 0.08);
  const netMonthlyPay = monthlyBase + hraAllowance + specialAllowance - pfDeduction - taxDeduction;

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button */}
      <button
        onClick={() => navigate('/employees')}
        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Employee Directory
      </button>

      {/* Main Profile Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <Avatar name={employee.name} src={employee.avatar} size="xl" status={employee.status === 'Active' ? 'online' : 'away'} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{employee.name}</h1>
                <StatusBadge status={employee.status} />
              </div>
              <p className="text-xs font-semibold text-[#0066FF] mt-0.5">{employee.designation || employee.role}</p>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-slate-400" /> {employee.department} Department
                <span className="text-slate-300">•</span>
                <MapPin className="h-3.5 w-3.5 text-slate-400" /> {employee.location || 'Bangalore, India'}
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => openQuickCreate('task')}
              className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
            >
              <Plus className="h-3.5 w-3.5" /> Assign Task
            </button>
            <button
              onClick={() => alert(`Editing profile for ${employee.name}`)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
            >
              <Edit className="h-3.5 w-3.5 text-slate-500" /> Edit Profile
            </button>
            <button
              onClick={() => alert(`Downloading employee dossier for ${employee.name}`)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" /> Dossier PDF
            </button>
          </div>
        </div>

        {/* Header Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-100 text-xs">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Annual Compensation</span>
            <p className="text-lg font-bold text-slate-900 mt-0.5">₹{annualSalary.toLocaleString('en-IN')}/yr</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Leave Balance</span>
            <p className="text-lg font-bold text-[#0066FF] mt-0.5">{employee.leaveBalance || 18} Days Available</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
            <p className="text-lg font-bold text-emerald-600 mt-0.5">{employee.attendanceRate || '98.5%'}</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Reporting Manager</span>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{employee.manager || employee.reportingManager || 'Nikhil'}</p>
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
        <Tabs tabs={tabsList} activeTab={activeTab} onChange={setActiveTab} />

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Workload Section */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Workload & Capacity Utilization</h3>
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Current Workload Allocation</span>
                  <span className="font-bold text-[#0066FF]">{employee.workload || 75}%</span>
                </div>
                <ProgressBar progress={employee.workload || 75} size="sm" />
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Active Tasks</span>
                    <span className="font-bold text-slate-900">{employee.activeTasksCount || 5}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Completed Tasks</span>
                    <span className="font-bold text-emerald-600">{employee.completedTasksCount || 18}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Utilization Status</span>
                    <span className="font-bold text-blue-600">Optimal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal & Work Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Personal Information
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-[#0066FF]" />
                    <div>
                      <span className="text-slate-400 text-[10px] block font-medium">Work Email</span>
                      <p className="font-semibold text-slate-900">{employee.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-[#0066FF]" />
                    <div>
                      <span className="text-slate-400 text-[10px] block font-medium">Phone Number</span>
                      <p className="font-semibold text-slate-900">{employee.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-[#0066FF]" />
                    <div>
                      <span className="text-slate-400 text-[10px] block font-medium">Primary Office Location</span>
                      <p className="font-semibold text-slate-900">{employee.location || 'Bangalore, India'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Work Information
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Employee ID:</span>
                    <span className="font-bold text-slate-900">{employee.id}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-semibold text-slate-900">{employee.department}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Designation / Role:</span>
                    <span className="font-semibold text-[#0066FF]">{employee.designation || employee.role}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Reporting Manager:</span>
                    <span className="font-semibold text-slate-900">{employee.manager || employee.reportingManager || 'Nikhil'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Joining Date:</span>
                    <span className="font-semibold text-slate-900">{employee.joiningDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Employment Type:</span>
                    <span className="font-semibold text-slate-900">{employee.type || 'Full-Time'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TASKS */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Tasks & Deliverables</h3>
              <button
                onClick={() => openQuickCreate('task')}
                className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0066FF] hover:bg-blue-100 transition"
              >
                <Plus className="h-3.5 w-3.5" /> Assign Task
              </button>
            </div>

            <div className="space-y-2">
              {employeeTasks.length > 0 ? (
                employeeTasks.map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs hover:border-blue-200 transition">
                    <div className="flex items-center gap-3">
                      <CheckSquare className="h-4 w-4 text-[#0066FF]" />
                      <div>
                        <h4 className="font-bold text-slate-900">{t.title}</h4>
                        <p className="text-[11px] text-slate-400">Project: {t.project} • Due: {t.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={t.priority} size="xs" />
                      <StatusBadge status={t.status} size="xs" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                  No active tasks currently assigned to {employee.name}.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Log & Hours</h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Attendance Rate: {employee.attendanceRate || '98.5%'}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Clock In</th>
                    <th className="p-3">Clock Out</th>
                    <th className="p-3">Logged Hours</th>
                    <th className="p-3">Work Mode</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">2026-10-04</td>
                    <td className="p-3">08:45 AM</td>
                    <td className="p-3">06:15 PM</td>
                    <td className="p-3 font-bold text-slate-900">9.5 hrs</td>
                    <td className="p-3">On-site</td>
                    <td className="p-3"><StatusBadge status="Present" size="xs" /></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">2026-10-03</td>
                    <td className="p-3">09:02 AM</td>
                    <td className="p-3">05:50 PM</td>
                    <td className="p-3 font-bold text-slate-900">8.8 hrs</td>
                    <td className="p-3">Remote</td>
                    <td className="p-3"><StatusBadge status="Present" size="xs" /></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">2026-10-02</td>
                    <td className="p-3">08:55 AM</td>
                    <td className="p-3">06:00 PM</td>
                    <td className="p-3 font-bold text-slate-900">9.0 hrs</td>
                    <td className="p-3">On-site</td>
                    <td className="p-3"><StatusBadge status="Present" size="xs" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: LEAVE */}
        {activeTab === 'leave' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Casual Leave</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">8 Days</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sick Leave</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">6 Days</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Earned Vacation</span>
                <span className="text-xl font-bold text-[#0066FF] mt-1 block">{employee.leaveBalance || 14} Days</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PAYROLL */}
        {activeTab === 'payroll' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Salary & Compensation Breakdown</h3>
              <button
                onClick={() => alert(`Downloading Payslip for ${employee.name}`)}
                className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0066FF] hover:bg-blue-100 transition"
              >
                <Download className="h-3.5 w-3.5" /> Download Payslip (Sep 2026)
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3 text-xs max-w-md">
              <div className="flex justify-between text-slate-600">
                <span>Monthly Base Salary:</span>
                <span className="font-semibold text-slate-900">₹{monthlyBase.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>HRA Allowance:</span>
                <span className="font-semibold text-slate-900">+ ₹{hraAllowance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Special Allowance:</span>
                <span className="font-semibold text-slate-900">+ ₹{specialAllowance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Provident Fund (PF):</span>
                <span className="font-semibold">- ₹{pfDeduction.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>TDS Tax Deduction:</span>
                <span className="font-semibold">- ₹{taxDeduction.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-slate-900 text-sm">
                <span>Net Monthly Take-Home Pay:</span>
                <span className="text-emerald-600 text-base">₹{netMonthlyPay.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Employee Documents Repository</h3>

            <div className="space-y-2">
              {(employee.documents || []).length > 0 ? (
                employee.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-[#0066FF]" />
                      <div>
                        <h4 className="font-bold text-slate-900">{doc.name}</h4>
                        <p className="text-[11px] text-slate-400">{doc.size} • Uploaded on {doc.date}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Downloading document ${doc.name}`)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                  No employee documents uploaded yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: ACTIVITY */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">HR Activity Audit Feed</h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {(employee.activity || []).map((act) => (
                <div key={act.id} className="relative">
                  <div className="absolute -left-6 top-0 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold bg-blue-100 text-[#0066FF]">
                    ✓
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{act.label}</h4>
                      <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Logged by: {act.by}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
