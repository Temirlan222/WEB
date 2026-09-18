# Assignment 2 CSS checklist

Student: Temirlan

Line numbers are 1-based and refer to the current saved files. They must be updated if the HTML or CSS is edited.

## Selectors

| Requirement | Evidence | File | Line | Author |
| --- | --- | --- | ---: | --- |
| Type selector | `body` | `css/base.css` | 15 | Temirlan |
| Class selector | `.site-header` | `css/base.css` | 58 | Temirlan |
| ID selector | `#main-content` | `css/base.css` | 127 | Temirlan |
| Descendant selector | `.site-nav a` | `css/base.css` | 97 | Temirlan |
| Child selector | `.site-nav > .nav-list` | `css/base.css` | 84 | Temirlan |
| Adjacent sibling selector | `h2 + p` | `css/base.css` | 143 | Temirlan |
| Grouping with commas | `h1, h2, h3` | `css/base.css` | 26 | Temirlan |
| Attribute selector | `a[target="_blank"]` | `css/base.css` | 206 | Temirlan |
| Universal selector | `*` | `css/base.css` | 11 | Temirlan |
| `:hover` | `.site-nav a:hover` | `css/base.css` | 109 | Temirlan |
| `:focus` | `.site-nav a:focus` | `css/base.css` | 110 | Temirlan |
| `:first-child` | `.site-nav li:first-child` | `css/base.css` | 104 | Temirlan |
| `::before` | Navigation marker | `css/base.css` | 104 | Temirlan |
| `::after` | External-link text | `css/base.css` | 206 | Temirlan |

The less obvious universal, descendant, child, adjacent sibling, attribute, structural pseudo-class and pseudo-element selectors have comments beside their rules.

## Classes and IDs

| Requirement | Evidence | File | Line | Author |
| --- | --- | --- | ---: | --- |
| At least eight meaningful classes | `site-header`, `site-nav`, `nav-list`, `site-main`, `content-section`, `about-section`, `products-summary`, `opening-hours`, `website-summary`, `back-to-top` | `index.html` | 18 | Temirlan |
| Reused class | `content-section` is used by multiple sections | `index.html` | 35 | Temirlan |
| First unique ID | `page-title` | `index.html` | 20 | Temirlan |
| Second unique ID | `main-content` | `index.html` | 34 | Temirlan |
| ID reason comment | Unique page title | `index.html` | 19 | Temirlan |
| ID reason comment | Unique main region | `index.html` | 33 | Temirlan |

Each ID appears once per page. The same ID name may be used once on each separate page.

## Colours fonts spacing and alignment

| Requirement | Evidence | File | Line | Author |
| --- | --- | --- | ---: | --- |
| Palette of five colours with reasons | Palette comment | `css/base.css` | 3 | Temirlan |
| HEX colour | `#f7f3e8` | `css/base.css` | 17 | Temirlan |
| RGB colour | `rgb(35, 49, 43)` | `css/base.css` | 18 | Temirlan |
| RGBA colour | Section border | `css/base.css` | 134 | Temirlan |
| Named colour | `white` | `css/base.css` | 55 | Temirlan |
| First font family with fallbacks | Arial stack | `css/base.css` | 19 | Temirlan |
| Second font family with fallbacks | Georgia stack | `css/base.css` | 30 | Temirlan |
| `font-size` | Body size | `css/base.css` | 20 | Temirlan |
| `font-weight` | Body weight | `css/base.css` | 21 | Temirlan |
| `line-height` | Body line height | `css/base.css` | 22 | Temirlan |
| `letter-spacing` | Body letter spacing | `css/base.css` | 23 | Temirlan |
| `box-sizing` | Universal `border-box` | `css/base.css` | 12 | Temirlan |
| `margin` | Main content and auto centering | `css/base.css` | 123 | Temirlan |
| `padding` | Shared content sections | `css/base.css` | 133 | Temirlan |
| `border` | Shared content sections | `css/base.css` | 134 | Temirlan |
| Margin collapse explanation | Comment about section padding | `css/base.css` | 137 | Temirlan |
| Text alignment | Header centred text | `css/base.css` | 62 | Temirlan |
| Layout alignment | Flex navigation alignment | `css/base.css` | 88 | Temirlan |

## Cascade and specificity

