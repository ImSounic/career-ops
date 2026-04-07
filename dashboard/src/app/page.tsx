'use client';

import { useState } from 'react';
import { useApplications, useStats } from '@/lib/hooks';
import { StatCards } from '@/components/dashboard/stat-cards';
import { RankingsTable } from '@/components/dashboard/rankings-table';
import { Kanban } from '@/components/dashboard/kanban';

type View = 'table' | 'kanban';

export default function Dashboard() {
  const { applications, loading, refetch, updateStatus } = useApplications();
  const stats = useStats(applications);
  const [view, setView] = useState<View>('table');

  const handleStatusChange = async (id: number, status: string) => {
    await updateStatus(id, status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground animate-pulse">Loading pipeline...</div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">career-ops</h1>
          <p className="text-xs text-muted-foreground">Job search pipeline dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border overflow-hidden text-xs">
            <button
              onClick={() => setView('table')}
              className={`px-3 py-1.5 transition-colors ${
                view === 'table' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-1.5 transition-colors ${
                view === 'kanban' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              Kanban
            </button>
          </div>
          <button
            onClick={refetch}
            className="rounded-md border px-3 py-1.5 text-xs hover:bg-muted transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <StatCards {...stats} />

      {/* Main View */}
      {view === 'table' ? (
        <RankingsTable applications={applications} onStatusChange={handleStatusChange} />
      ) : (
        <Kanban applications={applications} onStatusChange={handleStatusChange} />
      )}
    </main>
  );
}
