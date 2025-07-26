# 🌐 NUM Website Bilingual System Guide

## Overview
The NUM website uses a **self-contained bilingual system** that supports English and Khmer languages. Everything is built into the HTML with CSS-based show/hide functionality - no external JSON files or complex JavaScript needed!

## 🚀 How It Works

### 1. **Core Components**
- `css/i18n.css` - Language styling and show/hide rules
- `js/simple-i18n.js` - Simple language toggle functionality
- HTML with dual-language spans

### 2. **Language Toggle**
- Button shows "ខ្មែរ" when in English mode (click to switch to Khmer)
- Button shows "EN" when in Khmer mode (click to switch to English)
- Language choice is saved in browser localStorage

## 📝 How to Add Bilingual Content

### Basic Text Elements
Replace any text element with this pattern:
```html
<!-- Before -->
<h1>Welcome to NUM</h1>

<!-- After -->
<h1>
    <span class="lang-en">Welcome to NUM</span>
    <span class="lang-km">សូមស្វាគមន៍មកកាន់ NUM</span>
</h1>
```

### For Block Elements (paragraphs, divs)
```html
<p>
    <span class="lang-en">This is a paragraph in English.</span>
    <span class="lang-km">នេះជាកថាខណ្ឌជាភាសាខ្មែរ។</span>
</p>
```

### For Buttons and Links
```html
<button>
    <span class="lang-en">Click Here</span>
    <span class="lang-km">ចុចទីនេះ</span>
</button>
```

## 🔧 Setup for New Pages

### 1. Include Required Files
Add these to your HTML `<head>`:
```html
<link rel="stylesheet" href="css/i18n.css">
<script src="js/simple-i18n.js"></script>
```

### 2. Add Language Toggle Button
Add this anywhere in your page (usually in header):
```html
<button class="language-toggle bg-dark-blue text-white px-4 py-2 rounded-full shadow-lg hover:bg-dark-blue/90 transition-colors">
    <span class="lang-en">ខ្មែរ</span>
    <span class="lang-km">EN</span>
</button>
```

## 📋 Translation Workflow

### Step 1: Identify Text to Translate
Go through your HTML and find all user-visible text:
- Headings (`<h1>`, `<h2>`, etc.)
- Paragraphs (`<p>`)
- Button text
- Navigation links
- Form labels
- Alt text for images

### Step 2: Wrap Text in Language Spans
For each text element, wrap it like this:
```html
<span class="lang-en">English text here</span>
<span class="lang-km">Khmer translation here</span>
```

### Step 3: Test
- Click the language toggle button
- Verify all text switches correctly
- Check that layout doesn't break with longer/shorter text

## 🎨 Styling Notes

### Khmer Font
- Khmer text automatically uses 'Noto Sans Khmer' font
- Font loads only when Khmer is selected (performance optimization)
- Spacing and sizing match English exactly to prevent layout shifts

### CSS Classes
- `.lang-en` - English text (shown by default)
- `.lang-km` - Khmer text (hidden by default)
- When `html[lang="km"]` is set, English hides and Khmer shows

## 🔍 Troubleshooting

### Language Toggle Not Working
1. Check console for errors
2. Ensure `simple-i18n.js` is loaded
3. Verify button has `language-toggle` class

### Text Not Switching
1. Check that spans have correct classes (`lang-en`, `lang-km`)
2. Ensure `i18n.css` is loaded
3. Verify HTML structure is correct

### Layout Issues
1. Khmer text might be longer/shorter than English
2. Test both languages and adjust CSS if needed
3. Use responsive design principles

## 📁 File Structure
```
NUM/
├── css/
│   └── i18n.css              # Language styling
├── js/
│   └── simple-i18n.js        # Language toggle logic
├── index.html                # Homepage (already converted)
└── BILINGUAL_GUIDE.md        # This guide
```

## ✅ Benefits of This System

- **🚀 Fast**: Instant language switching, no loading delays
- **🎯 Simple**: No JSON files, no complex build process
- **🔧 Easy**: Just wrap text in spans, that's it!
- **📱 SEO Friendly**: Both languages visible to search engines
- **💾 Persistent**: Language choice saved in browser
- **🎨 Consistent**: Same styling and layout for both languages

## 🚀 Quick Start Checklist

When you're ready to add translations to a new page:

1. ✅ Include `css/i18n.css` and `js/simple-i18n.js`
2. ✅ Add language toggle button
3. ✅ Wrap all text in `lang-en` and `lang-km` spans
4. ✅ Test language switching
5. ✅ Check layout in both languages

That's it! The system is designed to be as simple and maintainable as possible.
