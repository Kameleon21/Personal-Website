/**
 * Live-wire hero canvas.
 *
 * Every node in the desktop architecture diagram is draggable. Nodes keep their
 * CSS layout position (`left/top` + `--tx` centring) as a base and the script
 * only drives a delta (`--dx/--dy`), so the diagram stays responsive and the
 * no-JS state is the plain static layout.
 *
 * Connectors are SVG cables that sag like real wire. Edges act as springs, so
 * dragging one node tugs its neighbours; each node also has a "home" spring
 * so the tug is partial and everything settles after release.
 */

type HeroNode = {
  id: string;
  el: HTMLElement;
  bx: number;
  by: number;
  dx: number;
  dy: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  hx: number;
  hy: number;
  mass: number;
  physical: boolean;
  dragging: boolean;
};

type Edge = {
  from: HeroNode;
  to: HeroNode;
  wire: SVGPathElement;
  glow: SVGPathElement;
  plugA: SVGCircleElement;
  plugB: SVGCircleElement;
  pulse: SVGCircleElement | null;
  restX: number;
  restY: number;
};

type Box = { x: number; y: number; w: number; h: number };

const K_EDGE = 0.03;
const K_HOME = 0.08;
const K_BOUND = 0.08;
const DAMP = 0.8;
const PULSE_MS = 2400;
const XLINK_NS = 'http://www.w3.org/1999/xlink';

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** Pick the facing sides of two boxes so a cable never crosses a node. */
function anchors(a: Box, b: Box) {
  const A = { l: a.x, t: a.y, r: a.x + a.w, b: a.y + a.h, cx: a.x + a.w / 2, cy: a.y + a.h / 2 };
  const B = { l: b.x, t: b.y, r: b.x + b.w, b: b.y + b.h, cx: b.x + b.w / 2, cy: b.y + b.h / 2 };
  if (B.t >= A.b + 18) return { ax: A.cx, ay: A.b, bx: B.cx, by: B.t, dir: 'v', sign: 1 };
  if (B.b <= A.t - 18) return { ax: A.cx, ay: A.t, bx: B.cx, by: B.b, dir: 'v', sign: -1 };
  const sideClear = B.l >= A.r - 18 || B.r <= A.l + 18;
  if (sideClear) {
    if (B.cx >= A.cx) return { ax: A.r, ay: A.cy, bx: B.l, by: B.cy, dir: 'h', sign: 1 };
    return { ax: A.l, ay: A.cy, bx: B.r, by: B.cy, dir: 'h', sign: -1 };
  }
  // Boxes overlap on both axes: plug straight through behind the nodes.
  if (B.cy >= A.cy) return { ax: A.cx, ay: A.b, bx: B.cx, by: B.t, dir: 'v', sign: 1 };
  return { ax: A.cx, ay: A.t, bx: B.cx, by: B.b, dir: 'v', sign: -1 };
}

/** Cubic bezier that sags under its own weight; pulls tight while dragged. */
function wirePath(a: Box, b: Box, taut: boolean) {
  const p = anchors(a, b);
  const d = Math.hypot(p.bx - p.ax, p.by - p.ay);
  const sag = clamp(d * 0.35, 10, 130) * (taut ? 0.5 : 1);
  const g = clamp(d * 0.12, 4, 40) * (taut ? 0.3 : 1);
  let c1: [number, number];
  let c2: [number, number];
  if (p.dir === 'v') {
    c1 = [p.ax, p.ay + p.sign * sag + g];
    c2 = [p.bx, p.by - p.sign * sag + g];
  } else {
    c1 = [p.ax + p.sign * sag, p.ay + g];
    c2 = [p.bx - p.sign * sag, p.by + g];
  }
  return {
    d: `M${p.ax} ${p.ay} C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p.bx} ${p.by}`,
    a: [p.ax, p.ay] as const,
    b: [p.bx, p.by] as const,
  };
}

