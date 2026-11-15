# Lido modern store implementation plan

**Goal:** Redesign the existing seven-page Lido site and complete useful shopping interactions while keeping understandable HTML, Bootstrap, JavaScript and jQuery.
**Authorization:** The user explicitly states their teacher now permits redesign and new features and asks to proceed. This supersedes the earlier repair-only scope. They retain a separate cart.html. Implementation choices are delegated; continue inline without another approval cycle.
**Design:** Warm white surfaces, forest-green identity, lime accents, editorial Home headline, sourced product photography, compact consistent navigation and responsive cards. Keep the seven URLs, existing catalogue, local cart data, forms and student attribution. No invented live availability, discounts, reviews, payment or online order success.
**Approach:** Extend existing buildless pages and scripts. A framework rewrite adds unnecessary learning burden; cosmetic-only repairs would not meet the latest request. Existing local catalogue images are sufficient; no new image service or dependency is needed.
**Architecture:** site.css provides shared visual rules; static HTML retains landmarks/forms; home.js builds categories/budget/featured links; products.js adds image cards, native-dialog quick view and favourite filtering. favourites.js owns validated local persistence; store.js retains cart calculations. main.js owns common navigation state.

- [x] Preserve the current working copy in tmp/lido-before-redesign-20261115.zip; implement/test favourites persistence including corrupt and blocked storage.
- [x] Update the shared shell, Home, catalogue and other pages with the same design. Keep source attribution available in explicitly labelled product details.
- [x] Add favourite filtering, global search via q URL parameter, and keyboard-accessible product details with working Add/enquiry actions.
- [x] Check old shopping/form flows plus new interactions, two browsers, 375/768/1366 widths, console, focus, screenshots and local Nu source/rendered validation. Request an independent read-only review and fix important findings.

## Review focus

Preserve focus across catalogue rerenders and modal closure; handle empty favourite/filter combinations; do not silently treat blocked storage as durable; avoid duplicate full cart UI; keep important actions reachable on mobile; use only recorded product information; preserve all existing forms and their local-only behaviour.

## Execution ledger

- Backup created before editing. Working tree includes earlier authorized repairs and user settings; no reset, pull or overwrite of those changes.
- Keep the existing visible checkout and branch. Publishing and the final tag are not requested by this message.
- Favourites unit checks observed red before the module existed, then passed persistence, valid IDs, duplicates, corrupt JSON and blocked-storage cases. Existing catalogue/cart/request logic and syntax checks passed.
- Extended browser suite first failed on absent product photos. After implementation, Edge and Chrome passed new favourites/reload/cross-tab/global-search/dialog actions plus the existing cart, budget, delivery/contact/request, seven-page layout and console scenarios at 375/768/1366 px.
- Independent read-only review found no important defects; one minor exact-opener focus issue was corrected. Chrome regression and a focused modal check subsequently passed; dialog fits all three widths and returns to the actual image/Details opener.
- Local Nu 26.11.14 reports no errors or warnings in seven source pages and seven generated page documents. No HTML contents were uploaded externally.
- Inspected real screenshots of the revised pages and mobile product dialog. Existing 50 local product photographs are reused with lazy loading. No stock, discounts or successful real orders are invented.
- Local preview started at http://127.0.0.1:8766/index.html and returned HTTP 200. App preview opening was queued; actual page availability is independently verified. Preview process retained for user inspection.
- Physical phone testing and remote publication remain unperformed. Current changes stay in the existing visible workspace.
