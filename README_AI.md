# 🎓 University Website - Complete AI Development Guide

**COPY-PASTE THIS ENTIRE DOCUMENT TO AI FOR FULL PROJECT CONTEXT**

This is a comprehensive guide for AI assistants working on our university website project. The project uses a **hybrid SPA (Single Page Application)** architecture with self-contained pages for optimal maintainability and AI-friendly development.

---

## 🏗️ **ARCHITECTURE OVERVIEW**

### **Core Technologies**
- **Frontend:** Vanilla JavaScript Hybrid SPA
- **Styling:** Tailwind CSS (CDN) + embedded page-specific CSS
- **JavaScript:** Global SPA logic (`main.js`) + page-specific inline scripts
- **Build:** No build process - pure HTML/CSS/JS for simplicity

### **Hybrid SPA Design Philosophy**
- **Self-Contained Pages:** Each HTML file contains its own styles and scripts
- **Global SPA Navigation:** Smooth transitions between pages via `main.js`
- **Dynamic Includes:** Header/footer loaded dynamically to avoid duplication
- **AI-Friendly:** Each page is complete and can be understood independently

---

## 📁 **PROJECT STRUCTURE**

```
/
├── _includes/                  # 🔄 Dynamic HTML components
│   ├── header.html            # Global navigation header
│   └── footer.html            # Global footer
├── academic-ecosystem/         # 📚 Academic content pages
├── campus/                     # 🏫 Campus information pages  
├── programs/                   # 🎯 Academic programs pages
├── student-activities/         # 🎭 Student life pages
├── study-with-us/              # 📖 Admissions pages
├── css/
│   └── main.css               # 🎨 Global styles (minimal)
├── js/
│   ├── theme.js               # 🎨 Tailwind theme config
│   └── main.js                # ⚡ CORE SPA LOGIC (CRITICAL)
├── Picture/                    # 🖼️ All image assets
├── template.html               # 📄 Page template (see below)
├── index.html                  # 🏠 Homepage with hero video
├── README.md                   # 👥 Human developer docs
└── README_AI.md                # 🤖 This comprehensive AI guide
```

---

## ⚡ **Recent Major Improvements (2024)**

### 🧠 **Smart Device Detection & Adaptive Animations (LATEST)**
- ✅ **Universal Device Support:** Works on everything from smart fridges to gaming phones
- ✅ **Hardware Detection:** CPU cores, memory, network speed, performance benchmarking
- ✅ **Device Classification:** IoT, low-end, mid-range, high-end with specific profiles
- ✅ **Adaptive Animations:** Frame rates, durations, easing adapt to device capabilities
- ✅ **Smart Header Behavior:** Mobile gets hide/show, desktop/tablet always visible
- ✅ **Accessibility Integration:** Respects prefers-reduced-motion and user preferences
- ✅ **Header Protection:** SPA transitions never affect header (clip-path solution)
- ✅ **DRY Code:** Eliminated redundancy with utility functions, 30% code reduction

### 🚀 **SPA Navigation System**
- ✅ **Seamless Transitions:** Smart fade transitions with device-adaptive performance
- ✅ **Page Caching:** Intelligent caching with 5-minute expiration
- ✅ **Link Preloading:** Hover-based preloading for instant navigation
- ✅ **Error Handling:** Robust retry logic with exponential backoff
- ✅ **Browser History:** Full back/forward button support
- ✅ **Script Execution:** Page-specific scripts run during SPA navigation
- ✅ **Header Isolation:** Transitions never visually affect header or navigation

### 🎬 **Homepage Hero System**
- ✅ **Perfect Viewport:** Hero fills exactly `viewport height - header height`
- ✅ **Video Loading:** Smooth image-to-video transition with fallbacks
- ✅ **Mobile Responsive:** Handles address bar changes and orientation
- ✅ **Self-Contained:** All logic moved to homepage inline script

