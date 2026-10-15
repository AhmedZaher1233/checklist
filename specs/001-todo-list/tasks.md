---

description: "Task list for 001 To-Do List"
---

# Tasks: To-Do List

**Input**: Design documents from `/specs/001-todo-list/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Delivery**: Partially implemented — manual test cases TC-TODO-030 and TC-TODO-032 pending (T081) <!-- Same value and note as the feature map and plan.md: Planned · Partially
implemented — <what is pending> · Implemented. Kept in step by /amend, an approved ACR, and the closing task. -->

**Tests**: Tests are REQUIRED: one test task per row of plan.md → Test Design, in the story the scenario belongs to.
The spec's acceptance scenarios are the source of truth for expected behaviour. Rows of the Test Design that span
several stories (Edge "gone", FR-014, FR-016) are split so each story tests its own action.

**Acceptance tests (QC)**: rows marked `(QC)` are mandated by the constitution's Quality Control section (QC-3) in
addition to the developer test tasks above; they are emitted with real task IDs and paths and are omitted only when
plan.md → Test Design marks their scope N/A.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Reviewed**: 2026-10-13 — Tech lead

**Project override**: `.specify/templates/overrides/tasks-template.md`. Adds component tasks from the plan's
Component Decisions and mandatory closing tasks (DevOps handover, Component Register, feature map).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- **[Comp]**: Component task generated from the plan's Component Decisions; `(needed by: …)` states which user stories
  depend on it
- Include exact file paths in descriptions

## Path Conventions

- **TS** = `implementation/backend/task-service` — Java sources in `src/main/java/com/todo/taskservice/`, tests in
  `src/test/java/com/todo/taskservice/`, resources in `src/main/resources/`
- **WA** = `implementation/frontend/todo-web-app` — sources and `*.test.tsx` in `src/`
- **DEV** = `implementation/dev`
- **Acceptance automation**: `Testing/Automation/` (constitution, Quality Control configuration: AUTOMATION_ROOT)
- Messages shown to the user are exactly the texts of research.md R8; problem types are those of
  `contracts/task-service.openapi.yaml`

---

## Phase 0: Environment check

**Purpose**: Find missing tools before writing code. Report what is missing; code is still written, but verification
waits for it.

- [X] T000 Check the environment: JDK 21 (`java -version`), Maven 3.9 (`mvn -v`), Node.js 24 LTS and npm (`node -v`,
  `npm -v` — **not installed on the reference machine**), Docker with Compose (`docker compose version`), Playwright
  Chromium (installed later by the automation root); host ports 55432, 8080 and 5173 free

---

## Phase 1: Components (from plan.md → Component Decisions)

**Purpose**: Create the two approved components and the local environment — only what this feature needs.

- [X] T001 [Comp] Create the local environment in implementation/dev/docker-compose.yml (service `todo-db`, image
  `postgres:18.6`, host port 55432 → 5432, database `todo`, `TZ=UTC`, named volume, `pg_isready` health check,
  credentials from `.env`) and implementation/dev/.env.example (`POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
  with placeholder values); add `implementation/dev/.env`, `Testing/Automation/.env`, `**/node_modules/`,
  `**/target/` and `**/dist/` to the repository root .gitignore (needed by: US1, US2, US3)
- [X] T002 [Comp] Create the Task Service in implementation/backend/task-service with Spring Initializr: Spring Boot
  4.1.1, Java 21, Maven Wrapper 3.9.16, group `com.todo`, artifact `task-service`, package `com.todo.taskservice`;
  dependencies `spring-boot-starter-web`, `-data-jpa`, `-validation`, `-actuator`, `flyway-core`,
  `flyway-database-postgresql`, `postgresql` (property `postgresql.version` = 42.7.14 in pom.xml),
  `springdoc-openapi-starter-webmvc-ui` 3.1.1, test: `spring-boot-starter-test`, `spring-boot-testcontainers`,
  `testcontainers-postgresql`; create the empty packages `controller`, `service`, `repository`, `entity`, `dto`,
  `exception`, `common` (architecture/cross-cutting/code-structure.md) (needed by: US1, US2, US3)
