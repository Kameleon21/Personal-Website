import { describe, expect, test } from 'bun:test';
import { levenshtein, suggest } from './suggest';

describe('levenshtein', () => {
  test('edit distances', () => {
    expect(levenshtein('', '')).toBe(0);
    expect(levenshtein('abc', '')).toBe(3);
    expect(levenshtein('', 'abc')).toBe(3);
    expect(levenshtein('kitten', 'sitting')).toBe(3);
    expect(levenshtein('/blog', '/blog')).toBe(0);
    expect(levenshtein('/blgo', '/blog')).toBe(2);
  });
  test('is symmetric', () => {
    expect(levenshtein('/stack', '/stak')).toBe(levenshtein('/stak', '/stack'));
  });
});

describe('suggest', () => {
  test('bot probes', () => {
    expect(suggest('/wp-admin')).toEqual({ kind: 'probe' });
    expect(suggest('/config.php')).toEqual({ kind: 'probe' });
    expect(suggest('/.env')).toEqual({ kind: 'probe' });
  });
  test('known first segment is a prefix hit, case-insensitive', () => {
    expect(suggest('/blog/no-such-post')).toEqual({ kind: 'prefix', route: '/blog' });
    expect(suggest('/Projects/x')).toEqual({ kind: 'prefix', route: '/projects' });
  });
  test('typos within two edits', () => {
    expect(suggest('/blgo')).toEqual({ kind: 'typo', route: '/blog' });
    expect(suggest('/stak')).toEqual({ kind: 'typo', route: '/stack' });
    expect(suggest('/contcat')).toEqual({ kind: 'typo', route: '/contact' });
  });
  test('nothing close', () => {
    expect(suggest('/zzzzzzzz')).toBeNull();
    expect(suggest('/')).toBeNull();
  });
  test('takes its own route list', () => {
    expect(suggest('/blgo', ['/', '/stack'])).toBeNull();
  });
});
