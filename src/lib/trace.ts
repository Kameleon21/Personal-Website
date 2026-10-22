import type { Span } from '../data/career';

export const DEFAULT_OPEN = 'swe';

export type Domain = [number, number];

/** A date as a fractional year, e.g. mid-July 2025 is about 2025.54. */
export function currentYear(d: Date = new Date()): number {
  const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return d.getFullYear() + (d.getMonth() + (d.getDate() - 1) / daysInMonth) / 12;
}

/** Time axis: starts mid-2022, ends at the next whole year past "now" (at least 2027). */
export function domainFor(now: number): Domain {
  return [2022.5, Math.max(2027, Math.ceil(now + 0.2))];
}

/** "now" never runs past the end of the axis. */
export function clampNow(now: number, domain: Domain): number {
  return Math.min(now, domain[1]);
}

export function pct(t: number, domain: Domain): number {
  return ((t - domain[0]) / (domain[1] - domain[0])) * 100;
}

export function formatDuration(years: number): string {
  const months = Math.round(years * 12);
  const y = Math.floor(months / 12);
  const m = months % 12;
  return y ? `${y}y${m ? ` ${m}m` : ''}` : `${m}mo`;
}

export function endOf(span: Span, now: number): number {
  return span.end ?? now;
}

export function spanDuration(span: Span, now: number): string {
  return span.durLabel ?? formatDuration(endOf(span, now) - span.start);
}

export type TraceStats = {
  services: number;
  depth: number;
  errors: number;
  rollbacks: number;
  redirects: number;
};

/** Header numbers, derived from the spans: distinct services, tree depth, and tag statuses. */
export function traceStats(spans: Span[]): TraceStats {
  const count = (status: string) =>
    spans.reduce((n, s) => n + s.tags.filter((t) => t.status === status).length, 0);
  return {
    services: new Set(spans.map((s) => s.svc)).size,
    depth: Math.max(...spans.map((s) => s.depth)) + 1,
    errors: count('error'),
    rollbacks: count('rollback'),
    redirects: count('redir'),
  };
}
