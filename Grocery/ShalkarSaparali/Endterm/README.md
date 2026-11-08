# Endterm - Contacts and About this site

Scope: Saparali Shalkar's existing contacts.html and colophon.html, in the same Lido repository. Existing Home, Products, shared cart, Cart and Delivery are preserved. This contribution is integrated from the current Git account, not falsely attributed to Shalkar's account. Each student remains responsible for personal commits and live defense.

## New functionality since Assignment 6

Contacts: the former form only validated and displayed a fixed thank-you. It now prepares a safe, retained summary (name, email, phone, topic, question), resets the form after successful checks and downloads that summary as a local UTF-8 text file. Editing invalidates the previous summary; Reset clears errors, selected-topic state and downloads. The visitor can finish preparing a question alone without a server or unverified recipient. No message is sent and no personal fields are saved in localStorage.

The existing review translation, helpful state, topic selection and phone copy are retained. Clipboard denial leaves the actual number visible for manual use. The unverified email draft link now opens the question form, and the disabled email button becomes a working explanation link. Adjacent field errors are associated using aria-describedby. Names, required values, limits, email, phone digits and the live checkbox state are checked. Trimming on submit avoids deleting spaces while the visitor types.

About this site: a plain-JavaScript guide creates six real page links and descriptions from an array. Search filters page names/purposes, shows a calculated count, handles no results and resets. The existing phone-link example can be collapsed or expanded. Outdated text saying there is no custom JavaScript is corrected at runtime.

## Implementation / criterion audit

| Requirement | Location / result |
| --- | --- |
| Plain JavaScript, arrays, loop, parameters/return, conditions/calculation | js/site-guide.js: page data array, make(), matchingPages(), renderPages(), loop, calculated count, empty-state condition and native events |
| jQuery in a separate file | js/contacts.jquery.js; CDN jQuery 3.7.1 full loaded first; ready wrapper |
| Events and delegation | click, input, change, submit, reset; topic and phone handlers delegated to stable containers |
| Selectors / traversal / chains | ID/class/tag/attribute/checked/not selectors, find/closest/parent/siblings/each and $(this); explained topic-selection chain |
| Purposeful effects | fadeToggle review, slideDown/slideToggle form, fadeIn success; timed callback focuses successful result |
| Main form validation | preventDefault; trim on submit; per-field errors, email/phone/required/length/checkbox rules; live correction; reset only after success; safe text summary |
| Completed visitor journey | Search -> real page; question -> errors or reviewed text -> local download; phone -> copied number or explicit manual alternative |
| Freeze | Source Contacts/About match midterm except added deferred scripts; shalkar.css unchanged; controls generated in JS; no inline handlers |
| Real content | Existing address/phone/review/source dates and own storefront photo retained; page descriptions reflect real local features; no made-up stock or email recipient |
| Preservation | Existing main.js cart block unchanged; Contacts block moved to its own script; Home/Products/Cart/Delivery unchanged |
| Console/responsiveness/menu | Both pages at 375/768/1366, expanded mobile menus, no overflow/broken images/duplicate IDs/page-console errors |
| HTML | Source plus generated DOM validated with Nu: zero messages |

All UI DOM of Contacts is handled with jQuery; clipboard and Blob/URL are browser APIs for copying/downloading. About guide DOM/events use native JavaScript. No new library, page, CSS rule, backend, payment, admin workflow or report was added. Original vanilla Contacts comparison remains in old-js-version.js and is never loaded. No vanilla About history was fabricated.

Run: node tests/shalkar-endterm-browser.cjs; node tests/endterm-source.cjs; node tests/endterm-browser.cjs; node tests/endterm-effects.cjs; node tests/logic.cjs. Browser checks use Playwright + Edge; detailed local evidence is in tmp/shalkar-endterm. checks.json records actual checks on 8 November 2026.

Quality findings fixed: old form had no usable retained output; copy failure could hide the number; reset did not clear topic state; input-time trim prevented natural spaces; About said no custom JavaScript; generated topic div needed role=group for its aria-label. Each was checked in source/browser/validator as applicable.

## Submission and limitations

Repository: https://github.com/Temirlan222/WEB . Final endterm tag includes this continuation; previous Temirlan-only endterm snapshot is preserved as endterm-temirlan. No PDF report or recording is required by the document. Demo the guide search/reset, topic delegation, invalid/corrected form, safe summary/download, review effects and copy-denied feedback.

Code was developed with AI assistance at the user's request; the document's no-AI-code rule is not represented as satisfied. A separate AI log stays excluded under the prior user instruction. Four commits across three days from Shalkar's own account, teammate review at least two days before the unknown deadline, and personal defense remain student responsibilities; no dates/authors were fabricated.
