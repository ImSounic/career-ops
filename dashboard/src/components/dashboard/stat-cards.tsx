'use client';

import { Card, CardContent } from '@/components/ui/card';

type StatCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  alert?: boolean;
};

function StatCard({ label, value, sub, alert }: StatCardProps) {
  return (
    <Card className={alert ? 'border-red-500/50 bg-red-500/5' : ''}>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${alert ? 'text-red-400' : ''}`}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

type Props = {
  total: number;
  evaluated: number;
  applied: number;
  interviewing: number;
  offers: number;
  topScore: number;
  deadlineSoon: number;
};

export function StatCards({ total, evaluated, applied, interviewing, offers, topScore, deadlineSoon }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      <StatCard label="Total" value={total} />
      <StatCard label="Evaluated" value={evaluated} />
      <StatCard label="Applied" value={applied} />
      <StatCard label="Interviews" value={interviewing} />
      <StatCard label="Offers" value={offers} />
      <StatCard label="Top Score" value={`${topScore.toFixed(1)}/5`} />
      <StatCard
        label="Deadlines"
        value={deadlineSoon}
        sub={deadlineSoon > 0 ? '< 7 days' : 'none'}
        alert={deadlineSoon > 0}
      />
    </div>
  );
}
