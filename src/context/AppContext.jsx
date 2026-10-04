import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  mockEnquiries,
  mockClients,
  mockProposals,
  mockProjects,
  mockTasks,
  mockEmployees,
  mockInvoices,
  mockPayments,
  mockExpenses,
  mockNotificationsList,
  currentUser
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [quickCreateInitialType, setQuickCreateInitialType] = useState('enquiry');

  // Dynamic state arrays for interactive demo experience
  const [enquiries, setEnquiries] = useState(mockEnquiries);
  const [clients, setClients] = useState(mockClients);
  const [proposals, setProposals] = useState(mockProposals);
  const [projects, setProjects] = useState(mockProjects);
  const [tasks, setTasks] = useState(mockTasks);
  const [employees, setEmployees] = useState(mockEmployees);
  const [invoices, setInvoices] = useState(mockInvoices);
  const [payments, setPayments] = useState(mockPayments);
  const [expenses, setExpenses] = useState(mockExpenses);
  const [notifications, setNotifications] = useState(mockNotificationsList);

  // Global hotkey Ctrl+K / Cmd+K listener for global search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev);

  const openQuickCreate = (type = 'enquiry') => {
    setQuickCreateInitialType(type);
    setIsQuickCreateOpen(true);
  };

  const closeQuickCreate = () => setIsQuickCreateOpen(false);

  // Quick Create Handlers
  const addEnquiry = (newEnquiry) => {
    const created = {
      id: `ENQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      status: 'New',
      assignedTo: currentUser.name,
      ...newEnquiry,
    };
    setEnquiries((prev) => [created, ...prev]);
    addNotification(`New Enquiry created for ${created.clientName}`, 'sales');
  };

  const addClient = (newClient) => {
    const created = {
      id: `CLI-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Active',
      totalSpent: 0,
      activeProjectsCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
      accountManager: currentUser.name,
      ...newClient,
    };
    setClients((prev) => [created, ...prev]);
    addNotification(`New Client added: ${created.companyName}`, 'sales');
  };

  const addProposal = (newProposal) => {
    const created = {
      id: `PROP-${Math.floor(420 + Math.random() * 100)}`,
      status: 'Draft',
      sentDate: new Date().toISOString().split('T')[0],
      author: currentUser.name,
      ...newProposal,
    };
    setProposals((prev) => [created, ...prev]);
    addNotification(`Proposal "${created.title}" generated`, 'sales');
  };

  const addProject = (newProject) => {
    const created = {
      id: `PRJ-${Math.floor(810 + Math.random() * 100)}`,
      progress: 0,
      status: 'In Progress',
      spent: 0,
      startDate: new Date().toISOString().split('T')[0],
      team: [{ name: currentUser.name, avatar: currentUser.avatar }],
      taskStats: { total: 0, completed: 0 },
      manager: currentUser.name,
      ...newProject,
    };
    setProjects((prev) => [created, ...prev]);
    addNotification(`Project "${created.name}" launched`, 'projects');
  };

  const addTask = (newTask) => {
    const created = {
      id: `TSK-${Math.floor(1010 + Math.random() * 900)}`,
      status: 'To Do',
      spentHours: 0,
      assignee: { name: currentUser.name, avatar: currentUser.avatar },
      ...newTask,
    };
    setTasks((prev) => [created, ...prev]);
    addNotification(`Task "${created.title}" assigned`, 'projects');
  };

  const addEmployee = (newEmp) => {
    const created = {
      id: `EMP-0${employees.length + 1}`,
      status: 'Active',
      joiningDate: new Date().toISOString().split('T')[0],
      leaveBalance: 15,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      ...newEmp,
    };
    setEmployees((prev) => [created, ...prev]);
    addNotification(`Employee onboarded: ${created.name}`, 'hr');
  };

  const addInvoice = (newInv) => {
    const created = {
      id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'Draft',
      paymentMethod: 'Pending',
      ...newInv,
    };
    setInvoices((prev) => [created, ...prev]);
    addNotification(`Invoice ${created.id} generated for ${created.clientName}`, 'finance');
  };

  const addNotification = (message, type = 'system') => {
    const notif = {
      id: `nt-${Date.now()}`,
      title: 'Action Performed',
      message,
      time: 'Just now',
      type,
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isSidebarCollapsed,
        isMobileSidebarOpen,
        isGlobalSearchOpen,
        isQuickCreateOpen,
        quickCreateInitialType,
        toggleSidebar,
        toggleMobileSidebar,
        setIsMobileSidebarOpen,
        setIsGlobalSearchOpen,
        openQuickCreate,
        closeQuickCreate,
        enquiries,
        clients,
        proposals,
        projects,
        tasks,
        employees,
        invoices,
        payments,
        setPayments,
        expenses,
        setExpenses,
        notifications,
        setNotifications,
        toggleNotificationRead,
        markAllNotificationsRead,
        addEnquiry,
        addClient,
        addProposal,
        addProject,
        addTask,
        addEmployee,
        addInvoice,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