- [X] T003 [Comp] Configure the Task Service in TS/src/main/resources/application.yml and application-local.yml:
  `server.port` 8080; datasource URL, user and password from `TODO_DB_URL` (local default
  `jdbc:postgresql://localhost:55432/todo`), `TODO_DB_USER`, `TODO_DB_PASSWORD`; Hikari `connection-timeout` 5000 ms;
  statement timeout 10 s (`options=-c statement_timeout=10000` on the URL); `spring.jpa.hibernate.ddl-auto=validate`,
  `spring.jpa.open-in-view=false`, `hibernate.jdbc.time_zone=UTC`; Flyway enabled; Actuator exposes only `health`
  with liveness and readiness groups, readiness including `db`; structured JSON console logging; springdoc at
  `/v3/api-docs` (needed by: US1, US2, US3)
- [X] T004 [P] [Comp] Add the Task Service's common mechanisms in TS/src/main/java/com/todo/taskservice/common/:
  `ClockConfig` (UTC `Clock` bean), `CorrelationIdFilter` (reads or creates `X-Correlation-Id`, puts it in MDC,
  returns it), `RequestLoggingFilter` (one INFO line: method, path template, status, duration — never bodies or
  titles), `SecurityHeadersFilter` (`X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`,
  `Content-Security-Policy: default-src 'self'`) (needed by: US1, US2, US3)
- [X] T005 [P] [Comp] Add the Task Service's error handling in TS/src/main/java/com/todo/taskservice/exception/:
  `ProblemTypes` constants (`/problems/validation`, `/problems/task-not-found`, `/problems/task-completion-final`,
  `/problems/service-unavailable`, `/problems/internal`), `ApiFieldError` record, and `GlobalExceptionHandler`
  (`@RestControllerAdvice`) returning `application/problem+json`: unreadable body → 400 validation with code
  `invalid`; database connection or resource failures → 503 service-unavailable; anything else → 500 internal with a
  generic title, logged in full at ERROR, never stack traces or class names in the body (needed by: US1, US2, US3)
- [X] T006 [Comp] Add the Testcontainers base class TS/src/test/java/com/todo/taskservice/AbstractPostgresIT.java
  (`@SpringBootTest`, `@AutoConfigureMockMvc`, PostgreSQL 18.6 container with `@ServiceConnection`, table cleanup
  before each test, fixed-instant `Clock` override available to subclasses) (needed by: US1, US2, US3)
- [X] T007 [Comp] Test for plan Test Design row "Cross-cutting": every response carries `X-Correlation-Id` (echoed
  when sent, generated when not), errors are `application/problem+json` without stack traces, security headers are
  present, `/actuator/health/readiness` is UP with the database, in
  TS/src/test/java/com/todo/taskservice/common/CrossCuttingIT.java (depends on T003–T006)
- [X] T008 [Comp] Create the To-Do Web App in implementation/frontend/todo-web-app with
  `npm create vite@latest -- --template react-ts`; pin `react`/`react-dom` 19.3.0, `typescript` 6.0.3, `vite` 8.3.4,
  `vitest` 5.0.4, `@testing-library/react` 16.3.3, `@testing-library/dom` 10.4.2, `@testing-library/user-event` 14.x,
  `jsdom`; add `.nvmrc` (`24`) and `engines.node` `>=24`; strict tsconfig; folders `src/pages`, `src/components`,
  `src/api`, `src/common`; render `<App/>` inside `React.StrictMode` in src/main.tsx; vite.config.ts: dev server port
  5173 with `strictPort`, proxy `/api` → `http://localhost:8080`, headers `X-Content-Type-Options: nosniff` and
  `Referrer-Policy: no-referrer`, Vitest `environment: 'jsdom'` with setup file src/test-setup.ts; scripts `dev`,
  `build`, `test`, `typecheck` (needed by: US1, US2, US3)
- [X] T009 [P] [Comp] Create the HTTP layer in WA/src/api/http.ts: `request<T>()` using relative URLs, JSON
  headers, a 10-second `AbortController` timeout (also accepting a caller signal), parsing `application/problem+json`
  into `ApiError { kind: 'problem' | 'network' | 'timeout' | 'aborted', status?, type?, fieldErrors? }`, never retrying;
  with tests in WA/src/api/http.test.ts for success, problem parsing, network failure and timeout (needed by: US1,
  US2, US3)

---

## Phase 2: Foundational (Feature Prerequisites)

**Purpose**: The task table and entity every story uses, and the acceptance test-case file.

- [X] T010 Create the migration TS/src/main/resources/db/migration/V1__create_task.sql: table `task` (`id uuid`
  primary key, `title varchar(100) not null` with `CHECK (char_length(title) BETWEEN 1 AND 100)`, `completed boolean
  not null default false`, `created_at timestamptz not null`) and index `ix_task_created_at_id` on
  `(created_at DESC, id DESC)` (data-model.md) (needed by: US1, US2, US3)
