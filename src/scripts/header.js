export function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!hamburger || !mobileMenu || hamburger.dataset.menuInit === 'true') return;
    hamburger.dataset.menuInit = 'true';

    const desktopMediaQuery = window.matchMedia('(min-width: 1024px)');

    function syncMenuAccessibility(isOpen) {
        mobileMenu.setAttribute('aria-hidden', String(!isOpen));
        if (isOpen) {
            mobileMenu.removeAttribute('inert');
        } else {
            mobileMenu.setAttribute('inert', '');
        }
    }

    function openMenu() {
        mobileMenu.classList.add('menu-visible');
        hamburger.classList.add('menu-open');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        syncMenuAccessibility(true);
    }

    function closeMenu() {
        mobileMenu.classList.remove('menu-visible');
        hamburger.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        syncMenuAccessibility(false);
    }

    syncMenuAccessibility(false);

    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.contains('menu-open');
        isOpen ? closeMenu() : openMenu();
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hamburger.classList.contains('menu-open')) {
            closeMenu();
        }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (
            hamburger.classList.contains('menu-open') &&
            !mobileMenu.contains(e.target) &&
            !hamburger.contains(e.target)
        ) {
            closeMenu();
        }
    });

    // Ensure menu does not stay open when switching to desktop viewport
    const handleDesktopSwitch = (event) => {
        if (event.matches) closeMenu();
    };

    if (typeof desktopMediaQuery.addEventListener === 'function') {
        desktopMediaQuery.addEventListener('change', handleDesktopSwitch);
    } else if (typeof desktopMediaQuery.addListener === 'function') {
        desktopMediaQuery.addListener(handleDesktopSwitch);
    }
}
