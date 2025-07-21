// js/main.js

document.addEventListener('DOMContentLoaded', function() {

    // =========================================================================
    //  SMART DEVICE DETECTION & ANIMATION SYSTEM
    // =========================================================================
    
    // Utility function for development environment detection (used throughout)
    const isDevelopment = () => {
        const hostname = window.location.hostname;
        return hostname === 'localhost' || hostname === '127.0.0.1';
    };

    /**
     * Smart device capability detection that works on any device
     * from smart fridges to high-end gaming phones
     */
    const DeviceCapabilities = (() => {
        // Detect hardware capabilities with fallbacks for any device
        const hardwareConcurrency = navigator.hardwareConcurrency || 2;
        const deviceMemory = navigator.deviceMemory || 2;
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        // Screen and viewport detection
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const screenWidth = window.screen?.width || viewportWidth;
        const screenHeight = window.screen?.height || viewportHeight;
        const pixelRatio = window.devicePixelRatio || 1;
        
        // Performance benchmarking
        const performanceBenchmark = (() => {
            const start = performance.now();
            // Simple CPU test
            for (let i = 0; i < 10000; i++) {
                Math.random() * Math.PI;
            }
            return performance.now() - start;
        })();
        
        // Network capability detection
        const networkSpeed = connection ? (
            connection.effectiveType === '4g' ? 'fast' :
            connection.effectiveType === '3g' ? 'medium' :
            connection.effectiveType === '2g' ? 'slow' : 'unknown'
        ) : 'unknown';
        
        // Device classification with smart detection
        const deviceClass = (() => {
            // Smart fridge/IoT device detection
            if (screenWidth <= 800 && hardwareConcurrency <= 2 && deviceMemory <= 1) {
                return 'iot';
            }
            // Low-end mobile/tablet
            if (hardwareConcurrency <= 2 || deviceMemory <= 2 || performanceBenchmark > 5) {
                return 'low-end';
            }
            // Mid-range device
            if (hardwareConcurrency <= 4 || deviceMemory <= 4 || performanceBenchmark > 2) {
                return 'mid-range';
            }
            // High-end device
            return 'high-end';
        })();
        
        // Form factor detection
        const formFactor = (() => {
            if (viewportWidth < 480) return 'phone';
            if (viewportWidth < 768) return 'large-phone';
            if (viewportWidth < 1024) return 'tablet';
            if (viewportWidth < 1440) return 'laptop';
            return 'desktop';
        })();
        
        // Animation profile based on device capabilities
        const animationProfile = (() => {
            const profiles = {
                'iot': {
                    fps: 15,
                    duration: 1200,
                    easing: 'linear',
                    effects: 'minimal',
                    transitions: 'instant'
                },
                'low-end': {
                    fps: 30,
                    duration: 800,
                    easing: 'ease-out',
                    effects: 'reduced',
                    transitions: 'fast'
                },
                'mid-range': {
                    fps: 60,
                    duration: 600,
                    easing: 'cubic-bezier',
                    effects: 'standard',
                    transitions: 'smooth'
                },
                'high-end': {
                    fps: 60,
                    duration: 400,
                    easing: 'cubic-bezier',
                    effects: 'enhanced',
                    transitions: 'fluid'
                }
            };
            return profiles[deviceClass];
        })();
        
        // Accessibility considerations
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
        
        // Final animation settings with accessibility overrides
        const finalSettings = {
            ...animationProfile,
            // Override for accessibility
            duration: prefersReducedMotion ? Math.min(animationProfile.duration, 200) : animationProfile.duration,
            easing: prefersReducedMotion ? 'linear' : animationProfile.easing,
            effects: prefersReducedMotion ? 'minimal' : animationProfile.effects
        };
        
        // Log device detection info (only in development)
        if (isDevelopment()) {
            console.log('🎯 Smart Device Detection:', {
                deviceClass,
                formFactor,
                hardwareConcurrency,
                deviceMemory: deviceMemory + 'GB',
                networkSpeed,
                performanceBenchmark: Math.round(performanceBenchmark) + 'ms',
                animationProfile: finalSettings,
                accessibility: { prefersReducedMotion, prefersHighContrast }
            });
        }
        
        return {
            deviceClass,
            formFactor,
            hardwareConcurrency,
            deviceMemory,
            networkSpeed,
            performanceBenchmark,
            screenWidth,
            screenHeight,
            viewportWidth,
            pixelRatio,
            prefersReducedMotion,
            prefersHighContrast,
            animation: finalSettings
        };
    })();
    
    /**
     * Universal Animation Controller
     * Adapts to any device from smart fridges to gaming rigs
     */
    const AnimationController = {
        // Get frame interval based on device capabilities
        getFrameInterval() {
            return 1000 / DeviceCapabilities.animation.fps;
        },
        
        // Get animation duration based on device and context
        getDuration(context = 'default') {
            const base = DeviceCapabilities.animation.duration;
            const multipliers = {
                'page-transition': 1.0,
                'header-hide': 0.3,
                'search-dropdown': 0.5,
                'fade-in': 0.8
            };
            return Math.round(base * (multipliers[context] || 1));
        },
        
        // Get easing function based on device capabilities
        getEasing(progress) {
            const { easing } = DeviceCapabilities.animation;
            switch (easing) {
                case 'linear':
                    return progress;
                case 'ease-out':
                    return 1 - Math.pow(1 - progress, 2);
                case 'cubic-bezier':
                default:
                    return 1 - Math.pow(1 - progress, 3);
            }
        },
        
        // Check if device should use enhanced effects
        shouldUseEffect(effectType) {
            const { effects } = DeviceCapabilities.animation;
            const effectLevels = {
                'breathing': ['enhanced'],
                'blur': ['standard', 'enhanced'],
                'transform': ['reduced', 'standard', 'enhanced'],
                'opacity': ['minimal', 'reduced', 'standard', 'enhanced']
            };
            return effectLevels[effectType]?.includes(effects) || false;
        },
        
        // Smart header behavior based on device
        shouldHideHeader() {
            // Smart fridges and IoT devices: keep header always visible
            if (DeviceCapabilities.deviceClass === 'iot') return false;
            // Only mobile devices (phones) get header hide/show on scroll
            // Tablets, laptops, and desktops have enough space - header stays visible
            return ['phone', 'large-phone'].includes(DeviceCapabilities.formFactor);
        },
        
        // Adaptive search dropdown behavior
        getSearchBehavior() {
            const isMobile = ['phone', 'large-phone'].includes(DeviceCapabilities.formFactor);
            const isLowEnd = ['iot', 'low-end'].includes(DeviceCapabilities.deviceClass);
            
            return {
                useOverlay: isMobile,
                lockScroll: isMobile && !isLowEnd,
                animateIn: !isLowEnd,
                positioning: isMobile ? 'fixed' : 'absolute'
            };
        }
    };

    // =========================================================================
    //  UTILITY FUNCTIONS
    // =========================================================================
    
    // Utility functions for commonly used DOM queries
    const getMainElement = () => document.querySelector('main');
    const getHeaderElement = () => document.querySelector('header');
    const getHeaderHeight = () => {
        const header = getHeaderElement();
        return header ? header.offsetHeight : 0;
    };
    
    // =========================================================================
    //  CORE INITIALIZATION
    // =========================================================================

    /**
     * This function runs ONCE when the page is fully loaded.
     * It sets up all necessary global and page-specific functionality.
     */
    function initializeSite() {
        // --- Setup for ALL pages ---
        initializeNavigation();
        initializeSearch(basePath);
        initializeHidingHeader();
        updateActiveNav();
        initializePageTransitions(); // The new, simple transition logic
        triggerPageAnimations(document);

        // --- Run Page-Specific Logic ---
        // Call page-specific functions if they exist (exposed by page inline scripts)
        if (typeof window.initializeProgramTabs === 'function') {
            try {
                window.initializeProgramTabs();
            } catch (error) {
                console.error('Error initializing program tabs:', error);
            }
        }

        // --- Make the page visible ---
        // The body starts as transparent (from CSS) and fades in.
        document.body.classList.add('is-visible');
    }

    // --- Start everything after the header is loaded ---
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const scriptTag = document.querySelector('script[src*="js/main.js"]');
    const basePath = scriptTag ? (scriptTag.dataset.basePath || '.') : '.';

    // Enhanced error handling with retries and fallbacks
    const loadWithRetry = async (url, retries = 3, delay = 1000) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return await response.text();
            } catch (error) {
                console.warn(`Attempt ${i + 1} failed for ${url}:`, error.message);
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    };

    const loadHeader = headerPlaceholder ? loadWithRetry(`${basePath}/_includes/header.html`)
        .then(data => {
            headerPlaceholder.outerHTML = data;
            // Use a timeout to ensure the header is in the DOM before we run scripts
            setTimeout(() => {
                try {
                    initializeSite();
                } catch (error) {
                    console.error('Error during site initialization:', error);
                    // Fallback: make page visible even if initialization fails
                    document.body.classList.add('is-visible');
                    showErrorMessage('Some features may not work properly. Please refresh the page.');
                }
            }, 0);
        })
        .catch(error => {
            console.error('Failed to load header after retries:', error);
            // Fallback: create a basic header
            headerPlaceholder.innerHTML = `
                <header class="bg-dark-blue text-white p-4">
                    <div class="max-w-6xl mx-auto">
                        <h1 class="text-xl font-bold">National University of Management</h1>
                        <p class="text-sm opacity-75">Header failed to load - basic navigation active</p>
                    </div>
                </header>
            `;
            setTimeout(() => {
                try {
                    initializeSite();
                } catch (error) {
                    console.error('Error during fallback initialization:', error);
                    document.body.classList.add('is-visible');
                }
            }, 0);
        }) : Promise.resolve().then(() => {
            try {
                initializeSite();
            } catch (error) {
                console.error('Error during direct initialization:', error);
                document.body.classList.add('is-visible');
            }
        });

    const loadFooter = footerPlaceholder ? loadWithRetry(`${basePath}/_includes/footer.html`)
        .then(data => { 
            footerPlaceholder.innerHTML = data; 
        })
        .catch(error => {
            console.error('Failed to load footer after retries:', error);
            // Fallback: create a basic footer
            footerPlaceholder.innerHTML = `
                <footer class="bg-dark-blue text-white p-4 text-center">
                    <p>&copy; ${new Date().getFullYear()} National University of Management</p>
                </footer>
            `;
        }) : Promise.resolve();


    // =========================================================================
    //  SIMPLE PAGE TRANSITION SYSTEM
    // =========================================================================
    
    function initializePageTransitions() {
        // Handle link clicks for smooth transitions
        document.body.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            
            // Check if it's an internal link that should be transitioned
            if (link && 
                link.hostname === window.location.hostname && 
                !link.getAttribute('href').startsWith('#') && 
                link.target !== '_blank' &&
                !link.hasAttribute('data-no-transition')) {
                
                e.preventDefault();
                const destination = link.href;
                
                // Don't transition if we're already on the same page
                if (destination === window.location.href) {
                    return;
                }
                
                // Start simple fade transition
                startPageTransition(destination);
            }
        });

        // Handle browser back/forward navigation
        window.addEventListener('popstate', (e) => {
            startPageTransition(window.location.href, false);
        });
    }    
        
    // Simple page cache for better performance
    const pageCache = new Map();
    
    // Set to track URLs currently being preloaded
    const preloadingUrls = new Set();
    
    function initializeLinkPreloading() {
        // Preload pages on hover for instant transitions
        document.body.addEventListener('mouseenter', (e) => {
            const link = e.target.closest('a');
            if (link && 
                link.hostname === window.location.hostname && 
                !link.getAttribute('href').startsWith('#') && 
                link.target !== '_blank' &&
                !pageCache.has(link.href)) {
                
                preloadPage(link.href);
            }
        }, true);
    }
    
    function preloadPage(url) {
        // Don't preload if already cached or currently loading
        if (pageCache.has(url) || preloadingUrls.has(url)) {
            return;
        }
        
        preloadingUrls.add(url);
        
        // Use a shorter timeout for preloading to avoid blocking
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        fetch(url, { signal: controller.signal })
            .then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                if (!html || html.trim().length === 0) {
                    throw new Error('Empty preload response');
                }
                const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
                const title = titleMatch ? titleMatch[1] : 'NUM';
                pageCache.set(url, { html, title, timestamp: Date.now() });
            })
            .catch(error => {
                clearTimeout(timeoutId);
                if (error.name !== 'AbortError') {
                    console.warn('Failed to preload page:', url, error.message);
                }
            })
            .finally(() => {
                preloadingUrls.delete(url);
            });
    }
    
    initializeLinkPreloading();
    
    function executePageScripts(doc) {
        // Execute inline scripts from the new page
        const scripts = doc.querySelectorAll('script:not([src])');
        scripts.forEach(script => {
            if (script.textContent.trim()) {
                try {
                    // Create a new script element and execute it
                    const newScript = document.createElement('script');
                    newScript.textContent = script.textContent;
                    document.head.appendChild(newScript);
                    document.head.removeChild(newScript);
                } catch (error) {
                    console.error('Error executing inline script:', error);
                }
            }
        });
    }
    

    
    function getCachedPage(url) {
        const cached = pageCache.get(url);
        return cached && cached.html ? cached : null;
    }

    // Enhanced transition system with dynamic timing
    let currentTransition = null;
    
    function startPageTransition(destination, pushState = true) {
        // Cancel any existing transition
        if (currentTransition) {
            currentTransition.cancel();
        }
        
        const mainContent = getMainElement();
        if (!mainContent) {
            console.error('No main content found for transition');
            return;
        }
        
        // Create transition state object
        currentTransition = {
            startTime: Date.now(),
            destination,
            pushState,
            cancelled: false,
            pageReady: false,
            fadeToWhiteComplete: false,
            
            cancel() {
                this.cancelled = true;
            }
        };
        
        // Start fade to white immediately
        startFadeToWhite(mainContent, currentTransition);
        
        // Start loading the new page in parallel
        loadPageContent(destination, currentTransition);
    }
    
    function startFadeToWhite(mainContent, transition) {
        // Use clip-path to completely exclude header area from overlay
        const headerHeight = getHeaderHeight();
        
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        
        // Cover entire viewport but use clip-path to exclude header area
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.backgroundColor = '#ffffff';
        overlay.style.opacity = '0';
        overlay.style.zIndex = '1'; // Very low z-index, below everything
        overlay.style.pointerEvents = 'none';
        
        // Use clip-path to cut out header area completely
        overlay.style.clipPath = `polygon(0 ${headerHeight}px, 100% ${headerHeight}px, 100% 100%, 0 100%)`;
        
        // Force new stacking context and hardware acceleration
        overlay.style.isolation = 'isolate';
        overlay.style.transform = 'translateZ(0)';
        overlay.style.willChange = 'opacity';
        
        // Add to body
        document.body.appendChild(overlay);
        
        transition.overlay = overlay;
        transition.startTime = Date.now();
        
        // Start animation with device-appropriate settings
        startSmoothFadeAnimation(overlay, transition);
    }
    
    function startSmoothFadeAnimation(overlay, transition) {
        // Use smart animation controller for adaptive performance
        const animationInterval = AnimationController.getFrameInterval();
        const animationDuration = AnimationController.getDuration('page-transition');
        let lastFrameTime = 0;
        
        const animateFrame = (currentTime) => {
            if (transition.cancelled) return;
            
            // Smart frame throttling based on device capabilities
            if (currentTime - lastFrameTime < animationInterval) {
                if (!transition.pageReady) {
                    requestAnimationFrame(animateFrame);
                }
                return;
            }
            lastFrameTime = currentTime;
            
            const elapsed = Date.now() - transition.startTime;
            const progress = Math.min(elapsed / animationDuration, 1);
            
            // Use adaptive easing based on device capabilities
            const easedProgress = AnimationController.getEasing(progress);
            let finalOpacity = easedProgress;
            
            // Add breathing effect only for capable devices
            if (AnimationController.shouldUseEffect('breathing') && progress >= 1 && !transition.pageReady) {
                const breathingCycle = (elapsed - animationDuration) / 1500;
                const breathingIntensity = DeviceCapabilities.deviceClass === 'high-end' ? 0.06 : 0.04;
                const breathingEffect = (1 - breathingIntensity) + breathingIntensity * Math.sin(breathingCycle * Math.PI * 2);
                finalOpacity = breathingEffect;
            }
            
            // Optimize repaints based on device class
            const opacityPrecision = DeviceCapabilities.deviceClass === 'iot' ? 10 : 100;
            overlay.style.opacity = Math.round(finalOpacity * opacityPrecision) / opacityPrecision;
            
            // Continue animation until page is ready
            if (!transition.pageReady) {
                requestAnimationFrame(animateFrame);
            } else {
                // Page is ready, we can proceed
                transition.fadeToWhiteComplete = true;
                checkTransitionReady(transition);
            }
        };
        
        requestAnimationFrame(animateFrame);
    }
    
    function loadPageContent(destination, transition) {
        // Get cached page or fetch new one
        const cachedPage = getCachedPage(destination);
        
        if (cachedPage) {
            // Cached content is immediately ready
            setTimeout(() => {
                if (transition.cancelled) return;
                transition.pageContent = { html: cachedPage.html, title: cachedPage.title };
                transition.pageReady = true;
                checkTransitionReady(transition);
            }, 0);
        } else {
            // Fetch new page
            loadWithRetry(destination, 2, 500)
                .then(html => {
                    if (transition.cancelled) return;
                    
                    // Validate HTML content
                    if (!html || html.trim().length === 0) {
                        throw new Error('Empty response received');
                    }
                    
                    // Cache the page
                    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
                    const title = titleMatch ? titleMatch[1] : 'NUM';
                    pageCache.set(destination, { html, title, timestamp: Date.now() });
                    
                    // Mark page as ready
                    transition.pageContent = { html, title };
                    transition.pageReady = true;
                    checkTransitionReady(transition);
                })
                .catch(error => {
                    if (transition.cancelled) return;
                    console.error('Page transition failed:', error);
                    handleTransitionError(destination, error);
                    cleanupTransition(transition);
                });
        }
    }
    
    function checkTransitionReady(transition) {
        // If page is ready, we can proceed regardless of fade state
        if (transition.pageReady && !transition.cancelled) {
            // Calculate current progress for smooth transition
            const elapsed = Date.now() - transition.startTime;
            const currentProgress = Math.min(elapsed / 800, 1);
            const currentOpacity = 1 - Math.pow(1 - currentProgress, 3);
            
            // If we're early in the animation (brief glow), complete it quickly
            if (currentOpacity < 0.3) {
                // Quick fade to show just a glow effect
                if (transition.overlay) {
                    transition.overlay.style.transition = 'opacity 0.15s ease-out';
                    transition.overlay.style.opacity = '0.4';
                }
                setTimeout(() => {
                    if (!transition.cancelled) {
                        proceedWithPageLoad(transition);
                    }
                }, 150);
            } else {
                // We're deeper in the animation, proceed immediately
                proceedWithPageLoad(transition);
            }
        }
        // If fade is complete but page isn't ready, the animation continues smoothly
    }
    
    function proceedWithPageLoad(transition) {
        try {
            loadNewPage(
                transition.pageContent.html, 
                transition.pageContent.title, 
                transition.destination, 
                transition.pushState,
                transition
            );
        } catch (error) {
            console.error('Error loading new page:', error);
            handleTransitionError(transition.destination, error);
            cleanupTransition(transition);
        }
    }
    
    function cleanupTransition(transition) {
        if (transition && transition.overlay) {
            // Reset will-change to free up GPU resources
            if (transition.overlay.style) {
                transition.overlay.style.willChange = 'auto';
            }
            
            // Safely remove overlay
            if (transition.overlay.parentNode) {
                try {
                    transition.overlay.remove();
                } catch (error) {
                    console.warn('Error removing transition overlay:', error);
                }
            }
        }
        
        // Clear transition reference
        if (currentTransition === transition) {
            currentTransition = null;
        }
    }

    function loadNewPage(mainHTML, titleText, destination, pushState, transition = null) {
        try {
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(mainHTML, 'text/html');
            const newMain = newDoc.querySelector('main'); // Note: This is from parsed HTML, not current DOM
            const currentMain = getMainElement();
            
            if (!newMain) {
                throw new Error('No main element found in new page content');
            }
            
            if (!currentMain) {
                throw new Error('No main element found in current page');
            }
            
            // Update page title
            document.title = titleText;
            
            // Update browser history
            if (pushState) {
                history.pushState({ path: destination }, titleText, destination);
            }
            
            // Replace main content
            currentMain.innerHTML = newMain.innerHTML;
            
            // Load and execute page-specific styles
            const newStyles = newDoc.querySelectorAll('style');
            newStyles.forEach(style => {
                if (!document.querySelector(`style[data-page-style="${btoa(style.textContent.substring(0, 50))}"]`)) {
                    const newStyle = document.createElement('style');
                    newStyle.textContent = style.textContent;
                    newStyle.setAttribute('data-page-style', btoa(style.textContent.substring(0, 50)));
                    document.head.appendChild(newStyle);
                }
            });
            
            // Execute page-specific inline scripts
            try {
                executePageScripts(newDoc);
            } catch (error) {
                console.error('Error executing page scripts:', error);
            }
            
            // Initialize page content after DOM update
            setTimeout(initializePageContent, 0);
            
        } catch (error) {
            console.error('Error in loadNewPage:', error);
            throw error; // Re-throw to be handled by caller
        }
        
        function initializePageContent() {
            try {
                // Update active navigation
                updateActiveNav();
                
                // Initialize page-specific components if functions exist
                if (typeof window.initializeProgramTabs === 'function') {
                    try {
                        window.initializeProgramTabs();
                    } catch (error) {
                        console.error('Error initializing program tabs during SPA navigation:', error);
                    }
                }
                
                // Initialize homepage hero if present (using global functions from page)
                if (typeof window.initializeHomepageHero === 'function') {
                    try {
                        window.initializeHomepageHero();
                    } catch (error) {
                        console.error('Error initializing homepage hero:', error);
                    }
                }
                
                // Initialize hero video if on homepage (using global functions from page)
                if (typeof window.initializeHeroVideo === 'function') {
                    try {
                        window.initializeHeroVideo();
                    } catch (error) {
                        console.error('Error initializing hero video:', error);
                    }
                }
                
                // Trigger animations for new content
                triggerPageAnimations(getMainElement());
                
                // Fade in from white overlay
                if (transition && transition.overlay) {
                    // Fade out the white overlay to reveal new content
                    transition.overlay.style.transition = 'opacity 0.4s ease-in';
                    transition.overlay.style.opacity = '0';
                    
                    // Remove overlay after fade completes
                    setTimeout(() => {
                        cleanupTransition(transition);
                    }, 400);
                } else {
                    // Fallback for non-transition loads (direct navigation, etc.)
                    const mainContent = getMainElement();
                    if (mainContent) {
                        mainContent.style.opacity = '1';
                        mainContent.style.transition = 'opacity 0.3s ease-in';
                    }
                }
            } catch (error) {
                console.error('Error during page content initialization:', error);
                // Still fade in even if initialization fails
                if (transition && transition.overlay) {
                    transition.overlay.style.transition = 'opacity 0.4s ease-in';
                    transition.overlay.style.opacity = '0';
                    setTimeout(() => {
                        cleanupTransition(transition);
                    }, 400);
                } else {
                    const mainContent = getMainElement();
                    if (mainContent) {
                        mainContent.style.opacity = '1';
                        mainContent.style.transition = 'opacity 0.3s ease-in';
                    }
                }
                showErrorMessage('Some page features may not work properly.');
            }
        }
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });
    }
    


    // =========================================================================
    //  ALL OTHER FUNCTIONS (Global and Page-Specific)
    //  These are now just a library of functions called by initializeSite()
    // =========================================================================

    function triggerPageAnimations(container) {
        const sections = container.querySelectorAll('.fade-in-section');
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.05 };
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        sections.forEach(section => observer.observe(section));
    }


    
    function updateActiveNav() {
        const currentPath = window.location.pathname.replace(/\/$/, '').replace(/\.html$/, '');
        const navLinks = document.querySelectorAll('.main-nav a');
        let bestMatch = null;
        
        navLinks.forEach(link => link.classList.remove('active'));
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (!linkHref || linkHref === '#') return;
            const linkUrl = new URL(link.href);
            const linkPath = linkUrl.pathname.replace(/\/$/, '').replace(/\.html$/, '');
            if (currentPath.startsWith(linkPath)) {
                if (!bestMatch || linkPath.length > bestMatch.path.length) {
                    bestMatch = { link: link, path: linkPath };
                }
            }
        });
        
        if (bestMatch) {
            bestMatch.link.classList.add('active');
            const parentDropdown = bestMatch.link.closest('.relative.group');
            if (parentDropdown) {
                parentDropdown.querySelector('a')?.classList.add('active');
            }
        }
    }

    function initializeHidingHeader() {
        // Only animate the <header> element, not the .header-bg-static background div
        const header = getHeaderElement();
        const headerBg = document.querySelector('.header-bg-static');
        if (!header) return;
        
        // Function to update background div height to match header
        function updateBackgroundHeight() {
            if (headerBg) {
                headerBg.style.height = header.offsetHeight + 'px';
            }
        }
        
        // Set initial height and update on resize
        updateBackgroundHeight();
        window.addEventListener('resize', updateBackgroundHeight);
        
        let lastScrollTop = 0;
        let isHeaderHidden = false;
        let ticking = false;
        let lastUpdateTime = 0;
        
        // Calculate scroll threshold more reliably
        // Use header height as threshold to prevent hiding with minimal scroll
        const headerHeight = header.offsetHeight;
        const scrollThreshold = headerHeight; // Require scrolling at least header height
        const minScrollDistance = 15; // Increased to reduce jitter on problematic pages
        const debounceTime = 50; // Minimum time between updates (ms)
        
        // Debug logging to help identify threshold differences (development only)
        if (isDevelopment()) {
            console.log('Header hide/show initialized:', {
                headerHeight,
                scrollThreshold,
                pageUrl: window.location.pathname
            });
        }
        
        function updateHeader() {
            // Use smart device detection for header behavior
            if (!AnimationController.shouldHideHeader()) {
                if (isHeaderHidden) {
                    header.style.transform = 'translateY(0)';
                    header.style.transition = `transform ${AnimationController.getDuration('header-hide')}ms ease-out`;
                    isHeaderHidden = false;
                }
                return;
            }
            
            const currentTime = Date.now();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollDifference = Math.abs(scrollTop - lastScrollTop);
            
            const isScrollingUp = scrollTop < lastScrollTop;
            const isAtTop = scrollTop <= scrollThreshold;
            
            // For showing header: be more responsive (less restrictive)
            if ((isScrollingUp || isAtTop) && isHeaderHidden) {
                // Allow smaller movements and less debouncing for showing header
                if (scrollDifference >= 3 || isAtTop) {
                    header.style.transform = 'translateY(0)';
                    header.style.transition = `transform ${AnimationController.getDuration('header-hide')}ms ease-out`;
                    isHeaderHidden = false;
                    lastUpdateTime = currentTime;
                    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
                    return;
                }
            }
            
            // For hiding header: use stricter filtering to prevent jitter
            if (currentTime - lastUpdateTime < debounceTime) {
                return;
            }
            
            if (scrollDifference < minScrollDistance) {
                return;
            }
            
            lastUpdateTime = currentTime;
            
            // Hide header when scrolling down past threshold
            if (scrollTop > lastScrollTop && scrollTop > scrollThreshold && !isHeaderHidden) {
                header.style.transform = 'translateY(-100%)';
                header.style.transition = `transform ${AnimationController.getDuration('header-hide')}ms ease-out`;
                isHeaderHidden = true;
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateHeader();
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }

    function initializeNavigation() {
        document.body.addEventListener('click', function(e) {
            const exploreLink = e.target.closest('.explore-link, a[href="#intro"]');
            if (exploreLink) {
                e.preventDefault();
                const introSection = document.getElementById('intro');
                if (introSection) {
                    const headerHeight = getHeaderHeight();
                    const targetPosition = introSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            }
            const navToggle = e.target.closest('.nav-toggle');
            if (navToggle) {
                const nav = document.querySelector('#mobile-menu');
                if (!nav) return;
                nav.classList.toggle('translate-x-full');
                navToggle.classList.toggle('is-active');
                document.body.style.overflow = nav.classList.contains('translate-x-full') ? 'auto' : 'hidden';
            }
            if (!e.target.closest('.main-nav .group')) {
                document.querySelectorAll('.main-nav .group.is-open').forEach(item => item.classList.remove('is-open'));
            }
        });
    }



    function initializeSearch(basePath) {
        let searchInitialized = false;
        
        // Function to initialize search when input is found
        const tryInitializeSearch = () => {
            const searchInput = document.querySelector('input[type="search"]');
            if (searchInput && !searchInitialized) {
                setupSearch(searchInput, basePath);
                searchInitialized = true;
                return true;
            }
            return false;
        };
        
        // Try to initialize immediately
        if (!tryInitializeSearch()) {
            // If search input not found, wait for it to be loaded (header loads async)
            const observer = new MutationObserver(() => {
                if (tryInitializeSearch()) {
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            
            // Also try with a fallback event listener
            document.body.addEventListener('focusin', (e) => {
                if (e.target.matches('input[type="search"]') && !searchInitialized) {
                    setupSearch(e.target, basePath);
                    searchInitialized = true;
                }
            }, { once: true });
        }
    }
    
    function setupSearch(searchInput, basePath) {
        // This function remains the same as before.
        let fuse = null;
        const searchContainer = searchInput.closest('div');
        if (!searchContainer) return;
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/60 z-40 hidden';
        document.body.appendChild(overlay);
        const searchResultsContainer = document.createElement('div');
        searchResultsContainer.className = 'search-results-dropdown hidden';
        searchContainer.appendChild(searchResultsContainer);
        // Load search index with native JavaScript search
        let searchData = [];
        
        // Restore search text from sessionStorage if available
        const savedSearch = sessionStorage.getItem('searchQuery');
        if (savedSearch) {
            searchInput.value = savedSearch;
        }
        
        fetch(`${basePath}/js/search-index.json`)
            .then(r => r.json())
            .then(data => {
                searchData = data;
            })
            .catch(err => console.error('Error loading search index:', err));
        
        // Simple native search function
        const performSearch = (query) => {
            if (!query || query.length < 2) return [];
            
            const lowerQuery = query.toLowerCase();
            const results = [];
            
            searchData.forEach(item => {
                let score = 0;
                const titleLower = item.title.toLowerCase();
                const descLower = item.description.toLowerCase();
                const tagsLower = item.tags ? item.tags.toLowerCase() : '';
                
                // Exact title match gets highest score
                if (titleLower.includes(lowerQuery)) {
                    score += titleLower.indexOf(lowerQuery) === 0 ? 100 : 50;
                }
                
                // Description match gets medium score
                if (descLower.includes(lowerQuery)) {
                    score += 25;
                }
                
                // Tags match gets lower score
                if (tagsLower.includes(lowerQuery)) {
                    score += 10;
                }
                
                if (score > 0) {
                    results.push({ item, score });
                }
            });
            
            // Sort by score (highest first) and return top 10
            return results.sort((a, b) => b.score - a.score).slice(0, 10).map(r => r.item);
        };
        
        const render = results => {
            const ul = document.createElement('ul');
            results.forEach(result => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                // Use absolute URL from root to avoid basePath issues
                a.href = result.url;
                a.innerHTML = `
                    <div class="result-title">${result.title}</div>
                    <div class="result-description">${result.description}</div>
                `;
                li.appendChild(a);
                ul.appendChild(li);
            });
            searchResultsContainer.innerHTML = '';
            searchResultsContainer.appendChild(ul);
        };
        const search = () => {
            if (!searchData.length || searchInput.value.length < 2) { 
                hide(); 
                return; 
            }
            
            const results = performSearch(searchInput.value);
            
            if (results.length === 0) { 
                hide(); 
                return; 
            }
            
            render(results);
            
            // Smart search dropdown positioning based on device capabilities
            const searchBehavior = AnimationController.getSearchBehavior();
            
            if (searchBehavior.useOverlay) {
                const searchRect = searchInput.getBoundingClientRect();
                searchResultsContainer.style.position = searchBehavior.positioning;
                searchResultsContainer.style.top = (searchRect.bottom + 18) + 'px';
                overlay.classList.remove('hidden');
                
                if (searchBehavior.lockScroll) {
                    document.body.classList.add('overflow-hidden');
                }
                
                // Add entrance animation for capable devices
                if (searchBehavior.animateIn) {
                    searchResultsContainer.style.transform = 'translateY(-10px)';
                    searchResultsContainer.style.opacity = '0';
                    setTimeout(() => {
                        searchResultsContainer.style.transition = `all ${AnimationController.getDuration('search-dropdown')}ms ease-out`;
                        searchResultsContainer.style.transform = 'translateY(0)';
                        searchResultsContainer.style.opacity = '1';
                    }, 10);
                }
            } else {
                searchResultsContainer.style.position = 'absolute';
                searchResultsContainer.style.top = '';
            }
            
            searchResultsContainer.classList.remove('hidden');
        };
        const hide = () => {
            setTimeout(() => {
                if (document.activeElement !== searchInput) {
                    searchResultsContainer.classList.add('hidden');
                    overlay.classList.add('hidden');
                    document.body.classList.remove('overflow-hidden');
                }
            }, 150);
        };
        searchInput.addEventListener('input', search);
        searchInput.addEventListener('focus', search);
        searchInput.addEventListener('click', search); // Show dropdown on click even if already focused
        searchInput.addEventListener('blur', hide);
        searchInput.addEventListener('keydown', e => { 
            if (e.key === 'Enter') e.preventDefault(); 
        });
        overlay.addEventListener('click', hide);
        searchResultsContainer.addEventListener('mousedown', e => e.preventDefault());
        searchResultsContainer.addEventListener('click', e => {
            if (e.target.closest('a')) {
                sessionStorage.setItem('searchQuery', searchInput.value);
                searchResultsContainer.classList.add('hidden');
                overlay.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        });
    }


    
    // Error handling utilities
    function showErrorMessage(message, duration = 5000) {
        // Remove any existing error messages
        const existingError = document.querySelector('.spa-error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'spa-error-message fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-sm';
        errorDiv.innerHTML = `
            <div class="flex items-center gap-2">
                <span>⚠️</span>
                <span class="text-sm">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">&times;</button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        if (duration > 0) {
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.remove();
                }
            }, duration);
        }
    }
    
    function handleTransitionError(destination, error) {
        console.error('Transition error for', destination, ':', error);
        
        // Reset page opacity - only affect main content, not header
        const mainContent = getMainElement();
        if (mainContent) {
            mainContent.style.opacity = '1';
            mainContent.style.transition = 'opacity 0.3s ease-in';
        }
        
        // Show user-friendly error message
        showErrorMessage('Failed to load page. Redirecting...', 3000);
        
        // Fallback to regular navigation after a short delay
        setTimeout(() => {
            window.location.href = destination;
        }, 1000);
    }
    
    // Global error handler for unhandled errors
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        if (event.error && event.error.message && event.error.message.includes('fetch')) {
            showErrorMessage('Network error detected. Some features may not work properly.');
        }
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        if (event.reason && event.reason.message && event.reason.message.includes('fetch')) {
            showErrorMessage('Network error detected. Please check your connection.');
        }
    });
    

});