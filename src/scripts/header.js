export function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');

    hamburger?.addEventListener('click', () => {
        const isOpen = hamburger.classList.contains('active');
        
        if (!isOpen) {
            // Opening the menu
            mobileNav?.classList.add('active');
            hamburger.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            // Closing the menu
            mobileNav?.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    const mobileLinks = mobileNav?.querySelectorAll('a');
    mobileLinks?.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav?.classList.remove('active');
            hamburger?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking backdrop
    mobileNav?.addEventListener('click', (e) => {
        if (e.target === mobileNav || e.target.classList.contains('backdrop-blur-sm')) {
            mobileNav.classList.remove('active');
            hamburger?.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hamburger?.classList.contains('active')) {
            mobileNav?.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
} 