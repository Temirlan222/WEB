# Temirlan midterm contribution

Author: Temirlan. Scope: `../index.html`, `../products.html`, and `../css/temirlan.css` only.
Repository: https://github.com/Temirlan222/WEB

## Pages

- Home: introduction, team photograph, product overview, opening hours, address, map and telephone.
- Products: three photo cards, categories, department descriptions, team visit quote, request form and result area.

Both pages use Bootstrap 5.3.8 CSS through CDN. Native details/summary opens the phone menu. There are no scripts on these pages.
The two pages share their header, six navigation links, footer, title pattern and correction stylesheet.
The other four pages belong to other contributors and were not edited for this contribution.

## Three visitor journeys

1. Plan a visit: open Home -> choose Opening hours -> read the 24-hour schedule -> use the footer address and map link. End: the visitor knows where and when to visit.
2. Explore products: open Home -> choose Browse products -> inspect the photo cards -> choose Product categories -> read department descriptions. End: the visitor identifies the relevant department. View prices also leads to the existing teammate page.
3. Prepare a request: open Home -> choose Prepare a product request -> complete required fields -> choose Check request -> reach Request result. End: the result explains that no enquiry was sent and offers the telephone number or a link to the opening hours. A real shop reply, payment or delivery approval is not needed to complete this local path.

## Form behaviour

Native HTML required/type/min/max validation checks the fields. An accepted GET opens `products.html#request-result`; field values appear in the URL and are not sent to Lido. CSS :target reveals the existing result paragraph. The form does not claim to book, buy, save or send anything.
Reset restores the form defaults. The visible result area is present before submission.

## Prepared hooks

The form and both buttons have ids. Inputs, radio buttons, checkbox, select and textarea have matching labels and ids. Product cards and navigation links have ids. Empty `request-summary`, `request-confirmation` and `request-error` containers are ready for later messages. State classes `hidden`, `active`, `selected`, `error` and `success` already exist.

## Files for submission

- This README: page scope and three journeys.
- `quality-pass.md`: findings, fixes and recorded checks.
- `screenshots/`: Home and Products at phone, tablet and desktop widths, plus phone navigation.
- `Temirlan_Midterm_Report.pdf`: short descriptive report.

Team members still need to review each other's pages at least two days before the deadline and commit from their own accounts across the required days. This contribution does not claim that a team review has already happened.
