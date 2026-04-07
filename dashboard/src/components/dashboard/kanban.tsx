'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  type Application,
  STATUS_COLORS,
  GEO_FLAGS,
  gradeColor,
} from '@/lib/supabase';

const KANBAN_COLUMNS = [
  { key: 'Evaluated', label: 'Evaluated' },
  { key: 'Applied', label: 'Applied' },
  { key: 'Responded', label: 'Responded' },
  { key: 'Interview', label: 'Interview' },
  { key: 'Offer', label: 'Offer' },
  { key: 'Rejected', label: 'Rejected' },
] as const;

type Props = {
  applications: Application[];
  onStatusChange: (id: number, status: string) => void;
};

function KanbanCard({
  app,
  onDrop,
}: {
  app: Application;
  onDrop?: (status: string) => void;
}) {
  const isDeadlineSoon = app.deadline &&
    (new Date(app.deadline).getTime() - Date.now()) < 7 * 24 * 60 * 60 * 1000 &&
    (new Date(app.deadline).getTime() - Date.now()) > 0;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/json', JSON.stringify({ id: app.id }));
      }}
      className={`rounded-md border p-3 bg-card cursor-grab active:cursor-grabbing hover:border-primary/30 transition-colors ${
        isDeadlineSoon ? 'border-red-500/50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm truncate">{app.company}</p>
          <p className="text-xs text-muted-foreground truncate">{app.role}</p>
        </div>
        <span className={`text-sm font-bold shrink-0 ${gradeColor(app.grade)}`}>
          {app.score?.toFixed(1)}
        </span>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-xs">{GEO_FLAGS[app.geo_tier || 0]}</span>
        {app.archetype && (
          <span className="text-[10px] text-muted-foreground truncate">{app.archetype}</span>
        )}
      </div>
      {isDeadlineSoon && (
        <p className="text-[10px] text-red-400 font-medium mt-1">
          Deadline approaching
        </p>
      )}
    </div>
  );
}

export function Kanban({ applications, onStatusChange }: Props) {
  const handleDrop = (status: string) => (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.id) onStatusChange(data.id, status);
    } catch {}
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 min-h-[300px]">
      {KANBAN_COLUMNS.map(col => {
        const items = applications.filter(a => a.status === col.key);
        return (
          <div
            key={col.key}
            className="flex-shrink-0 w-[220px]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop(col.key)}
          >
            <div className="flex items-center gap-2 mb-2 px-1">
              <Badge
                variant="outline"
                className={`text-[10px] ${STATUS_COLORS[col.key]}`}
              >
                {col.label}
              </Badge>
              <span className="text-xs text-muted-foreground">{items.length}</span>
            </div>
            <div className="space-y-2 min-h-[200px] rounded-md border border-dashed border-border/50 p-2">
              {items
                .sort((a, b) => (b.score || 0) - (a.score || 0))
                .map(app => (
                  <KanbanCard key={app.id} app={app} />
                ))}
              {items.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-8">
                  Drop here
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