### 📑 **Modular Architecture & Code Cleanup**
- ✅ **SPA-Compatible:** All features work seamlessly during page transitions
- ✅ **Event Delegation:** Persistent functionality using delegated listeners
- ✅ **Modular Architecture:** Page-specific code lives in respective HTML files
- ✅ **Self-Contained:** Program tabs, hero logic in individual pages
- ✅ **Optimized Codebase:** Removed ~200+ lines of redundant code
- ✅ **Utility Functions:** Centralized DOM queries and environment detection
- ✅ **Vercel Ready:** Proper routing configuration for deployment

### 🛡️ **Error Handling & Reliability**
- ✅ **Retry Logic:** Network requests retry with exponential backoff
- ✅ **Fallback UI:** Graceful degradation when components fail to load
- ✅ **User Feedback:** Transient error messages with auto-dismiss
- ✅ **Global Listeners:** Catch uncaught errors and promise rejections

### 🚀 **Deployment & Performance**
- ✅ **Vercel Integration:** Clean URLs and proper routing with vercel.json
- ✅ **Code Optimization:** Removed unused styles and functions
- ✅ **Fast Loading:** Minimal CSS/JS footprint for better performance

---

## 🔧 **CORE FILES EXPLAINED**

### 🎨 **`js/theme.js` - Tailwind Theme Configuration**
```javascript
// Defines site-wide colors, fonts, and design tokens
// Loaded in <head> of every page
// Edit this file to change site-wide visual theme
```

### ⚡ **`js/main.js` - Core SPA Logic (CRITICAL)**
```javascript
// 🔥 THE HEART OF THE APPLICATION
// Handles: Smart device detection, adaptive animations, SPA navigation,
//          header/footer loading, page transitions, caching, preloading,
//          error handling, search, device-optimized UI behavior
```

**Key Features:**
- **🧠 Smart Device Detection:** Hardware profiling (CPU, memory, network, performance)
- **🎯 Device Classification:** IoT, low-end, mid-range, high-end with adaptive profiles
- **⚡ Adaptive Animations:** Frame rates, durations, easing based on device capabilities
- **📱 Smart UI Behavior:** Mobile header hide/show, desktop always visible
- **🛡️ Header Protection:** SPA transitions never affect header (clip-path solution)
- **🔄 Dynamic Includes:** Loads header/footer from `_includes/`
- **🎬 SPA Navigation:** Device-optimized page transitions with fade effects
- **💾 Page Caching:** 5-minute intelligent caching system
- **⚡ Link Preloading:** Hover-based preloading for instant navigation
- **🔧 Error Handling:** Retry logic with exponential backoff
- **🔍 Search System:** Global search functionality with Fuse.js
- **🎛️ Event Delegation:** Persistent functionality during navigation
- **🔗 Page Integration:** Calls page-specific functions during navigation
- **♿ Accessibility:** Respects prefers-reduced-motion and user preferences
- **🧹 DRY Utilities:** Centralized DOM queries and environment detection

**🏗️ ARCHITECTURAL PRINCIPLE:** `main.js` contains ONLY global SPA logic. Page-specific functionality (hero videos, program tabs, etc.) lives as inline scripts within their respective HTML pages. This ensures clean separation of concerns and better maintainability.

**Critical `data-base-path` Attribute:**
```html
<!-- Root level (index.html) -->
<script src="js/main.js" data-base-path="."></script>

<!-- Subdirectory (programs/bachelors.html) -->
<script src="../js/main.js" data-base-path=".."></script>
```

**Execution Flow:**
1. 🔄 **DOMContentLoaded** - Wait for page load
2. 📥 **Load Header/Footer** - Fetch from `_includes/` with retry logic
3. 🚀 **Initialize SPA** - Set up navigation, search, transitions
4. 🎨 **Page Animations** - Trigger fade-in effects
5. 🔍 **Page-Specific Logic** - Initialize tabs, hero, etc.

