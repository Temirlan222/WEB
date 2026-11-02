# Lido Grocery Store

A six-page website for Lido Grocery Store, Uly Dala Avenue 31, Astana. It continues the same project and repository from Assignments 1–3 and the Midterm Project.

[Repository](https://github.com/Temirlan222/WEB) · [Midterm](https://github.com/Temirlan222/WEB/tree/midterm) · [Assignment 4](https://github.com/Temirlan222/WEB/tree/assignment-4) · [Assignment 5](https://github.com/Temirlan222/WEB/tree/assignment-5) · [Assignment 6](https://github.com/Temirlan222/WEB/tree/assignment-6)

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

Open `Grocery/index.html` in a browser with JavaScript enabled. Internet access loads the existing Bootstrap CDN files and jQuery 3.7.1 full from the official CDN. No build command, package installation, backend or account is needed.

Browse the catalogue on Products, combine search and category filters, add items and open the cart. Its shared link shows the quantity on all six pages. `localStorage` keeps only product IDs and quantities between navigation and reload. If browser storage is unavailable, the current page works, but the cart cannot persist between pages.

The current catalogue contains **50 products in five categories**, with ten in each: Dairy & eggs, Fruit & vegetables, Meat & fish, Bakery and Pantry. Exact names, sizes, prices and corresponding photographs were recorded from Galmart Avstriyskiy Kvartal, Kaldayakov 6, Astana, via its public Wolt listings on **2 November 2026**. [Per-product sources and original image URLs](Grocery/images/catalogue/sources.json) are included. Prices are snapshots of the retailer's online listing, not live Lido prices or stock; confirm the final price with Lido before buying. All 50 product photographs are served locally.

Home links directly to each category. Products combines bilingual name/brand search, category selection and numeric price sorting. The existing cart sits beside the catalogue on desktop, with direct cart links on phones. Reviewing a shopping list preserves its contents; only Clear cart removes the whole list. The enquiry form remains a secondary, collapsible action. No online order or payment is submitted.

### Current catalogue checks

With Node.js: `node tests/logic.cjs`, `node tests/catalogue-data.cjs`, `node tests/catalogue-browser.cjs`. The browser check uses Playwright from the bundled runtime (or `PLAYWRIGHT_PATH`) and Microsoft Edge. It saves current evidence to `tmp/catalogue-evidence` by default; `EVIDENCE_DIR` can override that folder. These checks cover the expanded catalogue; older Assignment 4-6 checks remain tied to their historical tags.

Verified on **2 November 2026**: five categories of ten, all 50 photographs, bilingual search, category/price sorting, all 50 delegated Add buttons, independent cart arithmetic, keyboard quantity changes, retained/repeated list review, storage recovery and safe request validation/reset. All six pages were checked at 375/768/1366 px; 133 local links/targets passed with no broken images, horizontal overflow, duplicate IDs or console/page errors. A regression also verifies that reviewing all fifty items fits the desktop viewport and that its final total is reachable by scrolling the sidebar.

The latest teammate Contacts contribution is retained. Only Home, Products, their data and the shared cart were changed for the catalogue expansion. The historical Prices page belongs to a separate contribution and retains its older price examples; use the catalogue cards for this selection's recorded prices.

## Assignment 6 — jQuery (historical milestone)

This section and its line pointers describe the published `assignment-6` version. The newer 50-product catalogue intentionally changes Home/Products markup and the small CSS correction layer; the old frozen-source checks apply to the tag, not current main.

The supplied file is `assignment6_jquery.docx`; its internal heading says “Assignment 4”, but this section follows that supplied jQuery rubric. The same site and pages continue; no redesign, new page, plugin or CSS rule was added.

Temirlan rewrote three existing features: catalogue, shared cart and product-request form. jQuery **3.7.1 full** is loaded from its official CDN before all local scripts on all six pages. The full build includes the required effects. Data and validation rules stay in `store.js`; active DOM/event code uses jQuery throughout. `old-js-version.js` is comparison material only and never executes.

Shalkar's Contacts block is appended to `Grocery/js/main.js`: review translation, helpful state and phone copy are rewritten with jQuery; a topic list and validated contact form are generated in code. Its plain-JavaScript comparison is appended to `old-js-version.js`. Contacts uses only the existing HTML and Bootstrap/project classes, so the page source and stylesheet remain unchanged.

After successful validation the form resets to its original defaults. The summary uses captured values and stays visible, with focus moved after the slide effect. Manual Reset clears feedback/results and leaves the cart alone. .text() handles visitor text; .html() is used only for a fixed demo notice. .prop('checked') reads the current checkbox state; .attr('checked') would describe its initial markup.

| Rubric requirement | Where to show it |
| --- | --- |
| Three rewritten features | `Grocery/js/products.js:7`; `Grocery/js/main.js:19`; `Grocery/js/request.js:7` — catalogue, shared cart and main form; comparison comments are immediately above each block. |
| Ready and version | `Grocery/js/main.js:5`; each file uses ready. The first comments identify jQuery 3.7.1, the full build/effects and why CDN/ready order matters. |
| ID/class/element/attribute selectors and a filter | `Grocery/js/main.js:70`; `Grocery/js/main.js:56`; `Grocery/js/products.js:126`; `Grocery/js/main.js:129`; `Grocery/js/request.js:86` |
| Traversal | `Grocery/js/main.js:65` — find; `Grocery/js/products.js:122` — closest; `Grocery/js/request.js:65` — parent; `Grocery/js/request.js:62` — siblings; `Grocery/js/products.js:65` — each. |
| $(this) in event handlers | `Grocery/js/products.js:121`; `Grocery/js/main.js:130`; `Grocery/js/request.js:159` |
| At least two chains of three or more methods | `Grocery/js/main.js:46` — attr/addClass/text/appendTo; `Grocery/js/products.js:32` — val/text/appendTo. Both have a chain explanation comment. |
| text/html/val/attr/prop | `Grocery/js/request.js:35` uses trusted constant markup only; `Grocery/js/request.js:74`; `Grocery/js/request.js:88`. Visitor summary values use .text(). |
| All existing-class helpers | `Grocery/js/main.js:107`; `Grocery/js/main.js:164`; `Grocery/js/products.js:70`; `Grocery/js/products.js:125` |
| Cards generated from an array | `Grocery/js/products.js:84` — jQuery nodes and append/appendTo; no card markup added to source HTML. |
| on/delegation/event types | `Grocery/js/products.js:120`; `Grocery/js/request.js:48`; `Grocery/js/request.js:49`. Rebuilt card/cart buttons are delegated; comments explain why direct binding would miss later elements. |
| Three useful effects | `Grocery/js/products.js:77` — replace outdated add feedback with fadeOut/fadeIn; `Grocery/js/request.js:173` — reveal a valid confirmation. Durations and completion callbacks are real; reduced motion is respected. |
| Complete jQuery validation | `Grocery/js/request.js:77`; `Grocery/js/request.js:114`; `Grocery/js/request.js:138`; `Grocery/js/request.js:178`. Trimmed text, email/phone formats, quantities/date/selections and cross-field phone rule remain checked. |
| Valid-submit reset and HTML fallback | `Grocery/js/request.js:159` resets only after checks pass; captured values build the safe summary afterwards. required/min/maxlength remain in HTML. Comments explain preventDefault and why a browser check never replaces server validation. |
| Original comparison version | `Grocery/js/old-js-version.js` preserves Temirlan's four original sources from 3c83c69 and Shalkar's three Contacts comparisons; it is not linked to any page. |
| Freeze and no mixed DOM approaches | All six source pages differ from Assignment 5 only by the jQuery CDN line, and all four stylesheets remain unchanged. Contacts selects existing blocks with traversal; its list and form are generated in code. Active features use jQuery DOM/events only; ordinary array/calculation/JSON/localStorage APIs are retained for data logic. |

### Verification and submission

Recorded on **31 October 2026**: pure logic, full user flows on all six pages at 375/768/1366 px, 78 local links/targets, safe input, quantity changes, storage recovery, keyboard focus, valid-submit defaults and retained summary. A separate non-reduced-motion run exercises fadeOut/fadeIn/slideDown with duration and completion callbacks, rapid-action cancellation and immediate field-error correction. Source and generated HTML validation report no messages; no console errors were recorded.

At the historical `assignment-6` tag, run `tests/logic.cjs`, `tests/assignment6-source.cjs`, `tests/assignment6-browser.cjs`, `tests/assignment6-effects.cjs` with Node. The older Assignment 4–5 checks/evidence describe those historical milestone snapshots. Test tools are not loaded by the website.

Submit this same repository. [Submission instructions](Grocery/Temirlan_Assignment6/SUBMIT.txt) and [verification evidence](Grocery/Temirlan_Assignment6/evidence/) are included. **The jQuery assignment requires no written report or recording**; a ZIP is an optional backup. At defense demonstrate the live features and compare the old/new code.

The AI log remains excluded under the user's explicit instruction; that required artifact and the document's separate AI/authorship restriction are not represented as satisfied. Commit dates and authors are genuine; this run does not fabricate four commits across three days or other students' contributions. Each team member must complete their own history and live defense.

## Assignment 4–5 Functionality Plan (previous milestone)

This submission implements Temirlan's Home and Products contribution and one shared site feature. Catalogue filtering and the validated request form are his two substantial page features; the cart completes the product selection journey.

| Page | Visitor goal | Planned function | Expected result | Responsible student |
| --- | --- | --- | --- | --- |
| Home | Continue shopping from the entry page | Shared cart link and quantity | Open the same saved cart on Products | Temirlan |
| Products | Find a suitable product | Connected search and category filter | Matching cards/count, no-results message, reset and Add to cart | Temirlan |
| Products | Check a selection and its cost | Add, increase/decrease, remove, clear and demo checkout | Updated subtotals, quantity and total; demo summary/reference | Temirlan |
| Products | Prepare a product enquiry | Field validation, counter and local summary | Specific errors/first-error focus, or a safe summary with no-submission notice | Temirlan |
| All six pages | Keep the selection while navigating | Shared cart storage and quantity link | Consistent product IDs/quantities after navigation or reload | Temirlan |

The remaining contributors' features, including the Contacts review module, are outside this individual contribution. This package does not claim that the whole team's Assignment 4–5 requirements are complete. No booking or login pages were added.

## Files and frozen baseline (Assignments 4–5)

- `Grocery/js/store.js`: eight product objects, filtering, quantities, totals, validation and demo references.
- `Grocery/js/main.js`: shared cart state/storage/link and the Products cart interface.
- `Grocery/js/products.js`: catalogue cards, connected controls and selection feedback.
- `Grocery/js/request.js`: request validation, summary and character counter.

All six HTML files start from `midterm`; only deferred script links (including the jQuery CDN for Assignment 6) are added directly. New controls/messages are created through DOM methods in the existing gallery and result containers. CSS is unchanged. Post-midterm catalogue additions are supplied through JavaScript; the original store photos remain available below the catalogue. No essential midterm HTML/CSS correction was needed.

`assignment-4` records working data and calculation/validation logic. `assignment-5` records the complete interactions and submission materials. The `midterm` tag is preserved. Git history records actual work dates; this package does not assert that the required multi-day contribution history has been fulfilled.

The original published milestone tags remain unchanged. The Assignment 5 milestone includes the 23 October verification and a small accessibility fix: a successful request now receives focus, including on a phone with a long cart.

## Submission materials and checks

The [Assignment 4–5 package](Grocery/Temirlan_Assignment4-5/README.md) contains the exact-line JavaScript checklist, browser evidence and `Temirlan_Assignment4-5_Report.pdf` with the repository link.

[What to submit](Grocery/Temirlan_Assignment4-5/SUBMIT.txt) lists the repository materials and scope. The document requires the repository; the PDF and backup ZIP are supplemental. The AI log remains excluded at the user's request and is not represented as complete.

Recorded checks cover logic, catalogue/cart/form interactions, safe text, corrupt storage and shared navigation. All six pages were checked at 375, 768 and 1366 px with no overflow, missing images, duplicate IDs or browser errors. Source comparisons confirm six midterm HTML snapshots plus script links and all four CSS files unchanged. Nu HTML validation reports no messages. Evidence and the precise test scope are in the submission package.

## Previous coursework

- [Temirlan's midterm package](Grocery/Temirlan_Midterm/README.md)
- [Temirlan's Assignment 3](Grocery/Temirlan_Assik3/README.md)
- [Shalkar's Assignment 3](Grocery/ShalkarSaparali/README.md)
- Older evidence is in `Grocery/evidence/`; the earlier HTML/CSS checklists describe those earlier versions.
