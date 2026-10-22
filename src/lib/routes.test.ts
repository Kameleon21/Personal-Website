import { describe, expect, test } from 'bun:test';
import { hasBase, hrefFor, ROUTES, stripBase, withBase } from './routes';

const BASES = ['/Personal-Website/', '/Personal-Website'];

describe('withBase', () => {
  test.each(BASES)('joins with exactly one slash (base %p)', (base) => {
    expect(withBase('/media/a.png', base)).toBe('/Personal-Website/media/a.png');
    expect(withBase('media/a.png', base)).toBe('/Personal-Website/media/a.png');
    expect(withBase('/', base)).toBe('/Personal-Website/');
  });
  test('root base leaves paths as they are', () => {
    expect(withBase('/media/a.png', '/')).toBe('/media/a.png');
    expect(withBase('/', '/')).toBe('/');
  });
});

describe('hrefFor', () => {
  test.each(BASES)('pages get a trailing slash, sections are home anchors (base %p)', (base) => {
    expect(hrefFor('/', base)).toBe('/Personal-Website/');
    expect(hrefFor('/blog', base)).toBe('/Personal-Website/blog/');
    expect(hrefFor('/projects', base)).toBe('/Personal-Website/#projects');
    expect(hrefFor('/contact', base)).toBe('/Personal-Website/#contact');
  });
  test('root base', () => {
    expect(hrefFor('/', '/')).toBe('/');
    expect(hrefFor('/blog', '/')).toBe('/blog/');
    expect(hrefFor('/stack', '/')).toBe('/#stack');
  });
  test('every route builds a based href', () => {
    for (const route of ROUTES) expect(hrefFor(route, '/b/').startsWith('/b/')).toBe(true);
  });
});

describe('hasBase / stripBase', () => {
  test('matches the base as a whole segment only', () => {
    expect(hasBase('/Personal-Website', '/Personal-Website/')).toBe(true);
    expect(hasBase('/Personal-Website/blog', '/Personal-Website/')).toBe(true);
    expect(hasBase('/Personal-Website#contact', '/Personal-Website/')).toBe(true);
    expect(hasBase('/Personal-Websites/x', '/Personal-Website/')).toBe(false);
    expect(hasBase('/anything', '/')).toBe(false);
  });
  test.each(BASES)('strips the base (base %p)', (base) => {
    expect(stripBase('/Personal-Website/blog/x/', base)).toBe('/blog/x/');
    expect(stripBase('/Personal-Website', base)).toBe('/');
    expect(stripBase('/Personal-Website/', base)).toBe('/');
    expect(stripBase('/elsewhere', base)).toBe('/elsewhere');
  });
});
