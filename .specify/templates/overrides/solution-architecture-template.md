# [Customer] — [Project name]

## Solution Architecture Document

<!--
  THE architecture document (architecture skill): high level only, in customer language. No business content (it
  lives in specs) and no plan or task content (Rule 8: ownership table and the three tests).
  - Status (Document History, latest row) — the only thing other files check (framework-hooks before_plan):
      Approved — Tech team   the architecture covers every Approved spec; features can be planned
      Update required        a new or changed spec affects the architecture; /speckit-specify, intake, or /amend added
                             this row with the features and their impact; planning is blocked until /architecture update
      Draft                  /architecture create or update is in progress; the Open Items section lists what to decide
  - The tech team resolves the Open Items one by one; when none is left the section is removed and the row becomes
    "Approved — Tech team". Only then can the document be delivered.
  - Cross-cutting rules are NOT repeated here: they live only in architecture/cross-cutting/.
  - Facts come from the ADRs; do not decide anything here.
  - Diagrams: the solution architecture diagram only (§3). No sequence or flow diagrams. A business lifecycle or status
    model shared by several features is business behaviour: it lives, with its diagram, in the spec of the feature
    that owns it, and the ADRs that rely on it link to that spec.
  - Minor decisions (no ADR) are written in the section they concern (4–9), or in a cross-cutting file when every
    feature must follow them.
  - Sections marked "(include if any)" are removed when they do not apply; keep the numbering of the rest.
-->

### Document History

| Version | Date | Status | Author | Summary of changes |
| --- | --- | --- | --- | --- |
| [1.0] | [YYYY-MM-DD] | [Draft / Approved — Tech team / Update required] | [Author] | [First draft; for Update required: ###: impact] |

---

## 1. Introduction

[What this document is: the high-level solution architecture for [project]. What the platform covers, in one
paragraph of business scope. The architecture style in one or two sentences (building blocks, how they communicate,
the channels, where it is deployed).]

**Sources**

<!-- The business, integration, and other documents this design is based on (Constitution: traceability). -->

| Document | Version / date | Used for |
| --- | --- | --- |
| [e.g. Requirements specification] | [v1.0 — YYYY-MM-DD] | [Scope, actors, external systems] |

---

## 2. Architecture Principles

<!-- From the Constitution and approved ADRs only. -->

| Principle | What it means here |
| --- | --- |
| **[Principle]** | [How the architecture applies it] |

---

## 3. Solution Architecture Diagram

<!-- Layered block view, blocks only, NO arrows (Mermaid block-beta). TBC blocks labelled "(TBC)". -->

[Mermaid block-beta diagram]

*Figure 1: The components of the [project] platform.*

---

## 4. Components and Ownership

### 4.1 Component catalog

<!-- The Needed blocks of the building-blocks checklist (architecture skill step 3), with real names — never "FE",
     "BE", or "database". A data store belongs to the service that owns it. -->

| Component | Type | Responsibility | Owns data |
| --- | --- | --- | --- |
| **[e.g. Catalog Service]** | [Frontend / BFF / Gateway / Domain service / Shared service / External system] | [What it owns and does] | [Yes — its own data store / No] |

### 4.2 Actors

| Actor | Access | Responsibility |
| --- | --- | --- |
| **[Actor]** | [Channel] | [What they do] |

### 4.3 How components communicate

| Mechanism | Used for | Characteristics |
| --- | --- | --- |
| **[Synchronous REST / Messaging / ...]** | [When it is used] | [Security, timeouts, delivery guarantees] |

---

## 5. Business Domains *(include if any)*

<!-- One subsection per business domain: purpose and responsibility only — no endpoints or data models. -->

### 5.1 [Domain]

**Purpose:** [One line]

**Functionality:** [What the domain owns and decides]

---

## 6. Shared Services *(include if any)*

### 6.1 [Shared service]

**Purpose:** [One line]

**Functionality:** [What it provides]

**Boundary:** [What it does not own]

---

## 7. Presentation Layer

[Languages, browsers, accessibility — from the Constitution.]

### 7.1 [Application]

**Purpose:** [One line]

**Functionality:** [Main areas of the application]

---

## 8. Integration with External Systems *(include if any)*

| System | Business owner | Purpose | Customer responsibility |
| --- | --- | --- | --- |
| **[System]** | [Component that owns the relationship] | [What for] | [What the customer provides] |

---

## 9. Data, Messaging and Deployment

| Component | Role |
| --- | --- |
| **[Database / messaging / storage]** | [Role] |

[Data ownership rule, statelessness, deployment target, or TBC.]

---

## 10. Technology Stack

<!-- Technologies only; versions stay in architecture/decisions/*-technology-stack.md. -->

| Component | Technology |
| --- | --- |
| [Component name, e.g. Catalog Service] | [Technology] |

---

## 11. Alignment to Quality and Governance Requirements

<!-- Only requirements stated in the Constitution or approved specs; no invented targets. -->

| Requirement | How the architecture delivers it |
| --- | --- |
| **[Requirement]** | [How] |

---

## 12. Open Items *(Draft only — removed before approval)*

<!--
  Everything still to decide for this version. Each item is resolved in the Human Architecture Review, written
  into the sections above (and its ADR set to Approved), then deleted from here. When all tables are empty,
  delete this section and set the Document History row to "Approved — Tech team".
-->

### Decisions to take

| ADR | Decision | Proposed answer |
| --- | --- | --- |
| [ADR-0001] | [Technology stack] | [one line] |

### Open questions

| ID | Question | Blocks |
| --- | --- | --- |
| [OQ-01] | [Question] | [nothing / feature IDs] |

### Architecture Gaps

<!-- An Open gap that names a feature blocks /speckit-plan for it (before_plan gate). Feature IDs also go in the
     feature map Notes as "AG-NN". -->

| ID | Gap | Affects (features) | Owner | Source |
| --- | --- | --- | --- | --- |
| [AG-01] | [What is missing] | [###, ###] | [Tech team] | [intake YYYY-MM-DD / /architecture YYYY-MM-DD / plan ###] |

### Assumptions to confirm

<!-- Treated as true for now. Confirmed → written into sections 1–11 as fact; wrong → becomes a gap or a risk. -->

| ID | Assumption | If it is wrong |
| --- | --- | --- |
| [AS-01] | [Assumption] | [What changes] |

### Spec changes needed

<!-- An architecture decision forces a change to what a spec says (business behaviour); never a business choice made
     here. Resolved when /amend ### has been run for it; the amended spec then follows the normal business approval. -->

| Spec | Change needed | Why |
| --- | --- | --- |
| [###] | [Business change, in business language] | [Decision or constraint that requires it] |

### Risks to accept

| ID | Risk | Impact | Mitigation |
| --- | --- | --- | --- |
| [R-01] | [Risk] | [Impact] | [Mitigation, or "accepted" when agreed] |