- [X] T011 [P] Create `Task` entity in TS/src/main/java/com/todo/taskservice/entity/Task.java, `TaskRepository`
  (Spring Data, `findAllByOrderByCreatedAtDescIdDesc()`) in repository/TaskRepository.java, `TaskResponse` record
  (`id`, `title`, `completed`, `createdAt` as `Instant`) and its mapping in dto/TaskResponse.java, and the shared
  `Task` TypeScript type in WA/src/api/types.ts (needed by: US1, US2, US3)
- [X] T012 (QC) Expand plan.md → Test Design → Acceptance test cases into specs/001-todo-list/TEST-CASES-001-todo-list.md
  using .specify/templates/overrides/test-cases-template.md: one test case per high-level row (TC-TODO-001 …
  TC-TODO-032, same TC-ID, Type, Smoke, Automation Candidate, Data effect, Shared data; Locale en), steps per
  constitution QC-6 (every page load asserted as two steps: "Loading tasks…" appears, then the list is ready; the
  "Add" click or Enter is its own step; expected messages inline as in research.md R8; titles prefixed with the run
  prefix per research.md R9), `## Test Data` from the plan's Test data table (E1, D1, D2, D3; no accounts — no
  sign-in), header line `**Status:** APPROVED — generated YYYY-MM-DD from the Approved spec and the reviewed plan`
  (a generated status, not a human approval) (needed by: all stories)

**Checkpoint**: Each user story can begin as soon as the component and foundational tasks it needs are complete

---

## Phase 3: User Story 1 - Add a task and see it in the list (Priority: P1) 🎯 MVP

**Goal**: Anyone can open the page without signing in, see all tasks newest first (or "No tasks yet."), and add a
task with a title of up to 100 characters; tasks survive restarts.

**Independent Test**: Open the application with no tasks, add two tasks with different titles, and check that
both appear newest first as not completed and are still there after the application is closed and reopened.

### Tests for User Story 1 (from plan.md → Test Design → Developer tests) ⚠️

- [X] T013 [P] [US1] Test for US1-AS1: empty database → `GET /api/v1/tasks` returns 200 and `[]` in
  TS/src/test/java/com/todo/taskservice/controller/TaskListIT.java
- [X] T014 [P] [US1] Test for US1-AS1: the page with an empty list shows "No tasks yet." and the input labelled "New
  task", and no sign-in element, in WA/src/pages/TaskListPage/TaskListPage.test.tsx
- [X] T015 [P] [US1] Test for US1-AS2: `POST` `{"title":"Buy milk"}` → 201 with `completed=false` and a `Location`
  header; a later `GET` lists it, in TS/src/test/java/com/todo/taskservice/controller/TaskCreateIT.java
- [X] T016 [US1] Test for US1-AS2: adding "Buy milk" shows it at the top as not completed, clears the input and
  announces "Task added.", in WA/src/pages/TaskListPage/TaskListPage.test.tsx
- [X] T017 [US1] Test for US1-AS3: `POST` with `""`, `"   "` and no title → 400 `/problems/validation` with
  `title`/`required`, and nothing stored, in TS/src/test/java/com/todo/taskservice/controller/TaskCreateIT.java
- [X] T018 [P] [US1] Test for US1-AS3: submitting an empty or white-space title shows "Enter a title for the task."
  and sends no request, in WA/src/components/TaskForm/TaskForm.test.tsx
- [X] T019 [US1] Test for US1-AS4: tasks created before the application context restarts are returned unchanged
  (title, state, `createdAt`) afterwards, in TS/src/test/java/com/todo/taskservice/controller/TaskListIT.java
- [X] T020 [US1] Test for US1-AS5: the list response contains `title` and `completed` for every task (one completed
  task inserted through the repository), in TS/src/test/java/com/todo/taskservice/controller/TaskListIT.java
- [X] T021 [P] [US1] Test for US1-AS5: each item shows its title as text and its state (completed items show
  "Completed" and a struck-through title), in WA/src/components/TaskList/TaskList.test.tsx
- [X] T022 [P] [US1] Test for US1-AS6 (unit): `TaskService.createTask` accepts 100 characters, rejects 101 with
  `too-long`, accepts `"  " + 100 characters + "  "` and stores the stripped title, in
  TS/src/test/java/com/todo/taskservice/service/TaskServiceTest.java
