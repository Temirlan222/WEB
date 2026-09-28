# CSS rules replaced by Bootstrap

Scope: `contacts.html` and `colophon.html`. These pages no longer load `css/base.css`; the old file remains in the repository for the earlier assignment and was not edited here.

| Former rule or job | Bootstrap replacement |
| --- | --- |
| `.page-contacts .site-main`, `.page-colophon .site-main` top padding | `container py-4` |
| `.back-to-top` fixed position, custom padding and colours | `btn btn-outline-success btn-sm d-none d-md-inline-block ms-3 mb-3` |
| `.site-header` padding and alignment | `container-fluid py-4 text-center text-md-start` |
| `.site-main` width and automatic margins | `container` |
| `.site-nav > .nav-list` hand-written flex navigation | `navbar navbar-expand-lg`, `navbar-nav`, `nav-item`, `nav-link`, `gap-lg-3` |
| `.site-footer` hand-written flex layout | `container-fluid`, nested `container row g-3` and responsive `col-*` |
| Generic `table`, `th`, `td` styling | `table table-bordered table-striped align-middle` |
| Generic button borders and padding | `btn` with `btn-success`, `btn-outline-success`, `btn-secondary`, `btn-sm`, `disabled` |
| Manual image sizing | `figure-img img-fluid rounded shadow-sm` |
| Manual heading sizes and spacing | `display-5`, `h3`, `lead`, `fw-bold`, spacing utilities |

`css/shalkar.css` now contains only the brand colours. Bootstrap provides all layout, spacing, navigation, button and responsive rules for these two pages.
