# Lido Final Repairs Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Repair all existing pages and move the complete cart into cart.html.
**Architecture:** store.js owns shared data, cart persistence and native cart-updated events. main.js maintains navigation counters. cart.js renders the standalone cart, products.js renders the catalogue, prices.js fills the existing prices table. Existing page scripts keep their respective features.
**Tech Stack:** HTML, Bootstrap 5.3.8 CDN, JavaScript, jQuery 3.7.1.
**Spec:** ../specs/2026-11-15-lido-final-repairs-design.md

## Global constraints

- Keep existing English content, green palette and six existing URLs; add approved cart.html.
- Preserve lido-cart data and meaningful local edits. Do not alter historical attribution.
- Repair identified defects, preserve existing user features, report real-phone testing separately.

## Review focus

- Old, corrupt or blocked localStorage; show a useful state and preserve current-page cart.
- Cross-tab and back-navigation updates; prevent stale totals.
- Rebuilt controls and animations; retain keyboard focus and invalidate old results.
- Long text and narrow screens; prevent horizontal overflow and inaccessible fields.
- Migration from Products cart; preserve download/review and every route to cart.

## Tasks

- [x] 1. Add final source and browser regression tests. Source test must first fail because cart.html is absent. Browser tests exercise the migrated shopping flow, forms and seven-page keyboard/layout/link checks.
- [x] 2. Move persistence methods to store.js with readCart(), saveCart(), addToCart(id), setCartQuantity(id, quantity), clearCart(). Preserve quantity normalization. Dispatch native cart-updated. Reduce main.js to navigation status. Add cart.html and adapt cart.js to shared methods, with review/download and cross-tab refresh.
- [x] 3. Point existing cart links to cart.html, add common Bootstrap navbar and align existing header/footer. Restore Prices table from shared products with prices.js. Fix Home count/budget, Products focus and repeated blocks, Delivery duplicate list, Contacts instructions/form state and About descriptions.
- [x] 4. Run node tests/logic.cjs, tests/catalogue-data.cjs, tests/final-source.cjs and tests/final-browser.cjs in Edge/Chrome. Validate HTML, inspect screenshots, run a fresh read-only code review and address important findings.

## Execution ledger

- Baseline business-logic and catalogue tests passed before changes.
- Ruling: user explicitly requested work in the visible existing project; use codex/final-repairs branch in that checkout with a zip backup, avoiding a separate checkout that would hide edits from VS Code.
- Ruling: user said to implement the agreed plan immediately; proceed inline without another planning approval round.
- No matching unsaved Grocery buffers were found in VS Code backups at execution start.
- Full pre-edit site backup: `tmp/final-before-repairs-20261115.zip` (local, ignored).
- Source regression first failed on absent cart.html; now passes. Business logic, catalogue data and all active JavaScript syntax checks pass.
- Browser checks pass in Edge and Chrome at 375/768/1366 px: seven-page layout, navigation, cart persistence, cross-tab updates, quantity limits, review/download, budget, request/delivery/contact forms, guide, empty/corrupt/blocked storage and console errors.
- Independent review reproduced a lost click after quantity editing and lost keyboard focus. Added a failing regression, retained existing cart controls, restored catalogue focus and verified the corrected interactions in both browsers. A second independent Edge check confirmed the fixes.
- Visual inspection caught a duplicate phone-copy button outside Contacts and wrapped numeric prices on mobile. Scoped contact actions to their own container and kept units/prices on one line, hiding the Category column only on narrow screens.
- Online HTML upload was rejected by automatic approval review. Used the official Nu validator locally instead, without sending site contents externally. Nu 26.11.14 reports zero errors/warnings for all seven source pages and all seven rendered pages.
- Screenshots and machine-readable validation results are local in `tmp/final-checks/`. Inspected all seven page designs, including narrow Cart, Contacts and Prices.
- The 50 catalogue WebP files total 552,730 bytes; largest 21,052 bytes. Existing team photographs are preserved.
- Unused styles and the legacy JS comparison snapshot were moved into `archive/assignment-assets/`, preserving prior local CSS edits. The live site uses site.css. Historical assignment tests/docs remain snapshots, explicitly distinguished in README.
- Kept the current checkout and local branch for review. No remote push, merge, final tag or final-submission compliance claim is included in this repair task.

## Follow-up presentation repairs

The user chose the assignment version, without new features, after asking for a modern redesign. Kept this bounded to identifiable defects: removed duplicate Home dividers (section borders already separate blocks), removed the one-off blue hover override from the green Browse products button, and moved the existing store quotation before the product-request section so it no longer interrupts the form heading and fields. No new sections, libraries or functionality were added.

## Remaining external checks

- A real phone has not been tested; narrow browser viewports are not physical-device evidence.
- The teacher's individual Endterm feedback was not supplied, so its full resolution cannot be certified.
- Final publication/tag and the document's submission-policy requirements remain separate from the completed site repairs.
