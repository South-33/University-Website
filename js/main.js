document.addEventListener('DOMContentLoaded', function() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    
    const scriptTag = document.querySelector('script[src*="js/main.js"]');
    const basePath = scriptTag ? (scriptTag.dataset.basePath || '.') : '.';

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
        initializePageTransitions();

        // Adjust layout after all page resources (images, etc.) are loaded to ensure correct height.
        window.addEventListener('load', adjustLayoutForHeader);
    }).catch(error => console.error('Error loading header or initializing scripts:', error));

    loadFooter.catch(error => console.error('Error fetching footer:', error));

        function updateActiveNav() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.main-nav > ul > li > a');

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (!linkHref) {
                link.classList.remove('active');
                return;
            }

            const linkBasePath = linkHref.replace('index.html', '');
            const isActive = (linkHref === '/' && currentPath === '/') || (linkHref !== '/' && currentPath.startsWith(linkBasePath));
            
            link.classList.toggle('active', isActive);
        });
    }

    function initializeNavigation() {
        updateActiveNav(); // Set active link on initial load
        // Smooth scroll for the "Explore" link
        document.body.addEventListener('click', function(e) {
            const exploreLink = e.target.closest('.explore-link, a[href="#intro"]');
            if (exploreLink) {
                e.preventDefault();

                // Find the section containing the link, then find the *next* section to scroll to.
                const currentSection = exploreLink.closest('section');
                if (!currentSection) return;

                const nextSection = currentSection.nextElementSibling;
                if (!nextSection) return;

                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;

                // Calculate the top position of the next section relative to the document.
                const targetPosition = nextSection.getBoundingClientRect().top + window.pageYOffset;
                
                // Adjust the position by subtracting the header's height.
                const offsetPosition = targetPosition - headerHeight;

                // Scroll to the adjusted position.
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
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
                setTimeout(() => {
                    navToggle.style.pointerEvents = 'auto';
                }, 300);
            });
        }
        
        // Dropdown functionality is now handled purely by CSS group-hover on desktop.
        // No JavaScript is needed for mobile/tablet dropdowns as per the new requirement.
    }

    function initializePageTransitions() {
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

                        // Manually play video on homepage when navigating via SPA
                        if (url.endsWith('/') || url.endsWith('index.html')) {
                            const heroVideo = mainContent.querySelector('#hero video');
                            if (heroVideo) {
                                // Wait for the 'canplay' event before trying to play the video.
                                const onCanPlay = () => {
                                    heroVideo.play().catch(error => {
                                        console.error("Video autoplay failed:", error);
                                    });
                                    // Clean up the event listener once it has fired.
                                    heroVideo.removeEventListener('canplay', onCanPlay);
                                };
                                heroVideo.addEventListener('canplay', onCanPlay);
                                // Kickstart the loading process.
                                heroVideo.load();
                            }
                        }

                        document.title = newTitle.innerText;
                        
                        if (push) {
                            history.pushState({ path: url }, document.title, url);
                        }
                        
                        window.scrollTo({ top: 0, behavior: 'instant' });
                        
                        // This is the critical fix for the hero section resizing
                        adjustLayoutForHeader();
                        updateActiveNav(); // Update active link after page transition

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
});
