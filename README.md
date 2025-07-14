# University Website Project

python run cmd script: python -m http.server
i ahteee y
Welcome to the university website project! This is a static website built with HTML, Tailwind CSS, and vanilla JavaScript, designed for simplicity and maintainability.

## Project Structure

-   `_includes/`: Contains reusable HTML snippets for the header and footer.
-   `programs/`, `campus/`, etc.: Content-specific directories containing the HTML pages for each section of the site.
-   `js/theme.js`: Defines the site-wide color palette and fonts for Tailwind CSS.
-   `js/main.js`: **The heart of the site's interactivity.** This single file handles dynamic header/footer loading and all navigation logic (mobile menu, dropdowns, etc.).
-   `template.html`: The blueprint for creating new pages. It includes all necessary placeholders and script links.
-   `index.html`: The main homepage and entry point for the website.

## How It Works

1.  **Dynamic Header & Footer:** Instead of repeating HTML, each page uses placeholders (`<div id="header-placeholder"></div>`). The `js/main.js` script fetches the content from `_includes/header.html` and `_includes/footer.html` and injects it into the page on load.

2.  **Centralized Styling:** The site's look and feel is controlled by a combination of Tailwind CSS and a central stylesheet.
    -   **Theme Configuration:** Site-wide colors and fonts are defined in `js/theme.js` for Tailwind CSS.
    -   **Global Component Styles:** Custom styles for shared components, like the navigation menu and dropdown animations, are centralized in `css/main.css`. This ensures a consistent appearance and behavior across all pages.

3.  **Centralized Scripts:** All interactive features, like the navigation menu, are managed in `js/main.js`. This avoids code duplication and makes updates easy.

## Getting Started: Creating a New Page

1.  **Copy the Template:** Duplicate `template.html` and place it in the appropriate content directory (e.g., `programs/`).
2.  **Add Your Content:** Fill in the main content area of your new page.
3.  **That's It!** The new page will automatically get the correct header, footer, styling, and navigation functionality.

## Key Guidelines

-   **Images:** Store all images in the `/Picture` folder.
    -   From `index.html`, link to them using `Picture/your-image.png`.
    -   From a page in a subdirectory (e.g., `/programs/undergraduate.html`), link to them using `../Picture/your-image.png`.
-   **Modifying Navigation:** To change the navigation links, edit `_includes/header.html`.
-   **Modifying Styles:**
    -   To change site-wide **colors and fonts**, edit `js/theme.js`.
    -   To modify or add styles for **global components** (like the header or navigation), edit `css/main.css`.
    -   Avoid adding page-specific `<style>` blocks. If a component needs unique styling, first consider if it can be a reusable utility class in Tailwind or a new component style in `css/main.css`.
