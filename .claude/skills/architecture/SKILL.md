---
name: "architecture"
description: "Create, review, or update the project's authoritative Architecture Artifacts (system-wide structure, boundaries, cross-cutting decisions, technology choices) before feature-level implementation planning. Use for project architecture work, not for feature plans."
argument-hint: "create | review | update, plus the scope (e.g. 'create initial system architecture', 'review integration architecture', 'update identity architecture for SSO')"
user-invocable: true
disable-model-invocation: false
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

This skill manages the project's **architecture phase**, which comes before feature-level implementation
planning. It creates, reviews, and updates the project's **Architecture Artifacts**, which hold two things only:

1. the **High-Level Architecture (HLA)**: the system's building blocks, the technology stack, the external
   systems, and how the blocks talk to each other in general;
2. the **cross-cutting concerns**: the rules every feature follows the same way (for example security and
   identity, error handling, observability).

The architecture is designed **once for all features together**, never feature by feature. Everything else
(internal structure of a building block, endpoints, data models, how a business rule is enforced) is decided in the
feature's plan and tasks. Do not over-engineer: keep only what the features genuinely share.

## Location

Architecture Artifacts live under the project's `architecture/` directory:

- `architecture/` — architecture documents, organized by the information they cover
- `architecture/decisions/` — ADRs, one file per decision (`NNNN-short-title.md`)
- `architecture/changes/` — ACRs, one file per change to an approved decision (`NNNN-short-title.md`)
- `architecture/cross-cutting/` — cross-cutting rules and policies (for example security, audit, error handling,
  observability)
- `architecture/solution-architecture.md` — the **Solution Architecture Document (SAD)**: **the** architecture
  document — the high-level design, plus the Open Items section while it is a Draft; its latest Document History
  row is the **architecture status** (Approved — Tech team · Update required · Draft)
- `architecture/component-register.md` — the **Architecture Component Register**

