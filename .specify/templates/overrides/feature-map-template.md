# Feature Map: [PROJECT]

**Last updated**: [DATE] by [/speckit-specify | /speckit-plan | final task of ###-feature-name]

<!--
  Project-level map of the approved scope (Constitution, Development Workflow): every feature, the features it depends
  on, and the delivery order. One map per project, at specs/feature-map.md.

  Two status columns:
  - Spec: Draft · Approved · Deferred · Cancelled — the same as the spec header.
  - Delivery: how much of the CURRENT spec is in the code — Not planned · Planned · Partially implemented ·
    Implemented. "Partially implemented" = part of the current spec is built (stories delivered in increments, or an
    implemented feature whose spec was amended or that an approved ACR changes); Notes say what is pending.

  Maintained by:
  - /speckit-specify (spec template): adds or updates the feature's row and wave; Spec "Draft", Delivery "Not planned".
  - Business team approval (spec template, APPROVAL): Spec "Approved".
  - /speckit-plan (plan template, only for an Approved spec): Delivery "Planned" if it was "Not planned".
  - Final task of tasks.md (tasks template): Delivery "Implemented", or "Partially implemented" with pending stories
    in Notes.
  - Amending an existing spec (spec template): Spec "Draft"; Delivery "Implemented" becomes "Partially implemented";
    Notes "Amendment YYYY-MM-DD pending". It returns to Approved / Implemented through the same steps.
  - Approved ACR classifying the feature "Change now" (/architecture, step 10): Spec unchanged; Delivery
    "Implemented" becomes "Partially implemented"; Notes "ACR-NNNN pending".
  - /amend defer | cancel (business team): Spec "Deferred" / "Cancelled"; the feature leaves the waves, delivery
    order, and critical path and is listed under "Deferred / Cancelled"; dependents get Notes "Blocked by ###".
    /amend resume: Spec "Approved"; back in its wave; "Blocked by" notes removed.

  The Delivery value and its pending note are mirrored in the Delivery line at the top of the feature's plan.md and
  tasks.md; every command above that changes Delivery changes all three (Constitution, Development Workflow).

  Notes (set and cleared by the commands):
  - "AG-NN" — an open Architecture Gap names the feature (cleared when resolved).
  - "Change set: ###, ###" — approved together (cleared when all are Implemented).
  - "Amendment YYYY-MM-DD pending" / "ACR-NNNN pending" — cleared when Implemented again.
  - "Blocked by ###" — a feature it depends on is deferred or cancelled.

  Rules:
  - "Depends on" must match the Dependencies section of the feature's spec.md.
  - Wave = one more than the highest wave among its Depends on features (wave 1 if none). "Related" features do not
    change the wave.
  - "Consumed by" is derived from the other rows; it is not written in specs.
  - "Related" is symmetric: if A lists B, B lists A.
  - The Delivery order, Critical path and External dependencies sections are derived from the Features table and are
    updated together with it (spec template, Dependencies section, steps 1–8).
-->

## Features

**Spec**: `Draft` · `Approved` · `Deferred` · `Cancelled` | **Delivery**: `Not planned` · `Planned` · `Partially implemented` · `Implemented`

| ID | Feature | Channel | Depends on | Related | Consumed by | Wave | Spec | Delivery | Notes |
|----|---------|---------|------------|---------|-------------|------|------|----------|-------|
| [###] | [name] | [channel(s) from the business inputs, e.g. the user-facing app, the admin app] | [IDs or —] | [IDs or —] | [IDs or —] | [n] | [Draft / Approved] | [Not planned / Planned / Partially implemented / Implemented] | [...] |

## Delivery order

| Wave | Features | Starts when |
|------|----------|-------------|
| 1 | [### Feature name<br>### Feature name] | [no feature dependencies] |

**Critical path**: [longest dependency chain, as ### Feature name → ### Feature name]

**Deferred / Cancelled**: [### Feature name — Deferred YYYY-MM-DD, or None]

## External dependencies

| System | Needed by | Open items |
|--------|-----------|------------|
| [system] | [IDs] | [gap / risk IDs] |
