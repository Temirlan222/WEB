# Assignment 3 — CSS replacements

Scope: `index.html` and `products.html`. All layout rules in their personal `css/temirlan.css` were removed; it now contains 25 lines including comments and blank lines, with brand colours only. These two pages no longer load `base.css` or internal/inline CSS. `base.css`, `murager.css` and `shalkar.css` remain for the other four pages, which are outside this update.

| Old rule removed from the two pages | Bootstrap replacement |
| --- | --- |
| `.site-main`: width, max-width, automatic margins and padding | `container py-4` |
| `.page-home .site-main`, `.page-products .site-main`: top padding | `py-4` |
| `.site-header`: padding and alignment | `container-fluid py-4 text-center text-md-start` |
| `.site-nav > .nav-list`: custom flex layout, spacing and list reset | `navbar navbar-expand-lg`, `navbar-nav mx-auto gap-lg-3`, `nav-item` |
| `.site-nav a`: manual link styling and current-page border | `nav-link active`, `data-bs-theme="dark"`, existing `aria-current` |
| `.content-section`: margins, padding and bottom border | `mb-4 pb-4 border-bottom` |
| `h1`, `h2`, `h3`, `.site-name`: custom font sizes and weights | `display-5`, `h3`, `h5`, `lead`, `fw-bold` |
| `.cascade-demo`, internal `#cascade-note`, inline colour | Body brand colour in the correction layer; conflicting cascade demo removed |
| `.store-photo`: float, width and margins; `.about-section + hr`: clear | `row g-3 align-items-center`, responsive `col-*` spans, `img-fluid` |
| `.product-gallery`: hand-written grid and gaps | `row g-3`, `col-12 col-md-6 col-lg-4` |
| Gallery heading span, first-card span, hidden separators | `col-12`; equal responsive card columns; `d-none` |
| `.product-card`: position, padding, border and background | `card h-100 shadow-sm` and `card-body` |
| `.product-card:first-of-type::after`: positioned Popular label | Real text in `badge text-bg-warning mb-2` |
| `.opening-hours`: hand-written grid and heading span | `row g-3`, heading `col-12`, paragraphs `col-12 col-md-6` |
| `figure`, `figcaption`, `img`: custom spacing and image sizing | `figure mb-0`, `figure-caption`, `figure-img img-fluid rounded` |
| `.form-actions`: hand-written flex, button widths and gaps | `d-flex flex-wrap gap-2 align-items-center` |
| `input`, `select`, `textarea`, `button`: manually styled controls | `form-control`, `form-select`, `form-check-input`, `btn` variants |
| `.store-quote`: grid centering and alignment | `text-center text-md-start bg-white p-3 rounded` |
| `.product-information`: specificity demo and left border | `border-start border-success border-4 ps-3` |
| `label[for="request-comment"]`: display rule | `form-control` fills the available width below its label |
| `.back-to-top`: fixed position and manual button styling | Normal-flow link with `btn btn-outline-success btn-sm ms-3 mb-3`; `d-none d-md-inline-block` |
| `.site-footer`: custom flex layout, spacing and paragraph sizing | `container-fluid`, nested `container row g-3`, `col-12 col-md-6 col-lg-4`, `small` |
| Footer-generated duplicate store name | Existing store-name paragraph retained; no generated duplicate |
| Footer links and external-link marker | `link-light text-break`; descriptive 2GIS link retained |
| `hr`: margins and border | Bootstrap default separator with `my-4` |
| Universal box sizing, body reset, generic table rules, `h2 + p` width limit | Bootstrap Reboot/defaults; irrelevant table rules not loaded on these pages |

The disabled `Submit Request` button is a real submit control with both `disabled` and `.disabled`. Its explanation states that the local demonstration does not send requests. Reset remains functional. Top remains a real anchor link.
