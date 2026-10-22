import { describe, expect, test } from 'bun:test';
import { prefixBase, remarkBaseUrl } from './markdown';

const base = '/Personal-Website/';

describe('prefixBase', () => {
  test('prefixes root-relative URLs', () => {
    expect(prefixBase('/media/oku-v0-16/cover.png', base)).toBe('/Personal-Website/media/oku-v0-16/cover.png');
    expect(prefixBase('/#contact', base)).toBe('/Personal-Website/#contact');
    expect(prefixBase('/blog/x/', base)).toBe('/Personal-Website/blog/x/');
  });
  test('works with a base without trailing slash', () => {
    expect(prefixBase('/media/a.png', '/Personal-Website')).toBe('/Personal-Website/media/a.png');
  });
  test('is idempotent', () => {
    expect(prefixBase('/Personal-Website/media/a.png', base)).toBe('/Personal-Website/media/a.png');
    expect(prefixBase(prefixBase('/media/a.png', base), base)).toBe('/Personal-Website/media/a.png');
  });
  test('leaves everything else alone', () => {
    for (const url of ['https://hardcover.app', '//cdn.example.com/a.js', '#section', 'relative/a.png', 'mailto:a@b.c', '']) {
      expect(prefixBase(url, base)).toBe(url);
    }
  });
  test('root base is a no-op', () => {
    expect(prefixBase('/media/a.png', '/')).toBe('/media/a.png');
  });
});

describe('remarkBaseUrl', () => {
  test('rewrites links, images and definitions anywhere in the tree', () => {
    const tree = {
      type: 'root',
      children: [
        { type: 'paragraph', children: [{ type: 'link', url: '/#contact', children: [{ type: 'text' }] }] },
        { type: 'paragraph', children: [{ type: 'image', url: '/media/a.gif' }] },
        { type: 'definition', url: '/media/b.png' },
        { type: 'link', url: 'https://example.com', children: [] },
      ],
    };
    remarkBaseUrl({ base })(tree);
    const urls: string[] = [];
    const collect = (n: any) => {
      if (n.url !== undefined) urls.push(n.url);
      n.children?.forEach(collect);
    };
    collect(tree);
    expect(urls).toEqual([
      '/Personal-Website/#contact',
      '/Personal-Website/media/a.gif',
      '/Personal-Website/media/b.png',
      'https://example.com',
    ]);
  });
});
