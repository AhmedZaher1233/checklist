# Research: To-Do List (001)

**Date**: 2026-10-13 | **Plan**: [plan.md](plan.md)

Feature-level decisions only; system-wide decisions come from `architecture/` (ADR-0001, ADR-0002, cross-cutting).
No `NEEDS CLARIFICATION` remains.

## R1 — How the 100-character title limit is counted

- **Decision**: A character is one UTF-16 code unit on both sides: the input field uses `maxlength="100"`, which the
  browser applies to typed and pasted text, and the Task Service checks `String.length() <= 100` after removing
  leading and trailing spaces.
- **Rationale**: The browser's `maxlength` counts UTF-16 code units and Java's `String.length()` does too, so a title
  the field accepts is never rejected by the service. Ordinary text (the product is English only) is one unit per
  character.
- **Alternatives considered**: Counting Unicode code points on the server — rejected, because a title with emoji
  could pass the field yet differ in length on the server, and vice versa.

## R2 — Removing spaces and what counts as empty

- **Decision**: The service removes white space at both ends of the title — every character for which
  `Character.isWhitespace` or `Character.isSpaceChar` is true, plus U+FEFF, which matches the browser's `trim()` —
  then rejects it as missing when the result is empty; the length check applies to the stripped title.
  (`String.strip()` alone is not enough: it keeps the non-breaking space.) The web application sends the title
  as typed; it also blocks the request when the stripped value is empty, so the user gets the message without a
  round trip.
- **Rationale**: FR-002 and FR-003 are business rules, so the service is authoritative (Constitution V,
  `cross-cutting/security.md` rule 2); the client check only helps the user.
- **Alternatives considered**: `String.trim()` and `String.strip()` — rejected: both keep a non-breaking space
  pasted from another application.

## R3 — Identifier and list order

- **Decision**: The Task Service generates a random UUID per task and stores `created_at` as `timestamptz`, truncated
  to microseconds from the injected `Clock`. The list is ordered by `created_at` descending, then `id` descending as
  a stable second key (`cross-cutting/date-and-time.md` rule 4).
- **Rationale**: Newest first is FR-005. Truncating to the database's precision means the value returned on create
  equals the stored value. Completion never changes `created_at`, so a completed task keeps its place (US2-AS5).
- **Alternatives considered**: A database sequence as identifier — rejected: identifiers are opaque to the client
  (`cross-cutting/api-contracts.md` rule 4) and UUIDs avoid exposing a count of tasks.

## R4 — Completing a task: operation shape and the "final" rule

- **Decision**: `PATCH /api/v1/tasks/{id}` with `{"completed": true}`. Completing an already completed task returns
  `200` with the task unchanged (repeatable, `cross-cutting/resilience.md` rule 3). `{"completed": false}` is
  rejected with `409` and problem type `/problems/task-completion-final`; the web application never sends it,
  because it offers no such action (FR-009).
- **Rationale**: The business rule "completion is final" lives in the service layer (Constitution V); the UI hides
  the action, the service enforces it.
- **Alternatives considered**: `POST /api/v1/tasks/{id}/completion` — rejected: the architecture's contract style
  uses `PATCH` to a target state.

## R5 — Deleting a task that no longer exists

- **Decision**: `DELETE /api/v1/tasks/{id}` returns `204` when the task was deleted and `404`
  (`/problems/task-not-found`) when it does not exist. The web application treats `404` on complete or delete the
  same way: it removes the task from the screen and shows "This task no longer exists."
- **Rationale**: The spec's edge case requires telling the user that a task deleted by someone else no longer
  exists, so the client must be able to tell the difference. The end state is the same either way (the task is
  gone), which keeps a repeated delete harmless as `cross-cutting/resilience.md` rule 3 requires.
- **Alternatives considered**: Always `204` — rejected: the user could not be told the task was already gone.

## R6 — Preventing a double add

- **Decision**: The add form ignores submission (button click or Enter) while its request is in flight: the button is
  disabled and the submit handler returns early. No idempotency key on the API.
- **Rationale**: The spec's edge case (one add action creates exactly one task) is met by "one action, one request"
  (`cross-cutting/resilience.md` rule 4, `code-structure.md` rule 5); creates are never retried automatically.
