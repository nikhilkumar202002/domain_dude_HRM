import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldCheck,
  Plus,
  Users,
  Check,
  X,
  Save,
  Search,
  Copy,
  RotateCcw,
  CheckCircle2,
  Lock,
  UserPlus,
  UserMinus,
  Globe,
  Building,
  Pin,
  User,
  Shield,
  HelpCircle,
  ChevronRight,
  Filter,
  CheckSquare,
  Square,
  Sparkles,
  Zap,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

// ----------------------------------------------------------------------
// INITIAL DATA SETUP
// ----------------------------------------------------------------------

const INITIAL_ROLES = [
  {
    id: 'super_admin',
    name: 'Super Admin',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    description: 'Unrestricted system-wide authority across all operational modules, financial ledgers, and security matrices.',
    dataAccess: 'All Records',
    isSystem: true,
    usersCount: 3,
    assignedUsers: [
      { id: 'usr-001', name: 'Alex Morgan', email: 'alex.morgan@domaindude.com', dept: 'Executive Management', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
      { id: 'usr-002', name: 'Sarah Jenkins', email: 's.jenkins@domaindude.com', dept: 'Executive Management', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
      { id: 'usr-003', name: 'David Vance', email: 'd.vance@domaindude.com', dept: 'Executive Management', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    ],
    specialPermissions: {
      manageUsers: true,
      manageRoles: true,
      managePayroll: true,
      approveLeave: true,
      approveExpenses: true,
      approveInvoices: true,
      exportReports: true,
    },
  },
  {
    id: 'admin',
    name: 'Admin',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    description: 'High-level administrative authority over company operations, staff directories, and workflow management.',
    dataAccess: 'All Records',
    isSystem: true,
    usersCount: 5,
    assignedUsers: [
      { id: 'usr-004', name: 'Marcus Vance', email: 'm.vance@domaindude.com', dept: 'Project Operations', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
      { id: 'usr-005', name: 'Elena Rostova', email: 'e.rostova@domaindude.com', dept: 'Operations', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
    ],
    specialPermissions: {
      manageUsers: true,
      manageRoles: false,
      managePayroll: true,
      approveLeave: true,
      approveExpenses: true,
      approveInvoices: true,
      exportReports: true,
    },
  },
  {
    id: 'hr_manager',
    name: 'HR Manager',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    description: 'Comprehensive control over employee management, attendance logs, leave approvals, and payroll processing.',
    dataAccess: 'Department Records',
    isSystem: false,
    usersCount: 4,
    assignedUsers: [
      { id: 'usr-007', name: 'Sophia Chen', email: 's.chen@domaindude.com', dept: 'Human Resources', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    ],
    specialPermissions: {
      manageUsers: true,
      manageRoles: false,
      managePayroll: true,
      approveLeave: true,
      approveExpenses: false,
      approveInvoices: false,
      exportReports: true,
    },
  },
  {
    id: 'project_manager',
    name: 'Project Manager',
    badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    description: 'Manages project lifecycle, task assignments, sprint timelines, client communications, and team resource utilization.',
    dataAccess: 'Assigned Records',
    isSystem: false,
    usersCount: 6,
    assignedUsers: [
      { id: 'usr-011', name: "Liam O'Connor", email: 'l.oconnor@domaindude.com', dept: 'Engineering & Tech', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
      { id: 'usr-012', name: 'Rachel Green', email: 'r.green@domaindude.com', dept: 'Product Delivery', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
    ],
    specialPermissions: {
      manageUsers: false,
      manageRoles: false,
      managePayroll: false,
      approveLeave: true,
      approveExpenses: true,
      approveInvoices: false,
      exportReports: true,
    },
  },
  {
    id: 'team_leader',
    name: 'Team Leader',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
    description: 'Leads functional teams, supervises daily task delivery, tracks attendance, and reviews preliminary leave requests.',
    dataAccess: 'Department Records',
    isSystem: false,
    usersCount: 5,
    assignedUsers: [
      { id: 'usr-016', name: 'Priya Sharma', email: 'p.sharma@domaindude.com', dept: 'Quality Assurance', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
    ],
    specialPermissions: {
      manageUsers: false,
      manageRoles: false,
      managePayroll: false,
      approveLeave: true,
      approveExpenses: false,
      approveInvoices: false,
      exportReports: false,
    },
  },
  {
    id: 'accounts',
    name: 'Accounts',
    badgeColor: 'bg-teal-100 text-teal-700 border-teal-200',
    description: 'Manages customer invoicing, payment recording, vendor expenses, financial ledger auditing, and payroll execution.',
    dataAccess: 'All Records',
    isSystem: false,
    usersCount: 3,
    assignedUsers: [
      { id: 'usr-020', name: 'Vikram Mehta', email: 'v.mehta@domaindude.com', dept: 'Finance & Accounting', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
    ],
    specialPermissions: {
      manageUsers: false,
      manageRoles: false,
      managePayroll: true,
      approveLeave: false,
      approveExpenses: true,
      approveInvoices: true,
      exportReports: true,
    },
  },
  {
    id: 'sales',
    name: 'Sales',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    description: 'Drives business development, customer enquiry intake, proposal drafting, client relation management, and deal closings.',
    dataAccess: 'Assigned Records',
    isSystem: false,
    usersCount: 4,
    assignedUsers: [
      { id: 'usr-023', name: 'Jason Miller', email: 'j.miller@domaindude.com', dept: 'Business Development', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
    ],
    specialPermissions: {
      manageUsers: false,
      manageRoles: false,
      managePayroll: false,
      approveLeave: false,
      approveExpenses: false,
      approveInvoices: false,
      exportReports: true,
    },
  },
  {
    id: 'employee',
    name: 'Employee',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    description: 'Standard team member access to assigned tasks, work schedules, clock-in logs, and personal leave applications.',
    dataAccess: 'Own Records',
    isSystem: true,
    usersCount: 12,
    assignedUsers: [
      { id: 'usr-027', name: 'Carlos Gomez', email: 'c.gomez@domaindude.com', dept: 'Software Engineering', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80' },
      { id: 'usr-028', name: 'Anita Desai', email: 'a.desai@domaindude.com', dept: 'UI/UX Design', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    ],
    specialPermissions: {
      manageUsers: false,
      manageRoles: false,
      managePayroll: false,
      approveLeave: false,
      approveExpenses: false,
      approveInvoices: false,
      exportReports: false,
    },
  },
];

const ALL_MODULES = [
  { id: 'Dashboard', name: 'Dashboard', category: 'General' },
  { id: 'Enquiries', name: 'Enquiries & Leads', category: 'Sales' },
  { id: 'Clients', name: 'Clients Directory', category: 'Sales' },
  { id: 'Proposals', name: 'Commercial Proposals', category: 'Sales' },
  { id: 'Projects', name: 'Projects Delivery', category: 'Projects' },
  { id: 'Tasks', name: 'Tasks Management', category: 'Projects' },
  { id: 'Work Schedule', name: 'Work Schedule', category: 'Projects' },
  { id: 'Employees', name: 'Employees Directory', category: 'People' },
  { id: 'Attendance', name: 'Attendance & Clock-in', category: 'People' },
  { id: 'Leave', name: 'Leave Applications', category: 'People' },
  { id: 'Payroll', name: 'Payroll & Salaries', category: 'People' },
  { id: 'Invoices', name: 'Invoices & Billing', category: 'Finance' },
  { id: 'Payments', name: 'Payments & Receipts', category: 'Finance' },
  { id: 'Expenses', name: 'Expense Claims', category: 'Finance' },
  { id: 'Reports', name: 'Business Reports', category: 'Insights' },
  { id: 'Settings', name: 'System Settings', category: 'System' },
];

const PERM_ACTIONS = [
  { key: 'view', label: 'View', tooltip: 'Can view records and list views' },
  { key: 'create', label: 'Create', tooltip: 'Can create new records' },
  { key: 'edit', label: 'Edit', tooltip: 'Can modify existing records' },
  { key: 'delete', label: 'Delete', tooltip: 'Can delete or archive records' },
  { key: 'approve', label: 'Approve', tooltip: 'Can approve workflows and submissions' },
  { key: 'export', label: 'Export', tooltip: 'Can export CSV/PDF reports' },
  { key: 'assign', label: 'Assign', tooltip: 'Can assign tasks or ownership' },
];

// Helper to construct default matrix per role
const buildDefaultMatrix = () => {
  const matrix = {};
  INITIAL_ROLES.forEach((role) => {
    matrix[role.id] = {};
    ALL_MODULES.forEach((mod) => {
      if (role.id === 'super_admin') {
        matrix[role.id][mod.id] = { view: true, create: true, edit: true, delete: true, approve: true, export: true, assign: true };
      } else if (role.id === 'admin') {
        matrix[role.id][mod.id] = { view: true, create: true, edit: true, delete: mod.id !== 'Settings', approve: true, export: true, assign: true };
      } else if (role.id === 'hr_manager') {
        const isHR = ['Employees', 'Attendance', 'Leave', 'Payroll', 'Reports', 'Dashboard'].includes(mod.id);
        matrix[role.id][mod.id] = {
          view: true,
          create: isHR,
          edit: isHR,
          delete: isHR && mod.id !== 'Payroll',
          approve: isHR,
          export: isHR,
          assign: isHR,
        };
      } else if (role.id === 'project_manager') {
        const isProj = ['Projects', 'Tasks', 'Work Schedule', 'Clients', 'Proposals', 'Dashboard', 'Reports'].includes(mod.id);
        matrix[role.id][mod.id] = {
          view: true,
          create: isProj,
          edit: isProj,
          delete: ['Tasks', 'Proposals'].includes(mod.id),
          approve: ['Tasks', 'Leave'].includes(mod.id),
          export: isProj,
          assign: isProj,
        };
      } else if (role.id === 'accounts') {
        const isFin = ['Invoices', 'Payments', 'Expenses', 'Payroll', 'Reports', 'Clients'].includes(mod.id);
        matrix[role.id][mod.id] = {
          view: true,
          create: isFin,
          edit: isFin,
          delete: ['Expenses'].includes(mod.id),
          approve: isFin,
          export: isFin,
          assign: false,
        };
      } else if (role.id === 'sales') {
        const isSales = ['Enquiries', 'Clients', 'Proposals', 'Dashboard', 'Reports'].includes(mod.id);
        matrix[role.id][mod.id] = {
          view: isSales || mod.id === 'Projects',
          create: isSales,
          edit: isSales,
          delete: mod.id === 'Proposals',
          approve: false,
          export: isSales,
          assign: isSales,
        };
      } else if (role.id === 'team_leader') {
        const isTeam = ['Projects', 'Tasks', 'Work Schedule', 'Attendance', 'Leave'].includes(mod.id);
        matrix[role.id][mod.id] = {
          view: true,
          create: ['Tasks', 'Work Schedule'].includes(mod.id),
          edit: ['Tasks', 'Work Schedule'].includes(mod.id),
          delete: false,
          approve: ['Leave', 'Tasks'].includes(mod.id),
          export: isTeam,
          assign: ['Tasks'].includes(mod.id),
        };
      } else {
        // Employee
        const isOwn = ['Dashboard', 'Tasks', 'Work Schedule', 'Attendance', 'Leave'].includes(mod.id);
        matrix[role.id][mod.id] = {
          view: isOwn,
          create: ['Leave', 'Attendance'].includes(mod.id),
          edit: ['Tasks'].includes(mod.id),
          delete: false,
          approve: false,
          export: false,
          assign: false,
        };
      }
    });
  });
  return matrix;
};

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export const RolesSettingsPage = () => {
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState('project_manager');
  const [permissionMatrix, setPermissionMatrix] = useState(buildDefaultMatrix);
  const [searchModuleQuery, setSearchModuleQuery] = useState('');
  const [searchRoleQuery, setSearchRoleQuery] = useState('');
  
  // Dirty state tracking for Save button feedback
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Modals state
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [newRoleForm, setNewRoleForm] = useState({ name: '', description: '', cloneFrom: 'project_manager', dataAccess: 'Assigned Records' });
  const [isAssignUserModalOpen, setIsAssignUserModalOpen] = useState(false);
  const [newAssignEmail, setNewAssignEmail] = useState('');

  // Currently Selected Role Object
  const selectedRole = useMemo(() => {
    return roles.find((r) => r.id === selectedRoleId) || roles[0];
  }, [roles, selectedRoleId]);

  // Trigger toast alert
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Toggle single cell permission
  const handleTogglePermission = (modId, actionKey) => {
    if (selectedRole.id === 'super_admin') {
      triggerToast('Super Admin permissions are fixed and cannot be revoked.');
      return;
    }
    setPermissionMatrix((prev) => {
      const currentRoleMatrix = { ...prev[selectedRoleId] };
      const currentModPermissions = { ...currentRoleMatrix[modId] };
      currentModPermissions[actionKey] = !currentModPermissions[actionKey];

      // Auto view dependency check: if user enables create/edit/delete, auto-enable view
      if (!currentModPermissions.view && (actionKey === 'create' || actionKey === 'edit' || actionKey === 'delete')) {
        currentModPermissions.view = true;
      }

      currentRoleMatrix[modId] = currentModPermissions;
      return { ...prev, [selectedRoleId]: currentRoleMatrix };
    });
    setIsDirty(true);
  };

  // Toggle entire row (module)
  const handleToggleRow = (modId) => {
    if (selectedRole.id === 'super_admin') return;
    setPermissionMatrix((prev) => {
      const currentRoleMatrix = { ...prev[selectedRoleId] };
      const currentMod = currentRoleMatrix[modId];
      const allTrue = PERM_ACTIONS.every((act) => currentMod[act.key]);
      const nextState = !allTrue;

      const newModPerms = {};
      PERM_ACTIONS.forEach((act) => {
        newModPerms[act.key] = nextState;
      });

      currentRoleMatrix[modId] = newModPerms;
      return { ...prev, [selectedRoleId]: currentRoleMatrix };
    });
    setIsDirty(true);
  };

  // Toggle entire column (action)
  const handleToggleColumn = (actionKey) => {
    if (selectedRole.id === 'super_admin') return;
    setPermissionMatrix((prev) => {
      const currentRoleMatrix = { ...prev[selectedRoleId] };
      const allColTrue = ALL_MODULES.every((mod) => currentRoleMatrix[mod.id]?.[actionKey]);
      const nextState = !allColTrue;

      ALL_MODULES.forEach((mod) => {
        currentRoleMatrix[mod.id] = {
          ...currentRoleMatrix[mod.id],
          [actionKey]: nextState,
          ...(nextState && actionKey !== 'view' ? { view: true } : {}),
        };
      });

      return { ...prev, [selectedRoleId]: currentRoleMatrix };
    });
    setIsDirty(true);
  };

  // Preset Actions: Full Access, Read-Only, Clear
  const applyPreset = (presetType) => {
    if (selectedRole.id === 'super_admin') return;
    setPermissionMatrix((prev) => {
      const currentRoleMatrix = { ...prev[selectedRoleId] };
      ALL_MODULES.forEach((mod) => {
        if (presetType === 'full') {
          currentRoleMatrix[mod.id] = { view: true, create: true, edit: true, delete: true, approve: true, export: true, assign: true };
        } else if (presetType === 'readonly') {
          currentRoleMatrix[mod.id] = { view: true, create: false, edit: false, delete: false, approve: false, export: true, assign: false };
        } else if (presetType === 'clear') {
          currentRoleMatrix[mod.id] = { view: false, create: false, edit: false, delete: false, approve: false, export: false, assign: false };
        }
      });
      return { ...prev, [selectedRoleId]: currentRoleMatrix };
    });
    setIsDirty(true);
    triggerToast(`Applied '${presetType.toUpperCase()}' permission preset to ${selectedRole.name}.`);
  };

  // Advanced Data Access Scope update
  const handleUpdateDataAccess = (scope) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === selectedRoleId ? { ...r, dataAccess: scope } : r))
    );
    setIsDirty(true);
  };

  // Special permissions toggle
  const handleToggleSpecialPerm = (permKey) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id === selectedRoleId) {
          return {
            ...r,
            specialPermissions: {
              ...r.specialPermissions,
              [permKey]: !r.specialPermissions?.[permKey],
            },
          };
        }
        return r;
      })
    );
    setIsDirty(true);
  };

  // Save changes action
  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      triggerToast(`Successfully saved role & permission configurations for ${selectedRole.name}!`);
    }, 600);
  };

  // Create new Role
  const handleCreateRole = (e) => {
    e.preventDefault();
    if (!newRoleForm.name.trim()) return;

    const newId = `role_${Date.now()}`;
    const clonedMatrix = { ...permissionMatrix[newRoleForm.cloneFrom] };

    const newRoleObj = {
      id: newId,
      name: newRoleForm.name,
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      description: newRoleForm.description || 'Custom role created for specialized workflow permissions.',
      dataAccess: newRoleForm.dataAccess || 'Assigned Records',
      isSystem: false,
      usersCount: 0,
      assignedUsers: [],
      specialPermissions: {
        manageUsers: false,
        manageRoles: false,
        managePayroll: false,
        approveLeave: false,
        approveExpenses: false,
        approveInvoices: false,
        exportReports: true,
      },
    };

    setRoles((prev) => [...prev, newRoleObj]);
    setPermissionMatrix((prev) => ({ ...prev, [newId]: clonedMatrix }));
    setSelectedRoleId(newId);
    setIsCreateRoleModalOpen(false);
    setNewRoleForm({ name: '', description: '', cloneFrom: 'project_manager', dataAccess: 'Assigned Records' });
    triggerToast(`Role '${newRoleForm.name}' created successfully!`);
  };

  // Assign user to role
  const handleAssignUser = (e) => {
    e.preventDefault();
    if (!newAssignEmail.trim()) return;

    const newUserObj = {
      id: `usr-${Date.now()}`,
      name: newAssignEmail.split('@')[0].replace('.', ' '),
      email: newAssignEmail,
      dept: 'Engineering & Product',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };

    setRoles((prev) =>
      prev.map((r) => {
        if (r.id === selectedRoleId) {
          return {
            ...r,
            usersCount: r.usersCount + 1,
            assignedUsers: [...r.assignedUsers, newUserObj],
          };
        }
        return r;
      })
    );
    setNewAssignEmail('');
    setIsAssignUserModalOpen(false);
    triggerToast(`Assigned ${newUserObj.email} to ${selectedRole.name}!`);
  };

  // Remove assigned user
  const handleRemoveUser = (userId) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id === selectedRoleId) {
          return {
            ...r,
            usersCount: Math.max(0, r.usersCount - 1),
            assignedUsers: r.assignedUsers.filter((u) => u.id !== userId),
          };
        }
        return r;
      })
    );
    triggerToast(`User removed from ${selectedRole.name}.`);
  };

  // Filtered Modules for Search
  const filteredModules = useMemo(() => {
    if (!searchModuleQuery.trim()) return ALL_MODULES;
    return ALL_MODULES.filter(
      (m) =>
        m.name.toLowerCase().includes(searchModuleQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchModuleQuery.toLowerCase())
    );
  }, [searchModuleQuery]);

  // Filtered Roles for left panel
  const filteredRoles = useMemo(() => {
    if (!searchRoleQuery.trim()) return roles;
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(searchRoleQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchRoleQuery.toLowerCase())
    );
  }, [roles, searchRoleQuery]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Roles & Permissions"
        subtitle="Control exactly what each user can view, create, edit, approve, and delete across all 16 business modules."
        actions={
          <div className="flex items-center gap-2">
            {isDirty && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 animate-pulse">
                <Sparkles className="h-3.5 w-3.5" /> Unsaved changes
              </span>
            )}
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all ${
                isDirty ? 'bg-[#0066FF] hover:bg-blue-700' : 'bg-slate-700 hover:bg-slate-800'
              }`}
            >
              <Save className="h-3.5 w-3.5" />
              {isSaving ? 'Saving Changes...' : 'Save Permissions'}
            </button>
          </div>
        }
      />

      {/* TOAST FEEDBACK */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 shadow-xl border border-slate-700 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* NAVIGATION SUB-BAR */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <NavLink to="/settings" className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50">
          General Settings
        </NavLink>
        <NavLink to="/settings/roles" className="rounded-lg bg-[#0066FF] px-3.5 py-1.5 text-white shadow-xs">
          Roles & Permissions Matrix
        </NavLink>
        <NavLink to="/settings/permissions" className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50">
          Global Permission Matrix
        </NavLink>
      </div>

      {/* 2-COLUMN ENTERPRISE LAYOUT: LEFT SIDEBAR (ROLES) + RIGHT CONTENT (PERMISSION MATRIX & ACCESS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =================================================================== */}
        {/* LEFT PANEL: ROLES SELECTOR & CREATE ROLE */}
        {/* =================================================================== */}
        <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs space-y-3 sticky top-20">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Security Roles</h3>
            <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {roles.length} Roles
            </span>
          </div>

          {/* Quick Search Roles */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchRoleQuery}
              onChange={(e) => setSearchRoleQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Role Cards / List */}
          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredRoles.map((role) => {
              const isSelected = role.id === selectedRoleId;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all space-y-1.5 ${
                    isSelected
                      ? 'border-[#0066FF] bg-blue-50/70 shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className={`h-4 w-4 ${isSelected ? 'text-[#0066FF]' : 'text-slate-500'}`} />
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#0066FF]' : 'text-slate-900'}`}>
                        {role.name}
                      </span>
                    </div>
                    {role.isSystem && (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        System
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-1">{role.description}</p>

                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {role.usersCount} Users
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">{role.dataAccess}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Create Role Button */}
          <button
            onClick={() => setIsCreateRoleModalOpen(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-blue-400 bg-blue-50/50 px-3 py-2 text-xs font-bold text-[#0066FF] hover:bg-blue-100/60 transition-colors"
          >
            <Plus className="h-4 w-4" /> Create Custom Role
          </button>
        </div>

        {/* =================================================================== */}
        {/* RIGHT PANEL: SELECTED ROLE PERMISSIONS & MATRIX */}
        {/* =================================================================== */}
        <div className="lg:col-span-9 space-y-6">
          {/* ROLE OVERVIEW CARD */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-extrabold text-slate-900">{selectedRole.name}</h2>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${selectedRole.badgeColor}`}>
                    {selectedRole.isSystem ? 'System Core Role' : 'Custom Config Role'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{selectedRole.description}</p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => applyPreset('full')}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  title="Enable all permissions"
                >
                  <Zap className="h-3.5 w-3.5 text-amber-500" /> Grant Full
                </button>
                <button
                  onClick={() => applyPreset('readonly')}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  title="Enable view-only permissions"
                >
                  <Square className="h-3.5 w-3.5 text-blue-500" /> Read-Only
                </button>
                <button
                  onClick={() => applyPreset('clear')}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  title="Revoke all matrix permissions"
                >
                  <X className="h-3.5 w-3.5" /> Clear All
                </button>
              </div>
            </div>

            {/* SECTION 1: ADVANCED DATA ACCESS SCOPE */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-[#0066FF]" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Advanced Data Access Scope</h4>
              </div>
              <p className="text-xs text-slate-500">Defines data boundary limits for users assigned to this role.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                {[
                  { key: 'All Records', label: 'All Records', desc: 'Unrestricted access to all company data', icon: Globe },
                  { key: 'Department Records', label: 'Department Records', desc: 'Restricted to user department data', icon: Building },
                  { key: 'Assigned Records', label: 'Assigned Records', desc: 'Restricted to records assigned to user/team', icon: Pin },
                  { key: 'Own Records', label: 'Own Records', desc: 'Strictly personal created records only', icon: User },
                ].map((scope) => {
                  const ScopeIcon = scope.icon;
                  const isChecked = selectedRole.dataAccess === scope.key;
                  return (
                    <button
                      key={scope.key}
                      onClick={() => handleUpdateDataAccess(scope.key)}
                      className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                        isChecked
                          ? 'border-[#0066FF] bg-blue-50/70 ring-1 ring-[#0066FF]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                          <ScopeIcon className="h-3.5 w-3.5 text-slate-600" />
                          <span>{scope.label}</span>
                        </div>
                        <input
                          type="radio"
                          name="dataAccessScope"
                          checked={isChecked}
                          onChange={() => handleUpdateDataAccess(scope.key)}
                          className="h-3.5 w-3.5 text-[#0066FF] focus:ring-[#0066FF]"
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 leading-snug">{scope.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: SPECIAL SYSTEM PERMISSIONS */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Special Administrative Privileges</h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1">
                {[
                  { key: 'manageUsers', label: 'Manage Users', desc: 'Add/Deactivate users' },
                  { key: 'manageRoles', label: 'Manage Roles', desc: 'Modify RBAC matrix' },
                  { key: 'managePayroll', label: 'Manage Payroll', desc: 'Process salaries & TDS' },
                  { key: 'approveLeave', label: 'Approve Leave', desc: 'Approve leave requests' },
                  { key: 'approveExpenses', label: 'Approve Expenses', desc: 'Approve claims' },
                  { key: 'approveInvoices', label: 'Approve Invoices', desc: 'Approve billing' },
                  { key: 'exportReports', label: 'Export Reports', desc: 'CSV / PDF downloads' },
                ].map((sp) => {
                  const isEnabled = selectedRole.specialPermissions?.[sp.key];
                  return (
                    <button
                      key={sp.key}
                      onClick={() => handleToggleSpecialPerm(sp.key)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition-all ${
                        isEnabled
                          ? 'border-emerald-300 bg-emerald-50/60 font-semibold text-emerald-900'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <span className="block font-bold">{sp.label}</span>
                        <span className="text-[10px] text-slate-500">{sp.desc}</span>
                      </div>
                      <div
                        className={`h-4 w-4 rounded flex items-center justify-center border shrink-0 ${
                          isEnabled ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isEnabled && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =================================================================== */}
          {/* SECTION 3: THE PERMISSION MATRIX TABLE */}
          {/* =================================================================== */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden space-y-3 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Module Permission Matrix</h3>
                <p className="text-xs text-slate-500">Configure granular View, Create, Edit, Delete, Approve, Export & Assign capabilities for all 16 modules.</p>
              </div>

              {/* Module Search Filter */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter 16 modules..."
                  value={searchModuleQuery}
                  onChange={(e) => setSearchModuleQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* MATRIX TABLE */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5 min-w-[200px]">Module / Subsystem</th>
                    {PERM_ACTIONS.map((act) => (
                      <th key={act.key} className="p-3.5 text-center min-w-[90px]">
                        <div className="flex flex-col items-center gap-1">
                          <span>{act.label}</span>
                          <button
                            onClick={() => handleToggleColumn(act.key)}
                            className="text-[9px] font-medium text-[#0066FF] hover:underline"
                            title={`Toggle all ${act.label} checkboxes`}
                          >
                            All
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredModules.map((mod) => {
                    const modPerms = permissionMatrix[selectedRoleId]?.[mod.id] || {};
                    const isRowAll = PERM_ACTIONS.every((a) => modPerms[a.key]);

                    return (
                      <tr key={mod.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Module Title */}
                        <td className="p-3.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-slate-900 block">{mod.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{mod.category}</span>
                            </div>
                            <button
                              onClick={() => handleToggleRow(mod.id)}
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-colors ${
                                isRowAll
                                  ? 'bg-blue-100 text-[#0066FF] hover:bg-blue-200'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                              title="Toggle all actions for this row"
                            >
                              {isRowAll ? 'All On' : 'Row All'}
                            </button>
                          </div>
                        </td>

                        {/* 7 Action Checkboxes */}
                        {PERM_ACTIONS.map((act) => {
                          const checked = !!modPerms[act.key];
                          return (
                            <td key={act.key} className="p-3.5 text-center">
                              <label className="inline-flex items-center justify-center cursor-pointer p-1 rounded hover:bg-blue-50 transition-all">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => handleTogglePermission(mod.id, act.key)}
                                  className="h-4 w-4 rounded border-slate-300 text-[#0066FF] focus:ring-[#0066FF] cursor-pointer"
                                />
                              </label>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* =================================================================== */}
          {/* SECTION 4: USER ASSIGNMENT PANEL */}
          {/* =================================================================== */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Users Assigned to {selectedRole.name}</h3>
                <p className="text-xs text-slate-500">
                  {selectedRole.assignedUsers.length} active team members inherit this role's permission matrix.
                </p>
              </div>
              <button
                onClick={() => setIsAssignUserModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
              >
                <UserPlus className="h-3.5 w-3.5" /> Assign User
              </button>
            </div>

            {selectedRole.assignedUsers.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                No users are currently assigned to {selectedRole.name}. Click "Assign User" to add team members.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedRole.assignedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-2xs transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover border border-white shadow-2xs" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{user.name}</h4>
                        <p className="text-[11px] text-slate-500">{user.dept}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveUser(user.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      title="Remove user from role"
                    >
                      <UserMinus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MODAL 1: CREATE CUSTOM ROLE */}
      {/* =================================================================== */}
      <Modal
        isOpen={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
        title="Create New Custom Security Role"
        subtitle="Define a custom role title and copy base permissions from an existing role preset."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Role Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Senior QA Lead, Compliance Auditor"
              value={newRoleForm.name}
              onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Role Description</label>
            <textarea
              rows={2}
              placeholder="Explain the scope and responsibilities of this custom role..."
              value={newRoleForm.description}
              onChange={(e) => setNewRoleForm({ ...newRoleForm, description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Copy Permissions From Preset</label>
            <select
              value={newRoleForm.cloneFrom}
              onChange={(e) => setNewRoleForm({ ...newRoleForm, cloneFrom: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.dataAccess})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Data Access Boundary</label>
            <select
              value={newRoleForm.dataAccess}
              onChange={(e) => setNewRoleForm({ ...newRoleForm, dataAccess: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            >
              <option value="All Records">All Records (Unrestricted)</option>
              <option value="Department Records">Department Records</option>
              <option value="Assigned Records">Assigned Records</option>
              <option value="Own Records">Own Records</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateRoleModalOpen(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Create Role
            </button>
          </div>
        </form>
      </Modal>

      {/* =================================================================== */}
      {/* MODAL 2: ASSIGN USER TO ROLE */}
      {/* =================================================================== */}
      <Modal
        isOpen={isAssignUserModalOpen}
        onClose={() => setIsAssignUserModalOpen(false)}
        title={`Assign User to ${selectedRole.name}`}
        subtitle="Search user by corporate email to attach them to this security role."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAssignUser} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Employee Email Address *</label>
            <input
              type="email"
              required
              placeholder="employee@domaindude.com"
              value={newAssignEmail}
              onChange={(e) => setNewAssignEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAssignUserModalOpen(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Assign Role
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
