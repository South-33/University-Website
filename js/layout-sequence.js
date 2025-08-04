(function() {
    'use strict';
    
    // Layout Sequence Module
    window.LayoutSequence = {
        init: function() {
            const headerPlaceholder = document.getElementById('header-placeholder');
            const placeholder = document.getElementById('header-loading-placeholder');
            const contentContainer = document.getElementById('main-content-container');
            // Flexible hero section detection - supports multiple common patterns
            const heroSection = document.querySelector('.hero-section') || 
                               document.querySelector('#hero') || 
                               document.querySelector('section[class*="hero"]') || 
                               document.querySelector('.hero');
            
            // Early exit if critical elements are missing
            if (!headerPlaceholder || !placeholder || !contentContainer) {
                console.warn('⚠️  Layout sequence elements missing. Skipping initialization.');
                if (contentContainer) contentContainer.style.opacity = '1';
                return;
            }

            let freezeState = {
                isFrozen: true,
                originalY: 0,
            };

            function absoluteScrollFreeze() {
                if (freezeState.isFrozen) {
                    document.documentElement.style.scrollBehavior = 'auto';
                    document.body.style.scrollBehavior = 'auto';
                    window.scrollTo(0, freezeState.originalY);
                }
            }

            function setHeroHeight() {
                const header = document.querySelector('header');
                if (!header || header.offsetHeight === 0) {
                    return; // Header not ready
                }

                // 1. Clean up previous styles to ensure a single source of truth
                if (heroSection) {
                    heroSection.style.removeProperty('height');
                    heroSection.style.removeProperty('min-height');
                    heroSection.style.removeProperty('padding-top');
                }
                document.documentElement.style.removeProperty('--header-height');

                // 2. Perform precise measurements
                const viewportHeight = window.innerHeight;
                const headerRect = header.getBoundingClientRect();
                const exactHeaderHeight = Math.round(headerRect.height);
                
                // 3. Set the definitive height in pixels (only for hero section if it exists)
                if (heroSection) {
                    const exactHeroHeight = viewportHeight - exactHeaderHeight;
                    heroSection.style.height = `${exactHeroHeight}px`;
                    heroSection.style.minHeight = `${exactHeroHeight}px`;

                    // 4. Force an immediate browser reflow to apply the style
                    heroSection.offsetHeight;

                    // Optional: Log hero height calculation (useful for debugging)
                    // console.log(`🎯 Hero height: ${exactHeroHeight}px (${viewportHeight}vh - ${exactHeaderHeight}px header)`);
                }
            }

            function completeHeaderLoad() {
                freezeState.isFrozen = false;
                window.removeEventListener('scroll', absoluteScrollFreeze);

                placeholder.style.transition = 'opacity 0.1s ease-out';
                placeholder.style.opacity = '0';
                contentContainer.style.opacity = '1';

                setTimeout(() => {
                    placeholder.style.display = 'none';
                    document.documentElement.style.scrollBehavior = '';
                    document.body.style.scrollBehavior = '';
                    document.body.classList.remove('body-loading');
                    
                    // Call page-specific initialization if available (SPA compatibility)
                    if (typeof window.initializePage === 'function') {
                        try {
                            window.initializePage();
                        } catch (error) {
                            console.warn('Page initialization failed:', error);
                        }
                    }
                    
                    console.log('✅ Layout sequence complete');
                }, 100);
            }

            function initializeLayoutSequence() {
                console.log('🚀 Initializing Unified Layout Sequence...');
                freezeState.originalY = window.pageYOffset || document.documentElement.scrollTop;
                window.addEventListener('scroll', absoluteScrollFreeze, { passive: false });

                let attempts = 0;
                const maxAttempts = 50; // ~1 second

                const interval = setInterval(() => {
                    const header = document.querySelector('header');
                    attempts++;

                    if (header && header.offsetHeight > 0) {
                        clearInterval(interval);
                        setHeroHeight();
                        completeHeaderLoad();
                    } else if (attempts > maxAttempts) {
                        clearInterval(interval);
                        console.warn('Header failed to load in time. Forcing layout unlock.');
                        completeHeaderLoad();
                    }
                }, 20);
            }

            // Initialize on DOM ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeLayoutSequence);
            } else {
                initializeLayoutSequence();
            }

            // Re-calculate on resize for responsive correctness
            window.addEventListener('resize', setHeroHeight);

            // Layout sequence initialized successfully
        }
    };

    // Auto-initialize if called directly
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.LayoutSequence.init);
    } else {
        window.LayoutSequence.init();
    }
})();
