document.addEventListener('DOMContentLoaded', function() {
    // --- Reusable Animation Function ---
    function triggerPageAnimations(container) {
        const sections = container.querySelectorAll('.fade-in-section');

        if (sections.length === 0) return;

        const observerOptions = {
            root: null, // observes intersections relative to the viewport
            rootMargin: '0px',
            threshold: 0.05 // trigger when 5% of the element is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Stop observing once it's visible
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
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
        updateActiveNav(); // Set initial active link

        // Adjust layout after all page resources (images, etc.) are loaded to ensure correct height.
        window.addEventListener('load', adjustLayoutForHeader);

        // Initialize program tabs if they exist on the page.
        initializeProgramTabs();
    }).catch(error => console.error('Error loading header or initializing scripts:', error));

    loadFooter.catch(error => console.error('Error fetching footer:', error));

    function updateActiveNav() {
        // Normalize the current path by removing any trailing slash or .html extension.
        const currentPath = window.location.pathname.replace(/\/$/, '').replace(/\.html$/, '');
        const navLinks = document.querySelectorAll('.main-nav a');
        let bestMatch = null;

        // First, remove all active classes to reset the state.
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Then, find the best matching link for the current path.
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (!linkHref || linkHref === '#') return;

            const linkUrl = new URL(link.href);
            // Normalize the link's path for comparison.
            const linkPath = linkUrl.pathname.replace(/\/$/, '').replace(/\.html$/, '');

            // The best match is the longest link path that is a prefix of the current path.
            if (currentPath.startsWith(linkPath)) {
                if (!bestMatch || linkPath.length > bestMatch.path.length) {
                    bestMatch = { link: link, path: linkPath };
                }
            }
        });

        // If a best match is found, apply the 'active' class to it and its parent.
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
        // Set the scroll threshold to the header's height. This ensures the header
        // only hides after the user has scrolled past its vertical space.
        const scrollThreshold = header.offsetHeight;

        window.addEventListener('scroll', () => {
            // Only apply this behavior on mobile viewports
            if (window.innerWidth >= 768) {
                header.style.transform = 'translateY(0)';
                return;
            }

            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // On scrolling down, hide the header, but only after passing the threshold.
            if (scrollTop > lastScrollTop) {
                if (scrollTop > scrollThreshold) {
                    header.style.transform = 'translateY(-100%)';
                }
            } else {
                // On scrolling up, always show the header.
                header.style.transform = 'translateY(0)';
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
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

        // Add a class to handle the fade transition via CSS.
        mainContent.classList.add('spa-transition');

        const initialUrl = location.href;
        history.replaceState({ path: initialUrl }, document.title, initialUrl);

        const loadPage = async (url, push = true) => {
            document.body.style.cursor = 'wait';
            mainContent.style.opacity = '0';

            try {
                let fetchUrl = url;
                const urlObject = new URL(url);
                // Vercel needs .html extension for direct file access, but not for root.
                // We check if the path has no extension and is not the root.
                if (!urlObject.pathname.split('/').pop().includes('.') && urlObject.pathname !== '/') {
                    fetchUrl = urlObject.href.endsWith('/') ? `${urlObject.href}index.html` : `${urlObject.href}.html`;
                }

                const response = await fetch(fetchUrl);
                if (!response.ok) {
                    // If the fetch fails, fall back to a full page load.
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
                        
                        // Update browser history and title FIRST so nav update works correctly
                        if (push) {
                            history.pushState({ path: url }, newTitle.innerText, url);
                        }
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

                        // Re-initialize all necessary scripts for the new content
                        triggerPageAnimations(mainContent);
                        initializeHidingHeader();
                        initializeProgramTabs();
                        adjustLayoutForHeader();
                        updateActiveNav(); // Now this will read the correct URL
                        
                        window.scrollTo({ top: 0, behavior: 'instant' });

                        // Force a reflow to ensure the DOM is updated before the animation starts.
                        // This can fix transition issues on some browsers/environments.
                        void mainContent.offsetWidth;

                        mainContent.style.opacity = '1';
                        document.body.style.cursor = 'default';
                    }, 150);
                } else {
                    // Fallback for pages that don't have a <main> or <title>
                    window.location.href = url;
                }
            } catch (error) {
                console.error('Error loading page:', error);
                document.body.style.cursor = 'default';
                window.location.href = url; // Fallback on any error
            }
        };

        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.path) {
                loadPage(event.state.path, false);
            }
        });

        document.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (!link) return;

            // SPA navigation for internal links only
            if (link.hostname === window.location.hostname && !link.getAttribute('href').startsWith('#') && link.target !== '_blank') {
                event.preventDefault();
                loadPage(link.href);
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
        // The backdrop-blur-sm class was removed to improve performance on mobile.
        overlay.className = 'fixed inset-0 bg-black/60 z-40 hidden';
        document.body.appendChild(overlay);

        const searchResultsContainer = document.createElement('div');
        // This new class will be styled in main.css to handle positioning
        searchResultsContainer.className = 'search-results-dropdown hidden';
        // Append to the search container, not the body, to ensure it scrolls with the header
        searchContainer.appendChild(searchResultsContainer);

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

            // On mobile, show an overlay to focus the user
            if (window.innerWidth < 768) {
                overlay.classList.remove('hidden');
                document.body.classList.add('overflow-hidden');
            }
        };

        const hideResults = () => {
            searchResultsContainer.classList.add('hidden');
            overlay.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        };

        searchInput.addEventListener('input', performSearch);
        searchInput.addEventListener('click', performSearch);
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') e.preventDefault();
        });
        // Clicking the overlay will close the results (good for mobile UX)
        overlay.addEventListener('click', hideResults);
        // When a user clicks on a result, we don't want the input to lose focus,
        // as that would hide the results before the click is registered.
        searchResultsContainer.addEventListener('mousedown', (e) => {
            e.preventDefault(); // This prevents the 'blur' event on the input.
        });

        // Hide the results immediately when the input loses focus.
        searchInput.addEventListener('blur', hideResults);

        // Also hide results when a link inside is clicked.
        searchResultsContainer.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                hideResults();
            }
        });
        // The resize listener for positioning is no longer needed.
    }

    function initializeProgramTabs() {
        const tabs = document.querySelectorAll('.program-tab');
        const contentWrapper = document.querySelector('.program-content-wrapper');

        if (tabs.length === 0 || !contentWrapper) return;

        // Set initial height on page load
        window.addEventListener('load', () => {
            const activeContent = document.querySelector('.program-content.active');
            if (activeContent) {
                contentWrapper.style.height = `${activeContent.offsetHeight}px`;
            }
        });

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();

                // --- 1. Update Tab Button Styles ---
                tabs.forEach(t => {
                    t.classList.remove('active', 'bg-dark-blue', 'text-white');
                    t.classList.add('bg-white', 'text-dark-blue');
                });
                tab.classList.add('active', 'bg-dark-blue', 'text-white');
                tab.classList.remove('bg-white', 'text-dark-blue');

                const targetId = tab.dataset.tab + '-content';
                const activeContent = document.querySelector('.program-content.active');
                const targetContent = document.getElementById(targetId);

                if (!targetContent || targetContent === activeContent) return;

                // --- 2. Animate Height and Switch Content ---
                const targetHeight = targetContent.offsetHeight;

                // Set the wrapper to the new height to trigger the transition
                contentWrapper.style.height = `${targetHeight}px`;

                // Hide the current content
                if (activeContent) {
                    activeContent.classList.remove('active');
                }
                // Show the new content
                targetContent.classList.add('active');
            });
        });

        // Optional: Re-adjust height on window resize
        window.addEventListener('resize', () => {
            const activeContent = document.querySelector('.program-content.active');
            if (activeContent) {
                contentWrapper.style.height = `${activeContent.offsetHeight}px`;
            }
        });
    }
});
