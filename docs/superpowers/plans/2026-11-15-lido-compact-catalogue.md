# Compact Products and visual Prices

User feedback: Products is too long and should collapse; Prices looks like a database table. Scope stays on these two pages and their checks. Keep the existing seven-page shell, catalogue data, recorded prices, cart, favourites and forms.

Implementation choice: show eight matching products initially, reveal eight more at a time, and offer Show fewer after expansion. Filter the complete 50-item catalogue before applying this visible limit. Cart/favourite changes must preserve the expanded limit; an explicit search/category/sort/reset starts at eight. Focus the first newly revealed product and return to the results on collapse.

Prices becomes a visual price guide: compact horizontal cards with photograph, product name, unit, prominent price and an internal link to that product in Products. Search, category chips and ascending/descending price sort operate on all 50 entries. Show eight initially with the same progressive disclosure. Keep the existing price-table anchor for old links, but remove the table and redundant table-oriented copy. No invented discounts or external product redirects.

- [x] Add failing regression checks for initial size, expansion/collapse, full-data filtering, prices filters and internal links.
- [x] Implement Products disclosure while retaining cart/dialog/favourite focus behaviour.
- [x] Replace Prices markup/script and add limited page-specific styling.
- [x] Run browser regression, inspect narrow/wide screenshots and validate source/rendered HTML locally.

Verification, 15 November 2026: the new regression first failed with 50 initial
products instead of 8. After implementation, Chrome and Edge each passed the
shopping flow, filtering, expansion/collapse, forms, downloads, shared state,
console and seven-page layouts at 375/768/1366 px. The dialog focus assertion
now waits for the asynchronous close event before checking the same expected
trigger; no dialog behaviour change was needed. Logic, catalogue-data,
favourites and final-source checks passed. Nu 26.11.14 reported no messages
for source and generated Products/Prices HTML. Inspected Chrome Prices at
375/1366 px and collapsed Products at 1366 px. A separate read-only review
found no important actionable issue. Physical phone testing was not performed.
