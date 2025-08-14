function initializeHeaderNavigation() {
    const dropdownItems = document.querySelectorAll('.main-nav .group');

    const closeAllDropdowns = (exceptThisItem = null) => {
        dropdownItems.forEach(item => {
            if (item !== exceptThisItem) {
                const dropdown = item.querySelector('ul');
                if (dropdown && item.classList.contains('mobile-dropdown-open')) {
                    item.classList.remove('mobile-dropdown-open');
                    dropdown.classList.add('opacity-0', 'invisible', 'translate-y-1');
                    dropdown.classList.remove('opacity-100', 'visible', 'translate-y-0');
                }
            }
        });
    };

    const toggleDropdown = (item) => {
        const dropdown = item.querySelector('ul');
        if (!dropdown) return;

        const isOpen = item.classList.contains('mobile-dropdown-open');
        // Close other dropdowns before toggling this one
        closeAllDropdowns(item);

        if (!isOpen) {
            item.classList.add('mobile-dropdown-open');
            dropdown.classList.remove('opacity-0', 'invisible', 'translate-y-1');
            dropdown.classList.add('opacity-100', 'visible', 'translate-y-0');
        }
    };

    dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        const submenu = item.querySelector('ul');

        if (link && submenu) {
            // This check prevents adding duplicate listeners on SPA navigations
            if (!link.hasAttribute('data-mobile-nav-initialized')) {
                link.setAttribute('data-mobile-nav-initialized', 'true');
                link.addEventListener('click', (event) => {
                    if (window.innerWidth < 768) {
                        event.preventDefault();
                        toggleDropdown(item);
                    }
                });
            }
        }
    });

    // These listeners are safe to add once globally
    if (!window.headerNavGlobalListeners) {
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.main-nav .group')) {
                closeAllDropdowns();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeAllDropdowns();
            }
        });

        let lastWidth = window.innerWidth;
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && lastWidth < 768) {
                closeAllDropdowns();
            }
            lastWidth = window.innerWidth;
        });

        window.headerNavGlobalListeners = true;
    }
}

// Expose the function to the global scope for the SPA router
window.initializeHeaderNavigation = initializeHeaderNavigation;
