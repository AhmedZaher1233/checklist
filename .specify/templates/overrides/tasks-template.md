---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Delivery**: [copied from plan.md] <!-- Same value and note as the feature map and plan.md: Planned · Partially
implemented — <what is pending> · Implemented. Kept in step by /amend, an approved ACR, and the closing task. -->

**Tests**: Tests are REQUIRED: one test task per row of plan.md → Test Design, in the story the scenario belongs to.
The spec's acceptance scenarios are the source of truth for expected behaviour.

**Acceptance tests (QC)**: rows marked `(QC)` are mandated by the constitution's Quality Control section (QC-3) in
addition to the developer test tasks above; they are emitted with real task IDs and paths and are omitted only when
plan.md → Test Design marks their scope N/A.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Reviewed**: [YYYY-MM-DD] — Tech lead *(the tech lead reviews plan.md and tasks.md together — including test
coverage against the plan's Test Design — before /speckit-implement runs; fill only when the tech lead has explicitly
approved it. Every `## Phase N: Convergence` section added by /speckit-converge gets its own `**Reviewed**:` line,
reviewed the same way; earlier sections keep their review. The before_implement hook checks that every section with
open tasks is reviewed.)*

**Project override**: `.specify/templates/overrides/tasks-template.md`. Adds component tasks from the plan's
Component Decisions and mandatory closing tasks (DevOps handover, Component Register, feature map).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- **[Comp]**: Component task generated from the plan's Component Decisions; add `(needed by: US1, US3)` to state which
  user stories depend on it
- Include exact file paths in descriptions

## Path Conventions

- **Repository paths**: use the locations from plan.md (Component Decisions and Project Structure); by default
  `implementation/backend/<service>/`, `implementation/frontend/<app>/`, `implementation/test/<suite>/`, and
  `implementation/dev/`
- **Acceptance automation**: `Testing/Automation/` (constitution, Quality Control configuration: AUTOMATION_ROOT)
- Paths shown below are placeholders - replace them with the real repository paths from plan.md

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 0: Start of implementation

**Purpose**: The acceptance test cases are written first (constitution QC-3), before any component, foundational or
story task; then missing tools are found before code is written.

Always present, always the FIRST task (constitution QC-3):

- [ ] T001 (QC) Expand plan.md → Test Design → Acceptance test cases into specs/[###-feature]/TEST-CASES-[###-feature].md
  (in the feature folder, beside spec.md) using .specify/templates/overrides/test-cases-template.md: one test case per
  high-level row (same TC-ID, Type, Smoke, Automation Candidate, Data effect, Shared data; Locale en), steps per
  constitution QC-6, `## Test Data` from the plan's Test data table (every [E]/[A]/[D] token resolves to one row;
  accounts by secret name only, QC-7; the E1 value stays UNKNOWN until the local build runs, QC-12); header line
  `**Status:** APPROVED — generated YYYY-MM-DD from the Approved spec and the reviewed plan` (a generated status, not a
  human approval) (needed by: all stories)

Environment check — find missing tools before writing code. Check every tool and version the plan and the technology
stack ADR need (language runtimes, build tools, container runtime if used, Google Chrome for the acceptance tests).
Report what is missing; code is still written (CLAUDE.md, implementation rule), but verification waits for it.

- [ ] T002 Check the environment: [tools and versions from plan.md], container runtime (if used), Google Chrome

---

## Phase 1: Components (from plan.md → Component Decisions)

**Purpose**: Create, extend, or wire the architecture components this feature needs — nothing more (just in time).

Generate tasks for every row of the plan's Component Decisions table:

- **Create**: the component in the location the architecture's repository layout gives it, with only what this feature
  needs; shared modules and supporting capabilities stay generic (no domain or business authorization logic). Start
  from the official generator or CLI of its stack, follow
  `architecture/cross-cutting/code-structure.md`. It is built as real code for this feature — no skeleton-first step.
- **Extend**: the generic addition to the existing component, in that component's location.
- **Reuse**: dependency/configuration wiring only; never recreate the component.

Each component task states which user stories need it. A user story is blocked only by the component tasks it needs,
not by the whole phase.

- [ ] T003 [Comp] Create [component] in [location] (needed by: US1, US2)
- [ ] T004 [P] [Comp] Extend [module] with [generic capability] in [location] (needed by: US2)
- [ ] T005 [P] [Comp] Wire [existing module] into [service] (needed by: US1)

