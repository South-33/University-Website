# AI-Specific Project Documentation

**Objective:** This document provides a comprehensive, technical overview of the university website project for AI assistants. Use this as the primary source of truth for understanding the codebase, architecture, and development patterns.

## 1. Core Technologies & Architecture

- **Frontend Framework:** None. The project uses static HTML files.
- **Styling:** Tailwind CSS, loaded via a CDN. The theme configuration is centralized.
- **JavaScript:** Vanilla JavaScript for all client-side logic.
- **Architecture:** Static Site Generation (SSG) model where pages are individual HTML files. The URL structure is flat, with content directories at the root level. Key components like the header and footer are dynamically loaded via JavaScript to ensure maintainability.

## 2. Project File Structure

```
/
├── _includes/                  # Reusable HTML snippets (header, footer).
│   ├── header.html
│   └── footer.html
├── academic-ecosystem/         # Content pages for this section.
├── campus/                     # Content pages for this section.
├── programs/                   # Content pages for this section.
├── student-activities/         # Content pages for this section.
├── study-with-us/              # Content pages for this section.
├── css/
│   └── ... (additional global styles if needed)
├── js/
│   ├── theme.js                # Centralized Tailwind CSS theme configuration.
│   └── main.js                 # **Primary Application Logic** (IMPORTANT)
├── Picture/                    # All image assets.
├── template.html               # A clean template for creating new pages.
├── index.html                  # The main homepage.
├── README.md                   # High-level documentation for human developers.
└── README_AI.md                # This file (detailed technical documentation).
```

## 3. Key Scripts & Execution Flow

### `js/theme.js`
- **Purpose:** Defines the site-wide visual theme (colors, fonts) for Tailwind CSS.
- **Loading:** Included in the `<head>` of every HTML page.
- **Modification:** To alter site-wide colors or fonts, **edit this file exclusively**.

### `js/main.js`
- **Purpose:** This is the **central hub for all JavaScript functionality**. It handles dynamic content loading and all user interactions.
- **Loading:** Included at the end of the `<body>` in every HTML page. Example: `<script src="../js/main.js" data-base-path=".."></script>`.
- **`data-base-path` Attribute:** This custom attribute is critical. It tells the script the correct relative path to find the `_includes` directory.
    - For `index.html` (at the root), use `data-base-path="."`.
    - For pages in subdirectories (e.g., `programs/undergraduate.html`), use `data-base-path=".."`.
- **Execution Flow:**
    1. **`DOMContentLoaded`:** The script waits for the page to fully load.
    2. **Dynamic Includes:** It fetches `/_includes/header.html` and `/_includes/footer.html` using the `basePath` and injects them into the placeholder divs.
    3. **Navigation Initialization:** **Crucially**, after the header is successfully loaded, it calls the `initializeNavigation()` function. This ensures all navigation elements exist in the DOM before event listeners are attached.

### `initializeNavigation()` function (within `main.js`)
- **Purpose:** Contains all logic for the navigation menu, including:
    - Mobile hamburger menu toggle (`.nav-toggle`).
    - Desktop dropdown menus.
    - Touch-friendly dropdowns for mobile/tablet, including arrow icons and submenu management.
    - Logic to link the simplified tablet navigation to the full mobile flyout menu.
    - Smooth scrolling for anchor links.

## 4. Development Patterns & Rules

1.  **Creating New Pages:**
    - Start by duplicating `template.html` into the appropriate content subdirectory (e.g., `programs/`).
    - Do **not** write static header or footer HTML. Use the placeholder divs: `<div id="header-placeholder"></div>` and `<div id="footer-placeholder"></div>`.
    - Ensure the page includes links to `js/theme.js` in the `<head>` and `js/main.js` at the end of the `<body>`, setting the `data-base-path` correctly based on the file's location.

2.  **Image Pathing:**
    - All images are stored in the root `/Picture` directory.
    - The relative path depends on the HTML file's location.
        - From `index.html`: `Picture/image-name.png`
        - From `/programs/undergraduate.html`: `../Picture/image-name.png`

3.  **JavaScript Modifications:**
    - **DO NOT** add inline `<script>` blocks to HTML pages for navigation or other global features.
    - All shared, interactive logic **must** be added to `js/main.js`.

4.  **Styling:**
    - **Theme Configuration (`js/theme.js`):** For site-wide style changes related to the Tailwind theme (e.g., changing the primary color, fonts), modify `js/theme.js`.
    - **Global Component Styles (`css/main.css`):** For custom styles applied to shared components across the site (e.g., header animations, dropdown menus), use the central stylesheet at `css/main.css`.
    - **Inline Styles:** Avoid adding inline `<script>` or `<style>` blocks. All global styles have been centralized into `css/main.css` to ensure consistency and maintainability. Page-specific styles should be used sparingly and only if a component's style cannot be generalized..