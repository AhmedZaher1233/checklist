# Architecture Component Register: To-Do List

**Last updated**: 2026-10-13 by final task of 001-todo-list

<!--
  PURPOSE: no service or shared component is ever created twice. Feature plans decide Create / Reuse / Extend
  against this register AND the repository; if they disagree, record an Architecture Gap.
  ROWS: one per deployable (frontend, BFF, gateway, domain or shared service) and per shared component (shared
  library, supporting service), matching SAD §4.1. Never generic rows ("FE", "BE") and never a database row: a data
  store is recorded on the row of the service that owns it.
  Components are introduced JUST IN TIME by the first feature plan that needs them; the final task of that
  feature's tasks.md sets the status and location from the real repository.
-->

| Component | Type | Purpose | Owns data store | Location | Governing decisions | Status | Introduced by | Extended by |
|-----------|------|---------|-----------------|----------|---------------------|--------|---------------|-------------|
| To-Do Web App | Frontend | The single web channel | — | `implementation/frontend/todo-web-app` | ADR-0001, ADR-0002, cross-cutting/code-structure.md, cross-cutting/accessibility.md | Introduced | 001-todo-list | — |
| Task Service | Domain service | Task management: business rules and the durable list | PostgreSQL database `todo` | `implementation/backend/task-service` | ADR-0001, ADR-0002, cross-cutting/code-structure.md, cross-cutting/api-contracts.md | Introduced | 001-todo-list | — |
