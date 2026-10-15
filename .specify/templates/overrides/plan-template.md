# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Delivery**: [Planned] <!-- Same value and note as this feature's row in specs/feature-map.md: Planned ·
Partially implemented — <what is pending, e.g. "Amendment YYYY-MM-DD pending", "ACR-NNNN pending", "US3 pending"> ·
Implemented. Every command that changes the feature map's Delivery changes this line and the one in tasks.md too. -->

**Note**: This template is filled in by the `/speckit-plan` command. It is the project override of the core plan
template (`.specify/templates/plan-template.md`) and adds architecture alignment.

<!--
  The architecture (architecture/) is the single source for the stack, the building blocks, and the cross-cutting
  rules. This plan LINKS to it and records only what is specific to this feature — never repeat its content.
  Read first: architecture/solution-architecture.md, architecture/component-register.md, the ADRs in
  architecture/decisions/, and the cross-cutting documents in architecture/cross-cutting/.
  Only Approved decisions are used; anything missing, not Approved, or conflicting goes to "Architecture Gaps"
  and returns to /architecture. The before_plan gate already checked that the spec is Approved and the
  architecture status allows this feature (Approved, or Update required without naming it).
-->

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!-- Feature-specific only. Use "NEEDS CLARIFICATION" only for feature-specific unknowns the architecture does not
     answer. -->

**Stack**: as in `architecture/decisions/*-technology-stack.md` (not repeated here)

**Added for this feature**: [libraries or tools not in the stack ADR, with version and why — or None]

**Storage**: [this feature's data, in the owning service's data store — or N/A]

**Constraints**: [feature-specific constraints]

**Scale/Scope**: [feature scope]

**Testing**: [testing unknowns of the acceptance test design as NEEDS CLARIFICATION, resolved in research.md — or None]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on the constitution file]

<!-- Include a row for the constitution’s Quality Control section (QC-3): Test Design has the acceptance subsections and no
     testing unknown is left under Technical Context → Testing. -->

## Feature Dependencies

<!-- From the spec's Dependencies section and specs/feature-map.md. Implementation waits for every Depends on
     feature to be Implemented (before_implement gate); an exception (for example a stub) is justified in Complexity
     Tracking. After the plan is written, set this feature's Delivery in specs/feature-map.md to "Planned" if it is
     "Not planned" ("Partially implemented" stays as it is), and fill the Delivery line at the top of this plan with
     the same value and note. -->

