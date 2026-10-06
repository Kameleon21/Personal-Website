/**
 * 404 page: severed-cable diagram + incident log.
 *
 * Fills in the requested path (minus the site base), stamps and tails in the
 * incident log with a did-you-mean hint, and draws the cables between the
 * CSS-positioned nodes: root → /projects and /blog pulse, the cable to the
 * missing route is cut and sparking.
 */

type Pt = [number, number];
type Curve = [Pt, Pt, Pt, Pt];
type Box = { x: number; y: number; w: number; h: number };

const ROUTES = ['/', '/blog', '/projects', '/experience', '/stack', '/contact'];
const NARROW = 460;

function levenshtein(a: string, b: string) {
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

type Hint = { kind: 'probe' } | { kind: 'prefix'; route: string } | { kind: 'typo'; route: string } | null;

function suggest(path: string): Hint {
  if (/wp-|\.php|\.env/i.test(path)) return { kind: 'probe' };
  const first = `/${(path.split('/').filter(Boolean)[0] ?? '').toLowerCase()}`;
  if (first !== '/' && ROUTES.includes(first)) return { kind: 'prefix', route: first };

  let best: string | null = null;
  let bestDistance = 3;
  for (const route of ROUTES) {
    if (route === '/') continue;
    const distance = levenshtein(first, route);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = route;
    }
  }
  return best ? { kind: 'typo', route: best } : null;
}

function requestedPath(base: string) {
  let path = location.pathname;
  try {
    path = decodeURI(path);
  } catch {
    /* keep the raw path */
  }
  if (base && (path === base || path.startsWith(`${base}/`))) path = path.slice(base.length) || '/';
  return path;
}

function stamp(offsetMs: number) {
  const d = new Date(Date.now() + offsetMs);
  return `${d.toTimeString().slice(0, 8)}.${String(d.getMilliseconds()).padStart(3, '0')}`;
}

/* ── Incident log ── */

function writeHint(target: HTMLElement, hint: Hint, path: string, hrefFor: (route: string) => string) {
  const link = (route: string) => {
    const a = document.createElement('a');
    a.href = hrefFor(route);
    a.textContent = route;
    return a;
  };
  if (!hint) return false;
  if (hint.kind === 'probe') {
    const segment = path.split('/').filter(Boolean)[0];
    target.append(`this isn't WordPress. nothing to see at ${segment ? `/${segment}` : path}`);
  } else if (hint.kind === 'prefix') {
    target.append(`${hint.route} is up — the rest of the path isn't. try `, link(hint.route));
  } else {
    target.append('did you mean ', link(hint.route), ' ?');
  }
  return true;
}

function tailLog(log: HTMLElement, reducedMotion: boolean) {
  const lines = Array.from(log.querySelectorAll<HTMLElement>('.ln')).filter((line) => !line.hidden);
  lines.forEach((line, i) => {
    const t = line.querySelector('[data-nf-stamp]');
    if (t) t.textContent = stamp(i);
  });
  if (reducedMotion) return;
  log.dataset.animate = '';
  lines.forEach((line, i) => window.setTimeout(() => line.classList.add('in'), 260 + i * 170));
}

/* ── Cables ── */

const fmt = (n: number) => Math.round(n * 10) / 10;
const pathD = (c: Curve) =>
  `M${fmt(c[0][0])},${fmt(c[0][1])} C${c
    .slice(1)
    .map((p) => `${fmt(p[0])},${fmt(p[1])}`)
    .join(' ')}`;

/** de Casteljau split of a cubic at t. */
function split(c: Curve, t: number): [Curve, Curve] {
  const lerp = (p: Pt, q: Pt): Pt => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  const a = lerp(c[0], c[1]);
  const b = lerp(c[1], c[2]);
  const cc = lerp(c[2], c[3]);
  const ab = lerp(a, b);
  const bc = lerp(b, cc);
  const m = lerp(ab, bc);
  return [
    [c[0], a, ab, m],
    [m, bc, cc, c[3]],
  ];
}