Create these files from the project templates, resolved with `.specify/scripts/powershell/resolve-template.ps1 <name>`
(project override first): `solution-architecture-template` → `solution-architecture.md`, `component-register-template`
→ `component-register.md`, `adr-template` → each ADR, `acr-template` → each ACR. Keep their section names, numbers,
and columns: other files depend on them (the SAD's **Document History** status).

Use existing files where they already cover the topic. Do not create empty or placeholder documents.

## Rules

1. **Do not invent business requirements.** Surface genuinely missing information as an Open Question,
   Assumption, Risk, or Architecture Gap, whichever fits. Missing business content (texts, values, lists, rules) is
   never an architecture item: it is an open business question on the spec.
2. **Comply with the Constitution.** If a decision would conflict with a constitutional principle, do not
   make it; raise it for a governance decision.
3. **AI-generated decisions are never Approved automatically.** A decision is Approved only if it already
   exists as approved in an Architecture Artifact, or the **tech team explicitly approves it**. Answering or
   choosing an option during a discussion is agreement, not approval; record it as **Proposed** unless the tech team
   states approval. Only Approved decisions constrain and may be used by downstream feature planning.
4. **Create or update only what the requested scope needs.** No fixed document set. Architecture
   overview, components, technology, integrations, data, security, cross-cutting concerns, frontend,
   deployment, ADRs, and ACRs are information domains, not a mandatory one-file-per-domain structure.
5. **Approved specs only.** `create` and `update` run only when every spec in their scope is **Approved** by the
   business team (check each spec's `**Status**`); otherwise stop and name the specs that need approval. Exceptions:
   `review` (read-only) and technical changes that no spec drives (for example an upgrade ACR raised by the tech team).
6. **Always the whole scope.** Every `create` or `update` — even when one new feature, an amendment, or an ACR
   triggers it — reviews the whole design against **all Approved specs** and the existing architecture, and reports
   the **full impact**, not only the delta. Draft specs are not used for decisions.
7. **No implementation work, no technical specifications.** Specifications are business-only (Constitution, Spec-Driven Development).
   Components are recorded in the Architecture Component Register and introduced **just in time** by the
   first feature plan that needs them (step 5); never create a Foundation specification.
8. **High level only — no business content, no plan or task content.** Each artifact owns one kind of content:

   | Owner | Artifact | Holds |
   |---|---|---|
   | Business team | Spec | What and why: actors and permissions, business rules, statuses, data fields, messages and texts, when notifications are sent, every case |
   | Tech team | Architecture | System-wide how: building blocks and their one-line responsibility, technology, communication between blocks, external systems, general rules every feature applies the same way |
   | Tech lead | Plan and tasks | One feature: data model, endpoints, events and their contents, flows, error cases, per-dependency settings, how each rule applies to the feature |

   Test every sentence of an architecture artifact; if any answer is yes, it does not belong here:
   (1) does it name a feature, entity, field, screen, status, message, or event (only building blocks, external
   systems, and technologies are named; examples are generic)? (2) would it change if a business rule changed
   (→ spec)? (3) does it apply to one feature only, or describe how one feature works (→ plan)?

   Record something here only if it holds for the whole system or is shared by several
   features. In: the building blocks with their real names (e.g. "Customer Portal", "API Gateway", "Catalog
   Service", "Identity Provider") chosen with the building-blocks checklist (step 3), the technology stack and versions,
   external systems, communication style between blocks, cross-cutting rules chosen with the cross-cutting checklist
   (step 3), system-wide risks and gaps. Never generic blocks such as "FE", "BE", or "database". Out (belongs to
   plans): the internals of a block (modules, packages, folder layout), endpoints and payloads, tables and
   constraints, feature-specific rules or flows, and anything only one feature needs. When unsure, leave it to the
   plan. A **business lifecycle or status model** shared by several features is business behaviour, not
   architecture: it lives, with its diagram, in the spec of the feature that owns it; the ADRs that rely on it link
   to that spec.
9. **One document, approved before delivery.** While the SAD is a Draft, sections 1–11 show the proposed design in
   customer language and the Open Items section lists everything still to decide (decisions, open questions, gaps,
   assumptions to confirm, spec changes needed, risks). §1 lists the **Sources** the design is based on (business,
   integration, and other documents). It is delivered only when no Open Item is left, the section is removed, and the status is Approved. There
   is no internal register outside the Open Items and the ADRs; anything that stays undecided by design (for example
   owned by the customer) is written TBC in sections 1–11. Cross-cutting rules are never repeated in the SAD.
10. **The technology stack is always decided.** The SAD cannot be Approved without an Approved
    `*-technology-stack.md` ADR that covers the technology of every Needed building block (for example gateway,
    message broker, cache, workflow engine), not only the frontend, backend, and database.
11. **Project defaults are always produced.** Every `create` (and every `update` that changes the stack or the
    building blocks) writes, without waiting to be asked:
    - `cross-cutting/code-structure.md` — the layers or folders of every component type in the stack (for example, a
      layered backend service: `controller` → `service` → `repository` → `entity`, plus `dto`, `exception`, `common`; a
      single-page frontend app: `pages`, `components`, `api`, `auth`), with business rules only in the service layer
      (Constitution, Architecture & Integration Boundaries) and known pitfalls of the chosen frameworks guarded against (for example a frontend framework running initialisation twice);
    - the **shared-library decision** of the building-blocks checklist (none while each side has one deployable;
      extract when a second appears), with the default locations `implementation/backend/shared/` and
      `implementation/frontend/shared/`;
    - in the technology stack ADR, the **tools the developer tests need** (for example a frontend unit-test
      runner) and the **local environment needs** (container runtime, runtime versions), so the
      first plan and its environment check (tasks Phase 0) find nothing missing.
    Present these defaults at step 7 like any other decision; the human may change them.
12. **Architecture status, not feature lists.** The SAD never lists which features it covers. `/speckit-specify`,
    intake, and `/amend` set the status to **Update required** (a Document History row naming the features and
    their impact) when a new or changed spec affects the architecture; `update` turns that row into a **Draft** and
    its impacts into Open Items; approval sets **Approved — Tech team**. Planning is allowed while the status is
    Approved; while it is Update required, only the features named in that row wait; while it is Draft, all planning
    waits.

## Statuses

Use these statuses where they add meaning: on decisions and on items that need attention. Do **not**
label every descriptive statement; plain description of the system, or content taken directly from
approved business inputs, needs no label.

| Status | Use for |
|---|---|
| **Approved** | A decision approved by the tech team. Binding for feature planning. |
| **Proposed** | A recommended decision awaiting the tech team's review. Not binding. |
| **Open Question** | A decision that is needed but not yet recommended or resolvable. |
| **Assumption** | Something treated as true for now that must be confirmed. Not binding. |
| **Risk** | A threat to the architecture or delivery, with its impact. |
| **Architecture Gap** | Missing, ambiguous, or conflicting information that blocks a decision. |

## Scope of Concerns

Address only the concerns relevant to the requested scope, at the level of Rule 8:

- system context: users, channels, external systems
- building blocks and their responsibilities; what owns the data (building-blocks checklist, step 3)
- technology stack and versions (Rule 10)
- communication style between blocks (e.g. synchronous REST, messaging) and with external systems
- cross-cutting concerns that apply to all features (cross-cutting checklist, step 3)
- deployment and runtime constraints that affect all blocks
- architecture risks, assumptions, dependencies, and open decisions

## Workflow

### 1. Determine mode and scope

- **create**: create the Architecture Artifacts required for the requested scope.
- **review**: analyze existing Architecture Artifacts and report findings. **Do not modify files.** Also used as a
  read-only **impact estimate** for Draft specs, so the business team can decide with the technical impact in view;
  nothing is recorded.
- **update**: update existing Architecture Artifacts.

If the mode or scope cannot be determined from the input, ask one short question before continuing.

### 2. Gather inputs

Read what is relevant to the scope and available:

- Constitution (`.specify/memory/constitution.md`)
- **technology stack (required)**: the approved stack recorded in `architecture/decisions/*-technology-stack.md`, or
  the stack the human provides. The technology stack decision is always one ADR whose file name ends in
  `-technology-stack.md` (any number). If neither exists, ask the human for it before designing; do not invent a stack.
- approved business/project requirements, scope, and NFRs
- existing Architecture Artifacts and approved ADRs/ACRs under `architecture/`
- **all Approved specifications** (Rule 6), the feature map (`specs/feature-map.md`), and the open Architecture
  Gaps — and, when the status is Update required, the features and impacts named in that Document History row

If you cannot find the business/project inputs, ask the user where they are. If none exist, ask
whether to continue with the gaps made explicit.

### 3. Design and decide

For each **significant system-wide** decision (Rule 8), record it as an ADR (`adr-template`). A minor decision gets
no ADR: write it in the SAD section it concerns (4–9), or in a `cross-cutting/` file when every feature must follow
it. When a decision requires a change to what a spec says, add it to the SAD's **Spec changes needed**; never edit
the spec here. Keep ADRs few: typically the technology stack, the building blocks, identity, and any other
choice all features must follow. Its status is Proposed unless Rule 3 applies; give realistic alternatives only when
they exist.

Keep unresolved items unresolved. Do not create an ADR or ACR merely because a document is edited.

**Building-blocks checklist.** On every `create` and `update`, go through every candidate and decide **Needed**,
**Not needed**, or **TBC**, with a one-line reason drawn from the approved specs, the Constitution, and the stack:

| Layer | Candidates |
|---|---|
| Channels | One frontend per channel; micro-frontends; mobile application |
| Edge | API gateway (typically needed with more than one service, external callers, or one secured entry point); a BFF per channel (needed when channels need different shaping or aggregation) |
| Business | Domain services: one per business domain found in the approved specs, grouped by capability, never one per feature |
| Shared services | Identity provider; workflow engine; notification; document management; integration service; configuration; lookup / reference data; audit; reporting; CMS; search; scheduler |
| Shared libraries | Backend platform library (error format, security setup, correlation ID, logging, clock); frontend shared library (sign-in, API client, shared UI). Needed when **two or more deployables on the same side** need the same mechanism; with one, the mechanism stays in that deployable's `common` package and the plan that adds the second deployable extracts it (Create the library, Extend both) |
| Infrastructure | Message broker; cache; file / document storage. Each service owns its own data store; a database is part of the service that owns it, not a separate block |

Needed blocks go into SAD §3 (diagram) and §4.1 (catalog) with real names; Not needed blocks, with their reasons,
go into the building-blocks ADR under Alternatives; TBC blocks go into the Open Items.

**Cross-cutting checklist.** On every `create` and `update`, go through every concern and decide **Applies** or
**Not applicable**, with a one-line reason:

code structure (layers and folders of every backend and frontend component); security and identity; authorization model; error handling; API contracts and
versioning; observability (logs, traces, metrics); localization and languages; accessibility; audit trail; configuration and secrets; data
protection, privacy, and retention; date, time, and time zone; resilience (timeouts, retries, circuit breaking);
caching; messaging and consistency (events, idempotency); files and documents; notifications; performance and
scalability.

Every concern is checked and its result shown at step 7, but only the concerns that **Apply** are written: each gets
its rules in a document in `architecture/cross-cutting/` — the only place cross-cutting rules live (never in the SAD).
A cross-cutting document states **general rules that every feature applies the same way, never a list of cases**
(Rule 8): the spec decides the cases, the plan applies the rule to them. A rule that can only be written by listing
cases is not cross-cutting.
Not applicable concerns are not written anywhere; the next `update` checks the full list again.

When a **building block delivers the concern** (for example a Notification Service for notifications, an Audit
Service for the audit trail), the concern gets no cross-cutting file of its own: the rules for **using** the block
(who may call it, when) go in the building-blocks ADR, and its **internals** (queues, retries, statuses, data) go in
the plan of the first feature that creates it. Rules that every call between blocks must follow (timeouts, retries,
saving before calling) belong to the **resilience** concern, which gets its cross-cutting file.

**update: changing an Approved decision.** If the change materially alters an existing Approved decision:

- do not replace or edit the approved decision;
- record the change as an ACR (and a new ADR if a new decision results), with status Proposed;
- the existing Approved decision stays in force until the change is approved.

Non-material edits (clarifications, additions that don't alter an approved decision) are made directly.

### 4. Establish the version baseline

When the stack has no recorded versions, or when asked to refresh them:

- Research the current **stable** (GA, non-milestone, non-RC) release of each component from its official
  source (release notes, download page, or official repository), noting the date checked.
- Check **compatibility** between components using official compatibility or support matrices (for example
  language runtime ↔ framework, framework ↔ its companion libraries, workflow engine ↔ framework,
  platform ↔ delivery tooling). When the newest release of one component is not yet supported by another,
  choose the newest mutually compatible combination and say why.
- Prefer releases still inside their vendor support window; flag components close to end of support.
- Present the baseline as the version table described in `adr-template` (Decision section).
- Versions are **Proposed** until the tech team approves them; after approval, record them in the technology stack
  ADR with the approval date. Items marked TBC in the stack stay open and get no version.

### 5. Classify reusable capabilities

Place every reusable concern in exactly one category:

- **Cross-cutting rule** — a system-wide policy, documented in `architecture/cross-cutting/`; the rules stay
  authoritative there.
- **Shared module** — reusable in-process mechanism, in the shared-library location the architecture defines; generic,
  no domain or business authorization logic; services depend only on the modules they use.
- **Supporting service** — separately deployed shared runtime capability that owns its own data.

Then record it in the **Architecture Component Register** (`component-register-template`). The register has one row
per deployable (frontend, BFF, gateway, domain or shared service) and per shared component (shared library,
supporting service), matching SAD §4.1; data stores are recorded on the row of the service that owns them, never as
rows of their own. Its purpose is that no service or shared component is ever created twice: feature plans decide
Create / Reuse / Extend against it.
Do not build or specify it up front: it is introduced **just in time** by the plan of the first real feature that
needs it, declared explicitly in that plan, placed in its own location in the repository layout, and extended generically by later
features. Do not hide a reusable capability inside a feature's own service code.

### 6. Prepare diagrams

The SAD (§3) has **one** diagram: the layered block view of the components, with blocks only, no arrows. No other
diagrams in Architecture Artifacts (high-level design only); context, sequence, and flow diagrams belong in feature
plans.

Rules:

- Use Mermaid code blocks inside the Markdown artifacts so diagrams are versioned with the text.
- Diagrams show only what the artifacts state. Mark elements that come from **Proposed** decisions or
  **Open Questions** visibly, for example with a "(Proposed)" or "(Open)" label or a dashed line, so
  a diagram never presents an undecided choice as settled.
- Use a layered block view (Mermaid `block-beta`) with **no arrows**: one row per layer, one block per component.
- Keep diagrams renderer-safe: connect nodes, not whole subgraphs; use only standard edge syntax. When the Mermaid CLI
  is available, render each diagram before presenting it and fix any error.

### 7. Confirm before writing

Before creating or modifying any file (**create** and **update** modes), stop and present:

- the files to be created or changed;
- the building-blocks and cross-cutting checklist results (every item with its decision and reason);
- each decision to be recorded, with its status;
- the diagrams, shown in the conversation;
- the proposed version baseline, when one was researched;
- the gaps, open questions, and Architecture Component Register changes to be recorded;
- the SAD sections that change, in customer language, and the Open Items to add.

Ask the human to confirm, amend, or cancel. Write files only after explicit confirmation, and include
any amendments. If the human confirms only part, write only that part.

### 8. Write (create/update) or report (review)

- **create/update**: after confirmation, write only the confirmed artifacts under `architecture/`. In the SAD, add a
  Document History row `[version] | [date] | Draft | … | [summary]` (an `update` replaces the Update required row with
  it, keeping its version), update sections 1–11 (including the §1 Sources), and put every Proposed decision, open
  question, gap, assumption, spec change needed, and risk in the Open Items (Rules 9 and 12).
- **review**: report inconsistencies with the Constitution or business inputs, missing or mislabeled
  decisions, conflicts between artifacts, gaps, and risks.

### 9. Human Architecture Review (tech team)

End with this summary:

1. Architecture Artifacts created or updated (or reviewed)
2. Approved decisions retained
3. New Proposed decisions
4. Architecture Gaps (Open Items)
5. Architecture Component Register changes (new or changed entries)
6. Risks, open questions, assumptions to confirm, and spec changes needed (Open Items)
7. Decisions requiring Human Architecture Review: list each Proposed decision so the tech team can
   approve, reject, or amend it

Run the review **one Open Item at a time** in the conversation: explain it, give a recommendation, and let the tech
team agree, amend, or reject before moving to the next. When the tech team explicitly approves a decision or answers
an item: set the ADR to **Approved** and fill its **Approval** line (for decisions), write the result into SAD sections 1–11,
**delete the item from the Open Items**, and remove its `AG-NN` pointer from the feature map Notes (for gaps). When no Open Item is left,
**delete the section** and set the Document History row to **Approved — Tech team**. For approved
ACRs, apply the change to the affected decision at the same time, then run **step 10**.

**Start the review automatically.** Right after writing (step 8), without waiting to be asked, go through the Open Items in
this order: Architecture Gaps → Decisions to take → Open questions → Assumptions to confirm → Spec changes needed →
Risks to accept. Ask about **one item per
question** using the interactive question tool:

- the question names the item and asks for the tech team's decision;
- for decisions and risks, the options are **Approve (tech team)** · **Approve with change** (the reply gives the
  change) · **Reject** · **Defer** (stays in the Open Items); put the recommended option first, marked "(Recommended)", with one
  line saying why;
- for open questions and gaps, the options are the candidate answers plus **Not decided yet**; an answer that is a
  project-wide business rule (for example the time zone) can also go into the Constitution;
- for assumptions, the options are **Confirmed** (written into sections 1–11 as fact) · **Wrong** (give the facts; it
  becomes a gap or a risk) · **Not decided yet**;
- for spec changes needed, the options are **Run /amend ### now** · **Later** (stays in the Open Items); the item is
  deleted when `/amend` has run, and the amended spec follows the normal business approval.

After each answer, apply it at once (ADR status and Approval line, SAD sections 1–11, delete the item from the Open Items, feature map
Notes), confirm in one line what changed, then ask the next question. **Approve with change** and **Reject** first
update the ADR or SAD and show the change. Only **Approve (tech team)** and **Approve with change** approve (Rule 3);
**Defer** or no answer approves nothing. If the reply is "stop" or "pause", end the review: the remaining items stay
in the Open Items and the SAD stays a Draft. When no Open Item is left, delete the section, set the Document History row to
**Approved — Tech team (scope …)**, and report that planning is unlocked.

The architecture phase for a scope is complete only when its Architecture Artifacts have passed
Human Architecture Review.

### 10. Affected features of an approved ACR

When an ACR is approved, find what was built or planned on the old decision:

1. Search every `specs/*/plan.md` **Decisions used** table for the changed decision, and the Architecture Component
   Register for the components it governs.
2. Fill the ACR's **Affected features** table (`acr-template`), and let the tech team classify each feature:

   - **Change now** — the feature's code must follow the new decision.
   - **New work only** — existing code stays; only future plans follow the new decision.
3. For each **Change now** feature, in `specs/feature-map.md`: Delivery `Implemented` becomes `Partially implemented`;
   add "ACR-NNNN pending" to Notes; mirror both in the Delivery line at the top of the feature's `plan.md` and `tasks.md` (if they exist) — same value and note as the feature map. The spec is not changed (no business behaviour changes) and stays Approved.
   The feature is then re-planned through its plan's **Amendment Impact** → `/speckit-converge` (adds a section
   the tech lead reviews) → `/speckit-implement` → `/speckit-converge`.
4. If the change is not tied to individual features (for example a platform-wide upgrade), record how it is delivered
   as an **Open question in the SAD's Open Items** until the project has defined how technical changes are planned and
   implemented.

## Relationship to Feature Planning

- Approved Architecture Artifacts are the authoritative architecture context for feature planning.
  Feature plans consume them; they do not redefine system architecture.
- If feature planning finds a missing or conflicting system-wide decision, it is an Architecture Gap
  that returns to this skill; it is not decided locally in the feature plan.
- `/speckit-plan` uses the project override `.specify/templates/overrides/plan-template.md`, whose Architecture
  Alignment section and Architecture Check gate consume these artifacts. Keep the artifacts it references (SAD,
  ADRs, cross-cutting documents, Architecture Component Register) current.
- Lifecycle (lightweight, just in time):
  - **Plan**: the Component Decisions table records Create / Reuse / Extend for every component the feature needs,
    checked against the Architecture Component Register **and** the repository; Create only when the feature needs
    the component now and it does not exist.
  - **Tasks** (project override `.specify/templates/overrides/tasks-template.md`): component tasks are generated from
    those decisions and block only the user stories that need them; a mandatory final task updates the register with
    what was actually introduced or extended.
  - Components are built in the normal implementation tasks; DevOps handover details for created or changed
    deployables are written at the end of implementation, from the real code.
  - Planning (before_plan hook) waits for the features named in an Update required row, and for every feature while
    the status is Draft.
- If the register drifts from the repository, record it as an Architecture Gap; automated validation can be added
  later if needed.
