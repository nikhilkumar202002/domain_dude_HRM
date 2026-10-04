import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/common/AppShell';

import { DashboardPage } from './pages/DashboardPage';
import { EnquiriesListPage } from './pages/enquiries/EnquiriesListPage';
import { EnquiryDetailPage } from './pages/enquiries/EnquiryDetailPage';
import { ClientsListPage } from './pages/clients/ClientsListPage';
import { ClientDetailPage } from './pages/clients/ClientDetailPage';
import { ProposalsListPage } from './pages/proposals/ProposalsListPage';
import { ProposalDetailPage } from './pages/proposals/ProposalDetailPage';
import { ProjectsListPage } from './pages/projects/ProjectsListPage';
import { ProjectDetailPage } from './pages/projects/ProjectDetailPage';
import { TasksPage } from './pages/tasks/TasksPage';
import { SchedulePage } from './pages/schedule/SchedulePage';
import { EmployeesListPage } from './pages/employees/EmployeesListPage';
import { EmployeeDetailPage } from './pages/employees/EmployeeDetailPage';
import { AttendancePage } from './pages/attendance/AttendancePage';
import { LeavePage } from './pages/leave/LeavePage';
import { PayrollPage } from './pages/payroll/PayrollPage';
import { InvoicesListPage } from './pages/invoices/InvoicesListPage';
import { PaymentsListPage } from './pages/payments/PaymentsListPage';
import { ExpensesListPage } from './pages/expenses/ExpensesListPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { RolesSettingsPage } from './pages/settings/RolesSettingsPage';
import { PermissionsSettingsPage } from './pages/settings/PermissionsSettingsPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* SALES */}
            <Route path="enquiries" element={<EnquiriesListPage />} />
            <Route path="enquiries/:id" element={<EnquiryDetailPage />} />
            <Route path="clients" element={<ClientsListPage />} />
            <Route path="clients/:id" element={<ClientDetailPage />} />
            <Route path="proposals" element={<ProposalsListPage />} />
            <Route path="proposals/:id" element={<ProposalDetailPage />} />

            {/* PROJECTS */}
            <Route path="projects" element={<ProjectsListPage />} />
            <Route path="projects/:id" element={<ProjectDetailPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="schedule" element={<SchedulePage />} />

            {/* PEOPLE */}
            <Route path="employees" element={<EmployeesListPage />} />
            <Route path="employees/:id" element={<EmployeeDetailPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="leave" element={<LeavePage />} />
            <Route path="payroll" element={<PayrollPage />} />

            {/* FINANCE */}
            <Route path="invoices" element={<InvoicesListPage />} />
            <Route path="payments" element={<PaymentsListPage />} />
            <Route path="expenses" element={<ExpensesListPage />} />

            {/* INSIGHTS */}
            <Route path="reports" element={<ReportsPage />} />

            {/* SYSTEM */}
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="settings/roles" element={<RolesSettingsPage />} />
            <Route path="settings/permissions" element={<PermissionsSettingsPage />} />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