| Requirement | Evidence | File | Line | Author |
| --- | --- | --- | ---: | --- |
| External stylesheet first | `base.css` link | `index.html` | 9 | Temirlan |
| Personal stylesheet second | `temirlan.css` link | `index.html` | 10 | Temirlan |
| Exactly one internal style block | Internal ID rule with explanation | `index.html` | 11 | Temirlan |
| Exactly one inline style | Inline colour with explanation | `index.html` | 38 | Temirlan |
| Specificity experiment weaker rule | `.product-information`, specificity `0-1-0` | `css/temirlan.css` | 88 | Temirlan |
| Specificity experiment winning rule | `.page-products .product-information`, specificity `0-2-0` | `css/temirlan.css` | 94 | Temirlan |
| Conflict resolved normally | More specific selector changes the border colour | `css/temirlan.css` | 95 | Temirlan |
| `!important` | Not used | `css/temirlan.css` | - | Temirlan |

## Flexbox

| Requirement | Evidence | File | Line | Author |
| --- | --- | --- | ---: | --- |
| Navigation flex row | `display: flex` | `css/base.css` | 85 | Temirlan |
| `flex-direction` | Navigation row | `css/base.css` | 86 | Temirlan |
| `flex-wrap` | Navigation wrapping | `css/base.css` | 87 | Temirlan |
| `justify-content` | Navigation main-axis alignment | `css/base.css` | 88 | Temirlan |
| `align-items` | Navigation cross-axis alignment | `css/base.css` | 89 | Temirlan |
| `gap` | Navigation spacing | `css/base.css` | 90 | Temirlan |
| Additional flex container on all pages | Shared footer | `css/base.css` | 211 | Temirlan |
| Additional container wraps | Footer `flex-wrap` | `css/base.css` | 214 | Temirlan |
| Items grow and shrink | Footer paragraphs `flex: 1 1 160px` | `css/base.css` | 234 | Temirlan |
| Personal flex container | Form buttons | `css/temirlan.css` | 67 | Temirlan |

## Grid

| Requirement | Evidence | File | Line | Author |
| --- | --- | --- | ---: | --- |
| Grid section | Product gallery | `css/temirlan.css` | 19 | Temirlan |
| `grid-template-columns` | Three-column definition | `css/temirlan.css` | 21 | Temirlan |
| `repeat()` | Repeats the column definition three times | `css/temirlan.css` | 21 | Temirlan |
| `fr` unit | Each column may grow to `1fr` | `css/temirlan.css` | 21 | Temirlan |
| `minmax()` | Minimum `180px`, maximum `1fr` | `css/temirlan.css` | 21 | Temirlan |
| Grid `gap` | Space between cards | `css/temirlan.css` | 22 | Temirlan |
| Spanning item | First card spans two columns | `css/temirlan.css` | 41 | Temirlan |
| Grid versus Flexbox explanation | Rows and columns comment | `css/temirlan.css` | 18 | Temirlan |

## Positioning float and centering

| Requirement | Evidence | File | Line | Author |
| --- | --- | --- | ---: | --- |
| `position: static` | Navigation remains in normal flow | `css/base.css` | 78 | Temirlan |
| `position: relative` | Product card contains its badge | `css/temirlan.css` | 34 | Temirlan |
| `position: absolute` | `Popular` badge | `css/temirlan.css` | 46 | Temirlan |
| `position: fixed` | Back-to-top link | `css/temirlan.css` | 57 | Temirlan |
| Floated image inside a paragraph | Store photo | `index.html` | 39 | Temirlan |
| `float` | Store photo floats left | `css/temirlan.css` | 8 | Temirlan |
| `clear` | Content after the photo starts below it | `css/temirlan.css` | 15 | Temirlan |
| Explanation of missing clear | Required comment | `css/temirlan.css` | 13 | Temirlan |
| Centering technique 1 | Main column uses `margin: 0 auto` | `css/base.css` | 123 | Temirlan |
| Centering technique 2 | Flexbox centres form buttons | `css/temirlan.css` | 66 | Temirlan |
| Centering technique 3 | Grid centres the quotation | `css/temirlan.css` | 81 | Temirlan |

## Restrictions and validation

| Check | Result |
| --- | --- |
| CSS frameworks or libraries | None |
| Downloaded stylesheets or templates | None |
| JavaScript | None |
| Media queries | None |
| Extra inline styles | None; exactly one inline demonstration exists |
| `!important` declarations | Zero |
| W3C HTML validation | Six pages, zero errors and zero warnings on 18 September 2026 |
| W3C CSS validation | Two stylesheets, zero errors and zero warnings on 18 September 2026 |
| Git history | Multiple team commits across 12, 13 and 18 September 2026 |

## Process evidence still supplied by the student

- Signed and dated photograph of the hand-drawn layouts for two pages.

The `evidence` folder contains before-and-after screenshots of the home and products pages. The before screenshots were rendered from the final Assignment 1 commit, before CSS was added.
