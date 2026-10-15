# Code Structure

**Status**: Approved — Tech team, 2026-10-13 (SAD 1.0) | **Applies to**: every component in the Architecture Component Register

## Rules

1. **Repository layout.** Product code lives under `implementation/`: back-end services in
   `implementation/backend/<service-name>/`, front-end applications in `implementation/frontend/<app-name>/`, the
   local environment in `implementation/dev/`. Shared libraries, when one is needed (ADR-0002), go to
   `implementation/backend/shared/` and `implementation/frontend/shared/`.
2. **Back-end service (Spring Boot)** — one Maven project per service, base package `<group>.<service>`, with these
   packages:
   - `controller` — translates HTTP requests and responses only; no business rules, no repository calls;
   - `service` — all business rules; transactions start here; never depends on HTTP types;
   - `repository` — stores and loads data only (Spring Data); no business rules;
   - `entity` — persistence model; never returned by a controller;
   - `dto` — request and response models of the API contract; mapping between `dto` and `entity` happens in
     `service` (or a mapper it calls);
   - `exception` — business exceptions and the single global exception handler;
   - `common` — configuration and technical mechanisms (clock, correlation ID, logging setup).
   Dependencies point one way: `controller` → `service` → `repository` → `entity`.
3. **Database migrations** are Flyway scripts in the owning service (`src/main/resources/db/migration`), never edited
   once merged; the service never relies on automatic schema generation.
4. **Front-end application (React + TypeScript + Vite)** — under `src/`:
   - `pages` — one folder per screen; composes components and calls the API layer;
   - `components` — reusable presentational components; no API calls;
   - `api` — the only place that calls the back end (typed client per the contract, error mapping);
   - `common` — utilities, hooks, constants and shared styles.
   The application holds no business rules; it shows what the service decides and validates input only to help the
   user (the service always re-validates).
5. **Framework pitfalls guarded against.**
   - React StrictMode runs effects twice in development: effects that call the API are idempotent or cancel on
     cleanup (abort controller), and no create action is triggered from an effect.
   - Submit controls are disabled while their request is in flight, so one user action sends one request.
   - Spring: no lazy-loaded entities leave a transaction (`spring.jpa.open-in-view=false`).
6. **Tests live with the code they test**: `src/test/java` in a service, `*.test.tsx` beside the component in a
   front-end application. Acceptance automation lives only under `Testing/Automation` (Constitution, Quality
   Control).
