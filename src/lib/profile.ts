/**
 * Profile facts shared by the hero, contact, stack, experience and 404 pages.
 * Anything that changes over time (tenure, project count) is derived here
 * rather than written into the markup.
 */

type YearMonth = { year: number; month: number };

export const profile = {
  name: 'Kamil Rogozinski',
  role: 'software engineer',
  employer: 'Citi Dublin',
  employerShort: 'Citi',
  /** First day at Citi (internship); tenure counts from here. */
  employerSince: { year: 2024, month: 6 } satisfies YearMonth,
  /** Start of the current role; the "version" in the hero is this date. */
  roleSince: { year: 2025, month: 9 } satisfies YearMonth,
  degree: {
    title: 'BSc (Hons) Software Systems',
    result: 'First Class Honours (1.1)',
    short: 'BSc (Hons) 1.1',
  },
  languages: ['EN', 'PL'],
  /** Headline languages for the hero pill. */
  coreStack: ['Java', 'Go', 'TS'],
  /** Summary for the hero's stack node. */
  stackHighlights: ['Java', 'Go', 'TypeScript', 'MySQL', 'CI/CD'],
  /** Full list for the stack section. */
  stack: [
    'Java',
    'Spring Boot',
    'Go',
    'TypeScript',
    'JavaScript',
    'Angular',
    'Python',
    'MySQL',
    'REST APIs',
    'Docker',
    'OpenShift',
    'Git',
    'CI/CD',
    'Agile',
  ],
} as const;

const SEP = ' · ';

/** `v25.9`: the current role's start, as a release version. */
export const version = `v${profile.roleSince.year % 100}.${profile.roleSince.month}`;

/** `JAVA · GO · TS` */
export const coreStackLine = profile.coreStack.join(SEP).toUpperCase();

/** `Java · Go · TypeScript · MySQL · CI/CD` */
export const stackLine = profile.stackHighlights.join(SEP);

/** `fluent EN / PL` */
export const languagesLine = `fluent ${profile.languages.join(' / ')}`;

/** Whole years since the first day at the employer. */
export function tenureYears(now: Date = new Date()): number {
  const { year, month } = profile.employerSince;
  const months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
  return Math.max(0, Math.floor(months / 12));
}

/** `2 yrs at Citi` */
export function tenureLine(now: Date = new Date()): string {
  const years = tenureYears(now);
  return `${years} ${years === 1 ? 'yr' : 'yrs'} at ${profile.employerShort}`;
}

type Named = { name: string };

export function projectCount(projects: readonly unknown[]): number {
  return projects.length;
}

/** Hero projects node: `5 deployments` over `Tokenlens · Oku · …`. */
export function projectsSummary(projects: readonly Named[]) {
  return {
    title: `${projectCount(projects)} deployments`,
    desc: projects.map((p) => p.name).join(SEP),
  };
}

/** `BSc (Hons) 1.1 · 2 yrs at Citi · 5 shipped projects · fluent EN / PL` */
export function contactSummary(projects: readonly unknown[], now: Date = new Date()): string {
  return [
    profile.degree.short,
    tenureLine(now),
    `${projectCount(projects)} shipped projects`,
    languagesLine,
  ].join(SEP);
}
