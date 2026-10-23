# Lido Grocery Store

A six-page website for Lido Grocery Store, Uly Dala Avenue 31, Astana. It continues the same project and repository from Assignments 1–3 and the Midterm Project.

[Repository](https://github.com/Temirlan222/WEB) · [Midterm](https://github.com/Temirlan222/WEB/tree/midterm) · [Assignment 4](https://github.com/Temirlan222/WEB/tree/assignment-4) · [Assignment 5](https://github.com/Temirlan222/WEB/tree/assignment-5)

## Pages and responsibilities

| Page | Responsible student |
| --- | --- |
| `Grocery/index.html` — Home | Temirlan |
| `Grocery/products.html` — Products and product request | Temirlan |
| `Grocery/prices.html` — Prices | Murager |
| `Grocery/delivery.html` — Delivery information | Murager |
| `Grocery/contacts.html` — Contacts | Saparali Shalkar |
| `Grocery/colophon.html` — About this site | Saparali Shalkar |

## Run the website

Open `Grocery/index.html` in a browser with JavaScript enabled. Internet access loads the existing Bootstrap CDN files. No build command, package installation, backend or account is needed.

Browse the catalogue on Products, combine search and category filters, add items and open the cart. Its shared link shows the quantity on all six pages. `localStorage` keeps only product IDs and quantities between navigation and reload. If browser storage is unavailable, the current page works, but the cart cannot persist between pages.

Prices are recorded project examples. Product pictures are illustrative; [image sources are credited](Grocery/images/catalog/sources.md). Confirm current prices and availability with the store. Checkout and the request form are front-end demonstrations: they send nothing and create no real order or payment.

## Assignment 4–5 Functionality Plan

This submission implements Temirlan's Home and Products contribution and one shared site feature. Catalogue filtering and the validated request form are his two substantial page features; the cart completes the product selection journey.

| Page | Visitor goal | Planned function | Expected result | Responsible student |
| --- | --- | --- | --- | --- |
| Home | Continue shopping from the entry page | Shared cart link and quantity | Open the same saved cart on Products | Temirlan |
| Products | Find a suitable product | Connected search and category filter | Matching cards/count, no-results message, reset and Add to cart | Temirlan |
| Products | Check a selection and its cost | Add, increase/decrease, remove, clear and demo checkout | Updated subtotals, quantity and total; demo summary/reference | Temirlan |
| Products | Prepare a product enquiry | Field validation, counter and local summary | Specific errors/first-error focus, or a safe summary with no-submission notice | Temirlan |
| All six pages | Keep the selection while navigating | Shared cart storage and quantity link | Consistent product IDs/quantities after navigation or reload | Temirlan |

The remaining contributors' features, including the Contacts review module, are outside this individual contribution. This package does not claim that the whole team's Assignment 4–5 requirements are complete. No booking or login pages were added.

## Files and frozen baseline

- `Grocery/js/store.js`: eight product objects, filtering, quantities, totals, validation and demo references.
- `Grocery/js/main.js`: shared cart state/storage/link and the Products cart interface.
- `Grocery/js/products.js`: catalogue cards, connected controls and selection feedback.
- `Grocery/js/request.js`: request validation, summary and character counter.

All six HTML files start from `midterm`; only deferred local script links are added directly. New controls/messages are created through DOM methods in the existing gallery and result containers. CSS is unchanged. Post-midterm catalogue additions are supplied through JavaScript; the original store photos remain available below the catalogue. No essential midterm HTML/CSS correction was needed.

`assignment-4` records working data and calculation/validation logic. `assignment-5` records the complete interactions and submission materials. The `midterm` tag is preserved. Git history records actual work dates; this package does not assert that the required multi-day contribution history has been fulfilled.

The original published milestone tags remain unchanged. The latest main branch includes the 23 October verification and a small accessibility fix: a successful request now receives focus, including on a phone with a long cart.

## Submission materials and checks

The [Assignment 4–5 package](Grocery/Temirlan_Assignment4-5/README.md) contains the exact-line JavaScript checklist, browser evidence and `Temirlan_Assignment4-5_Report.pdf` with the repository link.

[What to submit](Grocery/Temirlan_Assignment4-5/SUBMIT.txt) lists the repository materials and scope. The document requires the repository; the PDF and backup ZIP are supplemental. The AI log remains excluded at the user's request and is not represented as complete.

Recorded checks cover logic, catalogue/cart/form interactions, safe text, corrupt storage and shared navigation. All six pages were checked at 375, 768 and 1366 px with no overflow, missing images, duplicate IDs or browser errors. Source comparisons confirm six midterm HTML snapshots plus script links and all four CSS files unchanged. Nu HTML validation reports no messages. Evidence and the precise test scope are in the submission package.

## Previous coursework

- [Temirlan's midterm package](Grocery/Temirlan_Midterm/README.md)
- [Temirlan's Assignment 3](Grocery/Temirlan_Assik3/README.md)
- [Shalkar's Assignment 3](Grocery/ShalkarSaparali/README.md)
- Older evidence is in `Grocery/evidence/`; the earlier HTML/CSS checklists describe those earlier versions.
