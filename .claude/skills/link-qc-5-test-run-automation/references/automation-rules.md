# Automation rules — expected results, assertions, modifiers, waits, repairs, coverage

Loaded by `SKILL.md` from `<source_of_truth>`, `<test_modifiers>`, `<wait_policy>`, `<first_run>`
and `<coverage_measurement>`.

> Policy: constitution "Quality Control" article (the `qa_standards` file) — QC-1, QC-3, QC-4,
> QC-8, QC-9, QC-11. This file holds tool mechanics and applies those rules; it does not restate
> them.

---

## 1. Where an expected result may come from

> Policy: constitution "Quality Control" article QC-1 (code, observed behaviour and notes never
> settle an expected result; precedence spec → article → approved test plan → research.md) and QC-9
> (expected results come from approved requirements and cases, never from current application
> behaviour; an unanswered ambiguity is an `@unverified-assumption`, excluded from confirmed
> coverage, never an application bug). This skill applies it and does not restate it.

Mechanics: an **explicitly approved clarification** is a `PHASE 2.4` answer the user actually
gave in this invocation. Application code and observed behaviour (a live run, a Playwright
pass) are evidence that may *form* a question, never authority that settles an expectation.
Where an approved TC
and its requirement disagree, say so in `### Deviations` with both wordings, automate the
requirement-consistent reading only if the user confirms it, and otherwise park the TC as an
open question. Exploratory checks automated on the best-evidenced reading are tagged
`@unverified-assumption`, with the assumption stated in the spec and the report, and are
counted as *Assumed* (§6).

---

## 2. Assertion quality

> Policy: constitution QC-9 (meaningful assertions — never literal vs literal, never
> visibility-only unless visibility is the requirement; a test covers its criterion and would
> fail if the behaviour broke). This skill applies it; the points below are how the validator
> and the semantic review judge it.

- **Reject obvious placeholders** (validator `placeholder-assertion`, `empty-test-body`,
  `no-assertions`): an assertion comparing literals (`expect(true).toBe(true)`), an empty test
  body, a test that asserts nothing at all.
- **Never ban a matcher by name.** `toBeTruthy()`, `toBeDefined()` and friends are legitimate on a
  real subject. What makes an assertion a placeholder is that it cannot fail for any state of the
  application — not the matcher it uses.
- **Recognise valid assertions in approved helpers and page objects.** An assertion inside an
  invoked page-object method counts (`assertions-call-found`). Never report a test as
  assertion-free from a direct-call search of the spec alone.
- **Repair a weak assertion whenever you find one**, even if the weighted coverage number already
  meets its target. Coverage is an aggregate; this is a defect in one test.

---

## 3. Modifier policy — `only`, `skip`, `fixme`, `fail`, `slow`

> Policy: constitution QC-9 (`test.only` is never committed; every skip / fixme / fail carries a
> traceable reason; skips and unknown outcomes are never PASS). The table is the status-model
> and validator treatment of each modifier.

Applies to every form: bare (`test.skip()`), conditional (`test.skip(cond, 'reason')`) and
suite-level (`test.describe.skip(...)`).

| Modifier | Policy |
|---|---|
| `only` (and `fit`, `describe.only`) | **Never committed.** It silences every other test in the run, so a green result would be meaningless. This is not exemptible. |
| `skip` | Allowed with a reason that traces to a PHASE 2.6 readiness decision, an approved requirement, or an honoured exception. Counts as `SKIP`, never as a pass. |
| `fixme` | Allowed with a reason. A known-broken test that must not be read as a pass. |
| `fail` | Allowed with a reason. An **expected failure**: reported in its own row, never merged into the pass count, and it fails the run if it unexpectedly passes. |
| `slow` | Allowed with a reason. It **extends the timeout**; it does not skip anything. Never report a `slow` test as skipped, and never use it to paper over an unexplained slowdown. |

**Targeted runs are preserved** — that is what the runner's own filters are for:
`--grep` / `--grep-invert`, `--project`, `--last-failed`, `--repeat-each`, `--workers` — on the one
shared config. Use those. Never edit a test file to focus a run, and never reach for `--config`.

**A missing prerequisite must stay visible.** A skipped or blocked test is reported against the
original scope with its reason, in the run file, the report's phase section and the chat summary. It is never
removed from the scope, never counted as a pass, and never allowed to disappear from the totals.

---

## 4. Wait policy — specs, page objects, fixtures and helpers alike

> Policy: constitution QC-9 (bounded readiness checks — no `networkidle`, no fixed sleeps
> without a stated reason, every wait bounded by its step deadline, timeouts from one timeouts
> file; never raise a timeout to hide a failure). This skill applies it and does not restate it.

