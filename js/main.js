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
                    easing: 'ease-out', // Keep this as a faster, simpler curve for low-end
                    effects: 'reduced',
                    transitions: 'fast'
                },
                'mid-range': {
                    fps: 60,
                    duration: 600,
                    easing: 'ease-in-out', // CHANGED
                    effects: 'standard',
                    transitions: 'smooth'
                },
                'high-end': {
                    fps: 60,
                    duration: 400,
                    easing: 'ease-in-out', // CHANGED
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
                    // Starts fast, slows down (Quadratic Ease-Out)
                    return 1 - Math.pow(1 - progress, 2);

                case 'ease-in-out': // NEW S-CURVE
                    // Starts slow, accelerates, ends slow (Cubic Ease-In-Out)
                    if (progress < 0.5) {
                        return 4 * progress * progress * progress;
                    } else {
                        return 1 - Math.pow(-2 * progress + 2, 3) / 2;
                    }
                
                case 'cubic-bezier': // This case is now a fallback
                default:
                    // The old default ease-out curve
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

    // Enhanced transition system with S-curve animation and midway interruption
    let currentTransition = null;

    function startPageTransition(destination, pushState = true) {
        // Immediately clean up any existing transition
        if (currentTransition) {
            currentTransition.cancel();
            cleanupTransition(currentTransition);
        }
        
        const mainContent = getMainElement();
        if (!mainContent) {
            console.error('No main content found for transition');
            return;
        }
        
        currentTransition = {
            startTime: Date.now(),
            destination,
            pushState,
            cancelled: false,
            contentReady: false,
            animationInterrupted: false,
            overlay: null,
            pageContent: null,
            
            cancel() {
                this.cancelled = true;
                // Immediately clean up when cancelled
                cleanupTransition(this);
            }
        };
        
        startFadeToWhite(mainContent, currentTransition);
        loadPageContent(destination, currentTransition);
    }
    
    /**
     * Fast-start then slow easing function for fade animation
     */
    function fastStartSlowEndEasing(t) {
        // Faster start, then very gradual - good balance
        if (t <= 0.5) {
            // Faster start for first 50% - more noticeable feedback
            return t * 1.1; // Faster than before but still subtle
        } else {
            // Slow progression for remaining 50% - exponential decay
            const remaining = t - 0.5;
            const normalizedRemaining = remaining / 0.5; // normalize to 0-1
            // Use exponential decay for very slow finish
            const slowPart = 1 - Math.pow(1 - normalizedRemaining, 4);
            return 0.55 + (slowPart * 0.45); // 0.55 (from fast part) + slow part to reach 1.0
        }
    }
    
    /**
     * Creates the semi-transparent white overlay and initiates the fade animation.
     * Uses a 50% white background with opacity control for smooth transitions.
     */
    function startFadeToWhite(mainContent, transition) {
        // Remove any existing transition overlays to prevent multiple overlays
        const existingOverlays = document.querySelectorAll('.page-transition-overlay');
        existingOverlays.forEach(overlay => {
            try {
                overlay.remove();
            } catch (error) {
                console.warn('Error removing existing overlay:', error);
            }
        });
        
        const headerHeight = getHeaderHeight();
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // 50% white background
        overlay.style.opacity = '0';
        overlay.style.zIndex = '9999';
        overlay.style.pointerEvents = 'none';
        overlay.style.clipPath = `polygon(0 ${headerHeight}px, 100% ${headerHeight}px, 100% 100%, 0 100%)`;
        overlay.style.isolation = 'isolate';
        overlay.style.transform = 'translateZ(0)';
        overlay.style.willChange = 'opacity';
        
        document.body.appendChild(overlay);
        transition.overlay = overlay;
        
        startSmoothFadeAnimation(overlay, transition);
    }
    
    /**
     * Main animation loop implementing:
     * - Fast-start slow-end easing fade to 20% visual white (0.4 opacity × 0.5 background)
     * - Midway interruption logic (30-85% progress) for fast content loading
     * - Dramatic pulsing effect (20% to 50% visual white) for slow content loading
     * - Performance optimizations to prevent reflows
     */
    function startSmoothFadeAnimation(overlay, transition) {
        // Make animation significantly longer to encourage midway interruption
        const baseDuration = AnimationController.getDuration('page-transition');
        const animationDuration = baseDuration * 2.5; // 2.5x longer than normal
        const minVisibleDuration = 150; // Slightly longer minimum visibility
        let fadeCompleted = false;
        let pulseStartTime = null;
        
        // Pre-calculate constants to avoid repeated calculations
        // Using 50% white background (rgba(255,255,255,0.5)) with opacity control
        // Fade ends at 0.4 opacity = 20% visual white (0.4 × 0.5 = 0.2)
        // Dramatic pulsing: 20% to 50% visual white for clear loading feedback
        const pulseMinOpacity = 0.4; // 20% visual white (0.4 × 0.5)
        const pulseMaxOpacity = 1.0; // 50% visual white (1.0 × 0.5)
        const pulseRange = (pulseMaxOpacity - pulseMinOpacity) / 2; // 0.3
        const pulseAvgOpacity = (pulseMinOpacity + pulseMaxOpacity) / 2; // 0.7
        
        let lastOpacity = 0; // Track last opacity to avoid unnecessary DOM updates
        
        const animateFrame = () => {
            if (transition.cancelled) {
                return;
            }
            
            const elapsed = Date.now() - transition.startTime;
            let newOpacity;
            
            // Check if content is ready and we can interrupt
            if (transition.contentReady && !transition.animationInterrupted && elapsed >= minVisibleDuration) {
                const progress = elapsed / animationDuration;
                
                // Interrupt much earlier and with wider range (30-85% progress)
                if (progress >= 0.3 && progress < 0.85) {
                    transition.animationInterrupted = true;
                    startCrossFadeIn(transition);
                    return;
                }
            }
            
            if (!fadeCompleted) {
                const progress = Math.min(elapsed / animationDuration, 1);
                // Scale easing to end at 0.4 opacity (20% visual white)
                newOpacity = fastStartSlowEndEasing(progress) * 0.4;
                
                if (progress >= 1) {
                    fadeCompleted = true;
                    pulseStartTime = Date.now();
                    newOpacity = 0.4; // Ensure we end at exactly 0.4 opacity (20% visual white)
                    
                    // If content is ready when fade completes, start cross-fade immediately
                    if (transition.contentReady) {
                        startCrossFadeIn(transition);
                        return;
                    }
                }
            } else {
                // Fade completed, show pulsing/breathing effect while waiting for content
                const pulseElapsed = Date.now() - pulseStartTime;
                const breathingCycle = pulseElapsed * 0.0006061; // 1650ms cycle (10% slower than default)
                // Start sine wave at minimum (-π/2 offset) for smooth transition from fade
                const pulseValue = Math.sin((breathingCycle * 6.283185307) - 1.570796327); // 2π and π/2 pre-calculated
                
                // Always pulse for loading feedback (ignores device breathing preferences)
                // Oscillates between 20% and 50% visual white intensity
                newOpacity = pulseAvgOpacity + (pulseRange * pulseValue);
                
                // Debug: Log pulsing values every 500ms for troubleshooting
                if (Math.floor(pulseElapsed / 500) !== Math.floor((pulseElapsed - 16) / 500)) {
                    console.log('Pulsing:', { pulseElapsed, breathingCycle, pulseValue: pulseValue.toFixed(3), newOpacity: newOpacity.toFixed(3) });
                }
                
                // If content becomes ready during pulsing, start cross-fade
                if (transition.contentReady) {
                    startCrossFadeIn(transition);
                    return;
                }
            }
            
            // Only update DOM if opacity actually changed (reduces reflows)
            if (Math.abs(newOpacity - lastOpacity) > 0.001) {
                overlay.style.opacity = newOpacity.toFixed(3);
                lastOpacity = newOpacity;
            }
            
            requestAnimationFrame(animateFrame);
        };
        
        requestAnimationFrame(animateFrame);
    }
    
    /**
     * Handles the cross-fade in effect when new content is ready
     */
    function startCrossFadeIn(transition) {
        if (!transition.pageContent || !transition.overlay) {
            return;
        }
        
        // Start fading out the white overlay immediately
        const fadeOutDuration = 300; // Slightly longer for smoother cross-fade
        transition.overlay.style.transition = `opacity ${fadeOutDuration}ms ease-out`;
        transition.overlay.style.opacity = '0';
        
        // Load new page content simultaneously with overlay fade-out
        // This creates the true cross-fade effect
        loadNewPage(
            transition.pageContent.html,
            transition.pageContent.title,
            transition.destination,
            transition.pushState,
            () => {
                // New content is now loaded and overlay is fading out
                // The cross-fade is happening naturally
            }
        );
        
        // Clean up after the overlay fade completes
        setTimeout(() => {
            cleanupTransition(transition);
        }, fadeOutDuration);
    }
    
    /**
     * Waits for ALL images to load to prevent white flash on any page
     */
    function waitForCriticalImages(html, callback) {
        // Create a temporary container to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // Find ALL images in the page content (not just hero images)
        const allImages = tempDiv.querySelectorAll('img[src]');
        
        if (allImages.length === 0) {
            // No images found, proceed immediately
            callback();
            return;
        }
        
        let loadedCount = 0;
        const totalImages = allImages.length;
        let timeoutId;
        
        const checkComplete = () => {
            loadedCount++;
            if (loadedCount >= totalImages) {
                clearTimeout(timeoutId);
                callback();
            }
        };
        
        // Set a maximum wait time to prevent hanging (3 seconds for all images)
        timeoutId = setTimeout(() => {
            callback();
        }, 3000);
        
        // Check each image
        allImages.forEach((img, index) => {
            const src = img.getAttribute('src');
            if (!src) {
                checkComplete();
                return;
            }
            
            // Convert relative paths to absolute paths for proper loading
            let absoluteSrc = src;
            if (!src.startsWith('http') && !src.startsWith('/')) {
                // This is a relative path, make it absolute from root
                absoluteSrc = '/' + src;
            }
            
            // Create a new image to test loading
            const testImg = new Image();
            testImg.onload = checkComplete;
            testImg.onerror = checkComplete; // Proceed even if image fails to load
            testImg.src = absoluteSrc;
        });
    }

    /**
     * Fetches the new page content and signals when ready
     */
    function loadPageContent(destination, transition) {
        const onPageReady = (html, title) => {
            if (transition.cancelled) return;
            
            // Wait for critical images to load before marking as ready
            waitForCriticalImages(html, () => {
                if (transition.cancelled) return;
                
                transition.contentReady = true;
                transition.pageContent = { html, title };
                
                // Don't immediately proceed - let the animation loop handle the timing
            });
        };
        
        const processPage = (pageData) => {
            // Reduce minimum delay to make interruption more likely
            const minDelay = 30;
            const elapsed = Date.now() - transition.startTime;
            const delay = Math.max(0, minDelay - elapsed);
            
            setTimeout(() => onPageReady(pageData.html, pageData.title), delay);
        };
        
        const cachedPage = getCachedPage(destination);
        if (cachedPage) {
            processPage(cachedPage);
        } else {
            loadWithRetry(destination, 2, 500)
                .then(html => {
                    if (!html || html.trim().length === 0) throw new Error('Empty response');
                    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
                    const title = titleMatch ? titleMatch[1] : 'NUM';
                    const pageData = { html, title };
                    pageCache.set(destination, { ...pageData, timestamp: Date.now() });
                    processPage(pageData);
                })
                .catch(error => {
                    if (transition.cancelled) return;
                    handleTransitionError(destination, error);
                    cleanupTransition(transition);
                });
        }
    }

    function cleanupTransition(transition) {
        if (!transition) return;
        
        // Remove overlay immediately
        if (transition.overlay) {
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
            transition.overlay = null;
        }
        
        // Clear transition reference
        if (currentTransition === transition) {
            currentTransition = null;
        }
    }

    /**
     * Swaps the page content - now simplified since cross-fade is handled separately
     */
    function loadNewPage(mainHTML, titleText, destination, pushState, onComplete = null) {
        try {
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(mainHTML, 'text/html');
            const newMain = newDoc.querySelector('main');
            const currentMain = getMainElement();
            
            if (!newMain || !currentMain) {
                throw new Error('Could not find main element.');
            }
            
            document.title = titleText;
            if (pushState) {
                history.pushState({ path: destination }, titleText, destination);
            }
            
            currentMain.innerHTML = newMain.innerHTML;
            
            const newStyles = newDoc.querySelectorAll('style');
            newStyles.forEach(style => {
                if (!document.querySelector(`style[data-page-style="${btoa(style.textContent.substring(0, 50))}"]`)) {
                    const newStyle = document.createElement('style');
                    newStyle.textContent = style.textContent;
                    newStyle.setAttribute('data-page-style', btoa(style.textContent.substring(0, 50)));
                    document.head.appendChild(newStyle);
                }
            });
            executePageScripts(newDoc);
            
            setTimeout(initializePageContent, 0);
            
        } catch (error) {
            console.error('Error in loadNewPage:', error);
            throw error;
        }
        
        // This inner function handles post-load initialization
        function initializePageContent() {
            try {
                updateActiveNav();
                
                // Call page-specific functions if they exist
                if (typeof window.initializeProgramTabs === 'function') window.initializeProgramTabs();
                // Add other initializers here
                
                triggerPageAnimations(getMainElement());
                
                // Call the completion callback if provided
                if (onComplete && typeof onComplete === 'function') {
                    onComplete();
                }
                
            } catch (error) {
                console.error('Error during page content initialization:', error);
                showErrorMessage('Some page features may not work properly.');
                
                // Still call completion callback even if there's an error
                if (onComplete && typeof onComplete === 'function') {
                    onComplete();
                }
            }
        }
        
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