import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Building2, Calendar, DollarSign, ArrowLeft, Shield, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Avatar } from '../../components/common/Avatar';

export const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees } = useApp();

  const employee = employees.find((e) => e.id === id) || employees[0];

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/employees')} className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to Employee Directory
      </button>

      <PageHeader
        title={employee.name}
        subtitle={`${employee.role} • ${employee.department} Department`}
      />

      {/* Main Profile Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar name={employee.name} src={employee.avatar} size="xl" status="online" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{employee.name}</h2>
              <StatusBadge status={employee.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-slate-400" /> {employee.department}
              <span className="text-slate-300">•</span> <MapPin className="h-3.5 w-3.5 text-slate-400" /> {employee.location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 text-xs">
          <div>
            <span className="text-slate-400">Annual Compensation</span>
            <p className="text-xl font-bold text-slate-900 mt-0.5">${employee.salary.toLocaleString()}/yr</p>
          </div>
          <div className="border-l border-slate-200 pl-6">
            <span className="text-slate-400">Leave Balance</span>
            <p className="text-xl font-bold text-indigo-600 mt-0.5">{employee.leaveBalance} Days</p>
          </div>
        </div>
      </div>

      {/* Info Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact & Work Profile</h3>
          
          <div className="flex items-center space-x-3 text-xs">
            <Mail className="h-4 w-4 text-slate-400" />
            <div>
              <span className="text-slate-400 text-[10px]">Email</span>
              <p className="font-semibold text-indigo-600">{employee.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <Phone className="h-4 w-4 text-slate-400" />
            <div>
              <span className="text-slate-400 text-[10px]">Phone</span>
              <p className="font-semibold text-slate-900">{employee.phone}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <Calendar className="h-4 w-4 text-slate-400" />
            <div>
              <span className="text-slate-400 text-[10px]">Joined Date</span>
              <p className="font-semibold text-slate-900">{employee.joiningDate}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">HR & Payroll Overview</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Employment Type</span>
              <span className="font-semibold text-slate-900">{employee.type}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Base Monthly Rate</span>
              <span className="font-semibold text-slate-900">${(employee.salary / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">System Role</span>
              <span className="font-semibold text-indigo-600">Full Operational Member</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
