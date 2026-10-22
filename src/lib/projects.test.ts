import { describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { demoAlt, demoTitle, mediaPaths, missingMedia, type Demo } from './projects';

const terminal: Demo = { kind: 'terminal', src: 'oku', cwd: '~/oku', shell: 'zsh' };
const device: Demo = { kind: 'device', src: 'tramly', host: 'tramly-theta.vercel.app', device: 'iPhone' };

describe('mediaPaths', () => {
  test('derives all three files under the base', () => {
    expect(mediaPaths('oku', '/Personal-Website/')).toEqual({
      webm: '/Personal-Website/media/oku.webm',
      mp4: '/Personal-Website/media/oku.mp4',
      poster: '/Personal-Website/media/oku-poster.jpg',
    });
  });

  test('tolerates a base without a trailing slash', () => {
    expect(mediaPaths('oku', '/Personal-Website').webm).toBe('/Personal-Website/media/oku.webm');
    expect(mediaPaths('oku').webm).toBe('/media/oku.webm');
  });
});

describe('missingMedia', () => {
  test('lists the files that are not on disk', () => {
    const dir = mkdtempSync(join(tmpdir(), 'media-'));
    try {
      expect(missingMedia('demo', dir)).toEqual(['demo.webm', 'demo.mp4', 'demo-poster.jpg']);
      writeFileSync(join(dir, 'demo.webm'), '');
      writeFileSync(join(dir, 'demo-poster.jpg'), '');
      expect(missingMedia('demo', dir)).toEqual(['demo.mp4']);
      writeFileSync(join(dir, 'demo.mp4'), '');
      expect(missingMedia('demo', dir)).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true });
    }
  });

  test('the shipped demos have all their media', () => {
    const publicMedia = join(import.meta.dir, '../../public/media');
    for (const src of ['tokenlens', 'oku', 'tramly']) expect(missingMedia(src, publicMedia)).toEqual([]);
  });
});

describe('demo chrome', () => {
  test('title depends on kind', () => {
    expect(demoTitle(terminal)).toEqual({ main: '~/oku', sub: 'zsh' });
    expect(demoTitle(device)).toEqual({ main: 'tramly-theta.vercel.app', sub: 'iPhone' });
  });

  test('default alt depends on kind, explicit alt wins', () => {
    expect(demoAlt(terminal, 'Oku')).toBe('Screen recording of Oku running in a terminal');
    expect(demoAlt(device, 'Tramly')).toBe('Screen recording of Tramly on iPhone');
    expect(demoAlt({ ...device, alt: 'Custom' }, 'Tramly')).toBe('Custom');
  });
});
