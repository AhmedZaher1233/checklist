# Implementation Plan: To-Do List

**Branch**: `001-todo-list` | **Date**: 2026-10-13 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-todo-list/spec.md`

**Delivery**: Partially implemented — manual test cases TC-TODO-030 and TC-TODO-032 pending (T081) <!-- Same value and note as this feature's row in specs/feature-map.md: Planned ·
Partially implemented — <what is pending, e.g. "Amendment YYYY-MM-DD pending", "ACR-NNNN pending", "US3 pending"> ·
Implemented. Every command that changes the feature map's Delivery changes this line and the one in tasks.md too. -->

**Note**: This template is filled in by the `/speckit-plan` command. It is the project override of the core plan
template (`.specify/templates/plan-template.md`) and adds architecture alignment.

## Summary

A shared, public to-do list: anyone who opens the web page can add a task (title of up to 100 characters), see all
tasks newest first, mark a task as completed (final) and delete a task (immediately, permanently). This first feature
creates both approved building blocks: the **Task Service** (Spring Boot, owns a PostgreSQL database with one `task`
table, four public REST operations under `/api/v1/tasks`) and the **To-Do Web App** (one React page). Feature-level
choices (title counting, ordering, completion and delete semantics, messages, acceptance-test isolation) are in
[research.md](research.md).

## Technical Context

**Stack**: as in `architecture/decisions/*-technology-stack.md` (not repeated here)

**Added for this feature**: Test-only, To-Do Web App: `jsdom` (the DOM environment Vitest needs for React Testing
Library) and `@testing-library/user-event` 14.x (realistic typing, paste and keyboard input for US1-AS6 and FR-016);
latest stable at implementation. Everything else is in ADR-0001 or managed by Spring Boot 4.1.1
(`spring-boot-starter-web`, `-data-jpa`, `-validation`, `-actuator`, `-test`, Flyway, Testcontainers).

**Storage**: Table `task` in the Task Service's PostgreSQL database `todo` ([data-model.md](data-model.md)).

**Constraints**: Title 1–100 UTF-16 code units after stripping white space (research R1, R2); completion is final
(R4); no sign-in, all operations public (FR-015); list order newest first and stable (R3); one request per user
action (R6); the list is updated on screen only after the service confirms (FR-014).

**Scale/Scope**: One screen, four API operations, one table; a few hundred tasks; one Task Service instance (SAD §9).
List results are not paged.

**Testing**: None open — acceptance test isolation, empty-list preparation and failure injection are resolved in
research R9.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|-----------|-------|--------|
| I. Security & Data Privacy | Public access declared (spec FR-015; contract marks every operation public); server-side validation of title and request bodies; no secrets committed (`.env` git-ignored); no task titles in logs; errors expose no internals | Pass |
| II. Accessibility | Keyboard and screen-reader requirements (FR-016) designed in (see Design → Web application); axe scans in acceptance tests; WCAG 2.2 AA | Pass |
| III. Testing & Quality | Every acceptance scenario has developer tests and acceptance test cases (Test Design); positive, negative, boundary and failure cases included | Pass |
| IV. Spec-Driven Development | Spec Approved 2026-10-13; no business rule decided here — message wording (research R8) is the plan's proposal of texts the spec defines by meaning only | Pass |
| V. Architecture & Integration Boundaries | Business rules (strip, length, final completion) only in the Task Service `service` layer; controllers translate only; the service alone owns its database; Flyway-versioned schema | Pass |
| VI. API Contracts & Error Handling | OpenAPI contract in `contracts/`; one problem format; error table below | Pass |
| VII. Observability | Structured JSON logs, correlation ID, liveness and readiness endpoints (`cross-cutting/observability.md`) | Pass |
| VIII. Simplicity | No component or library beyond the approved two blocks and ADR-0001; no router or state library | Pass |
| Platform Scope | One web channel, English only; times in UTC and Africa/Cairo (no time is shown in this feature) | Pass |
| Quality Control (QC-3) | Test Design has Story risk, High-level test cases, Test data, Developer testability asks and Automation approach; no testing unknown under Technical Context | Pass |

Post-design re-check (after Phase 1): all rows still Pass.

## Feature Dependencies

| Depends on | Impact on this plan |
|------------|---------------------|
| None | First feature; creates both components |

## Architecture Alignment

### Decisions used

| ADR | How this plan applies it |
|-----|--------------------------|
| ADR-0001 — Technology stack | Pins its versions (research R11); JDBC driver overridden to 42.7.14; Testcontainers for service tests; Playwright + axe for acceptance |
| ADR-0002 — Building blocks | Creates the To-Do Web App and the Task Service; the Task Service owns the `todo` database; no other block |

### Component Decisions (architecture/component-register.md)

| Component | Decision (Create / Reuse / Extend) | Evidence (register status + repository check) | Location | What this feature changes in it |
|-----------|------------------------------------|-----------------------------------------------|----------|---------------------------------|
| Task Service | Create | register: Not introduced; repo: `implementation/` absent | `implementation/backend/task-service` | New Spring Boot service: task operations, `task` table, error handling, correlation ID, health |
| To-Do Web App | Create | register: Not introduced; repo: `implementation/` absent | `implementation/frontend/todo-web-app` | New React app: the task list page |
| Local environment (not a component) | Create | repo: `implementation/dev` absent | `implementation/dev` | Docker Compose with PostgreSQL 18.6 on 55432, `.env.example` |

### Cross-cutting checklist

| Concern (architecture/cross-cutting/) | Applies? | How this feature complies |
|---------------------------------------|----------|---------------------------|
| code-structure.md | Yes | Task Service packages `controller`, `service`, `repository`, `entity`, `dto`, `exception`, `common`; web app `pages`, `components`, `api`, `common`; StrictMode-safe load (R7), in-flight guard (R6) |
| security.md | Yes | Public routes: `GET`/`POST /api/v1/tasks`, `PATCH`/`DELETE /api/v1/tasks/{id}` — all public by FR-015; title validated in the service; titles rendered as text; security headers and CSP set by the service and the web app's host; no CORS |
| error-handling.md | Yes | Global handler maps validation → 400, not found → 404, completion final → 409, database down → 503, other → 500; web app maps them to the messages in Error codes |
| api-contracts.md | Yes | `/api/v1/tasks` resource, `POST` 201 + `Location`, `PATCH` 200, `DELETE` 204, camelCase, `createdAt` ISO 8601 UTC; OpenAPI at `/v3/api-docs` |
| observability.md | Yes | Request log line without titles or bodies; `X-Correlation-Id` filter in `common`; readiness includes the database |
| accessibility.md | Yes | Labelled input, native buttons with item-specific names, status text for completion, polite live region for results, focus management after add and delete (Design → Web application) |
| configuration-and-secrets.md | Yes | Datasource URL, user and password from environment variables; profile `local`; `implementation/dev/.env` git-ignored with `.env.example` |
| date-and-time.md | Yes | `created_at` as `timestamptz` from the injected UTC `Clock`; ordering by instant then id; no time is shown on screen |
| resilience.md | Yes | 10 s client timeout via `AbortController`; add never retried; complete and delete repeatable; database connection timeout 5 s, statement timeout 10 s; 503 when the database is down |

### Architecture Gaps

| Gap | Decision needed | Affects |
|-----|-----------------|---------|
| none | | |

## Architecture Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] The plan contradicts no Approved decision and decides nothing system-wide locally (anything system-wide is under
      Architecture Gaps).
- [x] Every component has a Create / Reuse / Extend decision checked against the register and the repository; nothing
      is recreated; every Create is needed now.
- [x] Every service changes only data it owns (Constitution, Architecture & Integration Boundaries).
- [x] Every applicable cross-cutting concern is addressed in the checklist.

## Design

### Data model

**Details**: [data-model.md](data-model.md)

| Entity | Added / Changed / Used | Owning service | Summary |
|--------|------------------------|----------------|---------|
| Task | Added | Task Service | Title (1–100, stripped), completed flag (false → true only), created instant (sets the order) |

### APIs

**Contract**: [contracts/task-service.openapi.yaml](contracts/task-service.openapi.yaml)

| Operation | Method and path | Who may call | Purpose | Success | Error cases (see Error codes) |
|-----------|-----------------|--------------|---------|---------|-------------------------------|
| listTasks | GET /api/v1/tasks | Anyone (public) | All tasks, newest first | 200 + array | 500, 503 |
| createTask | POST /api/v1/tasks | Anyone (public) | Add a task | 201 + task + `Location` | 400, 500, 503 |
| completeTask | PATCH /api/v1/tasks/{id} | Anyone (public) | Mark as completed (repeatable) | 200 + task | 400, 404, 409, 500, 503 |
| deleteTask | DELETE /api/v1/tasks/{id} | Anyone (public) | Delete permanently | 204 | 404, 500, 503 |

### Events

| Event | Published / Consumed | Publisher → consumers | When | Payload (key fields) | Delivery and idempotency |
|-------|----------------------|-----------------------|------|----------------------|--------------------------|
| None | | | | | |

### Error codes

| Operation | Case | HTTP status | Error type | Message to the user |
|-----------|------|-------------|------------|---------------------|
| listTasks | Database unavailable | 503 | /problems/service-unavailable | "The tasks could not be loaded. Try again." |
| listTasks | Unexpected error, timeout or no network | 500 / — | /problems/internal | "The tasks could not be loaded. Try again." |
| createTask | Title missing, empty or only white space | 400 | /problems/validation (`title` / `required`) | "Enter a title for the task." |
| createTask | Title longer than 100 after stripping (not reachable from the page) | 400 | /problems/validation (`title` / `too-long`) | "The task was not added. Try again." |
| createTask | Malformed body | 400 | /problems/validation (`invalid`) | "The task was not added. Try again." |
| createTask | Database unavailable, unexpected error, timeout or no network | 503 / 500 / — | /problems/service-unavailable, /problems/internal | "The task was not added. Try again." |
| completeTask | Task does not exist (deleted by someone else) | 404 | /problems/task-not-found | "This task no longer exists." (task removed from the screen) |
| completeTask | `completed: false` requested (not offered by the page) | 409 | /problems/task-completion-final | "The task was not marked as completed. Try again." |
| completeTask | Malformed body or id | 400 | /problems/validation (`invalid`) | "The task was not marked as completed. Try again." |
| completeTask | Database unavailable, unexpected error, timeout or no network | 503 / 500 / — | /problems/service-unavailable, /problems/internal | "The task was not marked as completed. Try again." |
| deleteTask | Task does not exist (deleted by someone else) | 404 | /problems/task-not-found | "This task no longer exists." (task removed from the screen) |
| deleteTask | Database unavailable, unexpected error, timeout or no network | 503 / 500 / — | /problems/service-unavailable, /problems/internal | "The task was not deleted. Try again." |

A malformed id in the path (not a UUID) is answered as `404 /problems/task-not-found`.

### Web application (To-Do Web App, one page)

- Heading "To-Do List"; a form with a visible label "New task", a text input (`maxlength="100"`) and an "Add" button.
  Enter submits. While a request is in flight the button is marked busy (`aria-disabled`, so focus is not lost) and
  repeated submits are ignored (R6). After a
  successful add the input is cleared and keeps focus.
- While the list loads: "Loading tasks…" (announced). Load failure: message and a "Try again" button.
- The list is a `ul` of tasks, newest first. Each item shows the title as text; a not-completed task has a "Mark as
  completed" button; a completed task shows the text "Completed" and a struck-through title and has no completion
  button (FR-008, FR-009). Every item has a "Delete" button. Button accessible names start with the visible label and add the
  title (for example "Mark as completed: Buy milk", "Delete: Buy milk"; WCAG 2.5.3 label in name).
- Empty list: "No tasks yet."
- Results that do not move focus ("Task added.", "Task marked as completed.", "Task deleted.", and every error
  message) are announced in a polite live region; the error message is also shown visibly near the list.
- After a delete, focus moves to the next item's "Delete" button, else the previous one, else the "New task" input.
- The screen changes only after the service confirms; on `404` for complete or delete the task is removed and
  "This task no longer exists." is shown.

## Test Design

**Tests requested**: Yes. `/speckit-tasks` MUST generate one test task per row of the developer-test table, in the story
the scenario belongs to, plus the `(QC)` rows for the acceptance test cases below.

### Developer tests

Locations: **TS** = `implementation/backend/task-service/src/test/java` (service tests: `@SpringBootTest` + MockMvc
against PostgreSQL in Testcontainers; unit tests: plain JUnit on `TaskService` with a fixed `Clock`). **WA** =
`implementation/frontend/todo-web-app/src` (`*.test.tsx`, Vitest + React Testing Library, API layer mocked).

| Scenario | What the test checks | Test level (unit / service / contract / end-to-end) | Location |
|----------|----------------------|------------------------------------------------------|----------|
| US1-AS1 | Empty database → `GET /api/v1/tasks` returns `[]` | service | TS |
| US1-AS1 | Page with an empty list shows "No tasks yet." and the labelled "New task" input; no sign-in element | unit (component) | WA |
| US1-AS2 | `POST` "Buy milk" → 201, `completed=false`, `Location`; then listed | service | TS |
| US1-AS2 | Adding "Buy milk" puts it at the top as not completed and clears the input | unit (component) | WA |
| US1-AS3 | `POST` with `""`, `"   "`, missing title → 400 `/problems/validation`, `title`/`required`; nothing stored | service | TS |
| US1-AS3 | Empty or white-space title shows "Enter a title for the task." and sends no request | unit (component) | WA |
| US1-AS4 | Created tasks are returned unchanged by a later `GET` after the application context restarts | service | TS |
| US1-AS5 | List response contains title and completion state of every task | service | TS |
| US1-AS5 | Each item shows its title and its state (button or "Completed") | unit (component) | WA |
| US1-AS6 | 100-character title → 201; 101 characters → 400 `too-long`; `"  " + 100 chars + "  "` → 201 stripped | unit + service | TS |
| US1-AS6 | Input has `maxlength=100`; a 120-character paste leaves the first 100 | unit (component) | WA |
| US1-AS7 | Two `POST` "Buy milk" → two tasks with different ids | service | TS |
| US1-AS8 | Three tasks created at fixed clock instants are listed newest first; equal instants ordered by id descending | unit + service | TS |
| US1 edge (strip) | `"  Buy milk  "` is stored as `"Buy milk"`; non-breaking space stripped | unit | TS |
| US1 edge (double add) | Two quick submits send one request and add one task | unit (component) | WA |
| US2-AS1 | `PATCH {completed:true}` → 200 `completed=true`; repeated → 200 unchanged | service | TS |
| US2-AS1 | "Mark as completed" shows "Completed" and the struck-through title after the response | unit (component) | WA |
| US2-AS2 | Completed state is returned by a later `GET` | service | TS |
| US2-AS3 | Completing one task leaves the others `completed=false` | service | TS |
| US2-AS4 | `PATCH {completed:false}` on a completed task → 409 `/problems/task-completion-final`, task unchanged | unit + service | TS |
| US2-AS4 | A completed task renders no completion button | unit (component) | WA |
| US2-AS5 | Completing a task does not change its position in `GET` | service | TS |
| US3-AS1 | `DELETE` → 204, task no longer listed | service | TS |
| US3-AS1 | "Delete" removes the item after the response with no confirmation dialog; focus moves as designed | unit (component) | WA |
| US3-AS2 | Deleting a completed task → 204 | service | TS |
| US3-AS3 | Deleted task is not returned later; second `DELETE` → 404 | service | TS |
| US3-AS4 | Deleting the last item shows "No tasks yet." | unit (component) | WA |
| Edge (gone) | `PATCH` / `DELETE` unknown or malformed id → 404 `/problems/task-not-found` | service | TS |
| Edge (gone) | 404 on complete or delete removes the item and shows "This task no longer exists." | unit (component) | WA |
| FR-014 | Failed add / complete / delete / load (500, 503, network error, 10 s timeout) shows the matching message and leaves the list as it was | unit (component) | WA |
| FR-014 | Database stopped → 503 `/problems/service-unavailable`, no internal details in the body | service | TS |
| FR-016 | Add, complete and delete work with the keyboard; accessible names include the title; results announced in the live region | unit (component) | WA |
| Cross-cutting | Every response has `X-Correlation-Id`; errors are `application/problem+json` without stack traces | service | TS |

- [x] Every acceptance scenario in the spec has at least one row.

### Acceptance test cases (constitution, Quality Control)

**Story risk** (QC-6): US1 — **High** — data integrity: tasks must be kept exactly as entered and survive restarts;
US2 — **Medium** — core flow with a guarded state transition; US3 — **Medium** — core flow, permanent removal by
design.

**High-level test cases** (QC-6) — titles only; one happy path per acceptance scenario, one edge case per user-facing
input, one negative case per guarded action:

| TC-ID | Scenario (US#-AS# / FR-###) | Title (observable outcome) | Type (happy-path / edge-case / negative) | Smoke (YES/NO) | Automation Candidate (YES/NO — reason if NO) | Data effect (read-only / creates / modifies / deletes) | Shared data |
|---|---|---|---|---|---|---|---|
| TC-TODO-001 | US1-AS1, FR-006, FR-015 | Opening the application with no tasks shows "No tasks yet." and the "New task" field, without sign-in | happy-path | YES | YES | read-only | D1 empty list |
| TC-TODO-002 | US1-AS2, FR-001, FR-004, FR-013 | Adding "Buy milk" shows it at the top as not completed and clears the field | happy-path | YES | YES | creates | — |
| TC-TODO-003 | US1-AS3, FR-002 | Pressing "Add" with an empty title shows "Enter a title for the task." and adds nothing | negative | NO | YES | read-only | — |
| TC-TODO-004 | US1-AS3, FR-002, FR-003 | A title of only spaces shows "Enter a title for the task." and adds nothing | negative | NO | YES | read-only | — |
| TC-TODO-005 | FR-003 | A title typed with spaces before and after is shown without them | edge-case | NO | YES | creates | — |
| TC-TODO-006 | US1-AS4, FR-012, SC-004 | Tasks added are shown with the same titles and states after reopening the application | happy-path | NO | YES | creates | — |
| TC-TODO-007 | US1-AS5, FR-005 | Every task shows its title and whether it is completed | happy-path | NO | YES | creates | — |
| TC-TODO-008 | US1-AS6, FR-001 | Typing past 100 characters leaves exactly 100 in the field, and adding saves that title | edge-case | NO | YES | creates | — |
| TC-TODO-009 | US1-AS6, FR-001 | Pasting 120 characters leaves the first 100 in the field, and adding saves them | edge-case | NO | YES | creates | — |
| TC-TODO-010 | US1-AS7, FR-001 | Adding a title that already exists adds a second task with no warning | edge-case | NO | YES | creates | — |
| TC-TODO-011 | US1-AS8, FR-005 | A newly added task appears above the tasks added before it | happy-path | NO | YES | creates | — |
| TC-TODO-012 | FR-001, Edge (double add) | Double-clicking "Add" adds exactly one task | edge-case | NO | YES | creates | — |
| TC-TODO-013 | US2-AS1, FR-007, FR-008 | Marking "Buy milk" as completed shows it as "Completed", visibly different from open tasks | happy-path | YES | YES | modifies | — |
| TC-TODO-014 | US2-AS2, FR-012, SC-004 | A completed task is still completed after reopening the application | happy-path | NO | YES | modifies | — |
| TC-TODO-015 | FR-007, US2-AS3 | Completing one task leaves another task not completed | happy-path | NO | YES | modifies | — |
| TC-TODO-016 | US2-AS4, FR-009 | A completed task offers no action to mark it as not completed | negative | NO | YES | modifies | — |
| TC-TODO-017 | US2-AS5, FR-005 | Completing a task does not change the order of the list | happy-path | NO | YES | modifies | — |
| TC-TODO-018 | US3-AS1, FR-010, FR-011 | Deleting "Buy milk" removes it at once with no confirmation, and the other task remains | happy-path | YES | YES | deletes | — |
| TC-TODO-019 | US3-AS2, FR-010 | A completed task can be deleted | happy-path | NO | YES | deletes | — |
| TC-TODO-020 | US3-AS3, FR-011, SC-004 | A deleted task is not shown after reopening, and no restore action exists | happy-path | NO | YES | deletes | — |
| TC-TODO-021 | US3-AS4, FR-006 | Deleting the only task shows "No tasks yet." | happy-path | NO | YES | deletes | D1 empty list |
| TC-TODO-022 | FR-014 | When the service cannot be reached, adding shows "The task was not added. Try again." and no task appears | negative | NO | YES | read-only | — |
| TC-TODO-023 | FR-014 | When the service cannot be reached, completing shows "The task was not marked as completed. Try again." and the task stays not completed | negative | NO | YES | modifies | — |
| TC-TODO-024 | FR-014 | When the service cannot be reached, deleting shows "The task was not deleted. Try again." and the task stays | negative | NO | YES | deletes | — |
| TC-TODO-025 | FR-014 | When the list cannot be loaded, "The tasks could not be loaded. Try again." is shown and "Try again" loads it | negative | NO | YES | read-only | — |
| TC-TODO-026 | Edge (gone), FR-014 | Completing a task someone else deleted shows "This task no longer exists." and removes it | negative | NO | YES | deletes | — |
| TC-TODO-027 | Edge (gone), FR-014 | Deleting a task someone else deleted shows "This task no longer exists." and removes it | negative | NO | YES | deletes | — |
| TC-TODO-028 | FR-016, SC-005 | Adding, completing and deleting a task works with the keyboard only | happy-path | NO | YES | creates | — |
| TC-TODO-029 | FR-016, SC-005 | The page has no critical or serious accessibility violations when empty, filled and showing an error | happy-path | NO | YES | creates | D1 empty list |
| TC-TODO-030 | FR-016, SC-005 | A screen reader announces each task's title and completion state and the result of each action | happy-path | NO | NO — screen-reader output needs human judgement | creates | — |
| TC-TODO-031 | FR-013, SC-003 | After add, complete and delete, the list shows the result within 1 second | happy-path | NO | YES | creates | — |
| TC-TODO-032 | FR-001, FR-007, FR-010, SC-001, SC-002 | First-time users add, complete and delete a task without help, adding the first in under 10 seconds | happy-path | NO | NO — usability session with real first-time users | creates | — |

Smoke: 4 of 32 (12.5 %), the one screen covered.

Negative categories covered or N/A with reason: invalid input TC-TODO-004; boundary TC-TODO-008, TC-TODO-009;
missing required TC-TODO-003; unauthorised N/A — no sign-in, every action is public by FR-015; error recovery
TC-TODO-022 to TC-TODO-027. Techniques and interaction patterns applied: equivalence partitioning (empty, spaces only,
normal, padded title); boundary values (100 / 101 characters, typed and pasted); state transition (not completed →
completed, completed → no action, any → deleted, plus the invalid "reopen"); error guessing with spec-stated outcomes
(double add, task gone, connection lost); loading two-step (indicator appears, list ready) on every page load; the
"Add" click / Enter is its own trigger step; no hidden UI to reveal.

**Test data** (QC-7) — by reference only; never a URL, username or password:

| Ref | What | Source / status |
|---|---|---|
| E1 | Application base URL — local build (web app dev server) | secret name `E1_URL`; UNKNOWN until the run |
| — | Accounts | N/A — no sign-in (FR-015) |
| D1 | Empty task list | api (public delete per task, contract confirmed; local only — research R9); UNKNOWN until the run |
| D2 | Tasks owned by the case, titles prefixed with the run prefix (for example "QA-<run>-Buy milk") | e2e scenario (added through the page in the case's own setup); READY by design |
| D3 | A 100-character and a 120-character title | inline in the case; READY |

**Developer testability asks** (QC-6):
- stable test ids on: the "New task" input, "Add" button, task list, each task item (with the task id), each item's
  title, state text, "Mark as completed" and "Delete" buttons, the empty message, the error message, the live region,
  the loading indicator and the "Try again" button;
- the readiness endpoint `/actuator/health/readiness` and the local run commands of [quickstart.md](quickstart.md);
- API responses that make tasks identifiable (`id` in the item test id) so cases can clean up only their own tasks.

**Automation approach** (QC-9, QC-11): default — browser cases with Automation Candidate YES (30) → skill
`link-qc-5-test-run-automation` under `Testing/Automation`, run serially (shared global list, research R9); failure
cases use request interception; API behaviour is also covered by the developer service tests above; manual-only →
TC-TODO-030 (screen reader, Medium: human-observed step) and TC-TODO-032 (usability session, Medium: human-observed
step).

- [x] Every acceptance scenario and FR in scope has at least one TC-ID; no NEEDS CLARIFICATION is left under Technical
      Context → Testing.

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-list/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/
│   └── task-service.openapi.yaml
├── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
└── TEST-CASES-001-todo-list.md  # acceptance test cases, written by the Phase 2 (QC) task of tasks.md
```

### Source Code

```text
implementation/
├── dev/
│   ├── docker-compose.yml          # PostgreSQL 18.6 on 55432, database todo
│   └── .env.example                # variable names only; .env is git-ignored
├── backend/task-service/
│   ├── pom.xml, mvnw               # Spring Boot 4.1.1 parent, postgresql.version 42.7.14
│   └── src/
│       ├── main/java/com/todo/taskservice/
│       │   ├── controller/  service/  repository/  entity/  dto/  exception/  common/
│       ├── main/resources/
│       │   ├── application.yml, application-local.yml
│       │   └── db/migration/V1__create_task.sql
│       └── test/java/com/todo/taskservice/
└── frontend/todo-web-app/
    ├── package.json, vite.config.ts, tsconfig.json, .nvmrc
    └── src/
        ├── pages/TaskListPage/
        ├── components/             # TaskForm, TaskList, TaskItem, StatusMessage
        ├── api/                    # tasksApi.ts (fetch, 10 s timeout, problem mapping)
        └── common/
Testing/Automation/                 # acceptance automation (QC-owned), created by the (QC) tasks
```

**Structure Decision**: (1) Project default layout — all code under `implementation/`, by side, one folder per
component — with the packages and folders of `architecture/cross-cutting/code-structure.md`; no deviation.
(2) This feature introduces both components and the local environment, so it sets their folders
(`implementation/backend/task-service`, `implementation/frontend/todo-web-app`, `implementation/dev`). (3) No later
feature is in the feature map yet; future task features add their classes to the Task Service and their components
to the To-Do Web App.

## Complexity Tracking

No violations: the Constitution Check and the Architecture Check pass without exceptions.
