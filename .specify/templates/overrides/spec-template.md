# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`

**Created**: [DATE]

**Status**: Draft

**Input**: User description: "$ARGUMENTS"

<!--
  Project override of the core spec template (.specify/templates/spec-template.md). It adds the
  mandatory Dependencies section and keeps the project feature map (specs/feature-map.md) in step (Constitution,
  Development Workflow).

  STATUS AND APPROVAL
  - Status is "Draft", "Approved", "Deferred", or "Cancelled". Only the business team approves, defers, or cancels a
    spec; record it only when the business team's decision is explicitly given — never on your own.
  - On approval: set **Status**: Approved, add the line below under **Status**, and set the feature's Spec column in
    specs/feature-map.md to "Approved". New features are approved one at a time; a change set (one change touching
    several specs) is approved together and each spec's line names the others: "(with ###, ###)".
    **Approved**: [YYYY-MM-DD] — Business team
  - Defer / cancel / resume: run /amend ### defer | cancel | resume.
  - A spec that is not Approved cannot be planned; neither can a spec in a change set until the whole set is
    Approved.
-->

<!--
  LIVE SPEC RULES
  - The spec always describes the feature's CURRENT behaviour, in business language only: no technology, services,
    APIs, data stores, events, or implementation terms. Those belong in the plan.
  - No change history inside the spec: no "amended" markers, struck-through text, or old versions. History is kept
    in git and in the plan's Amendment Impact.

  CHANGING AN EXISTING FEATURE — run /amend (never a new spec that overrides this one). It rewrites the spec in
  place, adds the header line below (not for a spec that was never approved), sets Status back to Draft, updates the
  feature map, and gives the next steps for the feature's stage.

  Header line, one per amendment, under **Input** (omit for a new spec; in a change set end with "(with ###, ###)"):
  **Amended**: [YYYY-MM-DD] — [one-line business summary]
-->

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability, e.g., "allow users to create accounts"]
- **FR-002**: System MUST [specific capability, e.g., "validate email addresses"]
- **FR-003**: Users MUST be able to [key interaction, e.g., "reset their password"]
- **FR-004**: System MUST [data requirement, e.g., "persist user preferences"]
- **FR-005**: System MUST [behavior, e.g., "log all security events"]

*Example of marking unclear requirements:*

- **FR-006**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]

<!-- If an entity moves through business statuses (for example a request: submitted → under review → completed), and
     this feature owns that lifecycle, describe it here with a Mermaid state diagram in business words. Other features
     and the architecture refer to it here; they do not repeat it. -->

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]
- **SC-002**: [Measurable metric, e.g., "System handles 1000 concurrent users without degradation"]
- **SC-003**: [User satisfaction metric, e.g., "90% of users successfully complete primary task on first attempt"]
- **SC-004**: [Business metric, e.g., "Reduce support tickets related to [X] by 50%"]

## Dependencies *(mandatory)*

<!--
  Business dependencies only (what this feature needs from other features or systems), not technical components —
  components are decided in the plan against architecture/component-register.md.
  Refer to features by spec ID. Write "None" where nothing applies.

  AFTER writing this section — for a new spec AND whenever this section changes in an existing spec — update
  specs/feature-map.md (create it from .specify/templates/overrides/feature-map-template.md if it does not exist):
  1. Features table: add or update this feature's row (ID, feature, channel, Depends on, Related, wave; a new spec
     gets Spec "Draft", Delivery "Not planned").
  2. Consumed by: add this feature's ID to the Consumed by of every feature it depends on; remove it from features it
     no longer depends on. "Consumed by" is kept only in the map, never written in specs.
  3. Related: make the pair symmetric — add this feature's ID to the Related of each feature it lists as Related.
  4. Waves: wave = one more than the highest wave among its Depends on features (wave 1 if none). If this feature's
     wave changed, recompute the waves of the features that depend on it, transitively.
  5. Delivery order: put each feature in its wave's row (number and full name, one per line) and update the
     "Starts when" text of the affected waves.
  6. Critical path: recompute the longest dependency chain and update it if it changed.
  7. External dependencies: add or update this feature in the row of each external system it lists.
  8. Update "Last updated" with the date and "/speckit-specify". Report the map changes in the completion summary.

  ARCHITECTURE IMPACT — for a new spec AND whenever an existing spec changes: an Architecture impact is anything the approved SAD does not cover yet: a new or changed building block,
  external system, channel, or user group; a change to a technology, an ADR, or a cross-cutting rule (for example
  showing personal data a rule does not allow).
  If the spec has one and architecture/solution-architecture.md exists, add a Document History row
  "| [next version] | [date] | Update required | — | ###: [impact in one line] |" — or, if the latest row already says
  Update required, add "; ###: [impact]" to its summary. Report it; planning stays blocked until /architecture update.
  No impact → change nothing in the SAD.
-->

- **Depends on**: [###-feature-name — what this feature needs from it, e.g. "001-user-sign-in — a signed-in user"] | None
- **Related**: [###-feature-name — shared data or screens, either can be built first; no effect on waves, but checked
  when either feature is amended] | None
- **External**: [external system — what for] | None

## Assumptions

<!--
  Assumptions are ONLY for non-business defaults (for example: error messages are user-friendly;
  standard sign-in is used). A gap in a BUSINESS RULE is never an assumption (Constitution, Spec-Driven Development):
  who may do what, limits and quantities, time rules, what happens to existing data or records,
  uniqueness, deletion. Mark the 3 most critical as [NEEDS CLARIFICATION] in the requirements and
  list any others under Open Business Questions.
-->

- [Non-business default, e.g., "Error messages are shown in plain language"]
- [Environment default, e.g., "Users are already signed in; how they sign in is outside this feature"]

## Open Business Questions *(include if any)*

<!--
  Business rules the source did not decide, beyond the [NEEDS CLARIFICATION] markers. Each is
  answered by /speckit-clarify or the business team, then moved into the requirements and removed
  from here. A spec cannot be Approved while this section has entries.
-->

- **OQ-1**: [Question for the business team] — affects [FR / story]
