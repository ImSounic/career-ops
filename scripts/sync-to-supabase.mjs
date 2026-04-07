#!/usr/bin/env node
/**
 * sync-to-supabase.mjs — Parse career-ops markdown data and upsert to Supabase
 *
 * Usage: node scripts/sync-to-supabase.mjs
 * Reads data/applications.md + data/pipeline.md, parses, and upserts.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wrnseiawytlxzaecdjkn.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndybnNlaWF3eXRseHphZWNkamtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjIwOTAsImV4cCI6MjA5MTEzODA5MH0.nx7nxVg6t4x4Or_tEXOWu9hUawnrNu-Bj0GBYW3orQE';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Grade from score ---
function scoreToGrade(score) {
  if (score >= 4.5) return 'A+';
  if (score >= 4.0) return 'A';
  if (score >= 3.5) return 'B';
  if (score >= 3.0) return 'C';
  return 'D';
}

// --- Geo tier from location/notes ---
function detectGeoTier(location, notes) {
  const text = `${location || ''} ${notes || ''}`.toLowerCase();
  if (/netherlands|amsterdam|eindhoven|veldhoven|utrecht|rotterdam|enschede|delft|nl\b/.test(text)) return 1;
  if (/germany|berlin|munich|hamburg|freiburg|deutschland|de\b/.test(text)) return 2;
  if (/us\b|usa|united states|phoenix|san diego/.test(text)) return 0; // excluded
  if (/uk\b|united kingdom|london/.test(text)) return 0; // excluded
  return 3; // rest of EU
}

// --- Detect archetype from role title ---
function detectArchetype(role) {
  const r = role.toLowerCase();
  if (/deep learning|computer vision|cv\/ml/.test(r)) return 'ML / Deep Learning';
  if (/data scien|analytics/.test(r)) return 'Data Science';
  if (/data engineer/.test(r)) return 'Data Engineering';
  if (/nlp|research|ai\/ml/.test(r)) return 'AI / NLP Research';
  if (/mlops|platform/.test(r)) return 'MLOps';
  if (/machine learning|ml\b/.test(r)) return 'ML / Deep Learning';
  return 'Software Engineering';
}

// --- Detect location from notes ---
function detectLocation(company, notes) {
  const text = `${notes || ''}`;
  const locations = {
    'Amsterdam': /amsterdam/i, 'Veldhoven': /veldhoven/i,
    'Berlin': /berlin/i, 'Munich': /munich/i, 'Freiburg': /freiburg/i,
    'Paris': /paris/i, 'Stockholm': /stockholm/i, 'Utrecht': /utrecht/i,
    'Netherlands': /\bnl\b|netherlands/i, 'Germany': /germany|deutschland/i,
    'USA': /us\b|usa|phoenix|san diego/i,
  };
  for (const [loc, re] of Object.entries(locations)) {
    if (re.test(text)) return loc;
  }
  return null;
}

// --- Detect country from location ---
function detectCountry(location, notes) {
  const text = `${location || ''} ${notes || ''}`.toLowerCase();
  if (/netherlands|amsterdam|veldhoven|utrecht|rotterdam|enschede|delft/.test(text)) return 'Netherlands';
  if (/germany|berlin|munich|hamburg|freiburg/.test(text)) return 'Germany';
  if (/france|paris/.test(text)) return 'France';
  if (/sweden|stockholm/.test(text)) return 'Sweden';
  if (/usa|united states|phoenix/.test(text)) return 'USA';
  return null;
}

// --- Parse applications.md ---
function parseApplications(filepath) {
  if (!existsSync(filepath)) return [];
  const content = readFileSync(filepath, 'utf-8');
  const lines = content.split('\n');
  const apps = [];

  for (const line of lines) {
    // Match: | num | date | company | role | score | status | pdf | report | notes |
    const match = line.match(
      /^\|\s*(\d+)\s*\|\s*([\d-]+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*([\d.]+)\/5\s*\|\s*(\w+)\s*\|\s*([^\|]+)\s*\|\s*\[(\d+)\]\(([^)]+)\)\s*\|\s*(.*?)\s*\|?\s*$/
    );
    if (!match) continue;

    const [, num, date, company, role, score, status, pdf, reportNum, reportPath, notes] = match;
    const scoreNum = parseFloat(score);
    const location = detectLocation(company, notes);
    const country = detectCountry(location, notes);

    apps.push({
      report_num: parseInt(num),
      company: company.trim(),
      role: role.trim(),
      location,
      country,
      score: scoreNum,
      grade: scoreToGrade(scoreNum),
      archetype: detectArchetype(role),
      status: status.trim(),
      url: null, // will be filled from report if available
      geo_tier: detectGeoTier(location, notes),
      pdf_generated: pdf.trim() === '\u2705',
      notes: notes.trim(),
      report_path: reportPath.trim(),
      created_at: `${date}T00:00:00Z`,
    });
  }
  return apps;
}

// --- Parse pipeline.md ---
function parsePipeline(filepath) {
  if (!existsSync(filepath)) return [];
  const content = readFileSync(filepath, 'utf-8');
  const lines = content.split('\n');
  const items = [];

  for (const line of lines) {
    // Processed: - [x] #NUM | URL | Company | Role | Score/5 | PDF
    const processed = line.match(
      /^- \[x\]\s*#(\d+)\s*\|\s*(https?:\/\/\S+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*([\d.]+)\/5\s*\|\s*(.+)$/
    );
    if (processed) {
      const [, num, url, company, role, score, pdf] = processed;
      items.push({
        report_num: parseInt(num),
        company: company.trim(),
        role: role.trim(),
        url: url.trim(),
        score: parseFloat(score),
        grade: scoreToGrade(parseFloat(score)),
        status: 'processed',
        report_path: `reports/${num.padStart(3, '0')}-${company.trim().toLowerCase().replace(/\s+/g, '-')}-*.md`,
      });
      continue;
    }

    // Pending: - [ ] URL | Company | Role
    const pending = line.match(
      /^- \[ \]\s*(https?:\/\/\S+)\s*\|\s*(.+?)\s*\|\s*(.+?)(?:\s*—\s*(.+))?\s*$/
    );
    if (pending) {
      const [, url, company, role] = pending;
      items.push({
        company: company.trim(),
        role: role.trim(),
        url: url.trim(),
        status: 'pending',
      });
    }
  }
  return items;
}

// --- Extract URLs from reports to backfill applications ---
function extractUrlFromReport(reportPath) {
  const fullPath = join(ROOT, reportPath);
  if (!existsSync(fullPath)) return null;
  try {
    const content = readFileSync(fullPath, 'utf-8');
    const match = content.match(/\*\*URL:\*\*\s*(https?:\/\/\S+)/);
    return match ? match[1] : null;
  } catch { return null; }
}

// --- Parse deadline from notes ---
function parseDeadline(notes) {
  if (!notes) return null;
  const match = notes.match(/DEADLINE[:\s]*(\w+\s+\d+)/i);
  if (match) {
    try {
      const d = new Date(`${match[1]} 2026`);
      if (!isNaN(d.getTime())) return d.toISOString();
    } catch { /* ignore */ }
  }
  return null;
}

