# Lido Grocery Store

This repository contains a simple six-page website about Lido Grocery Store in Astana. It was created for the Introduction to Web Technologies course and continues the HTML work from Assignment 1 with CSS for Assignment 2.

## Pages

- `Grocery/index.html` - home page
- `Grocery/products.html` - products and product request form
- `Grocery/prices.html` - example product prices
- `Grocery/delivery.html` - order and delivery information
- `Grocery/contacts.html` - contact information
- `Grocery/colophon.html` - information about the website

For Assignment 3, Temirlan handles Home and Products; Murager handles Prices and Order and delivery; Saparali Shalkar handles Contacts and About this site.

## CSS files

- `Grocery/css/base.css` is the original Assignment 2 stylesheet; the migrated pages no longer load it.
- `Grocery/css/temirlan.css` is the 25-line brand-colour correction layer for the Bootstrap home and products pages.
- `Grocery/css/murager.css` contains the prices and delivery layouts.
- `Grocery/css/shalkar.css` is the short colour correction layer for Contacts and About this site.

Assignment 2 demonstrated selectors, the cascade, specificity, the box model, Flexbox, Grid, positioning, float and clear, and three centering techniques. Assignment 3 now uses Bootstrap on all six pages, with small page-specific correction stylesheets.

## Opening the website

Open `Grocery/index.html` in a browser. In VS Code, open the `Grocery` folder and press `F5`, then select `Open Grocery website` if VS Code asks for a configuration.

Keep the HTML files, the `css` folder and the images in their current locations so that links, styles and photographs continue to work.

## Validation

On 18 September 2026, all six HTML pages passed the W3C Nu HTML Checker with zero errors and zero warnings. Both CSS files passed the W3C CSS Validator with zero errors and zero warnings.

The Assignment 2 requirement locations are recorded in `Grocery/css-checklist.md`.
Before-and-after screenshots for the home and products pages are stored in `Grocery/evidence`.

On 21 September 2026, the modified contacts, colophon and prices HTML files passed W3C Nu with zero errors and warnings. All six pages had valid local asset and navigation targets. The contacts and colophon layouts were also checked in the browser; their screenshots are in `Grocery/evidence`.

Contacts and colophon now use Bootstrap responsive columns and a collapsing navbar. `shalkar.css` keeps only the site colours.

The Assignment 2 version of `shalkar.css` passed W3C CSS validation on 21 September 2026. The Assignment 3 version is a shorter colour-only layer.

## Assignment 3 — Home and Products

Temirlan's scope is `Grocery/index.html` and `Grocery/products.html`. Code stays in its existing locations. Documentation, CSS replacements, screenshots and validation results are grouped in [Grocery/Temirlan_Assik3](Grocery/Temirlan_Assik3/README.md).

## Assignment 3 — Contacts and About this site

Saparali Shalkar's code remains in Grocery/contacts.html, Grocery/colophon.html, and Grocery/css/shalkar.css. The CSS replacement list and four screenshots are in [Grocery/ShalkarSaparali](Grocery/ShalkarSaparali/README.md).
