# Validation record

Checked on 2026-09-13. Current scope: Saparali's delivery, contacts and colophon pages.

## W3C Nu Html Checker

The simplified delivery and colophon sources were pasted into the official
[W3C Nu Html Checker](https://validator.w3.org/nu/#textarea) and checked again
after removing the form. A temporary server disconnect was resolved by reopening
the checker. Both current files returned zero errors and warnings with vnu 26.9.9.
Contacts is unchanged from its successful check earlier the same day.

The final result for each file was:

> Document checking completed. No errors or warnings to show.

The input sources were compared with the local files by character counts and
FNV-1a hashes. The new delivery source contains the telephone link and no form.

| File | Characters | FNV-1a | Errors | Warnings |
| --- | ---: | --- | ---: | ---: |
| `Grocery/delivery.html` | 3857 | `177cf70e` | 0 | 0 |
| `Grocery/contacts.html` | 4702 | `efdf64da` | 0 | 0 |
| `Grocery/colophon.html` (before final paragraph removal) | 3433 | `b2940314` | 0 | 0 |

## Current browser and file checks

- Reloaded the local delivery page in Safari and inspected its appearance.
  The phone link and four steps replaced all former controls and fieldset boxes.
- Verified the main call link points to `tel:+77479052505`. No call was placed.
- Followed both `#call` and `#steps` links and confirmed their local URL fragments.
- Checked the new colophon source and its escaped telephone-link example.
- Checked unique IDs, all local file and fragment links, all-six-page navigation,
  one h1 per page, heading order, document metadata, semantic skeleton and authorship comments.
- Confirmed no form, input, select, textarea, button, fieldset, script, style or
  inline event handler remains in the three new pages.
- Confirmed three distinct photographs remain across delivery and contacts.
- Current visible word counts: delivery 229, contacts 211, colophon 206.
  Main-area counts: 200, 182 and 177. Counts include labels and captions where present.
- Regenerated TAG_CHECKLIST.md from current source positions. Removed elements
  are marked missing instead of pointing to deleted lines or escaped examples.

Earlier form submission/reset checks apply only to the archived version:
`../WEB_before_phone_20260913_224839.zip`. They do not describe the current site.

## Limits

The required assignment form is now missing at the student's request. W3C success
only checks HTML and does not mean the assignment's content, authorship, evidence,
report, photo ownership or commit-history requirements are satisfied.

The teammate's existing pages have not been edited or certified in this revision.
Their known assignment and markup gaps remain in README. The local Git history
could not be fetched because shell DNS resolution failed; any browser uploads
are recorded in the repository's GitHub history. No assignment submission or
message to the shop was made.

The student then removed one complete paragraph from colophon. Its final file has
3205 characters (FNV-1a `00f020ea`). The deletion preserves the HTML nesting;
the W3C result above refers to the preceding version. Checklist lines were updated.