// --- Main sync ---
async function main() {
  console.log('career-ops sync → Supabase');
  console.log('==========================\n');

  const appsFile = join(ROOT, 'data', 'applications.md');
  const pipelineFile = join(ROOT, 'data', 'pipeline.md');

  // Parse
  const apps = parseApplications(appsFile);
  console.log(`Parsed ${apps.length} applications`);

  const pipelineItems = parsePipeline(pipelineFile);
  console.log(`Parsed ${pipelineItems.length} pipeline items`);

  // Backfill URLs from reports + detect deadlines
  for (const app of apps) {
    if (!app.url && app.report_path) {
      app.url = extractUrlFromReport(app.report_path);
    }
    app.deadline = parseDeadline(app.notes);
  }

  // Upsert applications
  if (apps.length > 0) {
    const { data, error } = await supabase
      .from('applications')
      .upsert(apps, { onConflict: 'report_num' });
    if (error) {
      console.error('Error upserting applications:', error.message);
    } else {
      console.log(`Upserted ${apps.length} applications`);
    }
  }

  // Upsert pipeline
  if (pipelineItems.length > 0) {
    // Delete existing and reinsert (pipeline is a snapshot)
    await supabase.from('pipeline').delete().neq('id', 0);
    const { error } = await supabase.from('pipeline').insert(pipelineItems);
    if (error) {
      console.error('Error inserting pipeline:', error.message);
    } else {
      console.log(`Inserted ${pipelineItems.length} pipeline items`);
    }
  }

  // Insert scan record
  const nlCount = apps.filter(a => a.geo_tier === 1).length;
  const deCount = apps.filter(a => a.geo_tier === 2).length;
  const euCount = apps.filter(a => a.geo_tier === 3).length;

  const { error: scanErr } = await supabase.from('scans').insert({
    total_found: apps.length,
    nl_count: nlCount,
    de_count: deCount,
    eu_count: euCount,
    new_count: apps.length,
  });
  if (scanErr) console.error('Error inserting scan:', scanErr.message);

  console.log('\nSync complete.');
}

main().catch(console.error);
