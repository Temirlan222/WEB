# JavaScript checklist — Temirlan

Paths are relative to the repository root. Each citation identifies an exact line of the current main submission. Published tags retain their original milestone snapshots. Scope: Home, Products and the shared cart across six pages.

## Assignment 4: data and logic

| Requirement | Exact implementation evidence |
| --- | --- |
| Strict mode; const by default; let for changing values | `Grocery/js/store.js:1`; `Grocery/js/main.js:1`; `Grocery/js/products.js:1`; `Grocery/js/request.js:1`; mutable totals at `Grocery/js/store.js:84`, validation state at `Grocery/js/request.js:27`. All scripts were scanned for forbidden patterns. |
| At least six project objects with four properties | `Grocery/js/store.js:4`: eight recorded products, each with ID, name, category, unit, price and image. |
| Find/filter and a meaningful traversal | `Grocery/js/store.js:15`; `Grocery/js/store.js:21`; normalization loop at `Grocery/js/store.js:43`; total loop at `Grocery/js/store.js:86`.  |
| At least four parameter/return functions | `Grocery/js/store.js:15`, `Grocery/js/store.js:21`, `Grocery/js/store.js:30`, `Grocery/js/store.js:38`, `Grocery/js/store.js:57`, `Grocery/js/store.js:77`, `Grocery/js/store.js:83`, `Grocery/js/store.js:115`. Each takes parameters and returns a result. |
| One function calls another | `Grocery/js/store.js:77`: calls normalizeCart and changeQuantity; `Grocery/js/store.js:83`: calls normalizeCart and findProduct. |
| Arithmetic and conditions | `Grocery/js/store.js:57`: quantity decisions; `Grocery/js/store.js:89`: price × quantity and accumulated total. |
| Logical operators and strict comparisons | `Grocery/js/store.js:25`: `\|\|`; `Grocery/js/store.js:26`: &&; `Grocery/js/store.js:17`: ===; `Grocery/js/store.js:31`: !==. |
| Meaningful Math.random() | `Grocery/js/store.js:98`: six-digit DEMO reference; `Grocery/js/main.js:167`: shown only with a demonstration checkout notice. |

## Assignment 5: DOM, events and visitor flows

