import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { BASE, withBase } from './routes';

/**
 * Project demos: a looping screen recording on the project card.
 *
 * A terminal demo is a TUI recorded in a shell and gets window chrome with a
 * cwd / shell title. A device demo is a recording of an app on a device
 * (e.g. a PWA on an iPhone) and gets a plain frame labelled with the device.
 *
 * Every demo `src` maps to three files in `public/media`: a webm, an mp4
 * fallback and a poster frame. The content schema checks they exist, so a
 * missing recording fails the build instead of shipping a broken card.
 */

type DemoBase = { src: string; alt?: string };
export type TerminalDemo = DemoBase & { kind: 'terminal'; cwd: string; shell: string };
export type DeviceDemo = DemoBase & { kind: 'device'; host: string; device: string };
export type Demo = TerminalDemo | DeviceDemo;

export const MEDIA_DIR = 'media';

/** File names for a demo's recording, relative to the media directory. */
export function mediaFiles(src: string) {
  return {
    webm: `${src}.webm`,
    mp4: `${src}.mp4`,
    poster: `${src}-poster.jpg`,
  };
}

/** Public URLs for a demo's recording under the site base. */
export function mediaPaths(src: string, base = BASE) {
  const files = mediaFiles(src);
  return {
    webm: withBase(`/${MEDIA_DIR}/${files.webm}`, base),
    mp4: withBase(`/${MEDIA_DIR}/${files.mp4}`, base),
    poster: withBase(`/${MEDIA_DIR}/${files.poster}`, base),
  };
}

/** Media files for `src` that are missing from `mediaDir` (e.g. `public/media`). */
export function missingMedia(src: string, mediaDir: string): string[] {
  return Object.values(mediaFiles(src)).filter((file) => !existsSync(join(mediaDir, file)));
}

/** Title shown in the card's top bar. */
export function demoTitle(demo: Demo): { main: string; sub: string } {
  return demo.kind === 'terminal'
    ? { main: demo.cwd, sub: demo.shell }
    : { main: demo.host, sub: demo.device };
}

export function demoAlt(demo: Demo, projectName: string): string {
  if (demo.alt) return demo.alt;
  return demo.kind === 'terminal'
    ? `Screen recording of ${projectName} running in a terminal`
    : `Screen recording of ${projectName} on ${demo.device}`;
}