function drawCables(stage: HTMLElement, svg: SVGSVGElement, reducedMotion: boolean) {
  const W = stage.clientWidth;
  const narrow = W < NARROW;

  const nodes: Record<string, Box> = {};
  stage.querySelectorAll<HTMLElement>('[data-n]').forEach((el) => {
    nodes[el.dataset.n!] = { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };
  });
  const root = nodes.root;
  if (!root) return;

  // Narrow: each cable drops from its own point on the root's bottom edge.
  const trunk: Record<string, number> = { proj: 62, blog: 42, dead: 22 };
  const from = (to: Box, key: string): Pt =>
    narrow ? [trunk[key], root.y + root.h / 2] : [root.x + root.w / 2, root.y + (to.y - root.y) * 0.18];
  const to = (n: Box): Pt => [n.x - n.w / 2, n.y];
  const curve = (a: Pt, b: Pt): Curve =>
    narrow
      ? [a, [a[0], b[1]], [a[0] + (b[0] - a[0]) * 0.2, b[1]], b]
      : [a, [a[0] + (b[0] - a[0]) * 0.5, a[1]], [b[0] - (b[0] - a[0]) * 0.5, b[1]], b];
  const plug = (p: Pt, cls = 'plug') => `<circle class="${cls}" r="4" cx="${fmt(p[0])}" cy="${fmt(p[1])}"/>`;

  let out = '';
  (['proj', 'blog'] as const).forEach((key, i) => {
    const c = curve(from(nodes[key], key), to(nodes[key]));
    out += `<path id="nf-wire-${key}" class="wire" d="${pathD(c)}"/>${plug(c[0])}${plug(c[3])}`;
    if (!reducedMotion) {
      out += `<circle class="pulse" r="4"><animateMotion dur="2.4s" repeatCount="indefinite" begin="${0.4 + i * 0.6}s" calcMode="spline" keyTimes="0;1" keySplines=".4 0 .6 1"><mpath href="#nf-wire-${key}"/></animateMotion></circle>`;
    }
  });

  // Severed cable: a live stub from the root, and a slack half hanging off the dead node.
  const c = curve(from(nodes.dead, 'dead'), to(nodes.dead));
  const [live] = split(c, narrow ? 0.34 : 0.4);
  const [, deadHalf] = split(c, 0.7);
  const tip = live[3];
  const angle = Math.atan2(live[3][1] - live[2][1], live[3][0] - live[2][0]);
  const droop: Curve = narrow
    ? [[deadHalf[0][0] + 16, deadHalf[0][1] + 14], [deadHalf[1][0] + 4, deadHalf[1][1] + 18], deadHalf[2], deadHalf[3]]
    : [[deadHalf[0][0] - 6, deadHalf[0][1] + 46], [deadHalf[1][0], deadHalf[1][1] + 40], deadHalf[2], deadHalf[3]];
  const droopAngle = Math.atan2(droop[0][1] - droop[1][1], droop[0][0] - droop[1][0]);

  const fray = (p: Pt, a: number) =>
    [-0.5, 0, 0.5]
      .map((da) => `<line x1="${fmt(p[0])}" y1="${fmt(p[1])}" x2="${fmt(p[0] + Math.cos(a + da) * 7)}" y2="${fmt(p[1] + Math.sin(a + da) * 7)}"/>`)
      .join('');
  const sparks = [0, 1, 2, 3, 4, 5]
    .map((i) => {
      const a = angle + (i - 2.5) * 0.55;
      const l1 = 7 + (i % 3) * 3;
      const l2 = l1 + 9 + (i % 2) * 7;
      return `<line class="s${(i % 3) + 1}" x1="${fmt(tip[0] + Math.cos(a) * l1)}" y1="${fmt(tip[1] + Math.sin(a) * l1)}" x2="${fmt(tip[0] + Math.cos(a) * l2)}" y2="${fmt(tip[1] + Math.sin(a) * l2)}" style="transform-origin:${fmt(tip[0])}px ${fmt(tip[1])}px"/>`;
    })
    .join('');
  const label = narrow
    ? `<text class="cut-label" x="${fmt(Math.max(tip[0], 32))}" y="${fmt(tip[1] + 24)}" text-anchor="middle">ECONNRESET</text>`
    : `<text class="cut-label" x="${fmt(tip[0] + 14)}" y="${fmt(tip[1] + 4)}">ECONNRESET</text>`;

  out +=
    `<path class="wire" d="${pathD(live)}"/>${plug(live[0])}` +
    `<g class="fray">${fray(tip, angle)}</g>` +
    `<circle class="glow" cx="${fmt(tip[0])}" cy="${fmt(tip[1])}" r="2"/>` +
    `<circle cx="${fmt(tip[0] + Math.cos(angle) * 3)}" cy="${fmt(tip[1] + Math.sin(angle) * 3)}" r="2.2" fill="#f0b429"/>` +
    `<g class="sparks">${sparks}</g>${label}` +
    `<path class="wire wire-dead" d="${pathD(droop)}"/>` +
    `<g class="fray" opacity=".6">${fray(droop[0], droopAngle)}</g>${plug(droop[3], 'plug-dead')}`;

  svg.innerHTML = out;
}

export function initNotFound() {
  const main = document.querySelector<HTMLElement>('[data-not-found]');
  if (!main || main.dataset.nfInit === 'true') return;
  main.dataset.nfInit = 'true';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const base = main.dataset.base ?? '';
  const hrefFor = (route: string) =>
    route === '/' ? `${base}/` : route === '/blog' ? `${base}/blog` : `${base}/#${route.slice(1)}`;

  const path = requestedPath(base);
  main.querySelectorAll('[data-nf-path]').forEach((el) => {
    el.textContent = path;
  });

  const opened = main.querySelector('[data-nf-opened]');
  if (opened) opened.textContent = `opened ${new Date().toTimeString().slice(0, 5)} · `;

  const hintLine = main.querySelector<HTMLElement>('[data-nf-hint]');
  const hintMsg = main.querySelector<HTMLElement>('[data-nf-hint-msg]');
  if (hintLine && hintMsg) hintLine.hidden = !writeHint(hintMsg, suggest(path), path, hrefFor);

  const log = main.querySelector<HTMLElement>('[data-nf-log]');
  if (log) tailLog(log, reducedMotion);

  const stage = main.querySelector<HTMLElement>('[data-nf-stage]');
  const svg = main.querySelector<SVGSVGElement>('[data-nf-wires]');
  if (!stage || !svg) return;

  const draw = () => drawCables(stage, svg, reducedMotion);
  draw();
  if ('ResizeObserver' in window) {
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    });
    observer.observe(stage);
    stage.querySelectorAll('[data-n]').forEach((node) => observer.observe(node));
  } else {
    window.addEventListener('resize', draw);
  }
}
