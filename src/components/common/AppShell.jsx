import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { GlobalSearch } from './GlobalSearch';
import { QuickCreateModal } from './QuickCreateModal';

export const AppShell = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F7F8FA] antialiased">
      {/* Left Application Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <Topbar />

        {/* Scrollable Page Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Global Modals */}
      <GlobalSearch />
      <QuickCreateModal />
    </div>
  );
};
