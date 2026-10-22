import { profile } from '../lib/profile';

export type Svc = 'kamil' | 'setu' | 'citi';
export type Status = 'ok' | 'live' | 'redir' | 'error' | 'rollback';
export type Tag = { k: string; v: string; status?: Status };
export type Log = { text: string; comment?: string };
export type Span = {
  id: string;
  op: string;
  svc: Svc;
  depth: 0 | 1;
  start: number;
  end: number | null;
  from: string;
  to: string;
  durLabel?: string;
  title: string;
  tags: Tag[];
  logs: Log[];
  logsTitle?: string;
};

// Months as fractional years so every span shares one time axis.
const ym = (y: number, m: number) => y + (m - 1) / 12;
const ymOf = ({ year, month }: { year: number; month: number }) => ym(year, month);
const { degree, employer } = profile;

export const spans: Span[] = [
  {
    id: 'career',
    op: 'kamil.career',
    svc: 'kamil',
    depth: 0,
    start: ym(2022, 9),
    end: null,
    from: '2022',
    to: 'now',
    title: 'Kamil Rogozinski — software engineer',
    tags: [
      { k: 'service', v: 'kamil-rogozinski' },
      { k: 'region', v: 'waterford, ie' },
      { k: 'stack', v: 'java · go · typescript' },
      { k: 'languages', v: 'polish (native) · english (fluent)' },
      { k: 'status', v: '200 · HEALTHY', status: 'live' },
    ],
    logs: [],
  },
  {
    id: 'setu',
    op: 'setu.bsc',
    svc: 'setu',
    depth: 1,
    start: ym(2022, 9),
    end: ym(2025, 6),
    from: '2022',
    to: '2025',
    durLabel: '3y',
    title: degree.title,
    tags: [
      { k: 'org', v: 'SETU Waterford' },
      { k: 'degree', v: degree.title },
      { k: 'result', v: degree.result },
      { k: 'status', v: '200 · graduated', status: 'ok' },
    ],
    logs: [{ text: degree.result }],
  },
  {
    id: 'intern',
    op: 'citi.intern',
    svc: 'citi',
    depth: 1,
    start: ymOf(profile.employerSince),
    end: ym(2024, 12),
    from: '2024.06',
    to: '2024.12',
    title: `SWE Intern — ${employer}`,
    tags: [
      { k: 'org', v: employer },
      { k: 'role', v: 'SWE Intern' },
      { k: 'stack', v: 'Java · .NET' },
      { k: 'scope', v: 'APIs · microservices' },
      { k: 'team', v: 'Agile teams · code reviews' },
      { k: 'status', v: '301 → citi.swe', status: 'redir' },
    ],
    logs: [
      { text: 'Java + .NET, APIs and microservices' },
      { text: 'Agile teams, code reviews' },
      { text: 'converted to full-time', comment: '// 301 Moved Permanently' },
    ],
  },
  {
    id: 'swe',
    op: 'citi.swe',
    svc: 'citi',
    depth: 1,
    start: ymOf(profile.roleSince),
    end: null,
    from: '2025.09',
    to: 'now',
    title: `Software Engineer — ${employer}`,
    tags: [
      { k: 'org', v: employer },
      { k: 'role', v: 'Software Engineer' },
      { k: 'stack', v: 'Spring Boot · Angular · MySQL' },
      { k: 'infra', v: 'Docker · OpenShift · CI/CD' },
      { k: 'ref', v: 'follows_from → citi.intern' },
      { k: 'status', v: '200 · span open', status: 'live' },
    ],
    logs: [
      { text: 'ships Spring Boot REST services across multiple apps' },
      { text: 'builds modular Angular front-end components' },
      { text: 'designs MySQL schemas for query efficiency' },
      { text: 'deploys via Docker + OpenShift, improves CI/CD' },
      { text: 'mentors(intern)', comment: '// onboarding, reviews, guidance' },
    ],
    logsTitle: 'logs · diff',
  },
];
