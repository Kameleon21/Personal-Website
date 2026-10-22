/**
 * The site's routes and the one place the deploy base path is applied.
 *
 * Everything is a pure function of `base`, which defaults to the base Vite
 * inlines at build time (`/Personal-Website/`). Tests pass their own base.
 */

/** The deployed base path. Outside Vite (bun test) there is none, so `/`. */
export const BASE: string = import.meta.env?.BASE_URL ?? '/';

/** Home-page sections, reached as anchors on `/`. */
export const SECTIONS = ['experience', 'projects', 'stack', 'contact'] as const;
export type Section = (typeof SECTIONS)[number];

export type Route = '/' | '/blog' | `/${Section}`;

/** Every route a visitor can land on, in 404 did-you-mean order. */
export const ROUTES: Route[] = ['/', '/blog', '/projects', '/experience', '/stack', '/contact'];

/** Header nav, left to right. `/contact` gets its own button. */
export const NAV_ROUTES: Route[] = ['/experience', '/projects', '/stack', '/blog'];

const isSection = (route: string): route is `/${Section}` => (SECTIONS as readonly string[]).includes(route.slice(1));

/** `/Personal-Website/` → `/Personal-Website`, `/` → `` */
const trimBase = (base: string) => base.replace(/\/+$/, '');

/** Prefix a root-relative path with the base: `/media/a.png` → `/Personal-Website/media/a.png`. */
export function withBase(path: string, base = BASE): string {
  return `${trimBase(base)}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Whether a root-relative path already carries the base. */
export function hasBase(path: string, base = BASE): boolean {
  const b = trimBase(base);
  return b !== '' && (path === b || path.startsWith(`${b}/`) || path.startsWith(`${b}#`) || path.startsWith(`${b}?`));
}

/** Drop the base from a pathname: `/Personal-Website/blog/x/` → `/blog/x/`. */
export function stripBase(pathname: string, base = BASE): string {
  return hasBase(pathname, base) ? pathname.slice(trimBase(base).length) || '/' : pathname;
}

/**
 * Href for a route. Pages are directories on disk (`blog/index.html`), so
 * they get a trailing slash; sections are anchors on the home page.
 */
export function hrefFor(route: Route, base = BASE): string {
  if (route === '/') return withBase('/', base);
  if (isSection(route)) return withBase(`/#${route.slice(1)}`, base);
  return withBase(`${route}/`, base);
}