---

## Phase 2: Foundational (Feature Prerequisites)

**Purpose**: Feature-specific prerequisites that are not architecture components. Include only if needed; like
component tasks, state which user stories depend on each task. Architecture components (security, error handling,
logging, routing, gateway, identity, ...) belong in Phase 1, never here.

Examples of feature prerequisites (adjust based on the plan):

- [ ] T006 Create this feature's database migrations in [service location] (needed by: US1, US2)
- [ ] T007 [P] Create this feature's base entities shared by its stories in [service location] (needed by: US1, US2)
- [ ] T008 [P] Add this feature's configuration keys in [service location] (needed by: US2)

**Checkpoint**: Each user story can begin as soon as the component and foundational tasks it needs are complete

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (from plan.md → Test Design → Developer tests) ⚠️

- [ ] T010 [P] [US1] Test for US1-AS1: [what it checks] in [location from Test Design]
- [ ] T011 [P] [US1] Test for US1-AS2: [what it checks] in [location from Test Design]

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create [Entity1] model in src/models/[entity1].py
- [ ] T013 [P] [US1] Create [Entity2] model in src/models/[entity2].py
- [ ] T014 [US1] Implement [Service] in src/services/[service].py (depends on T012, T013)
- [ ] T015 [US1] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T016 [US1] Add validation and error handling
- [ ] T017 [US1] Add logging for user story 1 operations
- [ ] T018 [US1] (QC) Deliver the testability ask from plan.md → Test Design → Developer testability asks: [stable test
  ids on … | observable interface for … | seed / cleanup hook for …] in [paths] (omit when the plan lists none for US1)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (from plan.md → Test Design → Developer tests) ⚠️

- [ ] T018 [P] [US2] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T019 [P] [US2] Integration test for [user journey] in tests/integration/test_[name].py

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create [Entity] model in src/models/[entity].py
- [ ] T021 [US2] Implement [Service] in src/services/[service].py
- [ ] T022 [US2] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T023 [US2] Integrate with User Story 1 components (if needed)
- [ ] T024 [US2] (QC) Deliver the testability ask from plan.md → Test Design for US2: […] in [paths] (omit when none)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (from plan.md → Test Design → Developer tests) ⚠️

- [ ] T024 [P] [US3] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T025 [P] [US3] Integration test for [user journey] in tests/integration/test_[name].py

### Implementation for User Story 3