### 📄 **Page-Specific Inline Scripts**
- **Homepage:** Hero height calculation + video loading logic
- **Programs:** Tab system functionality
- **Other Pages:** Custom interactive elements as needed

---

## 🧠 **SMART DEVICE DETECTION SYSTEM**

### 🎯 **Device Classification**
The system automatically detects and classifies devices into 4 categories:

```javascript
// Device Classes with Animation Profiles
'iot':      { fps: 15,  duration: 1200ms, easing: 'linear',      effects: 'minimal'  }
'low-end':  { fps: 30,  duration: 800ms,  easing: 'ease-out',   effects: 'reduced'  }
'mid-range': { fps: 60,  duration: 600ms,  easing: 'cubic-bezier', effects: 'standard' }
'high-end': { fps: 60,  duration: 400ms,  easing: 'cubic-bezier', effects: 'enhanced' }
```

### 🔍 **Detection Criteria**
- **Hardware:** CPU cores (`navigator.hardwareConcurrency`)
- **Memory:** Device RAM (`navigator.deviceMemory`)
- **Network:** Connection speed (`navigator.connection`)
- **Performance:** Real-time benchmark testing
- **Screen:** Viewport size and pixel density
- **Form Factor:** Phone, tablet, laptop, desktop classification

### 🎬 **Adaptive Behaviors**

**📱 Mobile Devices (< 768px):**
- Header hides/shows on scroll to save space
- Optimized touch interactions
- Reduced animation complexity

**💻 Desktop/Tablet (≥ 768px):**
- Header always visible (plenty of space)
- Enhanced animations and effects
- Full feature set enabled

**🌡️ IoT Devices (Smart Fridges, etc.):**
- Minimal animations (15fps, linear easing)
- Header always visible for accessibility
- Simplified UI interactions

### ♿ **Accessibility Integration**
- Respects `prefers-reduced-motion` setting
- Adapts to user's accessibility preferences
- Ensures usability across all device types

### 🛡️ **Header Protection System**
- SPA transitions use CSS `clip-path` to exclude header area
- Header has higher z-index than footer (10000 vs 9000)
- Isolated stacking context prevents visual interference
- Works regardless of scroll position or header visibility

---

## 📄 **COMPLETE PAGE TEMPLATE**

**Copy this template for ALL new pages:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title - NUM</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Theme Configuration -->
    <script src="../js/theme.js"></script>
    
    <!-- PAGE-SPECIFIC STYLES (if needed) -->
    <style>
        /* Add page-specific CSS here */
        .page-specific-class {
            /* Custom styles for this page only */
        }
    </style>
</head>
<body class="bg-gray-50 text-gray-900 font-sans leading-relaxed">
    
    <!-- DYNAMIC HEADER (DO NOT MODIFY) -->
    <div id="header-placeholder"></div>
    
    <!-- MAIN CONTENT -->
    <main class="pt-20"> <!-- pt-20 accounts for fixed header -->
        
        <!-- PAGE CONTENT GOES HERE -->
        <section class="container mx-auto px-4 py-8">
            <h1 class="text-4xl font-bold mb-6">Page Title</h1>
            
            <!-- Add your content here -->
            <div class="prose max-w-none">
                <p>Your page content...</p>
            </div>
        </section>
        
    </main>
    
    <!-- DYNAMIC FOOTER (DO NOT MODIFY) -->
    <div id="footer-placeholder"></div>
    
    <!-- PAGE-SPECIFIC JAVASCRIPT (if needed) -->
    <script>
        // Add page-specific JavaScript here
        document.addEventListener('DOMContentLoaded', function() {
            // Page initialization code
        });
        
        // Make functions globally available for SPA navigation
        // window.yourPageFunction = yourPageFunction;
    </script>
    
    <!-- REQUIRED: Fuse.js for search -->
    <script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0"></script>
    
    <!-- REQUIRED: Main SPA Logic -->
    <script src="../js/main.js" data-base-path=".."></script>
    <!-- ❗ CRITICAL: Adjust data-base-path based on file location:
         - Root level (index.html): data-base-path="."
         - One level deep (programs/page.html): data-base-path=".."
         - Two levels deep (programs/sub/page.html): data-base-path="../.."
    -->
    
