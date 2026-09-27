# Lido Grocery Store

This repository contains a simple six-page website about Lido Grocery Store in Astana. It was created for the Introduction to Web Technologies course and continues the HTML work from Assignment 1 with CSS for Assignment 2.

## Pages

- `Grocery/index.html` - home page
- `Grocery/products.html` - products and product request form
- `Grocery/prices.html` - example product prices
- `Grocery/delivery.html` - order and delivery information
- `Grocery/contacts.html` - contact information
- `Grocery/colophon.html` - information about the website

For Assignment 3, Temirlan is responsible for Home and Products only. The other pages belong to the remaining team work.

## CSS files

- `Grocery/css/base.css` contains the shared colours, typography, navigation, main content and footer styles.
- `Grocery/css/temirlan.css` is the 25-line brand-colour correction layer for the Bootstrap home and products pages.
- `Grocery/css/murager.css` contains the prices and delivery layouts.
- `Grocery/css/shalkar.css` contains the contacts and colophon layouts, using the existing palette and shared navigation.

Assignment 2 demonstrated selectors, the cascade, specificity, the box model, Flexbox, Grid, positioning, float and clear, and three centering techniques. Assignment 3 now uses Bootstrap for Home and Products; the other four pages retain their Assignment 2 styles.

## Opening the website

Open `Grocery/index.html` in a browser. In VS Code, open the `Grocery` folder and press `F5`, then select `Open Grocery website` if VS Code asks for a configuration.

Keep the HTML files, the `css` folder and the images in their current locations so that links, styles and photographs continue to work.

## Validation

On 18 September 2026, all six HTML pages passed the W3C Nu HTML Checker with zero errors and zero warnings. Both CSS files passed the W3C CSS Validator with zero errors and zero warnings.

The Assignment 2 requirement locations are recorded in `Grocery/css-checklist.md`.
Before-and-after screenshots for the home and products pages are stored in `Grocery/evidence`.

On 21 September 2026, the modified contacts, colophon and prices HTML files passed W3C Nu with zero errors and warnings. All six pages had valid local asset and navigation targets. The contacts and colophon layouts were also checked in the browser; their screenshots are in `Grocery/evidence`.

Contacts and colophon use the same shared appearance as the existing pages, with normal single-column content. `shalkar.css` only matches the existing top padding and Top link.

The simplified `shalkar.css` passed W3C CSS validation with 0 errors and 0 warnings on 21 September 2026.

## Assignment 3 — Home and Products

Temirlan's scope is `Grocery/index.html` and `Grocery/products.html`. Code stays in its existing locations. Documentation, CSS replacements, screenshots and validation results are grouped in [Grocery/Temirlan_Assik3](Grocery/Temirlan_Assik3/README.md).
