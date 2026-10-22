import { describe, expect, test } from 'bun:test';
import { spans } from '../data/career';
import { clampNow, currentYear, domainFor, DEFAULT_OPEN, formatDuration, pct, spanDuration, traceStats } from './trace';

const span = (id: string) => spans.find((s) => s.id === id)!;

describe('currentYear', () => {
  test('first day of a year is the integer year', () => {
    expect(currentYear(new Date(2025, 0, 1))).toBe(2025);
  });
  test('first of July is half way', () => {
    expect(currentYear(new Date(2025, 6, 1))).toBeCloseTo(2025.5, 10);
  });
  test('uses day within the month', () => {
    expect(currentYear(new Date(2024, 1, 15))).toBeCloseTo(2024 + (1 + 14 / 29) / 12, 10);
  });
});

describe('domain, clamp and pct', () => {
  test('domain floors at 2027', () => {
    expect(domainFor(2026.5)).toEqual([2022.5, 2027]);
  });
  test('domain grows past 2027', () => {
    expect(domainFor(2027.9)).toEqual([2022.5, 2029]);
  });
  test('clampNow caps at the domain end only', () => {
    expect(clampNow(2030, [2022.5, 2027])).toBe(2027);
    expect(clampNow(2026, [2022.5, 2027])).toBe(2026);
  });
  test('pct maps domain ends to 0 and 100', () => {
    const d: [number, number] = [2022.5, 2027];
    expect(pct(2022.5, d)).toBe(0);
    expect(pct(2027, d)).toBe(100);
    expect(pct(2024.75, d)).toBeCloseTo(50, 10);
  });
});

describe('duration', () => {
  test('months only', () => expect(formatDuration(0.5)).toBe('6mo'));
  test('whole years', () => expect(formatDuration(3)).toBe('3y'));
  test('years and months', () => expect(formatDuration(3 + 4 / 12)).toBe('3y 4m'));
  test('durLabel wins', () => expect(spanDuration(span('setu'), 2030)).toBe('3y'));
  test('closed span', () => expect(spanDuration(span('intern'), 2030)).toBe('6mo'));
  test('open span runs to now', () => expect(spanDuration(span('swe'), 2026 + 8 / 12)).toBe('1y'));
});

describe('traceStats', () => {
  test('matches the values previously typed by hand', () => {
    expect(traceStats(spans)).toEqual({ services: 3, depth: 2, errors: 0, rollbacks: 0, redirects: 1 });
  });
  test('default open span exists', () => {
    expect(span(DEFAULT_OPEN)).toBeDefined();
  });
});
