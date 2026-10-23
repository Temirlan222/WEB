# Assignment 4–5 — Temirlan

Project: Lido Grocery Store. Contribution: Home, Products and a shared cart across the existing six pages.

## Submission files

- [What to submit](SUBMIT.txt): repository link, milestones and exact material list. The PDF/ZIP are supplemental, not extra formats required by the assignment document.
- [Repository](https://github.com/Temirlan222/WEB)
- [Assignment 4 milestone](https://github.com/Temirlan222/WEB/tree/assignment-4): product data and reusable project logic.
- [Assignment 5 milestone](https://github.com/Temirlan222/WEB/tree/assignment-5): original completed interactions and submission materials. Use the latest main branch for the 23 October verification and request-confirmation focus fix; published milestone tags are unchanged.
- [PDF report](Temirlan_Assignment4-5_Report.pdf): description of the work and GitHub link, without source code.
- [JavaScript checklist](javascript-checklist.md): exact files and line numbers.
- [Functionality Plan](../../README.md): visitor goals, expected results and responsibility.
- [Browser checks](evidence/browser-checks.json), [source checks](evidence/source-checks.json), [source HTML validation](evidence/html-validation.json), [generated DOM validation](evidence/generated-html-validation.json) and screenshots in `evidence/`.

## Implemented visitor journeys

1. Find a product: Home → Products → search and category → matching count/cards or an empty message → reset or Add to cart.
2. Review a selection: add products → shared cart → change quantities/remove/clear → updated totals → demo checkout summary/reference. Empty cart disables checkout. Later cart changes clear outdated confirmation.
3. Prepare a request: enter details → Check request → errors beside fields and focus on the first error, or a summary of the choices and focus on the successful confirmation. Editing clears outdated success feedback. Reset clears form feedback and the counter without clearing the cart.

Eight product entries contain ID, name, category, unit, price and image. Prices are recorded examples. References begin with `DEMO-` and do not identify real orders. No request or payment is sent to a server. Personal form details are not stored.

## Technical approach

Plain JavaScript uses named functions, arrays, loops, DOM methods and event listeners. `store.js` holds reusable logic, `main.js` provides shared behaviour, and the Products scripts handle the catalogue and form. Existing Bootstrap classes and the correction layer supply the layout and visual states. No new runtime library or build system is used.

All six HTML files use the `midterm` interface plus deferred local script links. JavaScript generates new interface elements. The original store photos are retained; illustrative product images keep their [source credits](../images/catalog/sources.md). All four CSS files remain unchanged. The `midterm` tag is preserved.

## Recorded verification

| Check | Recorded result | Evidence |
| --- | --- | --- |
| Product data, connected filtering, quantity bounds, cart arithmetic/normalization, reference and request rules | Passed | `tests/logic.cjs` in the repository |
| Search/category combination, no results and reset | Passed | `evidence/browser-checks.json`; `tests/browser.cjs` |
| Add/increase/decrease/remove/clear, totals, empty/disabled checkout and demo confirmation | Passed | Browser record and test |
| Count on all six pages, cart persistence and corrupt stored JSON | Passed | Browser record and test |
| Invalid form, first-error focus, phone/contact comparison, valid summary, counter and reset | Passed | Browser record and test |
| Literal user text without HTML interpretation | Passed | Browser record and test |
| Repeated keyboard quantity changes, local links and fragment targets | Passed; 78 local links checked | Browser record and test |
| Successful form result with all eight cart items on a phone; Reset preserving that cart | Passed; confirmation is visible and focused | Browser record; `evidence/request-success.png` |
| All six pages at 375, 768 and 1366 px | No overflow, missing images or duplicate IDs | Browser record; Home/Products screenshots |
| Browser console/runtime errors in the recorded run | None | `errors: []` in the browser record |
| Source HTML/CSS freeze and forbidden JavaScript patterns | Passed | `evidence/source-checks.json` |
| Nu HTML validation of all six source pages and generated DOM | No messages | `evidence/html-validation.json`; `evidence/generated-html-validation.json` |

Browser checks were rerun on 23 October 2026 using Microsoft Edge. Tests are development tools and are not loaded by the site. Set `VERIFIED_ON=YYYY-MM-DD` when recording a run for a specific local date; otherwise the checks use Asia/Qyzylorda time. Pure logic tests use fixed date fixtures intentionally.

## Contribution boundary

Catalogue filtering and the complete request form are Temirlan's two substantial page features. The cart is an additional complete selection/calculation flow and the common site feature. Teammates' Contacts reviews and other page features are not implemented in this contribution. There are no existing login or booking pages to extend.

Tags identify the actual milestones; commit dates remain genuine. The separate requirement for every team member's meaningful commits across three days is not claimed as fulfilled by this one contribution. Submission of the entire team must also include the remaining members' work.

The AI log remains excluded at the user's explicit request. That artifact is required by the assignment and is absent; functional verification cannot establish compliance with the assignment's separate AI/authorship policy. No missing history or log is fabricated.