export function initHeroCanvas(): void {
  const stage = document.querySelector<HTMLElement>('[data-hero-stage]');
  if (!stage || stage.dataset.live === 'true') return;
  stage.dataset.live = 'true';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const nodes: HeroNode[] = Array.from(stage.querySelectorAll<HTMLElement>('[data-node]')).map((el) => ({
    id: el.dataset.node ?? '',
    el,
    bx: 0, by: 0, dx: 0, dy: 0, w: 0, h: 0, vx: 0, vy: 0, hx: 0, hy: 0,
    mass: Number(el.dataset.mass ?? 1) || 1,
    physical: el.dataset.physics !== 'off',
    dragging: false,
  }));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const physical = nodes.filter((n) => n.physical);

  const edges: Edge[] = [];
  stage.querySelectorAll<SVGGElement>('[data-edge]').forEach((g) => {
    const [fromId, toId] = (g.dataset.edge ?? '').split(':');
    const from = byId.get(fromId);
    const to = byId.get(toId);
    const wire = g.querySelector<SVGPathElement>('[data-wire]');
    const glow = g.querySelector<SVGPathElement>('[data-glow]');
    const plugA = g.querySelector<SVGCircleElement>('[data-plug-a]');
    const plugB = g.querySelector<SVGCircleElement>('[data-plug-b]');
    if (!from || !to || !wire || !glow || !plugA || !plugB) return;
    const pulse = g.querySelector<SVGCircleElement>('[data-pulse]');
    if (pulse && reduceMotion) pulse.remove();
    edges.push({ from, to, wire, glow, plugA, plugB, pulse: reduceMotion ? null : pulse, restX: 0, restY: 0 });
  });

  // Safari still wants the xlink form on <mpath>.
  stage.querySelectorAll<SVGElement>('mpath').forEach((m) => {
    const href = m.getAttribute('href');
    if (href) m.setAttributeNS(XLINK_NS, 'xlink:href', href);
  });

  const W = () => stage.clientWidth;
  const H = () => stage.clientHeight;
  const box = (n: HeroNode): Box => ({ x: n.bx + n.dx, y: n.by + n.dy, w: n.w, h: n.h });
  const cx = (n: HeroNode) => n.bx + n.dx + n.w / 2;
  const cy = (n: HeroNode) => n.by + n.dy + n.h / 2;

  /** Read the CSS layout position (ignores transforms) as the node's base. */
  function measure() {
    nodes.forEach((n) => {
      n.w = n.el.offsetWidth;
      n.h = n.el.offsetHeight;
      const tx = parseFloat(getComputedStyle(n.el).getPropertyValue('--tx')) || 0;
      n.bx = n.el.offsetLeft + (n.w * tx) / 100;
      n.by = n.el.offsetTop;
    });
  }

  function move(n: HeroNode, dx: number, dy: number) {
    n.dx = dx;
    n.dy = dy;
    n.el.style.setProperty('--dx', `${dx}px`);
    n.el.style.setProperty('--dy', `${dy}px`);
  }
  const setRot = (n: HeroNode, deg: number) => n.el.style.setProperty('--rot', `${deg.toFixed(2)}deg`);

  /**
   * Read the on-screen delta while a CSS transition is running so the cables
   * follow the nodes during reset instead of jumping ahead.
   */
  function liveBox(n: HeroNode): Box {
    const dx = parseFloat(getComputedStyle(n.el).getPropertyValue('--dx')) || 0;
    const dy = parseFloat(getComputedStyle(n.el).getPropertyValue('--dy')) || 0;
    return { x: n.bx + dx, y: n.by + dy, w: n.w, h: n.h };
  }

  function redraw(live = false) {
    edges.forEach((e) => {
      const taut = e.from.dragging || e.to.dragging;
      const w = wirePath(live ? liveBox(e.from) : box(e.from), live ? liveBox(e.to) : box(e.to), taut);
      e.wire.setAttribute('d', w.d);
      e.glow.setAttribute('d', w.d);
      e.wire.classList.toggle('taut', taut);
      e.glow.classList.toggle('taut', taut);
      e.plugA.setAttribute('cx', String(w.a[0]));
      e.plugA.setAttribute('cy', String(w.a[1]));
      e.plugB.setAttribute('cx', String(w.b[0]));
      e.plugB.setAttribute('cy', String(w.b[1]));
    });
  }

  /** Current geometry becomes the new rest state: springs stop pulling. */
  function settleRest() {
    edges.forEach((e) => {
      e.restX = cx(e.to) - cx(e.from);
      e.restY = cy(e.to) - cy(e.from);
    });
    physical.forEach((n) => {
      n.hx = n.dx;
      n.hy = n.dy;
      n.vx = 0;
      n.vy = 0;
    });
  }

  /* ── physics loop ── */
  let raf = 0;
  let sleeping = true;
  function wake() {
    if (!sleeping) return;
    sleeping = false;
    raf = requestAnimationFrame(step);
  }
  function step() {
    let active = false;
    const width = W();
    const height = H();
    if (!reduceMotion) {
      edges.forEach((e) => {
        const fx = (cx(e.to) - cx(e.from) - e.restX) * K_EDGE;
        const fy = (cy(e.to) - cy(e.from) - e.restY) * K_EDGE;
        if (!e.from.dragging && e.from.physical) { e.from.vx += fx / e.from.mass; e.from.vy += fy / e.from.mass; }
        if (!e.to.dragging && e.to.physical) { e.to.vx -= fx / e.to.mass; e.to.vy -= fy / e.to.mass; }
      });
    }
    physical.forEach((n) => {
      if (n.dragging) { n.hx = n.dx; n.hy = n.dy; return; }
      n.vx += ((n.hx - n.dx) * K_HOME) / n.mass;
      n.vy += ((n.hy - n.dy) * K_HOME) / n.mass;
      const x = n.bx + n.dx;
      const y = n.by + n.dy;
      if (x < 0) n.vx -= x * K_BOUND;
      if (x + n.w > width) n.vx -= (x + n.w - width) * K_BOUND;
      if (y < 0) n.vy -= y * K_BOUND;
      if (y + n.h > height) n.vy -= (y + n.h - height) * K_BOUND;
      n.vx *= DAMP;
      n.vy *= DAMP;
      if (Math.abs(n.vx) > 0.02 || Math.abs(n.vy) > 0.02) {
        move(n, n.dx + n.vx, n.dy + n.vy);
        setRot(n, clamp(n.vx * 0.35, -4, 4));
        active = true;
      } else {
        n.vx = 0;
        n.vy = 0;
      }
    });
    redraw();
    if (!active && !nodes.some((n) => n.dragging)) {
      sleeping = true;
      settleRest();
      physical.forEach((n) => setRot(n, 0));
      redraw();
      return;
    }
    raf = requestAnimationFrame(step);
  }

  /* ── drag ── */
  nodes.forEach((n) => {
    const el = n.el;
    let dragged = false;

    // A real drag must not follow the link; a plain click still navigates.
    el.addEventListener('click', (e) => {
      if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; }
    }, true);

    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      const startX = e.clientX;
      const startY = e.clientY;
      const originX = n.dx;
      const originY = n.dy;
      let lastX = e.clientX;
      let lastY = e.clientY;
      let lastT = performance.now();
      let moving = false;
      dragged = false;
      n.vx = 0;
      n.vy = 0;

      const onMove = (ev: PointerEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (!moving) {
          if (Math.hypot(dx, dy) < 4) return;
          moving = true;
          dragged = true;
          n.dragging = true;
          el.classList.add('dragging');
          stage.classList.add('is-dragging');
          wake();
        }
        const now = performance.now();
        const dt = Math.max(1, now - lastT);
        n.vx = ((ev.clientX - lastX) / dt) * 16;
        n.vy = ((ev.clientY - lastY) / dt) * 16;
        lastX = ev.clientX;
        lastY = ev.clientY;
        lastT = now;
        move(n, originX + dx, originY + dy);
        setRot(n, clamp(n.vx * 0.4, -6, 6));
        if (sleeping) redraw();
      };
      const onUp = () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerup', onUp);
        el.removeEventListener('pointercancel', onUp);
        el.classList.remove('dragging');
        stage.classList.remove('is-dragging');
        if (!moving) return;
        n.dragging = false;
        if (reduceMotion || !n.physical) {
          n.vx = 0;
          n.vy = 0;
          setRot(n, 0);
        } else {
          // Fling: the node's new home is where the throw would carry it.
          n.hx = clamp(n.dx + n.vx * 4, -n.bx, W() - n.w - n.bx);
          n.hy = clamp(n.dy + n.vy * 4, -n.by, H() - n.h - n.by);
        }
        wake();
        if (sleeping) redraw();
      };
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerup', onUp);
      el.addEventListener('pointercancel', onUp);
    });

    // Keyboard nudge for focused nodes (10px, shift for 1px).
    el.addEventListener('keydown', (e) => {
      const stepPx = e.shiftKey ? 1 : 10;
      const map: Record<string, [number, number]> = {
        ArrowLeft: [-stepPx, 0], ArrowRight: [stepPx, 0], ArrowUp: [0, -stepPx], ArrowDown: [0, stepPx],
      };
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();
      move(n, n.dx + d[0], n.dy + d[1]);
      n.hx = n.dx;
      n.hy = n.dy;
      wake();
      if (sleeping) redraw();
    });
  });

  /* ── health-check readouts, timed to each pulse's arrival ── */
  const setStatus = (n: HeroNode, text: string, tone: 'ok' | 'bad') => {
    const s = n.el.querySelector<HTMLElement>('[data-status]');
    if (!s) return;
    s.textContent = text;
    s.dataset.tone = tone;
  };
  edges.forEach((e) => {
    if (!e.pulse) return;
    const anim = e.pulse.querySelector('animateMotion');
    const begin = parseFloat(anim?.getAttribute('begin') ?? '0') || 0;
    const arrive = () => setStatus(e.to, `● 200 OK · ${9 + Math.floor(Math.random() * 28)}ms`, 'ok');
    window.setTimeout(() => {
      arrive();
      window.setInterval(arrive, PULSE_MS);
    }, begin * 1000 + PULSE_MS);
  });

  /* ── tools: chaos monkey + reset ── */
  const health = stage.querySelector<HTMLElement>('[data-health]');
  let chaosTimer = 0;
  function chaos() {
    physical.forEach((n) => {
      if (n.id === 'root') return;
      n.vx += (Math.random() - 0.5) * 44;
      n.vy += (Math.random() - 0.5) * 30;
    });
    if (health) {
      health.textContent = '● DEGRADED';
      health.classList.add('degraded');
    }
    const root = byId.get('root');
    if (root) {
      root.el.classList.remove('jolt');
      void root.el.offsetWidth;
      root.el.classList.add('jolt');
    }
    physical.forEach((n) => setStatus(n, '● 503 · retrying…', 'bad'));
    wake();
    window.clearTimeout(chaosTimer);
    chaosTimer = window.setTimeout(() => {
      if (health) {
        health.textContent = '● HEALTHY';
        health.classList.remove('degraded');
      }
      root?.el.classList.remove('jolt');
    }, 2600);
  }
  function reset() {
    cancelAnimationFrame(raf);
    sleeping = true;
    nodes.forEach((n) => {
      n.el.classList.add('settling');
      n.vx = 0;
      n.vy = 0;
      move(n, 0, 0);
      setRot(n, 0);
    });
    const ms = reduceMotion ? 0 : 600;
    const t0 = performance.now();
    const tick = () => {
      redraw(true);
      if (performance.now() - t0 < ms) requestAnimationFrame(tick);
      else {
        nodes.forEach((n) => n.el.classList.remove('settling'));
        settleRest();
        redraw();
      }
    };
    requestAnimationFrame(tick);
  }
  document.querySelector('[data-hero-chaos]')?.addEventListener('click', chaos);
  document.querySelector('[data-hero-reset]')?.addEventListener('click', reset);

  /* ── init + keep in sync with layout changes ── */
  function relayout() {
    measure();
    nodes.forEach((n) => {
      if (n.dx || n.dy) {
        move(n, clamp(n.dx, -n.bx - 20, W() - n.w - n.bx + 20), clamp(n.dy, -n.by - 10, H() - n.h - n.by + 10));
      }
    });
    if (sleeping) settleRest();
    redraw();
  }
  relayout();
  stage.classList.add('is-live');
  new ResizeObserver(relayout).observe(stage);
  if (document.fonts?.ready) document.fonts.ready.then(relayout);
}
