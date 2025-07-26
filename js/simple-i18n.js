// Simple self-contained bilingual system
class SimpleBilingualManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('num-language') || 'en';
        this.init();
    }

    init() {
        // Set initial language
        this.setLanguage(this.currentLanguage);
        
        // Setup language toggle button
        this.setupLanguageToggle();
    }

    setLanguage(language) {
        this.currentLanguage = language;
        
        // Update HTML lang attribute
        document.documentElement.lang = language;
        
        // Update page title if needed
        const titleMeta = document.querySelector('meta[name="i18n-title"]');
        if (titleMeta) {
            const titleKey = titleMeta.getAttribute('content');
            // For self-contained system, we'll handle title differently
            if (language === 'km') {
                document.title = 'សាកលវិទ្យាល័យជាតិគ្រប់គ្រង';
            } else {
                document.title = 'National University of Management';
            }
        }
        
        // Save to localStorage
        localStorage.setItem('num-language', language);
        
        // Update toggle button text
        this.updateToggleButton();
    }

    setupLanguageToggle() {
        // Wait for DOM to be ready, then find the button
        const findAndSetupButton = () => {
            const toggleButton = document.querySelector('.language-toggle');
            if (toggleButton) {
                toggleButton.addEventListener('click', () => {
                    const newLanguage = this.currentLanguage === 'en' ? 'km' : 'en';
                    this.setLanguage(newLanguage);
                });
                console.log('Language toggle button found and set up!');
            } else {
                console.log('Language toggle button not found');
            }
        };
        
        // Try immediately
        findAndSetupButton();
        
        // Also try after a short delay in case the button is added later
        setTimeout(findAndSetupButton, 100);
    }

    updateToggleButton() {
        // The button content is handled by CSS show/hide, no need to update text
        // The spans with lang-en and lang-km classes will automatically show/hide
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SimpleBilingualManager();
});
