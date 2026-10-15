# ADR-0002: Building blocks

**Status**: Approved

**Approval**: 2026-10-13 — Tech team

**Date**: 2026-10-13 | **Source**: /architecture create — SAD version 0.1

## Context

The Constitution allows exactly one channel, a single web application in English (Platform Scope), and forbids
adding components before a feature needs them (VIII). The approved scope has one business domain (task management),
no sign-in, no notifications, no external systems and no files; the list must survive restarts and be shared by
everyone.

## Alternatives

Candidates of the building-blocks checklist that are **not needed**:

| Option | Pros | Cons |
|--------|------|------|
| Micro-frontends / mobile application | — | Not needed: one channel, one small application (Platform Scope) |
| API gateway | Single secured entry point | Not needed: one service, no external callers, no sign-in |
| BFF per channel | Channel-specific shaping | Not needed: one channel; the Task Service serves it directly |
| Identity provider | Sign-in, roles | Not needed: the approved scope has no sign-in |
| Workflow engine, notification, document management, integration service, configuration service, lookup, audit, reporting, CMS, search, scheduler | — | Not needed: nothing in the approved scope uses them |
| Backend / frontend shared libraries | Reuse across deployables | Not needed: one deployable per side; mechanisms stay in each deployable's `common` area until a second deployable appears (default locations `implementation/backend/shared/`, `implementation/frontend/shared/`) |
| Message broker, cache, file / document storage | — | Not needed: no events, no caching need, no files |
| Frontend-only application storing data in the browser | No back end | Rejected: the list must be shared by everyone and survive restarts |

## Decision

| Block | Type | Responsibility | Data |
|-------|------|----------------|------|
| **To-Do Web App** | Frontend (single-page application) | The only channel; holds no business rules | None |
| **Task Service** | Domain service | Task management: all business rules and the durable list | Owns its PostgreSQL database; no other block accesses it |

The To-Do Web App calls the Task Service only through the versioned REST contract (`cross-cutting/api-contracts.md`);
all operations are public by explicit declaration (`cross-cutting/security.md`).

## Consequences

- **Affects**: every feature plan (Component Decisions table: Create / Reuse / Extend against the Architecture
  Component Register).
- **Follow-up**: the first feature plan creates both components just in time. A second deployable on either side
  triggers the shared-library extraction; sign-in, external callers or a second service trigger an `/architecture
  update` for the identity provider and gateway candidates.
