---
name: "intake"
description: "Internal skill, called by the framework-hooks router when a /speckit-specify input (file or description, whole or part) contains several items — new features, changes to existing features, or both: lists the items with dependencies and waves, sets the architecture status to Update required for items that affect the architecture, and after confirmation runs /speckit-specify and /amend for each item in wave order."
argument-hint: "The /speckit-specify input (file path with optional sections, or a description)"
user-invocable: false
disable-model-invocation: false
---

## User Input

```text
$ARGUMENTS
```

## Purpose

Internal: the user runs `/speckit-specify <input>`; the router (`framework-hooks`, before_specify) calls this skill
when the input contains several items. Specs and the feature map are written only by `/speckit-specify` and `/amend`;
this skill itself writes only the architecture status (step 4).

## Rules

1. **Do not invent business behaviour.** Use only what the input says. Missing or unclear content stays in the spec as
   `[NEEDS CLARIFICATION]` or an assumption, to be resolved by `/speckit-clarify`.
2. **Business language only** in names and summaries (live spec rules in
   `.specify/templates/overrides/spec-template.md`).
3. **Reuse before creating.** Content that changes an existing feature is a change to that feature, not a new feature.
4. **Confirm before creating anything.**

## Workflow

### 1. Read the inputs

- The input: a file (for `.docx` / `.pdf`, extract its text; limit to the sections named, if any) or a description.
- `specs/feature-map.md` and, for each existing `specs/<###-name>/spec.md`, its title, status, user story headings,
  Key Entities, and Dependencies.
- `.specify/memory/constitution.md`.

### 2. List the items

- **New feature** = one coherent business capability that can be specified, approved, and delivered on its own:
  usually 2–5 independently testable user stories; one channel unless the stories form one lifecycle across channels;
  split by capability, never by technical layer.
- **Change ###** = content that changes an existing feature's behaviour (same actors, screens, data, or process).
- When one change touches several existing features, they form a **change set** (approved together). Check the
  changed feature's **Consumed by** and **Related** features in `specs/feature-map.md` for this.

### 3. Dependencies and order

For each new feature: **Depends on**, **Related**, **External**. Waves: one more than the highest wave among its
Depends on (wave 1 if none); the critical path. For each new feature, note which existing features would depend on it.

### 4. Architecture impact

For each item, decide whether it has an **Architecture impact** (an Architecture impact is anything the approved SAD does not cover yet: a new or changed building block,
external system, channel, or user group; a change to a technology, an ADR, or a cross-cutting rule (for example
showing personal data a rule does not allow)) and propose it: what is affected and why. After confirmation (step 5) and once the specs exist (step 6),
set the **architecture status** in `architecture/solution-architecture.md`: add one Document History row
`| [next version] | [date] | Update required | — | ###: [impact]; ###: [impact] |` (or extend an existing Update
required row). If that document does not exist yet, list the impacts in the intake report; `/architecture create`
covers them.

### 5. Propose (no file writes yet)

Present:

1. **Items** — order, name, channel, New / Change ###, one-line business summary, source section, Depends on,
   Related, External, wave; change sets marked.
2. **Delivery order** — waves with full feature names, one per line, and the critical path.
3. **Architecture impacts** (they set the architecture status to Update required).

Ask the user to confirm, amend, or cancel; they may confirm only part.

### 6. Create (after confirmation)

In **wave order**, one item at a time:

- **New** → `/speckit-specify` with a description of that **one** feature (name, summary, source document and
  section, Depends on / Related / External by feature ID). The router returns New for it.
- **Change ###** → `/amend ### <change>` (change sets: name the other specs of the set).

Then write the confirmed Architecture Gaps (step 4) with the feature IDs, and add the pointer (`AG-NN`) to the Notes
of each affected feature in `specs/feature-map.md`.

### 7. Report

1. Specs created and changed (paths), in order; change sets.
2. Feature map: new rows and the delivery order.
3. Architecture impacts recorded (architecture status).
4. Next steps: `/speckit-clarify` for each spec → business team approval (one by one; change sets together) →
   `/architecture create | update` (whole approved scope).
