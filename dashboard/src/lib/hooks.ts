'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase, type Application } from './supabase';

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('score', { ascending: false, nullsFirst: false });
    if (!error && data) setApplications(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = useCallback(async (id: number, status: string) => {
    const updates: Record<string, unknown> = { status };
    if (status === 'Applied') updates.applied_at = new Date().toISOString();

    const { error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id);

    if (!error) {
      setApplications(prev =>
        prev.map(a => a.id === id ? { ...a, status, ...updates } as Application : a)
      );
    }
    return !error;
  }, []);

  return { applications, loading, refetch: fetch, updateStatus };
}

export function useStats(applications: Application[]) {
  const total = applications.length;
  const evaluated = applications.filter(a => a.status === 'Evaluated').length;
  const applied = applications.filter(a => a.status === 'Applied').length;
  const interviewing = applications.filter(a => a.status === 'Interview').length;
  const offers = applications.filter(a => a.status === 'Offer').length;
  const topScore = applications.length > 0
    ? Math.max(...applications.map(a => a.score || 0))
    : 0;
  const deadlineSoon = applications.filter(a => {
    if (!a.deadline) return false;
    const diff = new Date(a.deadline).getTime() - Date.now();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
  }).length;

  return { total, evaluated, applied, interviewing, offers, topScore, deadlineSoon };
}