| Requirement | Exact implementation evidence |
| --- | --- |
| Shared main.js, page files and deferred loading | `Grocery/index.html:12`; `Grocery/index.html:13`; Products adds store/main/products/request in `Grocery/products.html:12`. The same store/main links are at line 12/13 of prices.html, delivery.html, contacts.html and colophon.html. |
| Reusable DOM creation; safe user text | `Grocery/js/store.js:159`: createElement/textContent; `Grocery/js/request.js:98`: creates safe summary terms/values; `Grocery/js/request.js:152`: uses visitor input. |
| Array rendered through one reusable catalogue function | `Grocery/js/products.js:95`: creates all product cards; `Grocery/js/products.js:124`: sends the filtered array to the same renderer. |
| Two connected controls, count, empty state, reset, next action | `Grocery/js/products.js:23`: search; `Grocery/js/products.js:30`: category; `Grocery/js/products.js:97`: count; `Grocery/js/products.js:98`: no-results state; `Grocery/js/products.js:128`: reset; `Grocery/js/products.js:88`: cart action and feedback. |
| Cart in an equivalent prepared container | `Grocery/products.html:274`: midterm result container; `Grocery/js/main.js:74`: generated cart child; `Grocery/js/main.js:102`: insertion preserves form result hooks. |
| Add, increase/decrease, remove and clear | `Grocery/js/main.js:24`; `Grocery/js/main.js:30`; `Grocery/js/main.js:34`; `Grocery/js/main.js:104`: real labelled buttons; `Grocery/js/main.js:140`: line action handling. |
| Recalculate subtotals, total quantity and final total | `Grocery/js/main.js:114`: renders each line subtotal and totals; `Grocery/js/store.js:83`: reusable arithmetic. |
| Empty state, disabled checkout and demo summary/reference | `Grocery/js/main.js:80`; `Grocery/js/main.js:137`; `Grocery/js/main.js:157`: summary, reference, cart clear and explicit no-order/no-payment notice. |
| Shared feature across six pages | `Grocery/js/main.js:9`: normalized saved cart; `Grocery/js/main.js:18`: IDs/quantities only; `Grocery/js/main.js:46`: shared quantity/link. |
| At least three event types | `Grocery/js/main.js:140`: click; `Grocery/js/products.js:136`: input; `Grocery/js/products.js:137`: change; `Grocery/js/request.js:46`: submit; `Grocery/js/request.js:49`: reset. |
| Create/insert/update/remove DOM nodes | `Grocery/js/store.js:159`; `Grocery/js/main.js:71`; `Grocery/js/main.js:102`; `Grocery/js/products.js:57`; `Grocery/js/request.js:104`. Repeated rendering replaces outdated list nodes. |
| classList for hidden/active/selected/error/success states | `Grocery/js/main.js:55`: active page; `Grocery/js/products.js:98`: hidden empty message; `Grocery/js/products.js:83`: selected product; `Grocery/js/request.js:115`: error; `Grocery/js/request.js:116`: success; `Grocery/js/request.js:95`: hidden form message. |
| Trimmed required text and valid contact details | `Grocery/js/store.js:117`: trimmed text; `Grocery/js/store.js:123`: required length; `Grocery/js/store.js:126`: email check; `Grocery/js/store.js:132`: supplied phone rules. |
| Numeric/date/selection validation | `Grocery/js/store.js:138`: whole number 1–999; `Grocery/js/store.js:141`: valid non-past optional date; `Grocery/js/store.js:144`: allowed category; `Grocery/js/store.js:147`: allowed contact method. |
| Cross-field rule | `Grocery/js/store.js:130`: a phone number is required when phone contact is selected. |
| Specific adjacent errors, focus and stale clearing | `Grocery/js/request.js:9`: field-to-feedback map; `Grocery/js/request.js:59`: adjacent accessible feedback; `Grocery/js/request.js:109`: error text/aria-invalid; `Grocery/js/request.js:147`: first invalid focus; `Grocery/js/request.js:170`: revalidation; `Grocery/js/request.js:182`: clears feedback. |
| Useful success summary; no real submission | `Grocery/js/request.js:135`: stops GET submission; `Grocery/js/request.js:152`: visitor choices; `Grocery/js/request.js:164`: no-server/no-order confirmation; `Grocery/js/request.js:167`: focus brings successful confirmation into view. |
| Character counter | `Grocery/js/request.js:88`: live comment length; `Grocery/js/request.js:170`: updates on input; `Grocery/js/request.js:198`: reset to zero. |
| Keyboard controls and non-colour feedback | `Grocery/js/products.js:24`, `Grocery/js/products.js:30`, `Grocery/js/products.js:112`: native controls; `Grocery/js/main.js:109`: product action labels; `Grocery/js/request.js:113`: Error/Valid text; `Grocery/js/request.js:147`: focus on invalid input. |

## Verification and submission boundary

- [Browser evidence](evidence/browser-checks.json): catalogue/cart/form/shared navigation, safe text, corrupt storage and all six pages at 375, 768 and 1366 px; no recorded browser errors, horizontal overflow, missing images or duplicate IDs. Home/Products screenshots are in the same folder.
- `tests/logic.cjs`: product data, filtering, quantity bounds, cart arithmetic/normalization, reference format and request validation.
- `tests/browser.cjs`: reproducible browser scenarios behind the JSON record/screenshots.
- [Source checks](evidence/source-checks.json): six HTML midterm snapshots plus script links only, four CSS files unchanged, strict mode and prohibited-pattern checks passed.
- [Nu HTML validation](evidence/html-validation.json) and [generated DOM validation](evidence/generated-html-validation.json): no messages for all six pages.
- Repeated keyboard quantity changes retain focus (`Grocery/js/main.js:149`); `tests/browser.cjs` checks this and 78 local links/fragment targets.
- [Functionality Plan](../../README.md) identifies Temirlan's two substantial page features and shared cart. Contacts reviews belong to the remaining team contribution and are not claimed complete. Login/booking modules do not apply to existing pages.
- [assignment-4](https://github.com/Temirlan222/WEB/tree/assignment-4) identifies working data/logic; [assignment-5](https://github.com/Temirlan222/WEB/tree/assignment-5) identifies the completed contribution. The `midterm` tag stays unchanged.
- Current browser verification was rerun on 23 October 2026. It includes visible/focused successful request confirmation at 375 px with all eight cart items, and form Reset preserving the cart.
- Git history retains genuine dates. This contribution does not claim the team-wide commit counts and work across three days are fulfilled.