- [X] T023 [US1] Test for US1-AS6 (service): 100 characters → 201; 101 → 400 `title`/`too-long`, in
  TS/src/test/java/com/todo/taskservice/controller/TaskCreateIT.java
- [X] T024 [US1] Test for US1-AS6: the input has `maxlength` 100; typing past it and pasting 120 characters both
  leave the first 100, and adding sends that title, in WA/src/components/TaskForm/TaskForm.test.tsx
- [X] T025 [US1] Test for US1-AS7: two `POST` "Buy milk" → two tasks with different ids, both listed, in
  TS/src/test/java/com/todo/taskservice/controller/TaskCreateIT.java
- [X] T026 [US1] Test for US1-AS8: tasks created at fixed clock instants are listed newest first, and tasks with equal
  instants by id descending, in TS/src/test/java/com/todo/taskservice/service/TaskServiceTest.java and
  TS/src/test/java/com/todo/taskservice/controller/TaskListIT.java
- [X] T027 [US1] Test for US1 edge (strip): `"  Buy milk  "` and a title wrapped in non-breaking spaces are stored as
  `"Buy milk"`, in TS/src/test/java/com/todo/taskservice/service/TaskServiceTest.java
- [X] T028 [US1] Test for US1 edge (double add): two quick clicks on "Add" (and Enter twice) send one request and
  add one task, in WA/src/components/TaskForm/TaskForm.test.tsx
- [X] T029 [US1] Test for FR-014 (load and add): a failed load (500, 503, network, timeout) shows "The tasks could
  not be loaded. Try again." with a working "Try again" button; a failed add shows "The task was not added. Try
  again." and adds nothing, in WA/src/pages/TaskListPage/TaskListPage.test.tsx
- [X] T030 [US1] Test for FR-014 (service): with the database container stopped, `GET` and `POST` return 503
  `/problems/service-unavailable` with no internal details, and readiness is DOWN, in
  TS/src/test/java/com/todo/taskservice/controller/TaskUnavailableIT.java
- [X] T031 [US1] Test for FR-016 (add): typing a title and pressing Enter adds it using the keyboard only; focus
  stays in the input; the result is announced in the live region, in WA/src/components/TaskForm/TaskForm.test.tsx

### Implementation for User Story 1

- [X] T032 [US1] Implement `CreateTaskRequest` record in TS/src/main/java/com/todo/taskservice/dto/CreateTaskRequest.java
  and `TaskService.listTasks()` and `createTask(String title)` in service/TaskService.java: `String.strip()`, empty →
  `TaskValidationException(title, required)`, `length() > 100` → `TaskValidationException(title, too-long)`, random
  UUID, `createdAt = Instant.now(clock)` truncated to microseconds, `completed = false` (research R1–R3)
- [X] T033 [US1] Implement `GET /api/v1/tasks` (200) and `POST /api/v1/tasks` (201, body `TaskResponse`, `Location`
  header) in TS/src/main/java/com/todo/taskservice/controller/TaskController.java, translating only; OpenAPI
  annotations matching contracts/task-service.openapi.yaml with no security requirement (public)
- [X] T034 [US1] Map `TaskValidationException` to 400 `/problems/validation` with the `errors` list in
  TS/src/main/java/com/todo/taskservice/exception/GlobalExceptionHandler.java (and the exception class in
  exception/TaskValidationException.java)
- [X] T035 [P] [US1] Implement `listTasks(signal)` and `createTask(title)` in WA/src/api/tasksApi.ts on top of
  WA/src/api/http.ts
- [X] T036 [P] [US1] Implement `StatusMessage` in WA/src/components/StatusMessage/StatusMessage.tsx: a polite live
  region (`role="status"`) for results and a visible error message area
- [X] T037 [P] [US1] Implement `TaskList` and `TaskItem` in WA/src/components/TaskList/: semantic `ul`/`li`, title
  rendered as text, completed items show "Completed" and a struck-through title, "No tasks yet." when empty
- [X] T038 [P] [US1] Implement `TaskForm` in WA/src/components/TaskForm/TaskForm.tsx: visible label "New task",
  input `maxlength={100}`, "Add" button, Enter submits, empty-after-strip → "Enter a title for the task." without a
  request, disabled and ignoring submits while in flight, clears and keeps focus after success (research R6)
- [X] T039 [US1] Implement `TaskListPage` in WA/src/pages/TaskListPage/TaskListPage.tsx and render it from
  WA/src/App.tsx: heading "To-Do List", `useReducer` state, load on mount with an `AbortController` cleaned up on
  unmount (StrictMode-safe), "Loading tasks…", load error with "Try again", insert a created task at the top, R8
  messages and "Task added." announcement (research R7, R8)
