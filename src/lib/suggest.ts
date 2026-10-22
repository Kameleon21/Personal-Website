import { ROUTES, type Route } from './routes';

export function levenshtein(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

export type Hint = { kind: 'probe' } | { kind: 'prefix'; route: Route } | { kind: 'typo'; route: Route } | null;

/**
 * Did-you-mean for a 404 path (base already stripped): bot probes get called
 * out, a known first segment is a prefix match, otherwise the nearest route
 * within two edits.
 */
export function suggest(path: string, routes: readonly Route[] = ROUTES): Hint {
  if (/wp-|\.php|\.env/i.test(path)) return { kind: 'probe' };
  const first = `/${(path.split('/').filter(Boolean)[0] ?? '').toLowerCase()}`;
  const known = routes.find((route) => route !== '/' && route === first);
  if (known) return { kind: 'prefix', route: known };

  let best: Route | null = null;
  let bestDistance = 3;
  for (const route of routes) {
    if (route === '/') continue;
    const distance = levenshtein(first, route);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = route;
    }
  }
  return best ? { kind: 'typo', route: best } : null;
}
