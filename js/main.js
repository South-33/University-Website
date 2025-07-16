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
        adjustLayoutForHeader(); // For homepage hero, harmless on other pages
        initializePageTransitions(); // The new, simple transition logic
        triggerPageAnimations(document);

        // --- Run Page-Specific Logic ---
        // Since every page is a full load, we can simply check for elements
        // and initialize them directly.
        if (document.querySelector('.program-tab')) {
            initializeProgramTabs();
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

    const loadHeader = headerPlaceholder ? fetch(`${basePath}/_includes/header.html`)
        .then(response => response.ok ? response.text() : Promise.reject('Failed to load header'))
        .then(data => {
            headerPlaceholder.outerHTML = data;
            // Use a timeout to ensure the header is in the DOM before we run scripts
            setTimeout(initializeSite, 0);
        }) : Promise.resolve();

    const loadFooter = footerPlaceholder ? fetch(`${basePath}/_includes/footer.html`)
        .then(response => response.text())
        .then(data => { footerPlaceholder.innerHTML = data; }) : Promise.resolve();
    
    loadHeader.catch(error => console.error('Error during header loading or initialization:', error));
    loadFooter.catch(error => console.error('Error fetching footer:', error));


    // =========================================================================
    //  NEW, SIMPLIFIED PAGE TRANSITION LOGIC
    // =========================================================================
    
    function initializePageTransitions() {
        document.body.classList.add('fade-in'); // Set initial state for fade-in

        document.body.addEventListener('click', (e) => {
            // Find the closest link that is internal and not a special link
            const link = e.target.closest('a');
            if (link && link.hostname === window.location.hostname && !link.getAttribute('href').startsWith('#') && link.target !== '_blank') {
                e.preventDefault(); // Stop the browser from navigating instantly
                const destination = link.href;

                // Add the fade-out class to the body
                document.body.classList.add('fade-out');

                // Wait for the animation to finish, then navigate
                setTimeout(() => {
                    window.location.href = destination;
                }, 300); // This duration should match your CSS transition time
            }
        });
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

    function initializeProgramTabs() {
        const tabs = document.querySelectorAll('.program-tab');
        const contentWrapper = document.querySelector('.program-content-wrapper');
        if (!tabs.length || !contentWrapper) return;

        const setActiveTabHeight = () => {
            const activeContent = contentWrapper.querySelector('.program-content.active');
            if (activeContent) {
                contentWrapper.style.height = activeContent.scrollHeight + 'px';
            }
        };
        
        // Initial setup
        const initialActiveTab = document.querySelector('.program-tab.active');
        if(initialActiveTab) {
            const initialTabContentId = initialActiveTab.dataset.tab + '-content';
            document.getElementById(initialTabContentId)?.classList.add('active');
        }
        setTimeout(setActiveTabHeight, 50); // Small delay for images/fonts

        tabs.forEach(tab => {
            tab.addEventListener('click', e => {
                e.preventDefault();
                const targetId = e.currentTarget.dataset.tab + '-content';
                
                tabs.forEach(t => t.classList.remove('active', 'bg-dark-blue', 'text-white'));
                e.currentTarget.classList.add('active', 'bg-dark-blue', 'text-white');
                
                contentWrapper.querySelectorAll('.program-content').forEach(c => c.classList.remove('active'));
                document.getElementById(targetId)?.classList.add('active');
                
                setActiveTabHeight();
            });
        });
        
        window.addEventListener('resize', setActiveTabHeight);
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

    function adjustLayoutForHeader() {
        const header = document.querySelector('header');
        const heroSection = document.getElementById('hero');
        if (header && heroSection) {
            const setHeroHeight = () => {
                heroSection.style.height = (window.innerHeight - header.offsetHeight) + 'px';
            };
            setHeroHeight();
            window.addEventListener('resize', setHeroHeight);
        }
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
});