- [X] T040 [US1] (QC) Deliver the testability asks for US1: stable `data-testid` on the "New task" input, "Add"
  button, task list, each task item (`task-item-<id>`), item title, state text, empty message, error message, live
  region, loading indicator and "Try again" button, in WA/src/components/ and WA/src/pages/TaskListPage/

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Mark a task as completed (Priority: P2)

**Goal**: A not-completed task can be marked as completed; it is shown clearly as completed, keeps its place, stays
completed, and can never be set back.

**Independent Test**: With one not-completed task in the list, mark it as completed and check that it is shown as
completed, stays completed after reopening, offers no way back, and the other tasks are unchanged.

US2 builds on the list page of US1 (T039) to show the result of completing.

### Tests for User Story 2 (from plan.md → Test Design → Developer tests) ⚠️

- [X] T041 [P] [US2] Test for US2-AS1: `PATCH {"completed":true}` → 200 with `completed=true`; repeating it → 200
  unchanged, in TS/src/test/java/com/todo/taskservice/controller/TaskCompleteIT.java
- [X] T042 [P] [US2] Test for US2-AS1: "Mark "Buy milk" as completed" shows "Completed" and the struck-through title
  only after the response, and announces "Task marked as completed.", in
  WA/src/pages/TaskListPage/TaskListPage.complete.test.tsx
- [X] T043 [US2] Test for US2-AS2: a completed task is returned as completed by a later `GET`, in
  TS/src/test/java/com/todo/taskservice/controller/TaskCompleteIT.java
- [X] T044 [US2] Test for US2-AS3: completing one task leaves the others `completed=false`, in
  TS/src/test/java/com/todo/taskservice/controller/TaskCompleteIT.java
- [X] T045 [P] [US2] Test for US2-AS4 (unit): `TaskService.completeTask(id, false)` on a completed task throws
  `CompletionFinalException` and leaves it completed, in TS/src/test/java/com/todo/taskservice/service/TaskServiceCompleteTest.java
- [X] T046 [US2] Test for US2-AS4 (service): `PATCH {"completed":false}` on a completed task → 409
  `/problems/task-completion-final`, task unchanged, in TS/src/test/java/com/todo/taskservice/controller/TaskCompleteIT.java
- [X] T047 [P] [US2] Test for US2-AS4: a completed task renders no "Mark as completed" button, in
  WA/src/components/TaskList/TaskItem.complete.test.tsx
- [X] T048 [US2] Test for US2-AS5: completing a task does not change its position in `GET`, in
  TS/src/test/java/com/todo/taskservice/controller/TaskCompleteIT.java
- [X] T049 [US2] Test for Edge (gone, complete): `PATCH` on an unknown id and on a malformed id → 404
  `/problems/task-not-found`, in TS/src/test/java/com/todo/taskservice/controller/TaskCompleteIT.java
- [X] T050 [US2] Test for Edge (gone, complete): a 404 on complete removes the item and shows "This task no longer
  exists.", in WA/src/pages/TaskListPage/TaskListPage.complete.test.tsx
- [X] T051 [US2] Test for FR-014 (complete): a failed complete (500, 503, network, timeout) shows "The task was not
  marked as completed. Try again." and the task stays not completed, in
  WA/src/pages/TaskListPage/TaskListPage.complete.test.tsx
- [X] T052 [US2] Test for FR-016 (complete): the "Mark as completed" button is reachable with Tab, works with Enter
  and Space, has an accessible name containing the title, and the result is announced, in
  WA/src/pages/TaskListPage/TaskListPage.complete.test.tsx

### Implementation for User Story 2

- [X] T053 [US2] Implement `UpdateTaskRequest` record in TS/src/main/java/com/todo/taskservice/dto/UpdateTaskRequest.java
  and `TaskService.completeTask(UUID id, boolean completed)` in service/TaskService.java: missing →
  `TaskNotFoundException`; `completed=false` on a completed task → `CompletionFinalException`; `false` on a
  not-completed task → returned unchanged; otherwise set `completed=true` (repeatable) (research R4)
- [X] T054 [US2] Implement `PATCH /api/v1/tasks/{id}` (200, body `TaskResponse`) in
  TS/src/main/java/com/todo/taskservice/controller/TaskController.java with public OpenAPI annotations
