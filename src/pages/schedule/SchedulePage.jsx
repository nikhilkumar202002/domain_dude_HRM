import React from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Calendar } from '../../components/common/Calendar';

export const SchedulePage = () => {
  const scheduleEvents = [
    { title: 'Quantum Release v2.0', date: '2026-10-08', type: 'milestone' },
    { title: 'AeroCloud Fleet Sprint Review', date: '2026-10-12', type: 'meeting' },
    { title: 'DICOM Viewer Audit Handoff', date: '2026-10-15', type: 'deadline' },
    { title: 'All-Hands Company Townhall', date: '2026-10-20', type: 'event' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Work Schedule & Milestones"
        subtitle="Operational timeline, team shifts, sprint reviews, and key project delivery dates."
        actions={
          <button
            onClick={() => alert('Add schedule event modal')}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" /> Schedule Event
          </button>
        }
      />

      <Calendar events={scheduleEvents} onAddEvent={() => alert('Create Event modal')} />
    </div>
  );
};
