// Clean API Service Layer abstraction
// Prepares frontend for seamless REST API integration with Laravel backend later

import {
  dashboardStats,
  mockEnquiries,
  mockClients,
  mockProposals,
  mockProjects,
  mockTasks,
  mockEmployees,
  mockAttendance,
  mockLeaveRequests,
  mockPayroll,
  mockInvoices,
  mockPayments,
  mockExpenses,
  mockRevenueData,
  mockNotificationsList,
  mockRolesList
} from '../data/mockData';

// Simulated delay helper for realistic feel
const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // Dashboard & Analytics
  getDashboardStats: async () => {
    await delay();
    return { data: dashboardStats };
  },

  getRevenueAnalytics: async () => {
    await delay();
    return { data: mockRevenueData };
  },

  // CRM: Enquiries
  getEnquiries: async (filters = {}) => {
    await delay();
    let result = [...mockEnquiries];
    if (filters.status && filters.status !== 'All') {
      result = result.filter(e => e.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(e => e.clientName.toLowerCase().includes(q) || e.service.toLowerCase().includes(q) || e.id.toLowerCase().includes(q));
    }
    return { data: result };
  },

  getEnquiryById: async (id) => {
    await delay();
    const item = mockEnquiries.find(e => e.id === id) || mockEnquiries[0];
    return { data: item };
  },

  // CRM: Clients
  getClients: async (filters = {}) => {
    await delay();
    let result = [...mockClients];
    if (filters.status && filters.status !== 'All') {
      result = result.filter(c => c.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(c => c.companyName.toLowerCase().includes(q) || c.contactName.toLowerCase().includes(q));
    }
    return { data: result };
  },

  getClientById: async (id) => {
    await delay();
    const client = mockClients.find(c => c.id === id) || mockClients[0];
    return { data: client };
  },

  // Proposals
  getProposals: async (filters = {}) => {
    await delay();
    let result = [...mockProposals];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.clientName.toLowerCase().includes(q));
    }
    return { data: result };
  },

  getProposalById: async (id) => {
    await delay();
    const item = mockProposals.find(p => p.id === id) || mockProposals[0];
    return { data: item };
  },

  // Projects
  getProjects: async (filters = {}) => {
    await delay();
    let result = [...mockProjects];
    if (filters.status && filters.status !== 'All') {
      result = result.filter(p => p.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q));
    }
    return { data: result };
  },

  getProjectById: async (id) => {
    await delay();
    const project = mockProjects.find(p => p.id === id) || mockProjects[0];
    return { data: project };
  },

  // Tasks
  getTasks: async (filters = {}) => {
    await delay();
    let result = [...mockTasks];
    if (filters.status && filters.status !== 'All') {
      result = result.filter(t => t.status.toLowerCase() === filters.status.toLowerCase());
    }
    return { data: result };
  },

  // Employees & HR
  getEmployees: async (filters = {}) => {
    await delay();
    let result = [...mockEmployees];
    if (filters.department && filters.department !== 'All') {
      result = result.filter(e => e.department.toLowerCase() === filters.department.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(e => e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q));
    }
    return { data: result };
  },

  getEmployeeById: async (id) => {
    await delay();
    const emp = mockEmployees.find(e => e.id === id) || mockEmployees[0];
    return { data: emp };
  },

  // Attendance & Leave & Payroll
  getAttendance: async () => {
    await delay();
    return { data: mockAttendance };
  },

  getLeaveRequests: async () => {
    await delay();
    return { data: mockLeaveRequests };
  },

  getPayroll: async () => {
    await delay();
    return { data: mockPayroll };
  },

  // Finance: Invoices, Payments, Expenses
  getInvoices: async () => {
    await delay();
    return { data: mockInvoices };
  },

  getPayments: async () => {
    await delay();
    return { data: mockPayments };
  },

  getExpenses: async () => {
    await delay();
    return { data: mockExpenses };
  },

  // System: Notifications & Roles
  getNotifications: async () => {
    await delay();
    return { data: mockNotificationsList };
  },

  getRoles: async () => {
    await delay();
    return { data: mockRolesList };
  },
};