- [X] T055 [US2] Add `TaskNotFoundException` and `CompletionFinalException` in TS/src/main/java/com/todo/taskservice/exception/
  and map them in GlobalExceptionHandler.java to 404 `/problems/task-not-found` and 409
  `/problems/task-completion-final`; map a non-UUID path id to 404 `/problems/task-not-found`
- [X] T056 [P] [US2] Implement `completeTask(id)` (sends `{"completed":true}`) in WA/src/api/tasksApi.ts
- [X] T057 [US2] Add the "Mark as completed" button to not-completed items in WA/src/components/TaskList/TaskItem.tsx
  (accessible name `Mark as completed: <title>`, `onComplete` prop, disabled while its request is in flight; none on
  completed items)
- [X] T058 [US2] Handle completing in WA/src/pages/TaskListPage/TaskListPage.tsx: replace the item with the response,
  keep its position, announce "Task marked as completed."; 404 → remove the item and show "This task no longer
  exists."; other failures → "The task was not marked as completed. Try again." with the list unchanged
- [X] T059 [US2] (QC) Deliver the testability ask for US2: stable `data-testid` on each item's "Mark as completed"
  button (`task-complete-<id>`), in WA/src/components/TaskList/TaskItem.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Delete a task (Priority: P3)

**Goal**: Any task, completed or not, can be deleted at once, with no confirmation and no way to restore it.

**Independent Test**: With two tasks in the list, delete one and check that it disappears immediately without a
confirmation step, and that only the other remains, including after reopening.

US3 builds on the list page of US1 (T039) to show the result of deleting.

### Tests for User Story 3 (from plan.md → Test Design → Developer tests) ⚠️

- [X] T060 [P] [US3] Test for US3-AS1: `DELETE` → 204 and the task is no longer listed, in
  TS/src/test/java/com/todo/taskservice/controller/TaskDeleteIT.java
- [X] T061 [P] [US3] Test for US3-AS1: "Delete" removes the item after the response with no confirmation dialog,
  announces "Task deleted." and moves focus to the next item's "Delete" button, else the previous one, else the "New
  task" input, in WA/src/pages/TaskListPage/TaskListPage.delete.test.tsx
- [X] T062 [US3] Test for US3-AS2: deleting a completed task → 204, in
  TS/src/test/java/com/todo/taskservice/controller/TaskDeleteIT.java
- [X] T063 [US3] Test for US3-AS3: a deleted task is not returned later, and a second `DELETE` → 404
  `/problems/task-not-found`, in TS/src/test/java/com/todo/taskservice/controller/TaskDeleteIT.java
- [X] T064 [US3] Test for US3-AS4: deleting the last item shows "No tasks yet.", in
  WA/src/pages/TaskListPage/TaskListPage.delete.test.tsx
- [X] T065 [US3] Test for Edge (gone, delete): `DELETE` on an unknown id and on a malformed id → 404
  `/problems/task-not-found`, in TS/src/test/java/com/todo/taskservice/controller/TaskDeleteIT.java
- [X] T066 [US3] Test for Edge (gone, delete): a 404 on delete removes the item and shows "This task no longer
  exists.", in WA/src/pages/TaskListPage/TaskListPage.delete.test.tsx
- [X] T067 [US3] Test for FR-014 (delete): a failed delete (500, 503, network, timeout) shows "The task was not
  deleted. Try again." and the task stays, in WA/src/pages/TaskListPage/TaskListPage.delete.test.tsx
- [X] T068 [US3] Test for FR-016 (delete): the "Delete" button is reachable with Tab, works with Enter and Space, has
  an accessible name containing the title, and the result is announced, in
  WA/src/pages/TaskListPage/TaskListPage.delete.test.tsx

### Implementation for User Story 3

- [X] T069 [US3] Implement `TaskService.deleteTask(UUID id)` in TS/src/main/java/com/todo/taskservice/service/TaskService.java:
  physical delete; missing → `TaskNotFoundException` (create it here if US2 is not built yet) (research R5)
- [X] T070 [US3] Implement `DELETE /api/v1/tasks/{id}` (204) in
  TS/src/main/java/com/todo/taskservice/controller/TaskController.java with public OpenAPI annotations; ensure the
  404 mapping of T055 exists (add it here if US2 is not built yet)
- [X] T071 [P] [US3] Implement `deleteTask(id)` in WA/src/api/tasksApi.ts
- [X] T072 [US3] Add the "Delete" button to every item in WA/src/components/TaskList/TaskItem.tsx (accessible name
  `Delete: <title>`, `onDelete` prop, no confirmation, disabled while its request is in flight)
