# Endterm - Temirlan: Home, Products and shared cart

Scope: same repository, existing six pages. Temirlan owns Home/Products and the shared shopping-list API/UI; other students own Cart/Delivery and Contacts/About. This is an individual contribution, not certification of all team criteria.

## New work since the defended jQuery milestone

- Home: plain-JavaScript category guide plus saved-list quantity/total and optional budget comparison. Empty, invalid, within-budget and over-budget results are explicit. Storage and pageshow refresh the saved summary. The visitor can continue the list on Products.
- Catalogue: a live Only products in my cart filter composes with name/category/sort, and updates immediately when an item is removed. Reset restores all products.
- Enquiry: a delegated Prepare an enquiry button fills product, category and current cart quantity, opens the existing form location and focuses the name. Validation still checks all fields and resets only after success, while retaining the safe summary. It does not contact the store.
- Shared cart: Download shopping list creates a local UTF-8 text file containing each item, unit, quantity, subtotal and total. Review retains the cart and replaces its previous summary. Nothing is paid or submitted.
- Corrected Contacts initialization leaking into Products: one page guard prevents its unrelated copy controls/table references from being injected outside Contacts. The existing Contacts feature code is otherwise preserved.

## JavaScript / jQuery and authorship

Temirlan's implementation contribution is recorded by this commit; existing teammate code is preserved. Code was developed with AI assistance at the user's request; it is not represented as meeting the document's AI-only-for-explanations rule. No separate AI log was generated under the user's earlier instruction.

Plain JavaScript: js/store.js contains real product/category arrays, parameter/return helpers and calculated totals; it has no jQuery dependency. js/home.js builds category links using createElement and a loop and handles saved-list/budget interaction with native events. Shared helpers such as findProduct, normalizeCart, cartTotals, formatMoney and make are used in multiple places.

jQuery: js/products.js owns catalogue DOM/events; js/main.js owns shared cart DOM/events; js/request.js owns enquiry DOM/events. They use CDN jQuery 3.7.1, ready, ID/class/tag/attribute selectors, closest/find/siblings/each, $(this), chains, delegated events, input/change/click/submit/reset, purposeful fadeOut/fadeIn/slideDown and completion callbacks. Native Blob/URL APIs implement file download, not duplicate DOM handling. Data helpers are shared without mixing DOM approaches inside a feature.

## Freeze and content

index.html and products.html match the midterm tag exactly after removing only the deferred script links. css/temirlan.css is byte-equivalent to midterm after newline normalization. No new handwritten page markup, CSS rules or inline handlers were added. Additional controls/cards/results are generated in JS using existing Bootstrap/project classes. Original store photos and content are retained.

The catalogue retains 50 real named product records and their Galmart Astana source URLs, with prices recorded 2 November 2026; these are reference snapshots, not live Lido price/stock claims. Original team photographs remain available in the store-photo section. Product cards use names/units/prices without substituting a store photo for a product photograph. Own photographs of all 50 separate products were not supplied; third-party packshots remain archived as source assets but are not displayed by Home/Products.

## Rubric audit / verification

| Requirement | Evidence / status |
| --- | --- |
| Same project and useful finished actions | Existing pages/repository; search -> results; cart -> totals/review/download; budget -> difference; enquiry -> errors or confirmation |
| New functionality since previous defense | Home budget/saved summary, selected-only filter, product-to-enquiry prefill, local shopping-list download |
| Midterm HTML/CSS freeze | tests/endterm-source.cjs compares own pages/styles to actual midterm |
| Plain JS arrays, loop, parameters/return, conditions, computed numbers | store.js and home.js |
| Three event types and delegation | products.js and request.js; rebuilt product buttons use gallery delegation |
| Complete validation | Trim, required values, email/phone, quantity/date/category/contact/checkbox/comment checks; adjacent feedback; corrected fields update; safe successful summary/reset |
| jQuery selectors/traversal/chain/two effects | products.js/main.js/request.js; fadeOut, fadeIn and slideDown with timed callbacks |
| One visitor can finish | Local list file and local enquiry summary; explicit no-server/no-payment text |
| Empty cases, safe text, persistence | tests/logic.cjs, tests/catalogue-data.cjs, tests/endterm-browser.cjs |
| Console/responsiveness | Browser test checks six pages at 375/768/1366; this is a smoke check of teammates' pages, not a full audit of their features |
| HTML validity | Nu checks source and generated Home/Products DOM |
| Own photos / real information | Existing team store photos shown with honest captions; per-product own photo coverage unavailable; prices dated and sourced |
| Quality pass two days before deadline | Automated findings recorded below; teammate review/timing must be confirmed by the students, deadline not supplied |
| Commit history | Existing Temirlan-owned page/data history includes commits dated 16/18/31 October and 2 November 2026; dates/authors are genuine. Each student remains responsible for their own contribution history |
| AI log/authorship policy and defense | Not claimed satisfied; AI log excluded at user direction; personal live defense remains necessary |

Checks: node tests/logic.cjs; node tests/catalogue-data.cjs; node tests/endterm-source.cjs; node tests/endterm-browser.cjs; node tests/endterm-effects.cjs. Browser test uses Playwright and Edge; evidence defaults to tmp/endterm-evidence. Historical assignment-6/catalogue frozen-layout tests target their old tags and are not current Endterm checks.

Quality findings fixed: post-midterm manual page/CSS additions; no plain-JS Home interaction; dead-end reuse of catalogue without new functionality; Contacts controls appearing in Products; enquiry product names longer than the old 100-character rule. Tests verify selected-only empty state, downloaded text, positive/negative budget, safe form reset, all 50 delegated adds, dynamic cart math, corrupt storage and all six responsive pages.

## Submission and demo

Submit https://github.com/Temirlan222/WEB with the endterm tag. No PDF report or video is required. This tag records Temirlan's scoped Endterm contribution and includes the existing team snapshot; teammates' unfinished checks/history are not certified.

Demo: Home budget -> category -> bilingual search/sort -> add two items -> Only products in my cart -> quantity/remove -> review/download -> Prepare an enquiry -> invalid fields -> valid safe summary. Explain both native JS and jQuery, event delegation, text/html, checked property, calculated totals and storage. No online order or payment is claimed.

Final checks on 8 November 2026: 50 products, five categories, all data/logic tests, Endterm browser flows and 129 local links passed. All six pages passed responsive smoke at 375/768/1366 with zero page/console errors. Own source/generated HTML validation returned zero messages. Real effects completed and cleaned temporary styles. Home category guide and budget were also tested with the jQuery CDN deliberately blocked and still worked.
