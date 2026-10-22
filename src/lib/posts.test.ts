import { describe, expect, test } from 'bun:test';
import { DEFAULT_AUTHOR, newPostSource, ogImageFor, postUrl, readingTime, slugify, sortNewestFirst } from './posts';

const base = '/Personal-Website/';
const post = (slug: string, date: string) => ({ slug, data: { pubDate: new Date(date) } });

describe('sortNewestFirst', () => {
  test('orders by pubDate descending without mutating', () => {
    const posts = [post('a', '2025-02-16'), post('c', '2026-10-20'), post('b', '2026-07-18')];
    expect(sortNewestFirst(posts).map((p) => p.slug)).toEqual(['c', 'b', 'a']);
    expect(posts.map((p) => p.slug)).toEqual(['a', 'c', 'b']);
  });
});

describe('postUrl', () => {
  test('is a based directory URL with trailing slash', () => {
    expect(postUrl('oku-pace-forecasting', base)).toBe('/Personal-Website/blog/oku-pace-forecasting/');
    expect(postUrl('x', '/')).toBe('/blog/x/');
  });
});

describe('ogImageFor', () => {
  test('falls back to the site card', () => {
    expect(ogImageFor({}, base)).toBe('/Personal-Website/og-image.png');
    expect(ogImageFor({ image: '' }, base)).toBe('/Personal-Website/og-image.png');
  });
  test('uses the post image, based', () => {
    expect(ogImageFor({ image: '/media/oku-v0-16/cover.png' }, base)).toBe('/Personal-Website/media/oku-v0-16/cover.png');
  });
  test('passes absolute URLs through', () => {
    expect(ogImageFor({ image: 'https://cdn.example.com/c.png' }, base)).toBe('https://cdn.example.com/c.png');
  });
});

describe('readingTime', () => {
  test('rounds up at 200 wpm', () => {
    expect(readingTime('word')).toBe(1);
    expect(readingTime(Array(200).fill('w').join(' '))).toBe(1);
    expect(readingTime(Array(201).fill('w').join('\n'))).toBe(2);
  });
});

describe('new post', () => {
  test('slugify', () => {
    expect(slugify("Did I really build this?")).toBe('did-i-really-build-this');
    expect(slugify('  oku v0.16: pace!  ')).toBe('oku-v0-16-pace');
  });

  const source = newPostSource({
    title: 'Quotes "inside": and a colon',
    description: 'Back\\slash and\nnewline',
    tags: ['go', '', 'cli'],
    pubDate: '2026-10-22',
  });

  test('frontmatter round-trips through a YAML parser', async () => {
    const yaml = source.split('---')[1];
    const { YAML } = await import('bun');
    expect(YAML.parse(yaml)).toEqual({
      title: 'Quotes "inside": and a colon',
      description: 'Back\\slash and\nnewline',
      pubDate: expect.anything(),
      author: DEFAULT_AUTHOR,
      tags: ['go', 'cli'],
    });
  });
  test('no H1 in the body, BlogPost renders the title', () => {
    expect(source).not.toMatch(/^# /m);
  });
  test('author can be overridden', () => {
    expect(newPostSource({ title: 't', description: 'd', tags: [], pubDate: '2026-01-01', author: 'Someone' })).toContain(
      'author: "Someone"',
    );
  });
});
