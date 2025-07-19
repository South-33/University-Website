// js/main.js

document.addEventListener('DOMContentLoaded', function() {

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
        // adjustLayoutForHeader removed - no longer needed
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

    // Simple transition timing
    let transitionStartTime = 0;
    
    function startPageTransition(destination, pushState = true) {
        transitionStartTime = Date.now();
        
        // Start fade out - only affect main content, not header
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.style.opacity = '0.85';
            mainContent.style.transition = 'opacity 0.2s ease-out';
        }
        
        // Get cached page or fetch new one
        const cachedPage = getCachedPage(destination);
        
        if (cachedPage) {
            // Use cached version
            setTimeout(() => {
                try {
                    loadNewPage(cachedPage.html, cachedPage.title, destination, pushState);
                } catch (error) {
                    console.error('Error loading cached page:', error);
                    handleTransitionError(destination, error);
                }
            }, 150);
        } else {
            // Fetch new page with enhanced error handling
            loadWithRetry(destination, 2, 500)
                .then(html => {
                    // Validate HTML content
                    if (!html || html.trim().length === 0) {
                        throw new Error('Empty response received');
                    }
                    
                    // Cache the page
                    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
                    const title = titleMatch ? titleMatch[1] : 'NUM';
                    pageCache.set(destination, { html, title, timestamp: Date.now() });
                    
                    setTimeout(() => {
                        try {
                            loadNewPage(html, title, destination, pushState);
                        } catch (error) {
                            console.error('Error loading new page:', error);
                            handleTransitionError(destination, error);
                        }
                    }, 150);
                })
                .catch(error => {
                    console.error('Page transition failed:', error);
                    handleTransitionError(destination, error);
                });
        }
    }

    function loadNewPage(mainHTML, titleText, destination, pushState) {
        try {
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
                triggerPageAnimations(document.querySelector('main'));
                
                // Fade page back in - only affect main content, not header
                const mainContent = document.querySelector('main');
                if (mainContent) {
                    mainContent.style.opacity = '1';
                    mainContent.style.transition = 'opacity 0.3s ease-in';
                }
            } catch (error) {
                console.error('Error during page content initialization:', error);
                // Still fade in even if initialization fails - only affect main content
                const mainContent = document.querySelector('main');
                if (mainContent) {
                    mainContent.style.opacity = '1';
                    mainContent.style.transition = 'opacity 0.3s ease-in';
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
        const header = document.querySelector('header');
        if (!header) return;
        let lastScrollTop = 0;
        const scrollThreshold = header.offsetHeight;
        window.addEventListener('scroll', () => {
            if (window.innerWidth >= 768) {
                header.style.transform = 'translateY(0)'; return;
            }
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, { passive: true });
    }

    function initializeNavigation() {
        document.body.addEventListener('click', function(e) {
            const exploreLink = e.target.closest('.explore-link, a[href="#intro"]');
            if (exploreLink) {
                e.preventDefault();
                const introSection = document.getElementById('intro');
                if (introSection) {
                    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
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
        document.body.addEventListener('focusin', (e) => {
            if (e.target.matches('input[type="search"]') && !searchInitialized) {
                setupSearch(e.target, basePath);
                searchInitialized = true;
            }
        }, { once: true });
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
        fetch(`${basePath}/js/search-index.json`).then(r => r.json()).then(data => {
            fuse = new Fuse(data, { keys: ['title', 'description', 'tags'], includeScore: true, threshold: 0.4, minMatchCharLength: 2 });
        }).catch(err => console.error('Error loading search index:', err));
        const render = (results) => {
            searchResultsContainer.innerHTML = '';
            if (results.length === 0) return;
            const ul = document.createElement('ul');
            results.slice(0, 10).forEach((result, index, arr) => {
                const { item } = result;
                const li = document.createElement('li');
                if (index < arr.length - 1) li.classList.add('border-b', 'border-dark-blue/5');
                li.innerHTML = `<a href="${new URL(item.url, window.location.origin).href}" class="block w-full px-5 py-3 hover:bg-light-lavender/60 transition-colors duration-150"><span class="font-body font-medium text-dark-blue">${item.title}</span><span class="block text-sm text-dark-blue/70 font-body mt-1">${item.description||''}</span></a>`;
                ul.appendChild(li);
            });
            searchResultsContainer.appendChild(ul);
        };
        const search = () => {
            if (!fuse || searchInput.value.length < 2) { hide(); return; }
            const results = fuse.search(searchInput.value);
            if (results.length === 0) { hide(); return; }
            render(results);
            searchResultsContainer.classList.remove('hidden');
            if (window.innerWidth < 768) {
                overlay.classList.remove('hidden');
                document.body.classList.add('overflow-hidden');
            }
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
        searchInput.addEventListener('blur', hide);
        searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') e.preventDefault(); });
        overlay.addEventListener('click', hide);
        searchResultsContainer.addEventListener('mousedown', e => e.preventDefault());
        searchResultsContainer.addEventListener('click', e => {
            if (e.target.closest('a')) {
                searchInput.value = '';
                hide();
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
        const mainContent = document.querySelector('main');
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