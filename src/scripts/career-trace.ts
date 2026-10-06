/**
 * Career trace (Experience section).
 *
 * The component server-renders every span, bar and drawer, so the trace reads
 * fine without JS. This script only enhances it: collapsible drawers (one open
 * by default), a collapsible root, arrow-key navigation, and re-measuring
 * "now" so open spans keep growing between deploys.
 */

const DEFAULT_OPEN = 'swe';

function currentYear(d = new Date()) {
  const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return d.getFullYear() + (d.getMonth() + (d.getDate() - 1) / daysInMonth) / 12;
}

function formatDuration(years: number) {
  const months = Math.round(years * 12);
  const y = Math.floor(months / 12);
  const m = months % 12;
  return y ? `${y}y${m ? ` ${m}m` : ''}` : `${m}mo`;
}

/** Move the "now" marker and stretch still-running spans to today. */
function refreshNow(trace: HTMLElement) {
  const [d0, d1] = (trace.dataset.domain ?? '').split(',').map(Number);
  if (!Number.isFinite(d0) || !Number.isFinite(d1)) return;

  const now = Math.min(currentYear(), d1);
  const pct = (t: number) => ((t - d0) / (d1 - d0)) * 100;

  trace.querySelectorAll<HTMLElement>('[data-now]').forEach((el) => {
    el.style.left = `${pct(now)}%`;
  });

  trace.querySelectorAll<HTMLElement>('[data-trace-item]').forEach((item) => {
    const bar = item.querySelector<HTMLElement>('[data-bar]');
    if (!bar?.classList.contains('running')) return;

    const start = Number(item.dataset.start);
    const width = pct(now) - pct(start);
    bar.style.width = `${width}%`;
    bar.classList.toggle('inside', width > 18);

    const label = formatDuration(now - start);
    trace.querySelectorAll(`[data-dur-of="${item.dataset.traceItem}"]`).forEach((el) => {
      el.textContent = label;
    });
  });
}

export function initCareerTrace() {
  const trace = document.querySelector<HTMLElement>('[data-trace]');
  if (!trace || trace.dataset.enhanced !== undefined) return;

  refreshNow(trace);

  const items = Array.from(trace.querySelectorAll<HTMLElement>('[data-trace-item]'));
  const children = items.filter((item) => item.dataset.depth !== '0');
  const twist = trace.querySelector<HTMLButtonElement>('[data-trace-twist]');

  const spanButton = (item: HTMLElement) => item.querySelector<HTMLButtonElement>('[data-trace-span]')!;

  const setOpen = (item: HTMLElement, open: boolean) => {
    item.classList.toggle('open', open);
    spanButton(item).setAttribute('aria-expanded', String(open));
    const panel = item.querySelector<HTMLElement>('[data-trace-panel]');
    if (panel) panel.inert = !open;
  };

  const setChildrenVisible = (visible: boolean) => {
    if (!twist) return;
    twist.setAttribute('aria-expanded', String(visible));
    twist.setAttribute('aria-label', visible ? 'Collapse child spans' : 'Expand child spans');
    children.forEach((item) => {
      item.hidden = !visible;
    });
  };

  items.forEach((item) => {
    setOpen(item, item.dataset.traceItem === DEFAULT_OPEN);

    const button = spanButton(item);
    button.addEventListener('click', () => setOpen(item, !item.classList.contains('open')));

    // The whole row (bar track included) is a click target; the button keeps focus semantics.
    item.querySelector('[data-trace-row]')?.addEventListener('click', (event) => {
      if ((event.target as Element).closest('button')) return;
      button.click();
    });
  });

  twist?.addEventListener('click', () => setChildrenVisible(twist.getAttribute('aria-expanded') !== 'true'));

  trace.addEventListener('keydown', (event) => {
    const buttons = items.filter((item) => !item.hidden).map(spanButton);
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;

    const item = buttons[index].closest<HTMLElement>('[data-trace-item]')!;
    const isRoot = item.dataset.depth === '0';

    switch (event.key) {
      case 'ArrowDown':
        buttons[Math.min(index + 1, buttons.length - 1)].focus();
        break;
      case 'ArrowUp':
        buttons[Math.max(index - 1, 0)].focus();
        break;
      case 'ArrowLeft':
        if (item.classList.contains('open')) setOpen(item, false);
        else if (isRoot) setChildrenVisible(false);
        else buttons[0].focus();
        break;
      case 'ArrowRight':
        if (isRoot && children[0]?.hidden) setChildrenVisible(true);
        else setOpen(item, true);
        break;
      default:
        return;
    }
    event.preventDefault();
  });

  // Collapse the other drawers without animating them shut on load.
  trace.dataset.enhanced = 'init';
  requestAnimationFrame(() => requestAnimationFrame(() => (trace.dataset.enhanced = '')));
}
