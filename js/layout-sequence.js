(function() {
    'use strict';
    
    // Layout Sequence Module
    window.LayoutSequence = {
        init: function() {
            const headerPlaceholder = document.getElementById('header-placeholder');
            const placeholder = document.getElementById('header-loading-placeholder');
            const contentContainer = document.getElementById('main-content-container');
            // Flexible hero detection is performed dynamically inside setHeroHeight for SPA safety
            
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
                    return false; // Header not ready
                }

                // Dynamically resolve the hero each time (SPA navigation safe)
                const heroSection = document.querySelector('.hero-section') ||
                                   document.querySelector('#hero') ||
                                   document.querySelector('section[class*="hero"]') ||
                                   document.querySelector('.hero');
                const isFixedHero = !!(heroSection && heroSection.hasAttribute('data-fixed-hero'));

                // 1. Clean up previous styles to ensure a single source of truth
                if (heroSection) {
                    if (isFixedHero) {
                        // Respect fixed-height heroes: ensure no inline overrides remain
                        heroSection.style.removeProperty('height');
                        heroSection.style.removeProperty('min-height');
                        heroSection.style.removeProperty('padding-top');
                        document.documentElement.style.removeProperty('--header-height');
                        return true;
                    }
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
                if (heroSection && !isFixedHero) {
                    const exactHeroHeight = viewportHeight - exactHeaderHeight;
                    heroSection.style.height = `${exactHeroHeight}px`;
                    heroSection.style.minHeight = `${exactHeroHeight}px`;

                    // 4. Force an immediate browser reflow to apply the style
                    heroSection.offsetHeight;

                    // Optional: Log hero height calculation (useful for debugging)
                    // console.log(`🎯 Hero height: ${exactHeroHeight}px (${viewportHeight}vh - ${exactHeaderHeight}px header)`);
                    return true;
                }
                return false;
            }

            // Retry helper: attempts to set hero height across multiple frames/timeouts
            function ensureHeroCalculated(maxAttempts = 30, delayMs = 80) {
                let attempt = 0;
                function tryCalc() {
                    const ok = setHeroHeight();
                    if (ok) return;
                    attempt++;
                    if (attempt < maxAttempts) {
                        setTimeout(() => requestAnimationFrame(tryCalc), delayMs);
                    }
                }
                tryCalc();
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
                        ensureHeroCalculated();
                        completeHeaderLoad();
                    } else if (attempts > maxAttempts) {
                        clearInterval(interval);
                        console.warn('Header failed to load in time. Forcing layout unlock.');
                        ensureHeroCalculated();
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
            window.addEventListener('resize', () => {
                // Avoid overriding fixed-height heroes on resize
                ensureHeroCalculated(4, 30);
            });

            // Also re-run once everything (images/fonts) is loaded
            window.addEventListener('load', () => ensureHeroCalculated());

            // Re-calc on SPA navigations and history changes
            window.addEventListener('popstate', () => setTimeout(() => ensureHeroCalculated(30, 80), 0));
            window.addEventListener('hashchange', () => setTimeout(() => ensureHeroCalculated(30, 80), 0));
            document.addEventListener('spa:navigated', () => setTimeout(() => ensureHeroCalculated(30, 80), 0));

            // Patch history API to detect SPA navigations
            (function patchHistoryForSpa(){
                if (window.__layoutSequenceHistoryPatched) return;
                window.__layoutSequenceHistoryPatched = true;
                const { pushState, replaceState } = history;
                function emitSpaNavigated(){
                    try { document.dispatchEvent(new Event('spa:navigated')); } catch(e) {}
                }
                history.pushState = function(){
                    const res = pushState.apply(this, arguments);
                    setTimeout(emitSpaNavigated, 0);
                    return res;
                };
                history.replaceState = function(){
                    const res = replaceState.apply(this, arguments);
                    setTimeout(emitSpaNavigated, 0);
                    return res;
                };
            })();

            // Mutation observer: when hero mounts/replaces within main container, recalc
            try {
                const observer = new MutationObserver((mutations) => {
                    for (const m of mutations) {
                        if (m.type === 'childList') {
                            const added = Array.from(m.addedNodes || []);
                            if (added.some(n => n.nodeType === 1 && (
                                n.matches?.('.hero-section, #hero, section[class*="hero"], .hero') ||
                                n.querySelector?.('.hero-section, #hero, section[class*="hero"], .hero')
                            ))) {
                                // Defer to next frame to ensure layout is ready
                                requestAnimationFrame(() => ensureHeroCalculated(30, 80));
                                break;
                            }
                        }
                    }
                });
                if (contentContainer) {
                    observer.observe(contentContainer, { childList: true, subtree: true });
                }
            } catch (e) {
                console.warn('MutationObserver unavailable:', e);
            }

            // Expose manual refresh hook for SPA routers
            window.LayoutSequence.refresh = function() {
                ensureHeroCalculated();
            };

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
