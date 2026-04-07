'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  type Application,
  STATUSES,
  STATUS_COLORS,
  GEO_FLAGS,
  gradeColor,
} from '@/lib/supabase';

type SortKey = 'score' | 'company' | 'status' | 'geo_tier';

type Props = {
  applications: Application[];
  onStatusChange: (id: number, status: string) => void;
};

function isDeadlineSoon(deadline: string | null): boolean {
  if (!deadline) return false;
  const diff = new Date(deadline).getTime() - Date.now();
  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
}

function formatDeadline(deadline: string | null): string {
  if (!deadline) return '';
  const d = new Date(deadline);
  const diff = Math.ceil((d.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  if (diff < 0) return 'Passed';
  if (diff === 0) return 'Today!';
  if (diff === 1) return 'Tomorrow!';
  return `${diff}d left`;
}

export function RankingsTable({ applications, onStatusChange }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [geoFilter, setGeoFilter] = useState<string | null>('all');
  const [statusFilter, setStatusFilter] = useState<string | null>('all');
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = applications
    .filter(a => !geoFilter || geoFilter === 'all' || String(a.geo_tier) === geoFilter)
    .filter(a => !statusFilter || statusFilter === 'all' || a.status === statusFilter);

  const sorted = [...filtered].sort((a, b) => {
    switch (sortKey) {
      case 'score': return (b.score || 0) - (a.score || 0);
      case 'company': return a.company.localeCompare(b.company);
      case 'status': return a.status.localeCompare(b.status);
      case 'geo_tier': return (a.geo_tier || 9) - (b.geo_tier || 9);
      default: return 0;
    }
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Select value={sortKey} onValueChange={(v) => v && setSortKey(v as SortKey)}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="score">Score</SelectItem>
            <SelectItem value="company">Company</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="geo_tier">Geography</SelectItem>
          </SelectContent>
        </Select>

        <Select value={geoFilter} onValueChange={setGeoFilter}>
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue placeholder="Geo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Geo</SelectItem>
            <SelectItem value="1">{GEO_FLAGS[1]} NL</SelectItem>
            <SelectItem value="2">{GEO_FLAGS[2]} DE</SelectItem>
            <SelectItem value="3">{GEO_FLAGS[3]} EU</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] h-8 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUSES.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-xs text-muted-foreground self-center ml-auto">
          {sorted.length} of {applications.length}
        </span>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">#</TableHead>
              <TableHead className="w-[50px]">Score</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead className="w-[40px]">Geo</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="hidden lg:table-cell w-[80px]">Deadline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map(app => (
              <>
                <TableRow
                  key={app.id}
                  className={`cursor-pointer hover:bg-muted/50 ${isDeadlineSoon(app.deadline) ? 'bg-red-500/5' : ''}`}
                  onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {String(app.report_num).padStart(3, '0')}
                  </TableCell>
                  <TableCell>
                    <span className={`font-bold ${gradeColor(app.grade)}`}>
                      {app.score?.toFixed(1) || '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{app.company}</span>
                      <span className="md:hidden text-xs text-muted-foreground block">
                        {app.role}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {app.role}
                  </TableCell>
                  <TableCell>{GEO_FLAGS[app.geo_tier || 0] || ''}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="cursor-pointer"
                        render={<Badge variant="outline" className={`text-xs cursor-pointer ${STATUS_COLORS[app.status] || ''}`} />}
                      >
                        {app.status}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {STATUSES.map(s => (
                          <DropdownMenuItem
                            key={s}
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(app.id, s);
                            }}
                          >
                            {s}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {app.deadline && (
                      <span className={`text-xs ${isDeadlineSoon(app.deadline) ? 'text-red-400 font-bold' : 'text-muted-foreground'}`}>
                        {formatDeadline(app.deadline)}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
                {expanded === app.id && (
                  <TableRow key={`${app.id}-details`}>
                    <TableCell colSpan={7} className="bg-muted/30 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div><span className="text-muted-foreground">Archetype:</span> {app.archetype || '-'}</div>
                          <div><span className="text-muted-foreground">Location:</span> {app.location || '-'}, {app.country || '-'}</div>
                          <div><span className="text-muted-foreground">Grade:</span> <span className={gradeColor(app.grade)}>{app.grade}</span></div>
                          <div><span className="text-muted-foreground">PDF:</span> {app.pdf_generated ? 'Generated' : 'Pending'}</div>
                        </div>
                        <div className="space-y-2">
                          <div><span className="text-muted-foreground">Notes:</span> {app.notes || '-'}</div>
                          {app.url && (
                            <div>
                              <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs break-all">
                                View Job Posting
                              </a>
                            </div>
                          )}
                          {app.report_path && (
                            <div className="text-xs text-muted-foreground">
                              Report: {app.report_path}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
