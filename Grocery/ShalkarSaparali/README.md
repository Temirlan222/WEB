# Assignment 3 — Saparali Shalkar

Scope: **Contacts** and **About this site** only. The original pages remain at `../contacts.html` and `../colophon.html`; their stylesheet is `../css/shalkar.css`. No page was added or rebuilt from scratch.

Both pages load Bootstrap 5.3.8 CSS and its JavaScript bundle from a CDN. The bundle operates the collapsing menu; there is no custom JavaScript. `shalkar.css` is a short correction layer for the site's green and cream colours. These two pages no longer load the old `base.css`.

## Assignment 3 checks

| Requirement | Where it is used |
| --- | --- |
| CDN and version comment | Both HTML files, in the head and before the bundle |
| `container` and `container-fluid` with comments | Main/nav content and full-width header/footer |
| Three responsive grid blocks | Contacts details/hours, nested address/photo row, review/payment row; About sections |
| Nested row | Address/photo row inside the Contacts details column |
| Phone/tablet/desktop | Checked at 375, 768 and 1366 pixels; no horizontal overflow |
| Collapsing navbar | Toggle button works on both pages below `lg` |
| Responsive display and alignment | Header, page title, photo, footer and Top link |
| Typography and buttons | `display-5`, `lead`, `h3`, `small`; real Call/Map/Top links and a disabled Email control |
| Ten or more utilities | `py-4`, `mb-4`, `g-4`, `fw-bold`, `text-center`, `text-md-start`, `bg-white`, `border`, `shadow-sm`, `d-flex`, `d-none`, `gap-2` and others |
| Bootstrap component | The alert on Contacts explains that no verified email is available; its adaptation is commented in HTML |
| Short CSS correction layer | `../css/shalkar.css`; removed rules are listed in `css-replacements.md` |

The four required screenshots are in `evidence/`: `contacts-375.png`, `contacts-768.png`, `contacts-1366.png`, and `navigation-375-collapsed.png`. They show the visible browser area at each width.

Both HTML files passed the **local Nu Html Checker 26.9.27 (0788818)** with zero messages. All local links and the photograph target exist. The mobile menu opened on both pages during browser checks.

Open `../contacts.html` or `../colophon.html` in a browser with internet access for the Bootstrap CDN. The pages also work through the existing site navigation.
