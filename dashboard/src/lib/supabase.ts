import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wrnseiawytlxzaecdjkn.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndybnNlaWF3eXRseHphZWNkamtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjIwOTAsImV4cCI6MjA5MTEzODA5MH0.nx7nxVg6t4x4Or_tEXOWu9hUawnrNu-Bj0GBYW3orQE';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Application = {
  id: number;
  report_num: number;
  company: string;
  role: string;
  location: string | null;
  country: string | null;
  score: number | null;
  grade: string | null;
  archetype: string | null;
  status: string;
  url: string | null;
  geo_tier: number | null;
  applied_at: string | null;
  deadline: string | null;
  notes: string | null;
  report_path: string | null;
  pdf_generated: boolean;
  created_at: string;
  updated_at: string;
};

export type Scan = {
  id: number;
  scan_date: string;
  total_found: number;
  nl_count: number;
  de_count: number;
  eu_count: number;
  new_count: number;
  created_at: string;
};

export const STATUSES = [
  'Evaluated',
  'Applied',
  'Responded',
  'Interview',
  'Offer',
  'Rejected',
  'Discarded',
  'SKIP',
] as const;

export const STATUS_COLORS: Record<string, string> = {
  Evaluated: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Applied: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Responded: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Interview: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Offer: 'bg-green-500/20 text-green-400 border-green-500/30',
  Rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  Discarded: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  SKIP: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
};

export const GEO_FLAGS: Record<number, string> = {
  0: '\u274c',
  1: '\ud83c\uddf3\ud83c\uddf1',
  2: '\ud83c\udde9\ud83c\uddea',
  3: '\ud83c\uddea\ud83c\uddfa',
};

export function gradeColor(grade: string | null): string {
  switch (grade) {
    case 'A+': return 'text-green-400';
    case 'A': return 'text-emerald-400';
    case 'B': return 'text-amber-400';
    case 'C': return 'text-orange-400';
    default: return 'text-red-400';
  }
}
