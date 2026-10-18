# Temirlan Assignment 4-5 Implementation Plan

> **For agentic workers:** Use executing-plans with parallel bounded implementation help and one final independent review. Track completed steps here.

**Goal:** Complete Temirlan's catalogue/cart/request journeys and publish verified code and PDF.
**Architecture:** A shared plain-JavaScript data/functions object; shared cart state/UI; two focused Products scripts. Every new interface node is created through DOM methods.
**Tech Stack:** HTML, existing Bootstrap CSS, plain JavaScript; Node/Playwright for verification only.
**Spec:** design.md

## Global constraints

- User approved execution and publication. Only Home/Products behaviour plus shared cart and runtime price anchors; no teammate feature rewrite.
- HTML from midterm plus script links only; no CSS changes, inline events/styles, unsafe innerHTML, eval, libraries or server code.
- Honest demo confirmation, real recorded prices, no personal data storage, genuine commit/tag dates.

## Review focus

- Corrupt cart storage, duplicate ids and out-of-range quantities must not produce bad totals or crashes.
- Filter combinations and empty results must keep controls usable and offer reset.
- Telephone preference must require a valid telephone; whitespace and past dates rejected.
- Form reset and repeated checkout must remove outdated feedback without deleting unrelated state.
- Shared navigation, source freeze, 375px layout and keyboard controls must work after DOM changes.

## Tasks

- [ ] 1. Test then implement store.js pure functions (filter/find/cart totals/normalization/validation/reference). Commit the logic and tag assignment-4 after green tests.
- [ ] 2. In parallel, implement products.js catalogue and request.js validation against the documented Lido API; tests cover their user flows. Do not commit shared files from agents.
- [ ] 3. Implement main.js shared cart, persistence, prepared-container cart and runtime price anchors. Restore six HTML snapshots from midterm with script links only. Browser-test catalogue/cart/form integration.
- [ ] 4. Run full browser suite at three widths, HTML validator, syntax/static/freeze checks; independent code review and focused repairs.
- [ ] 5. Generate exact-line checklist, README plan, evidence and PDF; render and inspect all PDF pages. Tag assignment-5 after verified completion; push main and both assignment tags, preserve midterm. Sync only delivered files into VS Code after backup.

## Execution rulings

- The user's explicit "Да, делай так ... Потом закинь ..." authorizes implementation and publication of the presented design; no repeated approval is requested. Plans/spec are supporting reviewable records.
- Reuse the existing separate checkout on branch assignment-4-5-temirlan; no new worktree is necessary. Protect original VS Code modifications with a backup before transfer.
- Request-result is the existing equivalent prepared cart container. Cart DOM gets its own child area; request-summary/error/confirmation remain the form's separate prepared hooks.
