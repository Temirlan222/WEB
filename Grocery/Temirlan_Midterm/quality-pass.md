# Quality pass for Home and Products

Date: 5 October 2026. Author: Temirlan. Scope: Home, Products and their shared correction stylesheet.

## Findings and fixes

- Removing the Bootstrap bundle would leave the old phone menu closed. Replaced it with native details/summary, with Bootstrap utilities for the responsive layout.
- The two headers and page title patterns differed. Applied the same header, footer and title pattern to both pages.
- A student email looked like the shop's contact address. Labelled it as the website team's email; retained the shop telephone and real map link.
- The product request stopped at a disabled submit button. Added native required-field checking, a usable Check request control, a visible result area and clear next links. The result never claims that a message or order was sent.
- The form and its buttons lacked ids. Added those ids and ids for cards, navigation and action links, plus empty summary, confirmation and error hooks.
- State classes needed for later interactions were missing. Added hidden, selected, error and success; the current navigation uses active.
- Several category choices and image descriptions were too narrow. Added categories already described on the page and made the image descriptions more specific.
- Old menu-script comments and hidden separator elements were obsolete. Removed them from these pages.

## Recorded checks

- Local W3C Nu HTML Checker 26.9.27: both pages have zero errors and zero warnings. See `html-validation.json`.
- Edge with JavaScript disabled: both pages checked at 375, 768 and 1366 pixels. No horizontal overflow, missing images, scripts or console errors. See `browser-checks.json`.
- Native phone menu opens and closes; desktop navigation is visible at the desktop breakpoint.
- The three README journeys reach their described endpoints.
- The form rejects missing required values, accepts complete values, resets to defaults and navigates to its result anchor after checking.
- Local file and fragment targets exist; control labels are connected; ids are unique. See `link-checks.json`.
- No inline styling, inline event handlers or !important in the changed files. Correction CSS: 47 physical lines.

## Team review

The recorded checks above are technical checks on Temirlan's two pages. The required review by another team member at least two days before the deadline still needs to be performed and recorded by that person. The remaining four pages were not assessed or edited as part of this contribution.