| Depends on | Impact on this plan |
|------------|---------------------|
| [###-feature-name, or None] | [e.g. reuses its components and data; implementation waits until it is Implemented] |

## Amendment Impact *(only when the spec has a new "Amended" header line, or an approved ACR lists this feature as "Change now")*

<!-- Two triggers:
     - Spec amendment: plan ONLY the changes not yet implemented — one **Amendment** line per such "Amended" line
       of the spec (several when a new amendment arrives while an earlier one is still pending); add rows for the
       new one and keep the rows of the earlier ones.
     - Approved ACR (architecture/changes/): plan ONLY the technical change the ACR requires; the spec is unchanged.
     The rest of the feature is already planned. Find the
     changed stories / FRs by comparing spec.md with its last implemented version in git (the spec itself keeps no
     change markers). Keep the earlier plan content and mark what this amendment adds or changes with
     "(amended YYYY-MM-DD)" — the change history lives here, not in the spec.
     /speckit-converge turns the items below into tasks appended to tasks.md, so every item must be concrete.
     Delete this section for a new feature. -->

**Amendment**: [YYYY-MM-DD — one-line summary from the spec's Amended line, or ACR-NNNN — title]

| Changed story / FR | Code affected (service / app, Extend) | Contract or event change | Breaking? |
|--------------------|---------------------------------------|--------------------------|-----------|
| [FR-0XX] | [service / app] | [endpoint / event, or None] | [No / Yes — consumer handling] |

| Affected feature (Consumed by and Related, from the feature map) | Why it is affected | Regression to re-run |
|------------------------------------------------------------------|--------------------|----------------------|
| [###-feature-name, or None] | [uses the changed contract / data / screen] | [its acceptance scenarios / tests] |

**Test Design update**: add or change the Test Design rows (developer tests and acceptance test cases) for every added
or changed acceptance scenario; remove rows of removed scenarios. The feature’s TEST-CASES file is regenerated and the
affected cases re-run (constitution QC-4); `/speckit-converge` adds that task.

**Closing work** (required, becomes the last convergence tasks):
- Re-run the acceptance tests of this feature and of every affected feature above.
- Update architecture/component-register.md: add this feature to `Extended by` for every component it changed.
- Update the DevOps handover details of every deployable this amendment changed (from the real code).
- When `/speckit-converge` reports no gaps: set this feature's Delivery to `Implemented` in specs/feature-map.md and in
  the Delivery line of plan.md and tasks.md, and remove the "Amendment … pending" or "ACR-NNNN pending" note.

- [ ] Every changed story / FR maps to the code it affects.
- [ ] Every affected feature has a regression check; every breaking contract change has consumer handling
      (Constitution, API Contracts & Error Handling).

## Architecture Alignment

### Decisions used

<!-- The ADRs this feature relies on. /architecture searches this table when an ACR changes a decision. -->

| ADR | How this plan applies it |
|-----|--------------------------|
| [ADR-000X — title] | [...] |

### Component Decisions (architecture/component-register.md)

<!-- For EVERY component this feature needs (deployables, shared libraries, supporting capabilities):
     1. Check the Architecture Component Register AND the actual repository (does the folder/module exist?).
     2. Decide:
        - Create — only if the register says "Not introduced" AND the repository has no such component, and this
          feature actually needs it now;
        - Reuse  — it exists and is used as is (only dependency/configuration wiring);
        - Extend — it exists and needs an addition for this feature (shared components stay generic: no domain or
          business authorization logic).
     3. Never recreate an existing component. If the register and the repository disagree, record it under
        Architecture Gaps and decide from what actually exists in the repository.
     Components are built in the normal implementation tasks (no skeleton-first step); DevOps handover details are
     written at the end of implementation, from the real code. -->

| Component | Decision (Create / Reuse / Extend) | Evidence (register status + repository check) | Location | What this feature changes in it |
|-----------|------------------------------------|-----------------------------------------------|----------|---------------------------------|
| [e.g. Catalog Service] | [Create] | [register: Not introduced; repo: <location> absent] | [<location>] | [...] |

### Cross-cutting checklist

<!-- One row per document in architecture/cross-cutting/. Write only how THIS feature complies (for security: the
     roles, ownership rules, and any public routes it needs) — never restate the document's rules. -->

| Concern (architecture/cross-cutting/) | Applies? | How this feature complies |
|---------------------------------------|----------|---------------------------|
| [document name] | [Yes/N/A] | [...] |

### Architecture Gaps

<!-- Missing, not Approved, or conflicting system-wide decisions found while planning. Each returns to
     /architecture. -->

| Gap | Decision needed | Affects |
|-----|-----------------|---------|
| [none] | | |

## Architecture Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [ ] The plan contradicts no Approved decision and decides nothing system-wide locally (anything system-wide is under
      Architecture Gaps).
- [ ] Every component has a Create / Reuse / Extend decision checked against the register and the repository; nothing
      is recreated; every Create is needed now.
- [ ] Every service changes only data it owns (Constitution, Architecture & Integration Boundaries).
- [ ] Every applicable cross-cutting concern is addressed in the checklist.

ERROR if a check fails without an entry in Complexity Tracking or Architecture Gaps.

## Design

<!-- The summary of the Phase 1 design. Details live in data-model.md and contracts/; this section gives the clear
     overview a reviewer needs and links to them. -->

### Data model

<!-- data-model.md MUST start with a Mermaid erDiagram of every entity this feature adds or changes — attributes, keys,
     and relationships, including relationships to entities of earlier features (marked as existing) — followed by
     field rules, uniqueness, and state transitions. -->

**Details**: [data-model.md](data-model.md)

| Entity | Added / Changed / Used | Owning service | Summary |
|--------|------------------------|----------------|---------|
| [Entity] | [Added] | [service] | [one line] |

### APIs

<!-- One row per operation this feature adds or changes. Full request and response schemas are in contracts/.
     Contract files describe the interface only: no user story, scenario, or requirement IDs (US1, FR-001, ...), no
     feature numbers, no references to framework documents, and no standard names (e.g. "RFC 9457") in summaries or
     descriptions. Traceability lives in this plan and in tasks.md. -->

**Contract**: [contracts/<file>.yaml]

| Operation | Method and path | Who may call | Purpose | Success | Error cases (see Error codes) |
|-----------|-----------------|--------------|---------|---------|-------------------------------|
| [operationId] | [POST /api/...] | [role / owner] | [one line] | [201 + body] | [400, 409, ...] |

### Events

<!-- Every event this feature publishes or consumes, or "None". -->

| Event | Published / Consumed | Publisher → consumers | When | Payload (key fields) | Delivery and idempotency |
|-------|----------------------|-----------------------|------|----------------------|--------------------------|
| [None] | | | | | |

### Error codes

<!-- One row per error case of every operation and event handler above. "Error type" is the problem type in the
     contract; "Message" is what the user is told (cross-cutting error rules). -->

| Operation | Case | HTTP status | Error type | Message to the user |
|-----------|------|-------------|------------|---------------------|
| [operationId] | [when it happens] | [409] | [/problems/...] | [plain-English message] |

## Test Design

<!-- The spec's acceptance scenarios are the source of truth for expected behaviour. Every acceptance scenario has at
     least one row; a test checks the behaviour the scenario describes, never the behaviour of existing code.
     Scenario IDs use the spec's own numbering: US<story>-AS<scenario number>.
     Use test tools from the technology stack ADR; a needed tool that is not there goes under "Added for this
     feature" with its reason.
     If a story's test relies on something another story provides (e.g. a list page used to check an add), build
     that part in the earlier story and say so in tasks.md. /speckit-tasks turns each row into a test task. -->

**Tests requested**: Yes. `/speckit-tasks` MUST generate one test task per row of the developer-test table, in the story
the scenario belongs to, plus the `(QC)` rows for the acceptance test cases below.

### Developer tests

| Scenario | What the test checks | Test level (unit / service / contract / end-to-end) | Location |
|----------|----------------------|------------------------------------------------------|----------|
| [US1-AS1] | [Given … When … Then …, in short] | [service] | [service or app folder] |

- [ ] Every acceptance scenario in the spec has at least one row.

### Acceptance test cases (constitution, Quality Control)

<!-- The acceptance test design the first task of tasks.md (T001) expands into specs/[###-feature]/TEST-CASES-[###-feature].md
     (template: .specify/templates/overrides/test-cases-template.md). Design decisions only — the steps are written in the
     test-case file. Rules: constitution QC-4 (traceability), QC-6 (design), QC-7 (test data). A testing unknown is a
     NEEDS CLARIFICATION under Technical Context → Testing, resolved in research.md; business questions go to
     /speckit-clarify. English only: every case is Locale en. -->

**Story risk** (QC-6): [US1 — High | Medium | Low — reason; US2 — …]

**High-level test cases** (QC-6) — titles only; one happy path per acceptance scenario, one edge case per user-facing
input, one negative case per guarded action:

| TC-ID | Scenario (US#-AS# / FR-###) | Title (observable outcome) | Type (happy-path / edge-case / negative) | Smoke (YES/NO) | Automation Candidate (YES/NO — reason if NO) | Data effect (read-only / creates / modifies / deletes) | Shared data |
|---|---|---|---|---|---|---|---|
| [TC-AREA-001] | [US1-AS1, FR-001] | [Admin adds a room with a name and capacity] | [happy-path] | [YES] | [YES] | [creates] | [—] |

Negative categories covered or N/A with reason: invalid input [TC / N/A], boundary [TC / N/A], missing required
[TC / N/A], unauthorised [TC / N/A], error recovery [TC / N/A]. Techniques and interaction patterns applied:
[EP / BVA / decision table / state transition; reveal / wait / trigger / loading two-step].

**Test data** (QC-7) — by reference only; never a username or password. Environment URLs are not known at planning
time: they are read from the running local build during implementation (QC-12) and never asked:

| Ref | What | Source / status |
|---|---|---|
| [E1] | [application base URL — local build] | [E1_URL; read from the running local build at implementation (QC-12); UNKNOWN until then] |
| [A1] | [Administrator] | [secret names A1_USER / A1_PASSWORD; local realm] |
| [A2] | [Employee] | [secret names A2_USER / A2_PASSWORD; local realm] |
| [D1] | [data item in plain words and what it must look like] | [e2e scenario / api (to be confirmed) / manual; UNKNOWN] |

**Developer testability asks** (QC-6): [stable test ids on …; observable interface for … (job result, mail sandbox);
isolated seed / cleanup hook for …; start steps in quickstart.md — or None]. Each becomes a `(QC)` task inside
its user story.

**Automation approach** (QC-9, QC-11): [default — browser cases with Automation Candidate YES → skill
link-qc-5-test-run-automation under Testing/Automation; API behaviour → the developer service tests above; manual-only
→ TC-IDs with reason — or the deviation and why]

- [ ] Every acceptance scenario and FR in scope has at least one TC-ID; no NEEDS CLARIFICATION is left under Technical
      Context → Testing.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
├── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
└── TEST-CASES-[###-feature].md  # acceptance test cases, written by the first task (T001) of tasks.md
```

### Source Code
<!--
  Show only the repository folders this feature touches. Default layout — all code under implementation/, one folder
  per component (named as in architecture/component-register.md):
    implementation/backend/<service>/     services and other backend deployables
    implementation/frontend/<app>/        frontend applications
    implementation/backend/shared/<lib>/  backend shared libraries (only when 2+ backend deployables need them)
    implementation/frontend/shared/<lib>/ frontend shared libraries (only when 2+ frontend apps need them)
    implementation/test/<suite>/          test suites that span components (e.g. end-to-end)
    implementation/dev/                   local development environment (e.g. compose files); host ports are
                                          non-default (e.g. a database on 55432) to avoid clashing with local installs
    Testing/Automation/                   acceptance automation (constitution, Quality Control configuration); QC-owned,
                                          not a product component — never listed as a deviation
  Inside each component, follow architecture/cross-cutting/code-structure.md. Deviate only with a reason in
  research.md (folder layout belongs to plans, architecture skill Rule 8).
-->

```text
[repository folders touched by this feature]
```

**Structure Decision**: [In this order: (1) the layout used — the project default (all code under `implementation/`,
by side, one folder per component) and the code structure of `architecture/cross-cutting/code-structure.md`, or the
deviation and why (research.md); (2) whether this feature introduces a component (and so sets its folder) or adds to
existing ones; (3) what later features are expected to add here (from the feature map's Consumed by), e.g. "002 adds
its controller, service, repository, and entity classes to Catalog Service and its pages to Customer Portal".]

## Complexity Tracking

> **Fill ONLY if the Constitution Check or Architecture Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., service reads another service's data] | [current need] | [why the owning service's contract is insufficient] |