- [ ] T026 [P] [US3] Create [Entity] model in src/models/[entity].py
- [ ] T027 [US3] Implement [Service] in src/services/[service].py
- [ ] T028 [US3] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T029 [US3] (QC) Deliver the testability ask from plan.md → Test Design for US3: […] in [paths] (omit when none)

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional unit tests (if requested) in tests/unit/
- [ ] TXXX Security hardening
- [ ] TXXX (QC) Build and start the application locally as quickstart.md and the project scripts describe; read the
  URL the running web application serves and write it to `E1_URL` in Testing/Automation/.env (git-ignored) and to the
  E1 row of `## Test Data` in TEST-CASES-[###-feature].md (value + READY) — constitution QC-12; confirm it responds
  [and that the [A1] account signs in — only when the spec has sign-in]. Nothing is asked: a value that cannot be read
  is recorded as a Deviation with the default used
- [ ] TXXX (QC) Run the acceptance automation with skill link-qc-5-test-run-automation on
  specs/[###-feature]/TEST-CASES-[###-feature].md (User Story label "[###-feature]", environment local, browser Google
  Chrome, `E1_URL` from Testing/Automation/.env, `ado_mode: local`,
  `qa_standards: .specify/memory/constitution.md`, automation root `Testing/Automation`, coverage target / enforcement and
  SMOKE_GATE from the configuration table). The skill writes TEST-RUN-REPORT-[###-feature].md and
  BUG-REPORT-[###-feature].md under Testing/Automation/reports/[###-feature]/
- [ ] TXXX (QC) After the automation run has finished, run the UI check of [screens] with skill link-qc-6-ui-testing on
  the same local build (constitution QC-10): screen URLs from `E1_URL` + [routes] and labels; the reference is chosen
  without asking — Figma design named in spec.md / plan.md → reference URL named there → similar existing page →
  general check; `breakpoints` = BREAKPOINTS_PX, `locales` = LANGUAGES, no credentials while the spec has no sign-in,
  `qa_standards: .specify/memory/constitution.md`. The closing summary states the reference used (`Figma`,
  `reference URL`, `similar page: <page>` or `general check`)
- [ ] TXXX (QC) Fix in product code every Severity 1–2 / P1–P2 bug the automation run recorded in
  BUG-REPORT-[###-feature].md and the UI check recorded in its UI Visual QA report, and re-run the affected cases with
  the same skill as a new phase (QC-9, QC-14); a wrong, missing or unnecessary test step
  found on the way is corrected per QC-8 (Enhancement Log row)
- [ ] TXXX (QC) Execute the manual-only test cases ([TC-IDs], [HUMAN] steps) on the local build and record
  PASS / FAIL / BLOCKED / NOT RUN / N/A per case in the `## Execution Results` table of TEST-CASES-[###-feature].md
  (QC-13); file any defect in BUG-REPORT-[###-feature].md
- [ ] TXXX Run quickstart.md validation

---

## Phase Final: Closing tasks (MANDATORY)

**Purpose**: Record what this feature **actually** introduced or changed. Run after `/speckit-implement`; then
`/speckit-converge` checks the result (it runs after every implement).

- [ ] TXXX Write the DevOps handover details (how to build and run it, ports, health endpoints, configuration keys) in
  the `README.md` of every deployable this feature created or changed — from the real code. No deployment manifests
  or infrastructure configuration (DevOps team responsibility).

- [ ] TXXX Update architecture/component-register.md: for every component this feature created, set status
  `Introduced`, its location, and `Introduced by: [###-feature-name]`; for every component it extended, add
  `[###-feature-name]` to `Extended by`; add rows for any new component type. Verify each entry against the repository.
- [ ] TXXX Update this feature's Delivery in specs/feature-map.md **and in the Delivery line of plan.md and tasks.md**:
  `Implemented` only when every story of the current spec is built, all tests pass, the acceptance automation run is
  recorded in TEST-RUN-REPORT-[###-feature].md, the UI check report exists (feature with a user interface), the
  manual-only cases are recorded in `## Execution Results`, no
  Severity 1–2 / P1–P2 defect of this feature is open (constitution QC-14), and `/speckit-converge` reports no gaps;
  otherwise `Partially implemented`, with the pending stories (or amendment) in the note.

**The feature is not complete until this task is done.**

---

## Dependencies & Execution Order

### Phase Dependencies

- **Start of implementation (Phase 0)**: T001 (test cases) runs first; no dependencies
- **Components (Phase 1)**: Start after Phase 0; each task blocks only the user stories listed in
  its `(needed by: …)`
- **Foundational (Phase 2)**: Only if needed; each task blocks only the user stories that depend on it
- **User Stories (Phase 3+)**: Each depends only on the component and foundational tasks it needs
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish**: Depends on all desired user stories being complete; the `(QC)` execution rows need the application
  running locally and the Phase 0 `(QC)` test-case file (T001); the UI check runs after the automation run
- **Closing tasks (Final Phase)**: Depend on everything else; mandatory; then `/speckit-converge`

### User Story Dependencies

- **User Story 1 (P1)**: Can start once its required component/foundational tasks are done - No dependencies on other stories
- **User Story 2 (P2)**: Can start once its required component/foundational tasks are done - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start once its required component/foundational tasks are done - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All component tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- A user story can start as soon as its own required tasks are done, in parallel with other stories (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Contract test for [endpoint] in tests/contract/test_[name].py"
Task: "Integration test for [user journey] in tests/integration/test_[name].py"

# Launch all models for User Story 1 together:
Task: "Create [Entity1] model in src/models/[entity1].py"
Task: "Create [Entity2] model in src/models/[entity2].py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete the component and foundational tasks needed by User Story 1
2. Complete Phase 3: User Story 1
3. **STOP and VALIDATE**: Test User Story 1 independently
4. Deploy/demo if ready

### Incremental Delivery

1. Complete the components needed by User Story 1
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes the component tasks each story needs
2. Once a story's required tasks are done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Never recreate a component the plan marks Reuse or Extend
- The `(QC)` rows are never dropped as "optional tests"; the Status line of TEST-CASES-[###-feature].md is generated by
  the first task, T001 (constitution QC-3), never a human approval
- The closing tasks are mandatory; the feature is not complete until they are done and `/speckit-converge` reports no gaps