- **Alternatives considered**: An idempotency key header — rejected as unnecessary complexity for one client
  (Constitution VIII).

## R7 — Web application state and structure

- **Decision**: One page (`TaskListPage`) holding the list in React state (`useReducer`); no router and no state
  library. The list is loaded once on page load (with an abort controller so StrictMode's double effect is harmless)
  and updated from each successful response: add → insert at the top, complete → replace, delete → remove.
- **Rationale**: FR-013 (the list reflects each action without reloading) with the smallest design; other people's
  changes appear on the next load (spec assumption).
- **Alternatives considered**: React Router, TanStack Query, Redux — not needed for one screen (Constitution VIII).

## R8 — Messages shown to the user

- **Decision**: The web application shows these texts (spec: short, plain language):

  | Situation | Text |
  |---|---|
  | No tasks | "No tasks yet." |
  | Title missing or only spaces | "Enter a title for the task." |
  | Loading the list fails | "The tasks could not be loaded. Try again." (with a "Try again" button) |
  | Add fails | "The task was not added. Try again." |
  | Complete fails | "The task was not marked as completed. Try again." |
  | Delete fails | "The task was not deleted. Try again." |
  | Task no longer exists | "This task no longer exists." |

- **Rationale**: The spec fixes when each message appears and that it is plain language, not the exact wording.
  These texts are the plan's proposal; acceptance test cases assert them.
- **Follow-up**: If the business team wants different wording, only these texts and the matching test-case
  expectations change (no design impact).

## R9 — Acceptance test data and isolation

- **Decision**:
  - The list is shared and global, so acceptance cases that change data run **serially**.
  - Every task a case creates has a title starting with a unique run prefix (for example `QA-<run>-`), so cases find
    their own tasks among others.
  - Cases that need an **empty list** (the empty-state cases) prepare it in setup by listing all tasks and deleting
    each through the public API (`GET` then `DELETE /api/v1/tasks/{id}`), local environment only (QC-7 preparation
    order: API, confirmed by the contract).
  - Failure cases (FR-014) make the API unreachable for the one request under test with Playwright request
    interception; the product is not changed.
  - The "deleted by someone else" cases use a second browser context, or the public API, to delete the task first.
- **Rationale**: QC-7 (unique ownership, cleanup of owned data only, local seeding) and QC-9 (data-changing cases
  run serially).
- **Alternatives considered**: A test-only reset endpoint — rejected: it would add an unprotected destructive
  operation to a public API.

## R10 — Local environment and ports

- **Decision**: `implementation/dev/docker-compose.yml` runs PostgreSQL 18.6 on host port **55432** (non-default, to
  avoid clashing with local installs) with database `todo`; credentials come from a git-ignored `.env` with a
  committed `.env.example` (`cross-cutting/configuration-and-secrets.md`). The Task Service runs on **8080** with
  Spring profile `local`; the web application's Vite dev server runs on **5173** and proxies `/api` to
  `http://localhost:8080` (same origin, SAD §4.3). Readiness: `GET http://localhost:8080/actuator/health/readiness`.
- **Rationale**: Project default layout (plan template) and the approved architecture.
- **Follow-up**: None. Since constitution 3.0.0 these values are not stored in the constitution: the local URL is read
  from the running build at implementation time (QC-12); the ports above are the repository defaults.

## R11 — Versions pinned by this feature

- **Decision**: Pin exactly the versions of ADR-0001 (Spring Boot 4.1.1 parent; `postgresql.version` overridden to
  42.7.14; springdoc 3.1.1; Node 24 LTS in `.nvmrc` and `engines`; React 19.3.0; TypeScript 6.0.3; Vite 8.3.4;
  Vitest 5.0.4; React Testing Library 16.3.3 with `@testing-library/dom` 10.4.2; Playwright 1.64.0 and
  `@axe-core/playwright` 4.13.0 in the automation root).
- **Rationale**: ADR-0001 is Approved; a newer patch that appears before implementation (Spring's next release day
  is 2026-10-22) is a patch-level update the implementer may take without a new decision.
- **Alternatives considered**: None.