- [X] T073 [US3] Handle deleting in WA/src/pages/TaskListPage/TaskListPage.tsx: remove the item after the response,
  announce "Task deleted.", move focus as designed in plan.md (Design → Web application); 404 → remove and show "This
  task no longer exists."; other failures → "The task was not deleted. Try again." with the list unchanged
- [X] T074 [US3] (QC) Deliver the testability ask for US3: stable `data-testid` on each item's "Delete" button
  (`task-delete-<id>`), in WA/src/components/TaskList/TaskItem.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Whole-feature verification and acceptance testing

- [X] T075 Run all developer tests and checks: `./mvnw verify` in implementation/backend/task-service (Testcontainers
  needs Docker) and `npm run typecheck`, `npm test` and `npm run build` in implementation/frontend/todo-web-app; fix
  every failure
- [X] T076 Verify the contract: compare the running service's `/v3/api-docs` with
  specs/001-todo-list/contracts/task-service.openapi.yaml (paths, methods, status codes, schemas, public access) and fix
  any difference in the code
- [X] T077 (QC) Confirm that the Quality Control configuration table of .specify/memory/constitution.md has the local
  environment, LOCAL_RUN_COMMAND, readiness check, runner and E1 values (from specs/001-todo-list/research.md R10);
  while any is still TODO, report the automation run as BLOCKED — configuration missing and ask for
  `/speckit-constitution`
- [X] T078 (QC) Build and start the application locally with LOCAL_RUN_COMMAND (specs/001-todo-list/quickstart.md →
  Start); confirm readiness `UP` and that the [E1] base URL responds with the task list page (no account: no sign-in)
- [X] T079 (QC) Run the acceptance automation with skill link-qc-5-test-run-automation on
  specs/001-todo-list/TEST-CASES-001-todo-list.md (User Story label "001-todo-list", environment local,
  `ado_mode: local`, `qa_standards: .specify/memory/constitution.md`, automation root `Testing/Automation`, Playwright
  1.64.0 with `@axe-core/playwright` 4.13.0, coverage target 80 % / soft block, SMOKE_GATE 30 %; data-changing cases
  serial per research.md R9). The skill writes TEST-RUN-REPORT-001-todo-list.md and BUG-REPORT-001-todo-list.md under
  Testing/Automation/reports/001-todo-list/
- [X] T080 (QC) Fix in product code every Severity 1–2 / P1–P2 bug the run recorded in
  Testing/Automation/reports/001-todo-list/BUG-REPORT-001-todo-list.md and re-run the affected cases with the same
  skill as a new phase (QC-9, QC-14); a wrong, missing or unnecessary test step found on the way is corrected per QC-8
  (Enhancement Log row)
- [ ] T081 (QC) Execute the manual-only test cases TC-TODO-030 (screen reader) and TC-TODO-032 (first-time-user
  usability session, [HUMAN] steps) on the local build and record PASS / FAIL / BLOCKED / NOT RUN / N/A per case in the
  `## Execution Results` table of specs/001-todo-list/TEST-CASES-001-todo-list.md (QC-13); file any defect in
  Testing/Automation/reports/001-todo-list/BUG-REPORT-001-todo-list.md
- [ ] T082 (QC, optional) Visual audit of the task list page (empty, filled, error states) with skill
  link-qc-6-ui-testing (URL [E1], `breakpoints` = 320, 375, 425, 768, 1024, 1280, 1440, `locales` = en,
  `qa_standards: .specify/memory/constitution.md`; requires Testing/qa-manifest.json)
- [X] T083 Run specs/001-todo-list/quickstart.md validation (API table and browser steps) and record the result

---

## Phase Final: Closing tasks (MANDATORY)

**Purpose**: Record what this feature **actually** introduced or changed. Run after `/speckit-implement`; then
`/speckit-converge` checks the result (it runs after every implement).

- [X] T084 Write the DevOps handover details (how to build and run it, ports, health endpoints, configuration keys and
  environment variables) in implementation/backend/task-service/README.md and
  implementation/frontend/todo-web-app/README.md — from the real code. No deployment manifests or infrastructure
  configuration (DevOps team responsibility).
- [X] T085 Update architecture/component-register.md: Task Service and To-Do Web App → status `Introduced`, locations
  `implementation/backend/task-service` and `implementation/frontend/todo-web-app`, `Introduced by: 001-todo-list`.
  Verify each entry against the repository.
