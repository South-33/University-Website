document.addEventListener('DOMContentLoaded', function() {
    // --- Reusable Animation Function ---
    function triggerPageAnimations(container) {
        const sections = container.querySelectorAll('.fade-in-section');
        if (sections.length > 0) {
            sections.forEach((section, index) => {
                // A small, staggered delay ensures the browser has time to apply initial styles
                // before the transition class is added, making the animation reliable.
                setTimeout(() => {
                    section.classList.add('is-visible');
                }, 50 * (index + 1));
            });
        }
    }

    // --- Initial Page Load ---
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const scriptTag = document.querySelector('script[src*="js/main.js"]');
    const basePath = scriptTag ? (scriptTag.dataset.basePath || '.') : '.';

    // Trigger animations for the initial content that's already on the page.
    triggerPageAnimations(document);

    const loadHeader = headerPlaceholder ? fetch(`${basePath}/_includes/header.html`)
        .then(response => response.ok ? response.text() : Promise.reject('Failed to load header'))
        .then(data => { headerPlaceholder.outerHTML = data; })
        : Promise.resolve();

    const loadFooter = footerPlaceholder ? fetch(`${basePath}/_includes/footer.html`)
        .then(response => response.ok ? response.text() : Promise.reject('Failed to load footer'))
        .then(data => { footerPlaceholder.innerHTML = data; })
        : Promise.resolve();

    // Wait for the header to be fetched and injected first.
    loadHeader.then(() => {
        // Initialize navigation and transitions immediately after header is ready.
        initializeNavigation();
        initializeSearch(basePath); // Initialize site search
        initializePageTransitions(triggerPageAnimations); // Pass the animation function to the SPA loader
        initializeHidingHeader(); // Add hiding header for mobile

        // Adjust layout after all page resources (images, etc.) are loaded to ensure correct height.
        window.addEventListener('load', adjustLayoutForHeader);
    }).catch(error => console.error('Error loading header or initializing scripts:', error));

    loadFooter.catch(error => console.error('Error fetching footer:', error));

        function updateActiveNav() {
        const currentPath = window.location.pathname;
        // Select all links within the main navigation to correctly handle submenus.
        const navLinks = document.querySelectorAll('.main-nav a');

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (!linkHref || linkHref === '#') {
                link.classList.remove('active');
                return;
            }

            // Make path comparison more robust.
            const linkUrl = new URL(link.href);
            const linkPath = linkUrl.pathname;

            // Check for an exact match or if the current path is a child of the link path.
            const isActive = currentPath === linkPath || (linkPath !== '/' && currentPath.startsWith(linkPath) && link.href.includes('index.html'));
            
            link.classList.toggle('active', isActive);

            // Also activate the parent menu item.
            if (isActive && link.closest('ul')?.classList.contains('absolute')) {
                link.closest('.relative.group')?.querySelector('a')?.classList.add('active');
            }
        });
    }

    function initializeHidingHeader() {
        const header = document.querySelector('header');
        if (!header) return;

        let lastScrollTop = 0;
        const scrollThreshold = 0; // Pixels to scroll before hiding header

        window.addEventListener('scroll', () => {
            // Only apply on mobile
            if (window.innerWidth >= 768) {
                header.style.transform = 'translateY(0)';
                return;
            }

            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
                // Scrolling Down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling Up
                header.style.transform = 'translateY(0)';
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
        }, { passive: true });
    }

    function initializeNavigation() {
        updateActiveNav(); // Set active link on initial load

        // --- Desktop & Mobile Dropdown Logic ---
        document.querySelectorAll('.main-nav .group').forEach(item => {
            const link = item.querySelector('a:not(ul a)'); // The top-level link
            const submenu = item.querySelector('ul');
            if (!link || !submenu) return;

            link.addEventListener('click', (e) => {
                // For touch devices, the first tap should open the menu.
                // If the menu is already open, the click should proceed as a normal navigation.
                if (window.innerWidth < 768 && !item.classList.contains('is-open')) {
                    e.preventDefault();
                    // Close other open menus
                    document.querySelectorAll('.main-nav .group.is-open').forEach(openItem => {
                        if (openItem !== item) openItem.classList.remove('is-open');
                    });
                    item.classList.add('is-open');
                }
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.main-nav .group')) {
                document.querySelectorAll('.main-nav .group.is-open').forEach(item => {
                    item.classList.remove('is-open');
                });
            }
        });

        // Smooth scroll for the "Explore" link
        document.body.addEventListener('click', function(e) {
            const exploreLink = e.target.closest('.explore-link, a[href="#intro"]');
            if (exploreLink) {
                e.preventDefault();
                const currentSection = exploreLink.closest('section');
                if (!currentSection) return;
                const nextSection = currentSection.nextElementSibling;
                if (!nextSection) return;
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = nextSection.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });

        // --- Mobile Navigation (Hamburger Menu) ---
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                const nav = document.querySelector('#mobile-menu');
                if (!nav) return;
                navToggle.style.pointerEvents = 'none';
                nav.classList.toggle('translate-x-full');
                const isVisible = !nav.classList.contains('translate-x-full');
                navToggle.classList.toggle('is-active');
                document.body.style.overflow = isVisible ? 'hidden' : 'auto';
                setTimeout(() => { navToggle.style.pointerEvents = 'auto'; }, 300);
            });
        }
    }

    function initializePageTransitions(triggerPageAnimations) {
        const mainContent = document.querySelector('main');
        if (!mainContent) return;

        const initialUrl = location.href;
        history.replaceState({ path: initialUrl }, document.title, initialUrl);

        const loadPage = async (url, push = true) => {
            document.body.style.cursor = 'wait';
            mainContent.style.transition = 'opacity 0.15s ease-out';
            mainContent.style.opacity = '0';

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    window.location.href = url;
                    return;
                }
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                
                const newMain = doc.querySelector('main');
                const newTitle = doc.querySelector('title');

                if (newMain && newTitle) {
                    setTimeout(() => {
                        mainContent.innerHTML = newMain.innerHTML;
                        document.title = newTitle.innerText;

                        // Manually play video on homepage when navigating via SPA
                        if (url.endsWith('/') || url.endsWith('index.html')) {
                            const heroVideo = mainContent.querySelector('#hero video');
                            if (heroVideo) {
                                const onCanPlay = () => {
                                    heroVideo.play().catch(error => console.error("Video autoplay failed:", error));
                                    heroVideo.removeEventListener('canplay', onCanPlay);
                                };
                                heroVideo.addEventListener('canplay', onCanPlay);
                                heroVideo.load();
                            }
                        }

                        // Trigger animations for the new content
                        triggerPageAnimations(mainContent);
                        
                        if (push) {
                            history.pushState({ path: url }, document.title, url);
                        }
                        
                        window.scrollTo({ top: 0, behavior: 'instant' });
                        
                        adjustLayoutForHeader();
                        updateActiveNav();

                        mainContent.style.opacity = '1';
                        document.body.style.cursor = 'default';
                    }, 150);

                } else {
                    window.location.href = url;
                }
            } catch (error) {
                console.error('Error loading page:', error);
                document.body.style.cursor = 'default';
                window.location.href = url;
            }
        };

        document.body.addEventListener('click', e => {
            const link = e.target.closest('a');

            if (!link || link.hasAttribute('data-no-spa') || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
                return;
            }

            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }

            const targetUrl = new URL(link.href);

            if (targetUrl.origin !== window.location.origin) {
                return; // External link
            }
            
            if (link.hasAttribute('download')) {
                return;
            }

            e.preventDefault();
            loadPage(targetUrl.href);
        });

        window.addEventListener('popstate', e => {
            if (e.state && e.state.path) {
                loadPage(e.state.path, false);
            }
        });
    }

    function adjustLayoutForHeader() {
        const header = document.querySelector('header');
        const heroSection = document.getElementById('hero');

        if (header && heroSection) {
            const setHeroHeight = () => {
                const headerHeight = header.offsetHeight;
                const heroHeight = window.innerHeight - headerHeight;
                heroSection.style.height = `${heroHeight}px`;
            };
            setHeroHeight();
            window.addEventListener('resize', setHeroHeight);
        }
    }

    function initializeSearch(basePath) {
        let fuse = null;
        let searchResults = [];
        const searchInput = document.querySelector('input[type="search"]');
        
        if (!searchInput) {
            console.warn('Search input with type="search" not found.');
            return;
        }

        const searchContainer = searchInput.parentNode;

        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-40 hidden';
        document.body.appendChild(overlay);

        const searchResultsContainer = document.createElement('div');
        searchResultsContainer.className = 'fixed hidden bg-white shadow-2xl rounded-lg z-50 border border-dark-blue/10 overflow-y-auto max-h-[70vh]';
        document.body.appendChild(searchResultsContainer);

        fetch(`${basePath}/js/search-index.json`)
            .then(response => response.json())
            .then(data => {
                fuse = new Fuse(data, {
                    keys: ['title', 'description', 'tags'],
                    includeScore: true,
                    threshold: 0.4,
                    minMatchCharLength: 2,
                });
                console.log('Search index loaded:', data.length, 'items.');
            }).catch(error => console.error('Error loading search index:', error));

        const renderResults = (results) => {
            searchResultsContainer.innerHTML = '';
            if (results.length === 0) return;

            const ul = document.createElement('ul');
            const limitedResults = results.slice(0, 10);
            limitedResults.forEach((result, index) => {
                const { item } = result;
                const li = document.createElement('li');
                if (index < limitedResults.length - 1) {
                    li.classList.add('border-b', 'border-dark-blue/5');
                }
                const fullUrl = new URL(item.url, window.location.origin).href;
                li.innerHTML = `
                    <a href="${fullUrl}" class="block w-full px-5 py-3 hover:bg-light-lavender/60 transition-colors duration-150">
                        <span class="font-body font-medium text-dark-blue">${item.title}</span>
                        <span class="block text-sm text-dark-blue/70 font-body mt-1">${item.description || ''}</span>
                    </a>
                `;
                ul.appendChild(li);
            });
            searchResultsContainer.appendChild(ul);
        };

        const positionResults = () => {
            if (searchResultsContainer.classList.contains('hidden')) return;

            const searchRect = searchContainer.getBoundingClientRect();
            
            if (window.innerWidth < 768) { // Mobile: Centered modal
                overlay.classList.remove('hidden');
                document.body.classList.add('overflow-hidden');
                searchResultsContainer.style.position = 'fixed';
                searchResultsContainer.style.width = '90vw';
                searchResultsContainer.style.maxWidth = '600px';
                searchResultsContainer.style.top = `${searchRect.bottom + 15}px`;
                searchResultsContainer.style.left = '50%';
                searchResultsContainer.style.transform = 'translateX(-50%)';
            } else { // Desktop: Attached to search bar
                overlay.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
                searchResultsContainer.style.position = 'absolute';
                searchResultsContainer.style.width = `${searchRect.width}px`;
                searchResultsContainer.style.top = `${window.scrollY + searchRect.bottom + 5}px`;
                searchResultsContainer.style.left = `${searchRect.left}px`;
                searchResultsContainer.style.transform = 'none';
            }
        };

        const performSearch = () => {
            if (!fuse || searchInput.value.length < 2) {
                hideResults();
                return;
            }
            searchResults = fuse.search(searchInput.value);
            if (searchResults.length === 0) {
                hideResults();
                return;
            }
            
            renderResults(searchResults);
            searchResultsContainer.classList.remove('hidden');
            positionResults();
        };

        const hideResults = () => {
            searchResultsContainer.classList.add('hidden');
            overlay.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        };

        searchInput.addEventListener('input', performSearch);
        searchInput.addEventListener('focus', performSearch);
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') e.preventDefault();
        });
        searchInput.addEventListener('blur', () => setTimeout(hideResults, 200));
        window.addEventListener('resize', positionResults);
    }
});
