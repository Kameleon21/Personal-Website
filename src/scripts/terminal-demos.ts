/**
 * Terminal recordings on the project cards.
 *
 * Videos are `preload="none"` with a poster, so nothing downloads until a card
 * is at least half in view. They play muted + looped only while visible and
 * pause when scrolled away. With reduced motion they never autoplay: the card
 * shows a play button instead. A missing recording falls back to the faux
 * terminal rendered behind the video.
 */

type State = 'playing' | 'paused';

export function initTerminalDemos() {
  const screens = Array.from(document.querySelectorAll<HTMLElement>('[data-demo]'));
  if (!screens.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const players = new Map<Element, { video: HTMLVideoElement; userPaused: boolean; play: () => void }>();

  screens.forEach((screen) => {
    if (screen.dataset.demoInit === 'true') return;
    screen.dataset.demoInit = 'true';

    const video = screen.querySelector('video');
    const toggle = screen.querySelector<HTMLButtonElement>('[data-demo-toggle]');
    const card = screen.closest<HTMLElement>('[data-demo-card]');
    if (!video || !toggle || !card) return;

    const name = screen.dataset.demo;
    const setState = (state: State) => {
      card.dataset.state = state;
      toggle.setAttribute('aria-label', `${state === 'playing' ? 'Pause' : 'Play'} ${name} recording`);
    };

    const markBroken = () => {
      screen.classList.add('broken');
      delete card.dataset.state;
    };
    // Every <source> failing surfaces as an error on the last one.
    video.querySelector('source:last-of-type')?.addEventListener('error', markBroken);

    const player = {
      video,
      userPaused: false,
      play() {
        if (screen.classList.contains('broken')) return;
        video.play().catch(() => {
          if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) markBroken();
        });
      },
    };
    players.set(screen, player);

    video.addEventListener('playing', () => setState('playing'));
    video.addEventListener('pause', () => setState('paused'));

    toggle.addEventListener('click', () => {
      if (video.paused) {
        player.userPaused = false;
        player.play();
      } else {
        player.userPaused = true;
        video.pause();
      }
    });

    if (reducedMotion.matches || !('IntersectionObserver' in window)) setState('paused');
  });

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const player = players.get(entry.target);
        if (!player) return;
        // isIntersecting is true at any overlap; only play once half is visible.
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (!reducedMotion.matches && !player.userPaused) player.play();
        } else if (!player.video.paused) {
          player.video.pause();
        }
      });
    },
    { threshold: 0.5 },
  );

  players.forEach((_, screen) => observer.observe(screen));
}