- [X] T086 Update this feature's Delivery in specs/feature-map.md **and in the Delivery line of plan.md and tasks.md**:
  `Implemented` only when every story of the current spec is built, all tests pass, the acceptance automation run is
  recorded in TEST-RUN-REPORT-001-todo-list.md, the manual-only cases are recorded in `## Execution Results`, no
  Severity 1–2 / P1–P2 defect of this feature is open (constitution QC-14), and `/speckit-converge` reports no gaps;
  otherwise `Partially implemented`, with the pending stories in the note.

**The feature is not complete until this task is done.**

---

## Dependencies & Execution Order

### Phase Dependencies

- **Environment (Phase 0)**: T000 first; missing tools block verification, not code writing
- **Components (Phase 1)**: T001–T003 in order; then T004, T005, T009 in parallel; T006 after T003; T007 after
  T003–T006; T008 before T009. Every component task is needed by US1, US2 and US3
- **Foundational (Phase 2)**: T010 after T002; T011 after T002 and T008; T012 can run any time after plan review
- **User Stories (Phase 3+)**: US1 needs T001–T011. US2 and US3 also need US1's list page (T035–T039) to show their
  results; their service tasks only need Phase 1–2
- **Polish (Phase 6)**: after the stories in scope; T079–T081 need T012, T077 and T078
- **Closing (Final)**: after everything else; then `/speckit-converge`

### User Story Dependencies

- **User Story 1 (P1)**: Phase 1 and Phase 2 only
- **User Story 2 (P2)**: Phase 1–2, plus US1's `TaskListPage`, `TaskList` and `tasksApi.ts` for the screen part
- **User Story 3 (P3)**: Phase 1–2, plus US1's `TaskListPage`, `TaskList` and `tasksApi.ts`; T069/T070 create the 404
  handling themselves if US2 is not built yet

### Within Each User Story

- Tests first (they fail until the implementation exists)
- Service before controller before exception mapping; API module before components before the page
- Story complete before moving to the next priority

### Parallel Opportunities

- Phase 1: T004, T005 and T009 (different packages and apps)
- Phase 2: T011 with T010; T012 independently
- US1 tests: T013, T014, T015, T018, T021, T022 start together (different files)
- US1 implementation: T035, T036, T037, T038 (different web-app files) while T032–T034 run on the service
- US2: T041, T042, T045, T047 together; T056 in parallel with T053–T055
- US3: T060, T061 together; T071 in parallel with T069–T070
- Back end and front end of any story can be built by two people at once

---

## Parallel Example: User Story 1

```bash
# Launch the first tests for User Story 1 together:
Task: "Test for US1-AS1: empty database → GET returns [] in TS/.../controller/TaskListIT.java"
Task: "Test for US1-AS1: empty page shows 'No tasks yet.' in WA/src/pages/TaskListPage/TaskListPage.test.tsx"
Task: "Test for US1-AS2: POST Buy milk → 201 in TS/.../controller/TaskCreateIT.java"
Task: "Test for US1-AS3: empty title message in WA/src/components/TaskForm/TaskForm.test.tsx"
Task: "Test for US1-AS6 (unit) in TS/.../service/TaskServiceTest.java"

# Then build the web-app parts together:
Task: "Implement listTasks/createTask in WA/src/api/tasksApi.ts"
Task: "Implement StatusMessage in WA/src/components/StatusMessage/StatusMessage.tsx"
Task: "Implement TaskList and TaskItem in WA/src/components/TaskList/"
Task: "Implement TaskForm in WA/src/components/TaskForm/TaskForm.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. T000, then Phase 1 and Phase 2 (T001–T012)
2. Phase 3: User Story 1 (T013–T040)
3. **STOP and VALIDATE**: run the US1 tests and quickstart steps 1–3 and 6
4. Demo if ready

### Incremental Delivery

1. Components and foundation
2. User Story 1 → test → demo (MVP)
3. User Story 2 → test → demo
4. User Story 3 → test → demo
5. Polish (acceptance run) and closing tasks

### Parallel Team Strategy

1. Together: Phase 1–2
2. Then: Developer A on the Task Service side of US1 → US2 → US3; Developer B on the web-app side; QC on T012 and the
   automation root

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Never recreate a component the plan marks Reuse or Extend
- The `(QC)` rows are never dropped as "optional tests"; the Status line of TEST-CASES-001-todo-list.md is generated by
  the Phase 2 task (constitution QC-3), never a human approval
- The closing tasks are mandatory; the feature is not complete until they are done and `/speckit-converge` reports no gaps