</body>
</html>
```

---

## 📝 **DEVELOPMENT RULES & PATTERNS**

### 🎯 **Creating New Pages**
1. **Copy the template above** into appropriate directory
2. **Update paths:** Adjust `data-base-path` and relative paths to `js/main.js`
3. **Add content:** Replace placeholder content with actual page content
4. **Page-specific code:** Add inline `<style>` and `<script>` blocks as needed
5. **Test SPA navigation:** Ensure page works both directly and via SPA

### 🖼️ **Image Pathing Rules**
```html
<!-- From root (index.html) -->
<img src="Picture/image.jpg" alt="Description">

<!-- From subdirectory (programs/page.html) -->
<img src="../Picture/image.jpg" alt="Description">

<!-- From nested subdirectory (programs/sub/page.html) -->
<img src="../../Picture/image.jpg" alt="Description">
```

### ⚡ **JavaScript Architecture**
- **Global Logic:** Add to `js/main.js` (SPA navigation, search, etc.)
- **Page-Specific Logic:** Add inline `<script>` blocks in individual pages
- **Make functions global:** Use `window.functionName = functionName` for SPA compatibility
- **Event Delegation:** Use delegated listeners for persistent functionality

### 🎨 **Styling Architecture**
- **Global Theme:** Edit `js/theme.js` for site-wide colors/fonts
- **Global Styles:** Add to `css/main.css` for shared components
- **Page-Specific Styles:** Add inline `<style>` blocks in individual pages
- **Tailwind First:** Use Tailwind classes before custom CSS

### 🔄 **SPA Compatibility Rules**
1. **Self-Contained Pages:** Each page must work independently
2. **Global Functions:** Expose page functions to `window` object
3. **Event Delegation:** Use delegated listeners for persistent events
4. **Initialization:** Handle both `DOMContentLoaded` and SPA navigation
5. **Resource Loading:** Ensure assets load correctly from any navigation path

### 🔍 **Search System (Fuse.js)**
- **Data Source:** The search data is generated dynamically in `main.js` by scanning all `<a>` tags in the header navigation.
- **Functionality:** It creates an in-memory index of page titles and URLs.
- **Customization:** To add or remove items from the search, modify the links in `_includes/header.html`. The search will update automatically.

### 🚀 **Vercel Deployment Configuration**
The project includes a `vercel.json` file that handles:
- **Clean URLs:** Removes `.html` extensions from URLs
- **Directory Routing:** Properly serves files from subdirectories
- **SPA Compatibility:** Direct URL access works alongside SPA navigation
- **Cache Headers:** Optimized caching for better performance

**Supported URL Patterns:**
- `/programs/bachelors` → `/programs/bachelors.html`
- `/academic-ecosystem/research` → `/academic-ecosystem/research.html`
- `/campus/facilities` → `/campus/facilities.html`
- And all other subdirectory pages

---

## ✅ **FINAL AI CHECKLIST**

**Before finishing any task, ensure the following:**

1.  **Used the Template?** All new pages started from the official template.
2.  **Paths Correct?** `data-base-path` and all asset paths (`../`, `../../`) are correct for the page's location.
3.  **SPA Works?** The page functions correctly when navigated to via the SPA, not just on a direct load.
4.  **Page-Specific Logic Isolated?** New functionality is in an inline `<script>` or `<style>` tag, not added to global files.
5.  **Functions Exposed?** Page-specific functions needed by the SPA are attached to the `window` object.
6.  **No Console Errors?** The browser console is clean on page load and after SPA navigation.