Mechanics: the validator runs `wait-for-timeout`, `bare-set-timeout` and `wait-network-idle` in
every layer passed in `--files` — a fixed wait moved from a spec into a page object is the same
fixed wait in a different file. A justified timer (retry backoff, a debounce the UI genuinely
has, an explicit timing requirement) states its reason on the line above or in a `qa-allow`, so
it appears in the report as `justification-comment` / an exception instead of a lazy sleep.
Readiness is an observable condition (web-first assertion, `waitForURL`, `waitForResponse`, a
page-object state) or bounded polling (`expect.poll`, `toPass({ timeout })`); the step deadline
(`helpers/steps.ts`) bounds every wait, a loader that outlives it IS the timeout the step
reports ("loader still visible"); every value — test budget, step deadline, action, navigation,
expect, hook, named `operations.*` — is imported from `timeouts.ts`. `references/code-craft.md`
§9 holds the values and the calibration rule.

---

## 5. Repair records

Every repair is recorded in the Heal Log with all nine columns. No column is optional; `n/a` with a
reason is an acceptable value, a blank is not.

| Column | Content |
|---|---|
| 1 TC-ID | the test case this repair affects |
| 2 Affected test / files | the test title and every file changed, as `file:line` |
| 3 Defect category | `selector_failure` · `assertion_failure` · `evidence_failure` · `timeout_failure` |
| 4 Previous value | the exact old locator, assertion or expected value |
| 5 Updated value | the exact new one |
| 6 Reason | why the new value is correct |
| 7 Approved-requirement reference | REQ/AC/TC id or the approved clarification. **Required** for any assertion or expected-value change; `n/a` for a pure locator repair |
| 8 Verification performed | which checks were re-run (validator rules, project lint, semantic re-review) |
| 9 Rerun result | the tests re-executed and their outcome, or `not re-run — reason` |

Rules:

- **Locator repairs must preserve the intended element and behaviour.** Re-confirm the new selector
  against the source before changing it; a locator that matches a *different* element is a new
  defect, not a fix.
- **Assertion and expected-value changes need requirement evidence.** Column 7 is how that evidence
  is shown. No evidence → the issue is recorded **unresolved**; never invent a repair.
- Everything else about what a repair may and may not do (no weakened assertion, no deleted
  coverage, no suppressed error, no unjustified skip, no application setting or product-code
  change, a requirement change is an explicit test update) is constitution QC-9 — applied, not
  restated here.

---

## 6. Traceability, coverage and execution — three different numbers

> Policy: constitution QC-4 (design coverage, automation coverage and execution results are
> three separate measures, each with numerator and denominator; a zero denominator is N/A) and
> QC-11 (the automation-coverage formula, target and enforcement from the configuration table;
> execution results reported per phase and never merged with a coverage figure). This skill
> applies it; the artifacts below are where each number lives.

| Figure | What it answers | Where |
|---|---|---|
| **Requirement outcome coverage** | Are each requirement's required outcomes actually asserted? `Full` / `Partial` / `Missing` / `Assumed` | `### Coverage`, with the requirement ID on every row |
| **TC automation coverage** | How much of the approved TC document is automated? The weighted % of PHASE 2.5 | The PHASE 2.5 gate — target, source and override path |
| **Execution pass rate** | Of what ran, how much passed? | `### Second Run — Results` |

**Traceability is not coverage.** A requirement linked to one test is *traceable*; whether that test
asserts the requirement's outcomes is a separate judgement (checklist item 7). A link plus a
visibility assertion on a calculation requirement is `Partial`, not `Full`.

**IDs come from upstream.** Validate every referenced requirement ID against the resolved sources
(the feature's `spec.md`, the approved test plan's traceability matrix, the approved TC
document). Report an ID you cannot resolve. **Never invent, derive or renumber a requirement ID
during automation** — spec.md owns requirement IDs and the test-case document owns TC IDs.

**Requirement IDs belong in the artifacts.** `coverage-summary.csv`, `coverage-detail.csv`,
`manual-scenarios.csv`, the Coverage section and `.runs/phase-{N}.json` each carry the requirement ID(s)
for every row, so Requirement → TC → automated test → execution result is mappable end to end.

**Keep the gaps visible.** Missing, partial, blocked and unexecuted coverage each keep their own
count. Extend the existing reports; do not replace them.

### Carrying forward the document's TC validation states

> Policy: constitution QC-8 defines the states (`validated` / `enhanced` / `inferred` /
> `discrepancy` / `not-implemented` / `draft`) and when each applies; QC-13 says `inferred` or
> `draft` never counts as execution evidence. Live validation is skill 3c, run by
> /speckit.implement before this skill; a document that was never validated live is all `draft`,
> which is normal and never a reason to ask for it.

Those labels were true when they were written and **may now be stale**:

- Handle them per constitution QC-9 / QC-13 (applied, not restated): re-verify readiness where
  you can; a genuinely unavailable implementation is `pending / not covered for this run` (not a
  failure, not an application defect); investigate a draft or unvalidated TC before classifying
  its failure.
