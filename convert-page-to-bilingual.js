// Helper script to convert a page to the new bilingual system
// Run this in browser console on any page you want to convert

function convertPageToBilingual() {
    console.log('🌐 Converting page to bilingual system...');
    
    // 1. Check if i18n.css is included
    const i18nCSS = document.querySelector('link[href*="i18n.css"]');
    if (!i18nCSS) {
        console.warn('⚠️  i18n.css not found. Add this to your <head>:');
        console.log('<link rel="stylesheet" href="css/i18n.css">');
    }
    
    // 2. Check if simple-i18n.js is included
    const i18nJS = document.querySelector('script[src*="simple-i18n.js"]');
    if (!i18nJS) {
        console.warn('⚠️  simple-i18n.js not found. Add this to your <head>:');
        console.log('<script src="js/simple-i18n.js"></script>');
    }
    
    // 3. Check for language toggle button
    const toggleButton = document.querySelector('.language-toggle');
    if (!toggleButton) {
        console.warn('⚠️  Language toggle button not found. Add this to your page:');
        console.log(`
<button class="language-toggle bg-dark-blue text-white px-4 py-2 rounded-full shadow-lg hover:bg-dark-blue/90 transition-colors">
    <span class="lang-en">ខ្មែរ</span>
    <span class="lang-km">EN</span>
</button>`);
    }
    
    // 4. Find text elements that need conversion
    const textElements = [];
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                // Skip if parent already has lang classes
                if (node.parentElement.classList.contains('lang-en') || 
                    node.parentElement.classList.contains('lang-km')) {
                    return NodeFilter.FILTER_REJECT;
                }
                
                // Skip if text is just whitespace
                if (!node.textContent.trim()) {
                    return NodeFilter.FILTER_REJECT;
                }
                
                // Skip script and style elements
                const tagName = node.parentElement.tagName.toLowerCase();
                if (['script', 'style', 'noscript'].includes(tagName)) {
                    return NodeFilter.FILTER_REJECT;
                }
                
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );
    
    let node;
    while (node = walker.nextNode()) {
        const text = node.textContent.trim();
        if (text && text.length > 1) {
            textElements.push({
                element: node.parentElement,
                text: text,
                tagName: node.parentElement.tagName.toLowerCase()
            });
        }
    }
    
    console.log(`📝 Found ${textElements.length} text elements that may need translation:`);
    
    textElements.forEach((item, index) => {
        console.log(`${index + 1}. <${item.tagName}>: "${item.text.substring(0, 50)}${item.text.length > 50 ? '...' : ''}"`);
    });
    
    console.log(`
📋 To convert each element, replace the text with:
<span class="lang-en">English text</span>
<span class="lang-km">Khmer translation</span>

Example:
Before: <h1>Welcome</h1>
After:  <h1>
            <span class="lang-en">Welcome</span>
            <span class="lang-km">សូមស្វាគមន៍</span>
        </h1>
    `);
    
    return textElements;
}

// Auto-run when script is loaded
if (typeof window !== 'undefined') {
    console.log('🚀 Bilingual conversion helper loaded!');
    console.log('💡 Run convertPageToBilingual() to analyze this page');
}
