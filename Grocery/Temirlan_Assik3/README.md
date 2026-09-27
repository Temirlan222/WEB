# Temirlan Assignment 3

Scope: **Home and Products only**. HTML and CSS remain in the existing Grocery folder: `../index.html`, `../products.html`, and `../css/temirlan.css`. This folder groups the supporting documents, four required screenshots, and validation results. Other pages are outside Temirlan's Assignment 3 responsibilities.


Only `../index.html` and `../products.html` were migrated. Both load Bootstrap 5.3.8 CSS and its JavaScript bundle through CDN, followed by `../css/temirlan.css`; neither loads the old `base.css`. No custom JavaScript or build tools are required. Open the HTML files directly; an internet connection is needed for the CDN.

The existing content and sections remain. Bootstrap supplies containers, responsive rows/columns, a collapsing navbar, product cards, form controls, typography and buttons. The local product-request demonstration has a disabled submit button because it has no sending service; Reset works, and store contact links remain available.

Both pages were checked in Edge at 375, 768 and 1366 pixels, with no horizontal overflow, working menu open/close, all images loaded, and valid local navigation targets. Existing page text was compared against the saved original. Four required screenshots are in `evidence/`: `products-375.png`, `products-768.png`, `products-1366.png`, and `navigation-375-collapsed.png`.

See `css-replacements.md` for deleted CSS and Bootstrap replacements, and `assignment3-audit.md` for the criterion audit and remaining course requirements.

Local Nu HTML Checker 26.9.27 (0788818) reported zero errors for both updated pages. After removing the temporary placeholder article from Home at the owner's request, both pages have zero warnings. Results are in `evidence/html-validation.json`. The HTML was validated locally, without uploading it to a public validator.

References: [Bootstrap CDN](https://getbootstrap.com/docs/5.3/getting-started/introduction/), [Cards](https://getbootstrap.com/docs/5.3/components/card/), [Navbar](https://getbootstrap.com/docs/5.3/components/navbar/).
