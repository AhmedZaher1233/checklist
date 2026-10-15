# Architecture Component Register: [PROJECT]

**Last updated**: [DATE] by [/architecture | final task of ###-feature-name]

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
| [e.g. Catalog Service] | [Frontend / BFF / Gateway / Domain service / Shared service / Shared library] | [one line] | [e.g. database schema `catalog` / —] | [repository path, or — until introduced] | [ADR-0002, cross-cutting/…] | [Not introduced / Introduced / Retired] | [###-feature-name, or —] | [###, ###, or —] |
