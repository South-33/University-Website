// js/main.js

document.addEventListener('DOMContentLoaded', function() {

    // =========================================================================
    //  URL MAPPING SYSTEM FOR CLEAN URLS
    // =========================================================================
    
    // Map clean URLs to actual file paths
    const urlMapping = {
        // Main pages
        '/programs': '/programs/index.html',
        '/programs/': '/programs/index.html',
        '/programs/bachelors': '/programs/bachelors.html',
        '/programs/bachelors/': '/programs/bachelors.html',
        '/programs/masters': '/programs/masters.html',
        '/programs/masters/': '/programs/masters.html',
        '/programs/doctoral': '/programs/doctoral.html',
        '/programs/doctoral/': '/programs/doctoral.html',
        '/study-with-us/': '/study-with-us/index.html',
        '/study-with-us/admissions': '/study-with-us/admissions.html',
        '/study-with-us/student-support': '/study-with-us/student-support.html',
        '/study-with-us/student-mobility': '/study-with-us/student-mobility.html',
        '/study-with-us/fees': '/study-with-us/fees.html',
        '/student-activities/': '/student-activities/index.html',
        '/student-activities/clubs': '/student-activities/clubs.html',
        '/student-activities/events': '/student-activities/events.html',
        '/student-activities/gallery': '/student-activities/gallery.html',
        '/student-activities/student-voice': '/student-activities/student-voice.html',
        '/campus': '/campus/index.html',
        '/campus/': '/campus/index.html',
        '/campus/map': '/campus/map.html',
        '/campus/facilities': '/campus/facilities.html',
        '/campus/main-campus-details': '/campus/main-campus-details.html',
        '/campus/second-campus-details': '/campus/second-campus-details.html',
        '/academic-ecosystem': '/academic-ecosystem/index.html',
        '/academic-ecosystem/': '/academic-ecosystem/index.html',
        '/academic-ecosystem/research': '/academic-ecosystem/research.html',
        '/academic-ecosystem/partners': '/academic-ecosystem/partners.html',
        '/academic-ecosystem/innovation': '/academic-ecosystem/innovation.html',
        
        // Faculty pages
        '/programs/bachelors/faculty-of-management': '/programs/bachelors/faculty-of-management.html',
        '/programs/bachelors/faculty-of-finance-and-accounting': '/programs/bachelors/faculty-of-finance-and-accounting.html',
        '/programs/bachelors/faculty-of-economics': '/programs/bachelors/faculty-of-economics.html',
        '/programs/bachelors/faculty-of-tourism': '/programs/bachelors/faculty-of-tourism.html',
        '/programs/bachelors/faculty-of-law': '/programs/bachelors/faculty-of-law.html',
        '/programs/bachelors/faculty-of-digital-economy': '/programs/bachelors/faculty-of-digital-economy.html',
        '/programs/bachelors/faculty-of-public-policy': '/programs/bachelors/faculty-of-public-policy.html',
        '/programs/bachelors/faculty-of-foreign-languages': '/programs/bachelors/faculty-of-foreign-languages.html',
        '/programs/bachelors/faculty-of-it': '/programs/bachelors/faculty-of-it.html',
        '/programs/bachelors/faculty-of-robotic-engineering': '/programs/bachelors/robotic-engineering.html',

        // Bachelor's program detail pages (clean URLs → actual files)
        '/programs/bachelors/management': '/programs/bachelors/management.html',
        '/programs/bachelors/marketing': '/programs/bachelors/marketing.html',
        '/programs/bachelors/entrepreneurship': '/programs/bachelors/entrepreneurship.html',
        '/programs/bachelors/accounting': '/programs/bachelors/accounting.html',
        '/programs/bachelors/accounting-and-auditing': '/programs/bachelors/accounting-and-auditing.html',
        '/programs/bachelors/accounting-and-taxation': '/programs/bachelors/accounting-and-taxation.html',
        '/programs/bachelors/finance-and-banking': '/programs/bachelors/finance-and-banking.html',
        '/programs/bachelors/finance-and-insurance': '/programs/bachelors/finance-and-insurance.html',
        '/programs/bachelors/finance-and-security-market': '/programs/bachelors/finance-and-security-market.html',
        '/programs/bachelors/information-technology': '/programs/bachelors/information-technology.html',
        '/programs/bachelors/business-information-technology': '/programs/bachelors/business-information-technology.html',
        '/programs/bachelors/computer-science': '/programs/bachelors/computer-science.html',
        '/programs/bachelors/business-economics': '/programs/bachelors/business-economics.html',
        '/programs/bachelors/economic-development': '/programs/bachelors/economic-development.html',
        '/programs/bachelors/tourism-management': '/programs/bachelors/tourism-management.html',
        '/programs/bachelors/hospitality-management': '/programs/bachelors/hospitality-management.html',
        '/programs/bachelors/law': '/programs/bachelors/law.html',
        '/programs/bachelors/public-administration': '/programs/bachelors/public-administration.html',
        '/programs/bachelors/english': '/programs/bachelors/english.html',
        '/programs/bachelors/chinese': '/programs/bachelors/chinese.html',
        // Newly added Bachelor's programs
        '/programs/bachelors/international-business': '/programs/bachelors/international-business.html',
        '/programs/bachelors/global-entrepreneurship-and-innovation': '/programs/bachelors/global-entrepreneurship-and-innovation.html',
        '/programs/bachelors/supply-chain-management': '/programs/bachelors/supply-chain-management.html',
        '/programs/bachelors/finance': '/programs/bachelors/finance.html',
        '/programs/bachelors/public-policy': '/programs/bachelors/public-policy.html',
        '/programs/bachelors/digital-economy': '/programs/bachelors/digital-economy.html',
        '/programs/bachelors/financial-technology': '/programs/bachelors/financial-technology.html',
        '/programs/bachelors/smart-city-planning-management': '/programs/bachelors/smart-city-planning-management.html',
        '/programs/bachelors/ilaw': '/programs/bachelors/ilaw.html',

        // Masters program detail pages (clean URLs → actual files)
        '/programs/masters/mba-management': '/programs/masters/mba-management.html',
        '/programs/masters/mba-marketing': '/programs/masters/mba-marketing.html',
        '/programs/masters/mba-international-business': '/programs/masters/mba-international-business.html',
        '/programs/masters/mba-business-law': '/programs/masters/mba-business-law.html',
        '/programs/masters/mba-family-business': '/programs/masters/mba-family-business.html',
        '/programs/masters/msc-logistics-and-supply-chain-management': '/programs/masters/msc-logistics-and-supply-chain-management.html',
        '/programs/masters/msc-management-of-technology': '/programs/masters/msc-management-of-technology.html',
        '/programs/masters/msc-bank-management': '/programs/masters/msc-bank-management.html',
        '/programs/masters/msc-accounting': '/programs/masters/msc-accounting.html',
        '/programs/masters/msc-tourism-and-hospitality': '/programs/masters/msc-tourism-and-hospitality.html',
        '/programs/masters/msc-information-technology': '/programs/masters/msc-information-technology.html',
        '/programs/masters/msc-economics': '/programs/masters/msc-economics.html',
        '/programs/masters/msc-finance': '/programs/masters/msc-finance.html',
        '/programs/masters/msc-environmental-management': '/programs/masters/msc-environmental-management.html',
        '/programs/masters/msc-digital-economy': '/programs/masters/msc-digital-economy.html',
        // LL.M Comparative Law — canonical mapping to a single file
        '/programs/masters/comparative-law': '/programs/masters/llm-comparative-law.html',
        '/programs/masters/llm-comparative-law': '/programs/masters/llm-comparative-law.html',
        '/programs/masters/law-comparative-law': '/programs/masters/llm-comparative-law.html',
        // Newly added Master's programs
        '/programs/masters/mba-global-innovation-management': '/programs/masters/mba-global-innovation-management.html',
        '/programs/masters/mpa-public-administration': '/programs/masters/mpa-public-administration.html',
        '/programs/masters/mpp-public-policy': '/programs/masters/mpp-public-policy.html',

        // Doctoral program detail pages (clean URLs → actual files)
        // Short alias URLs (kept for convenience/testing) — listed first so reverse mapping prefers full names below
        '/programs/doctoral/phd': '/programs/doctoral/doctor-of-philosophy.html',
        '/programs/doctoral/dba': '/programs/doctoral/doctor-of-business-administration.html',
        '/programs/doctoral/public-policy': '/programs/doctoral/doctoral-program-in-public-policy.html',

        // Preferred full-name URLs (listed after aliases so reverse mapping uses these)
        '/programs/doctoral/doctor-of-philosophy': '/programs/doctoral/doctor-of-philosophy.html',
        '/programs/doctoral/doctor-of-business-administration': '/programs/doctoral/doctor-of-business-administration.html',
        '/programs/doctoral/doctoral-program-in-public-policy': '/programs/doctoral/doctoral-program-in-public-policy.html'
    };
    
    // Reverse mapping for converting file paths back to clean URLs
    const reverseUrlMapping = {};
    Object.entries(urlMapping).forEach(([cleanUrl, filePath]) => {
        reverseUrlMapping[filePath] = cleanUrl;
    });
    
    // Function to convert clean URL to file path
    function getFilePathFromCleanUrl(cleanUrl) {
        return urlMapping[cleanUrl] || cleanUrl;
    }
    
    // Function to convert file path to clean URL
    function getCleanUrlFromFilePath(filePath) {
        return reverseUrlMapping[filePath] || filePath;
    }

    // =========================================================================
    //  CORE INITIALIZATION
    // =========================================================================

    function initializeSite() {
        // MODIFIED: Instead of calling many header functions, we call the one
        // exposed by the self-contained header.html script.
        if (window.initializeHeaderAndSearch) {
            window.initializeHeaderAndSearch(basePath);
        } else {
            console.warn('Header initialization function not found');
        }
        
        // Hide header placeholder when header is loaded
        if (window.hideHeaderPlaceholder) {
            window.hideHeaderPlaceholder();
        }
        
        initializePageTransitions();
        initializeLazyLoading(document);
        triggerPageAnimations(document);
        initializeTouchHoverEmulation();
        if (window.initializeImageToTextSlideshow) {
            try { window.initializeImageToTextSlideshow(); } catch (e) { console.warn('Slideshow init failed:', e); }
        }
        
        // Initialize i18n only if not already initialized by i18n.js
        if (window.SimpleBilingualManager && !window.__i18nInitialized) {
            try {
                new SimpleBilingualManager();
                window.__i18nInitialized = true;
            } catch (error) {
                console.error('Failed to initialize bilingual system:', error);
            }
        }

        initializeLazyLoading(document);
        document.body.classList.add('is-visible');
    }

    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const scriptTag = document.querySelector('script[src*="js/main.js"]');
    const basePath = scriptTag ? (scriptTag.dataset.basePath || '.') : '.';

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
            // Inject header HTML and execute scripts
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;
            // Replace placeholder with actual header nodes (excluding scripts)
            const scripts = tempDiv.querySelectorAll('script');
            const headerNodes = Array.from(tempDiv.childNodes).filter(node => node.nodeName.toLowerCase() !== 'script');
            headerNodes.forEach(node => headerPlaceholder.parentNode.insertBefore(node, headerPlaceholder));
            headerPlaceholder.parentNode.removeChild(headerPlaceholder);
            // Execute each script in header
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                if (oldScript.src) {
                    newScript.src = oldScript.src;
                    newScript.async = false;
                } else {
                    newScript.textContent = oldScript.textContent;
                }
                document.head.appendChild(newScript);
            });
            
            // The header now contains its own <script> tag which will execute automatically.
            // We still trigger the main site initialization.
            setTimeout(() => {
                try {
                    initializeSite();
                } catch (error) {
                    console.error('Error during site initialization:', error);
                    document.body.classList.add('is-visible');
                }
            }, 0);
        })
        .catch(error => {
            console.error('Failed to load header after retries:', error);
            headerPlaceholder.innerHTML = `
                <header class="bg-dark-blue text-white p-4">
                    <div class="max-w-6xl mx-auto">
                        <h1 class="text-xl font-bold">National University of Management</h1>
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
            footerPlaceholder.innerHTML = `
                <footer class="bg-dark-blue text-white p-4 text-center">
                    <p>© ${new Date().getFullYear()} National University of Management</p>
                </footer>
            `;
        }) : Promise.resolve();

    // =========================================================================
    //  SIMPLE PAGE TRANSITION SYSTEM (ORIGINAL WORKING VERSION)
    // =========================================================================
    
    function initializePageTransitions() {
        // Handle link clicks for smooth transitions
        document.body.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            
            if (link && 
                link.hostname === window.location.hostname && 
                !link.getAttribute('href').startsWith('#') && 
                link.target !== '_blank' &&
                !link.hasAttribute('data-no-transition')) {
                
                e.preventDefault();
                let destination = link.href;
                
                // Don't transition if we're already on the same page
                if (destination === window.location.href) {
                    return;
                }
                
                startPageTransition(destination);
            }
        });

        // Handle browser back/forward navigation
        window.addEventListener('popstate', (e) => {
            startPageTransition(window.location.href, null, false);
        });
    }
    
    function handleCleanUrlAccess() {
        const currentPath = window.location.pathname;
        const actualFilePath = getFilePathFromCleanUrl(currentPath);
        
        if (actualFilePath !== currentPath && urlMapping[currentPath]) {
            const title = document.title;
            history.replaceState({ path: window.location.href }, title, window.location.href);
        }
    }
        
    // Simple page cache for better performance
    const pageCache = new Map();
    
    // Set to track URLs currently being preloaded
    const preloadingUrls = new Set();
    
    function initializeLinkPreloading() {
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
        const pathname = new URL(url).pathname;
        const actualFilePath = getFilePathFromCleanUrl(pathname);
        let actualUrl = url;
        
        if (actualFilePath !== pathname) {
            actualUrl = new URL(actualFilePath, window.location.origin).href;
        }
        
        if (pageCache.has(actualUrl) || preloadingUrls.has(actualUrl)) {
            return;
        }
        
        preloadingUrls.add(actualUrl);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        fetch(actualUrl, { signal: controller.signal })
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
                pageCache.set(actualUrl, { html, title, timestamp: Date.now() });
            })
            .catch(error => {
                clearTimeout(timeoutId);
                if (error.name !== 'AbortError' && !error.message.includes('404')) {
                    console.warn('Failed to preload page:', actualUrl, error.message);
                }
            })
            .finally(() => {
                preloadingUrls.delete(actualUrl);
            });
    }
    
    initializeLinkPreloading();
    
    function executePageScripts(doc) {
        const scripts = doc.querySelectorAll('script:not([src])');
        scripts.forEach(script => {
            if (script.textContent.trim()) {
                try {
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

    // Simple transition timing
    let transitionStartTime = 0;
    
    function startPageTransition(cleanUrl, actualFilePath = null, pushState = true) {
        transitionStartTime = Date.now();
        
        if (!actualFilePath) {
            const pathname = new URL(cleanUrl).pathname;
            actualFilePath = getFilePathFromCleanUrl(pathname);
            if (actualFilePath === pathname) {
                actualFilePath = cleanUrl;
            } else {
                actualFilePath = new URL(actualFilePath, window.location.origin).href;
            }
        }
        
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.style.opacity = '0.85';
            mainContent.style.transition = 'opacity 0.2s ease-out';
        }
        
        const cachedPage = getCachedPage(actualFilePath);
        
        if (cachedPage) {
            setTimeout(() => {
                try {
                    loadNewPage(cachedPage.html, cachedPage.title, cleanUrl, pushState);
                } catch (error) {
                    console.error('Error loading cached page:', error);
                    handleTransitionError(cleanUrl, error);
                }
            }, 150);
        } else {
            loadWithRetry(actualFilePath, 2, 500)
                .then(html => {
                    if (!html || html.trim().length === 0) {
                        throw new Error('Empty response received');
                    }
                    
                    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
                    const title = titleMatch ? titleMatch[1] : 'NUM';
                    pageCache.set(actualFilePath, { html, title, timestamp: Date.now() });
                    
                    setTimeout(() => {
                        try {
                            loadNewPage(html, title, cleanUrl, pushState);
                        } catch (error) {
                            console.error('Error loading new page:', error);
                            handleTransitionError(cleanUrl, error);
                        }
                    }, 150);
                })
                .catch(error => {
                    console.error('Page transition failed:', error);
                    handleTransitionError(cleanUrl, error);
                });
        }
    }

    function loadNewPage(mainHTML, titleText, destination, pushState) {
        try {
            window.scrollTo({ top: 0, behavior: 'instant' });
            
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(mainHTML, 'text/html');
            const newMain = newDoc.querySelector('main');
            const currentMain = document.querySelector('main');
            
            if (!newMain) {
                throw new Error('No main element found in new page content');
            }
            
            if (!currentMain) {
                throw new Error('No main element found in current page');
            }
            
            document.title = titleText;
            
            if (pushState) {
                history.pushState({ path: destination }, titleText, destination);
            }
            
            currentMain.innerHTML = newMain.innerHTML;

            // Hint the browser to decode images asynchronously to reduce main-thread jank
            try {
                const imgs = currentMain.querySelectorAll('img');
                imgs.forEach(img => {
                    // Respect existing lazy strategy but prefer async decode
                    if (!img.hasAttribute('decoding')) {
                        img.setAttribute('decoding', 'async');
                    }
                });
            } catch (_) {}
            
            const newStyles = newDoc.querySelectorAll('style');
            newStyles.forEach(style => {
                if (style.textContent && style.textContent.trim()) {
                    try {
                        const styleHash = btoa(style.textContent.substring(0, 50).replace(/[\r\n\t]/g, ''));
                        if (!document.querySelector(`style[data-page-style="${styleHash}"]`)) {
                            const newStyle = document.createElement('style');
                            newStyle.textContent = style.textContent;
                            newStyle.setAttribute('data-page-style', styleHash);
                            document.head.appendChild(newStyle);
                        }
                    } catch (error) {
                        console.warn('Error processing page styles:', error);
                    }
                }
            });
            
            try {
                executePageScripts(newDoc);
            } catch (error) {
                console.error('Error executing page scripts:', error);
            }
            
            // Allow a microtask break before running initializers
            setTimeout(initializePageContent, 0);
            
        } catch (error) {
            console.error('Error in loadNewPage:', error);
            throw error;
        }
        
        function initializePageContent() {
            try {
                // MODIFIED: This now calls the `updateActiveNav` function exposed by the header script.
                // This is crucial for updating the active nav link after an SPA transition.
                if (window.updateActiveNav) {
                    window.updateActiveNav();
                }
                
                if (window.pageCleanup && typeof window.pageCleanup === 'function') {
                    try {
                        window.pageCleanup();
                    } catch (error) {
                        console.warn('Error during page cleanup:', error);
                    }
                }
                
                // Prioritize lightweight visual setup first for smoother perception
                const mainEl = document.querySelector('main');
                triggerPageAnimations(mainEl);
                initializeLazyLoading(mainEl);

                // Explicitly call initializePage if it exists (for SPA navigation)
                if (window.initializePage && typeof window.initializePage === 'function') {
                    try {
                        window.initializePage();
                    } catch (error) {
                        console.error('Error calling initializePage:', error);
                    }
                }

                // Run known page-level initializers quickly (small, necessary)
                const quickInits = [
                    'initializeImageToTextSlideshow',
                    'initializeProgramTabs'
                ];
                quickInits.forEach(name => {
                    if (typeof window[name] === 'function') {
                        try { window[name](); } catch (e) { console.error(`Error calling ${name}:`, e); }
                    }
                });

                // IMPORTANT: Avoid reflectively calling every initialize*/init* function on window.
                // This was causing multiple re-initializations (e.g., homepage features, header),
                // leading to duplicated listeners/instances and occasional blank states.
                // We now rely on:
                // - page-level window.initializePage()
                // - explicit quickInits above
                // If more initializers are needed, register them explicitly in quickInits.
                
                const mainContent = document.querySelector('main');
                if (mainContent) {
                    mainContent.style.opacity = '1';
                    mainContent.style.transition = 'opacity 0.25s ease-in';
                }
            } catch (error) {
                console.error('Error during page content initialization:', error);
                const mainContent = document.querySelector('main');
                if (mainContent) {
                    mainContent.style.opacity = '1';
                    mainContent.style.transition = 'opacity 0.25s ease-in';
                }
            }
        }
    }

    // =========================================================================
    //  UTILITY FUNCTIONS
    // =========================================================================

    let lazyLoadObserver;
    function initializeLazyLoading(container) {
        const lazyImages = container.querySelectorAll('img.lazy-load');

        if (!lazyImages.length) return;

        if (!lazyLoadObserver) {
            lazyLoadObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        img.src = src;
                        img.classList.add('is-loaded');
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '0px 0px 200px 0px' });
        }

        lazyImages.forEach(image => {
            lazyLoadObserver.observe(image);
        });
    }

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

    // ---------------------------------------------------------------------
    // Unified Wave Animation for Program Cards (Image ↔ Text Crossfade)
    // Centralized implementation used by Bachelors/Masters/Doctoral pages.
    // ---------------------------------------------------------------------
    function initializeImageToTextSlideshow() {
        const cards = document.querySelectorAll('.image-to-text-card');
        const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!cards.length) return;

        // Clear any existing timers to prevent duplicates during SPA navigation
        cards.forEach(card => {
            if (card.slideshowInterval) {
                clearInterval(card.slideshowInterval);
                card.slideshowInterval = null;
            }
            if (card.slideshowTimeout) {
                clearTimeout(card.slideshowTimeout);
                card.slideshowTimeout = null;
            }
        });

        const cardsArray = Array.from(cards);
        const baseInterval = 5000; // global cadence for flips
        const waveGap = 25;       // ms between neighboring cards (crisper wave)
        const maxJitter = 8;      // small jitter to avoid re-sync

        cardsArray.forEach(card => {
            const image = card.querySelector('img');
            // Select only the direct overlay container
            const textOverlay = card.querySelector(':scope > div');

            if (!image || !textOverlay) {
                console.warn('Image-to-text card missing required elements:', card);
                return;
            }

            // Ensure starting state: image visible, text hidden
            image.classList.add('opacity-100');
            image.classList.remove('opacity-0');
            textOverlay.classList.add('opacity-0');
            textOverlay.classList.remove('opacity-100');

            // Respect reduced motion: set initial state but do not animate
            if (isReducedMotion) {
                return;
            }

            let isImageVisible = true;

            const toggle = () => {
                if (isImageVisible) {
                    image.classList.remove('opacity-100');
                    image.classList.add('opacity-0');
                    textOverlay.classList.remove('opacity-0');
                    textOverlay.classList.add('opacity-100');
                } else {
                    textOverlay.classList.remove('opacity-100');
                    textOverlay.classList.add('opacity-0');
                    image.classList.remove('opacity-0');
                    image.classList.add('opacity-100');
                }
                isImageVisible = !isImageVisible;
            };

            const index = cardsArray.indexOf(card);
            const jitter = Math.floor(Math.random() * maxJitter);
            const startDelay = index * waveGap + jitter;

            // Kick off first flip after base interval plus staggered delay, then continue on base cadence
            card.slideshowTimeout = setTimeout(() => {
                toggle();
                card.slideshowInterval = setInterval(toggle, baseInterval);
            }, startDelay + baseInterval);
        });
    }

    // Expose globally so SPA transitions and pages can call it
    window.initializeImageToTextSlideshow = initializeImageToTextSlideshow;

    // Global utility function for program tab scrolling (used by multiple pages)
    window.handleProgramTabClick = function(tabEl) {
        const programSection = tabEl.closest('.program-tabs-section');
        if (!programSection) {
            console.warn('Could not find the program container to scroll to.');
            return;
        }

        const header = document.querySelector('header');
        let headerOffset = 0;

        if (window.innerWidth >= 768 && header) {
            headerOffset = header.offsetHeight;
        }

        const sectionTop = programSection.getBoundingClientRect().top + window.pageYOffset;
        const scrollToPosition = sectionTop - headerOffset;

        window.scrollTo({
            top: scrollToPosition,
            behavior: 'smooth'
        });
    };
    
    function handleTransitionError(destination, error) {
        console.error('Transition error for', destination, ':', error);
        
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.style.opacity = '1';
            mainContent.style.transition = 'opacity 0.3s ease-in';
        }
        
        setTimeout(() => {
            window.location.href = destination;
        }, 1000);
    }
    
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
    });

    // ---------------------------------------------------------------------
    // Touch Hover Emulation (site-wide)
    // Adds `.is-hovered` on tap and when centered in viewport on touch devices
    // ---------------------------------------------------------------------
    function initializeTouchHoverEmulation() {
        const isCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        if (!(isCoarsePointer || hasTouch)) return; // Only for touch / coarse devices

        document.documentElement.classList.add('touch-hover');

        // Elements to emulate hover for (extendable)
        const selectors = [
            '.btn',
            '.btn-primary',
            '.btn-secondary',
            '.btn-glass',
            '.program-subnav .subnav-link',
            '[data-simulate-hover]'
        ];

        // Delegate tap to toggle temporary hover state
        document.addEventListener('touchstart', (e) => {
            const target = e.target.closest(selectors.join(','));
            if (!target) return;
            applyTempHover(target, 850);
        }, { passive: true, capture: true });

        // Intersection-based hover: when an element is near viewport center
        const candidates = () => Array.from(document.querySelectorAll(selectors.join(',')));
        const centerObserver = new IntersectionObserver((entries) => {
            const vh = window.innerHeight || document.documentElement.clientHeight;
            const vw = window.innerWidth || document.documentElement.clientWidth;
            const centerY = vh / 2;
            const centerX = vw / 2;
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    entry.target.classList.remove('is-hovered');
                    return;
                }
                const rect = entry.target.getBoundingClientRect();
                const inCenter = rect.top < centerY && rect.bottom > centerY && rect.left < centerX && rect.right > centerX;
                if (inCenter) {
                    entry.target.classList.add('is-hovered');
                } else {
                    entry.target.classList.remove('is-hovered');
                }
            });
        }, { root: null, threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-20% 0px -20% 0px' });

        const observeAll = () => {
            candidates().forEach(el => centerObserver.observe(el));
        };
        observeAll();

        // Re-observe when DOM changes during SPA transitions
        const mo = new MutationObserver(() => {
            centerObserver.disconnect();
            observeAll();
        });
        mo.observe(document.body, { childList: true, subtree: true });

        function applyTempHover(el, duration = 800) {
            el.classList.add('is-hovered');
            window.clearTimeout(el.__hoverTimer);
            el.__hoverTimer = window.setTimeout(() => {
                el.classList.remove('is-hovered');
            }, duration);
        }
    }

    initializeTouchHoverEmulation();
});