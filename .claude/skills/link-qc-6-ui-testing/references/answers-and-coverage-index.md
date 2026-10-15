# Answers → bugs and Coverage-Index.md (Step 9)

Loaded from Step 9 of SKILL.md.

## Step 9 — Answers → Bugs

The Open Questions are how the project's real intent gets captured. When the
user answers them — in the same session or a later one — do both of the
following.

### 1. Act on each answer
- **"It should match / that's wrong"** → write it up as a full bug, exactly
  like any other (Step 8 structure, its own evidence crop). Its Expected Result
  cites the answer: *"Confirmed by the product owner on <date>: toolbar buttons
  use 16px horizontal padding."* Confidence is `High` — intent is now stated,
  not inferred.
- **"It's intentional"** → not a bug. Say so briefly and list it under
  Correctly Implemented with the answer as its source.
- **"Don't know / ask the designer"** → leave the question open, carry it
  forward to the next report unchanged, and note it's still outstanding.

Update the report in place: move answered questions out of Open Questions and
into either the bug list or Correctly Implemented, so the section only ever
holds what's still unanswered.

### 1b. Keep `Coverage-Index.md` — which screens have been audited at all

A per-page report answers "what's wrong with this page". Nothing answers
**"which pages have we never looked at?"** — so maintain
`<base>/UI-Testing/Coverage-Index.md` as the register of the whole product.

**Build the candidate list from the app itself**, not from memory:
- the route definitions in the codebase (the most complete source),
- the navigation menu of the running app,
- the frames in the design file, if there is one.

Keep the derived list as the denominator (no confirmation is asked; a screen found later is added with its source).

```markdown
# Coverage Index — UI audit status per screen

Every screen in the product. A screen with no row has never been considered;
a row marked "Not audited" has been identified but not yet covered.

| Screen | Route | Languages | Status | Last audited | Report | Open bugs |
|---|---|---|---|---|---|---|
| Dashboard | `/dashboard` | EN, AR | Audited | 2026-09-12 | [report](./Reports/UI-Visual-QA-dashboard.md) | 4 |
| Listing | `/items` | EN | Partially audited — AR not covered | 2026-09-12 | [report](…) | 2 |
| Item details | `/items/:id` | — | **Not audited** | — | — | — |
| Settings | `/settings` | — | **Not audited** | — | — | — |

**Screens audited: 2 of 4.**
```

Update the row the moment a page's report is written, and re-confirm the screen
list whenever the app gains routes. When the user asks what's been covered,
this file is the answer — and the "2 of 4" line is the honest headline, not the
number of reports produced.
