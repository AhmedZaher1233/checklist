---
name: "amend"
description: "Change an existing feature's specification in place (before planning, after planning, during implementation, or after delivery), or defer, cancel, or resume a feature; keeps the feature map in step and prepares the existing plan. Use instead of /speckit-specify when the input belongs to an existing feature."
argument-hint: "Feature ID and the change, e.g. '004 <the change in business language>', or '007 defer — reason', '007 cancel — reason', '007 resume'"
user-invocable: true
disable-model-invocation: false
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Changes to an existing feature's behaviour are made by **amending its spec in place**, never by a new spec that
overrides it. This skill edits the spec and the feature map and prepares the existing plan; it does **not** plan,
generate tasks, or write code.

## Rules

1. **Live spec.** The spec describes the feature's **current** behaviour, in business language only: no technology,
   services, APIs, data stores, events, or implementation terms. No change history in the spec (history lives in git
   and in the plan).
2. **Rewrite in place.** Changed stories and FRs are rewritten where they are; new ones take the next free number;
   numbers are never reused; removed items are deleted.
3. **Do not invent business behaviour.** If the change is unclear, ask (at most 3 questions) or mark at most 3
   `[NEEDS CLARIFICATION: …]` items.
4. **Never approve.** Only the business team approves; never write an Approved line yourself.
5. **One change.** If the input is a separate capability, stop and suggest `/speckit-specify` for a new feature.

## Workflow

### 1. Select the feature and the action

- Resolve `specs/<ID>-*/` from the feature ID; if missing or ambiguous, ask.
- Write `.specify/feature.json` with `{"feature_directory": "specs/<ID>-<name>"}`.
- Action: **change** (default), or **defer**, **cancel**, **resume** when the input says so. For defer, cancel, and
  resume go to step 8.

### 2. Load context

The feature's `spec.md`, `checklists/requirements.md`, `plan.md`, and `tasks.md` (if present); `specs/feature-map.md`;
`.specify/memory/constitution.md`; the rules in `.specify/templates/overrides/spec-template.md`.

### 3. Confirm the change belongs to this feature (Rule 5)

### 4. Propose (no file writes yet)

Show:

- each story / FR **added**, **changed**, or **removed**, with the new wording; changes to edge cases, entities,
  success criteria, assumptions, or Dependencies;
- the one-line business summary for the Amended line;
- the linked features from `specs/feature-map.md`: those that use this one (**Consumed by**) and those that share
  data or screens with it (**Related**). For each, say whether the change also changes **its** business behaviour;
  if it does, it is amended too and forms a **change set** with this feature (approved together). If it does not,
  say why in one line.

Ask the user to confirm, amend, or cancel. Write only after explicit confirmation.

### 5. Write the spec

- Apply the confirmed changes in place (Rules 1–2).
- If the spec was **never approved**: edit in place only — no Amended line; Status stays Draft.
- Otherwise: `**Status**: Draft`, remove the `**Approved**` line, add under `**Input**`
  `**Amended**: YYYY-MM-DD — [summary]` (keep earlier Amended lines). In a change set, end it with
  `(with ###, ###)` naming the other specs of the set.
- Re-run `checklists/requirements.md` against the amended spec.

### 5b. Architecture impact

If the change has an **Architecture impact** (an Architecture impact is anything the approved SAD does not cover yet: a new or changed building block,
external system, channel, or user group; a change to a technology, an ADR, or a cross-cutting rule (for example
showing personal data a rule does not allow)), set the architecture status in
`architecture/solution-architecture.md` as the spec template's ARCHITECTURE IMPACT step describes (Document History
row "Update required" with `###: [impact]`). No impact → change nothing in the SAD.

### 6. Update the feature map

- Spec → `Draft`.
- Delivery: `Implemented` → `Partially implemented`; other values stay. Mirror it in the Delivery line at the top of the feature's `plan.md` and `tasks.md` (if they exist) — same value and note as the feature map, with the
  note `Amendment YYYY-MM-DD pending` (e.g. `**Delivery**: Partially implemented — Amendment 2026-10-04 pending`).
- Notes: `Amendment YYYY-MM-DD pending` (if the spec was approved before); `Change set: ###, ###` for a change set.
- If Dependencies changed, apply the Dependencies steps of the spec template (Consumed by, Related, waves, delivery
  order, critical path, external dependencies).

### 7. Prepare the existing plan (only if `plan.md` exists)

`/speckit-plan` keeps an existing plan and does not copy the template again, so:

- If `plan.md` has no **Amendment Impact** section, insert it from `.specify/templates/overrides/plan-template.md`
  (before **Architecture Alignment**), with `**Amendment**: YYYY-MM-DD — [summary]` filled.
- If it already has one, add a new `**Amendment**: YYYY-MM-DD — [summary]` line under the existing ones (one line per
  amendment, the same summary as the spec's Amended line). Keep the earlier lines and table rows: `/speckit-plan`
  adds the rows for the new amendment; the rows of amendments already implemented stay as history.
- If `plan.md` has no **Test Design** section, insert it from the same template.
- Change nothing else.

Then go to step 9.

### 8. Defer, cancel, resume (business team decision)

| Action | Spec header | Feature map |
|---|---|---|
| defer | `**Status**: Deferred` + `**Deferred**: YYYY-MM-DD — Business team — <reason>` | Spec `Deferred`; removed from the waves, delivery order, and critical path; listed under "Deferred / Cancelled" in the delivery order |
| cancel | `**Status**: Cancelled` + `**Cancelled**: YYYY-MM-DD — Business team — <reason>` | Spec `Cancelled`; same removal; the spec folder and any built code stay as they are |
| resume | `**Status**: Approved` + a new `**Approved**: YYYY-MM-DD — Business team` line (spec unchanged) | Spec `Approved`; back in its wave |

For defer and cancel: add `Blocked by ###` to the Notes of every feature that depends on it, and tell the user that
the business team decides for each one: defer it too, or `/amend` it to drop the dependency. For resume: remove those
notes. Record the business team's decision only when the user states it.

### 9. Report and next steps

1. Spec path; what changed (or the new status); the change set, if any.
2. Feature map changes; plan sections inserted.
3. Next steps:

| Feature stage | Next steps |
|---|---|
| Changed — any stage | `/speckit-clarify` (if open points) → business team approves (the whole change set together) → `/architecture update` (whole approved scope) → then: |
| Not planned | `/speckit-plan` → `/speckit-tasks` → tech lead review → `/speckit-implement` → `/speckit-converge` |
| Planned, no task done | `/speckit-plan` (Amendment Impact) → `/speckit-tasks` (regenerates tasks.md) → tech lead review → `/speckit-implement` → `/speckit-converge` |
| Being implemented | **Stop implementing** → `/speckit-plan` (Amendment Impact) → `/speckit-converge` (adds a section) → tech lead reviews that section → `/speckit-implement` → `/speckit-converge` |
| Delivered | `/speckit-plan` (Amendment Impact) → `/speckit-converge` → tech lead reviews the new section → `/speckit-implement` → `/speckit-converge` |
| Deferred / cancelled / resumed | No code steps; for dependents, the business team decides |

If the business team rejects part of a change set, run `/amend` on that spec to revert its change; the rest of the set
is approved without it if it still stands alone.
