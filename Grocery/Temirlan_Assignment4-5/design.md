# Temirlan Assignment 4-5 design

Approved scope on 18 October 2026: Home and Products, plus a shared cart link/count on all six pages. Plain JavaScript only; simple named functions, no libraries or build system. Existing example prices are the only product-price source. No backend, real order, payment, account or delivery guarantee.

## Files and interfaces

- `js/store.js`: eight product records and pure functions. Exposes `window.Lido` with products, findProduct(id), filterProducts(items, search, category), validQuantity(value), normalizeCart(items), changeQuantity(cart, id, quantity), addItem(cart, id), cartTotals(cart), formatMoney(amount), makeReference(), today(), validateRequest(values, today), makeElement(tag, text, className).
- `js/main.js`: `Lido.cart` state, localStorage, shared cart link/count, Products cart UI in prepared `request-result`. Exposes addToCart(id), setCartQuantity(id, quantity), clearCart(), saveCart(); dispatches `cart-updated` after changes. Restores Prices row anchors through DOM.
- `js/products.js`: search/category controls and eight generated product cards. Uses Lido helpers and cart actions. Shows count, empty result, reset and selected cards. Reuses existing gallery/category areas.
- `js/request.js`: existing request form validation, field feedback, first-error focus, safe request summary and character counter. Uses validateRequest. Does not reload or put personal input in URLs. Reset clears errors and request result, not cart.
- HTML files: return interface source to midterm snapshot; add deferred script links only. Post-midterm links/thumbnails are replaced by equivalent DOM catalogue actions. CSS stays exactly at midterm; preserve unrelated original local base.css outside the delivered changes.

## State and data

Product properties: id, name, category, unit, price, image. Units are explicit, including apples in 1 kg units. Prices are recorded examples, not live stock/prices. Existing illustrative product-image sources stay credited.
Cart records contain product id and integer quantity 1-999. Unknown ids, duplicates and malformed storage are normalized. Only cart data is stored, no form/contact details. Empty cart disables demo checkout. Checkout creates an explicit DEMO reference and item/total summary, clears cart, and makes no business promise. Further cart edits clear outdated checkout feedback.

Form values: name, email, phone, product, quantity, date, category, method, permission, comment. Trim text; email required/format checked; supplied phone checked and required when method=phone; quantity finite integer 1-999; category/method allowed; optional date cannot be past; acknowledgement required; comment at most 1000. Errors are field-specific and textual. Success shows submitted choices and no-server/no-order message. User input uses textContent.

## Milestones and evidence

Assignment 4 tag: working pure data/logic with tests. Assignment 5 tag: complete DOM/events/validation and evidence. Keep midterm tag unchanged. Capture 375/768/1366 screenshots; test empty/repeated/invalid flows, storage corruption, safe text, navigation and keyboard. Verify source HTML differs from midterm only by scripts and CSS is unchanged. Include exact-line checklist, Functionality Plan and descriptive English PDF with GitHub link. Team features on other contributors' pages and multi-day author history are not claimed complete. AI log remains excluded under the user's earlier explicit instruction.
