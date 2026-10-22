import { describe, expect, test } from 'bun:test';
import {
  contactSummary,
  coreStackLine,
  languagesLine,
  profile,
  projectCount,
  projectsSummary,
  stackLine,
  tenureLine,
  tenureYears,
  version,
} from './profile';

const projects = ['Tokenlens', 'Oku', 'Tramly', 'FirstDevJob', 'CE Equipment'].map((name) => ({ name }));
const oct2026 = new Date(2026, 9, 22);

describe('static lines', () => {
  test('version comes from the current role start', () => {
    expect(version).toBe('v25.9');
  });

  test('stack and language lines', () => {
    expect(coreStackLine).toBe('JAVA · GO · TS');
    expect(stackLine).toBe('Java · Go · TypeScript · MySQL · CI/CD');
    expect(languagesLine).toBe('fluent EN / PL');
    expect(profile.stack).toHaveLength(14);
  });
});

describe('tenure', () => {
  test('counts whole years from the first day', () => {
    expect(tenureYears(new Date(2024, 5, 1))).toBe(0);
    expect(tenureYears(new Date(2025, 4, 30))).toBe(0);
    expect(tenureYears(new Date(2025, 5, 1))).toBe(1);
    expect(tenureYears(oct2026)).toBe(2);
    expect(tenureYears(new Date(2023, 0, 1))).toBe(0);
  });

  test('singular and plural', () => {
    expect(tenureLine(new Date(2025, 8, 1))).toBe('1 yr at Citi');
    expect(tenureLine(oct2026)).toBe('2 yrs at Citi');
  });
});

describe('project-derived lines', () => {
  test('count and hero summary follow the list', () => {
    expect(projectCount(projects)).toBe(5);
    expect(projectsSummary(projects)).toEqual({
      title: '5 deployments',
      desc: 'Tokenlens · Oku · Tramly · FirstDevJob · CE Equipment',
    });
  });

  test('contact summary', () => {
    expect(contactSummary(projects, oct2026)).toBe(
      'BSc (Hons) 1.1 · 2 yrs at Citi · 5 shipped projects · fluent EN / PL',
    );
  });
});
