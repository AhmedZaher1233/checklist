# ADR-0001: Technology stack

**Status**: Approved

**Approval**: 2026-10-13 — Tech team

**Date**: 2026-10-13 | **Source**: /architecture create — SAD version 0.1

## Context

The platform needs one browser application and one back-end service with a durable, shared store (SAD §4.1). The
tech team chose Java 21 with Spring Boot for the service, React for the web application, and Playwright for
acceptance tests. No database was named; the store must be durable, relational data is simple, and the team already
uses PostgreSQL-compatible tooling. The Constitution requires versioned schema changes (V), documented API contracts
(VI), accessibility verification (II) and acceptance automation with Playwright (Quality Control, QC-9).

## Alternatives

| Option | Pros | Cons |
|--------|------|------|
| PostgreSQL (chosen) | Free, mature, first-class Spring Boot, Flyway and Testcontainers support | One more container locally |
| H2 / embedded database | No container | Not a production database; behaviour differs from production |
| SQL Server | Common in enterprise | Licensing; heavier local setup |
| Java 25 LTS | Newer LTS, longer support | The team chose 21, which is installed and fully supported by Spring Boot 4.1 |
| TypeScript 7.0 | Faster native compiler | Linting tooling (typescript-eslint) does not support it yet |
| Maven 3.10 / 4 | Newest | 3.10 has breaking build changes; Maven 4 is not GA |

## Decision

| Component | Version | Release date | Source | Compatibility notes |
|-----------|---------|--------------|--------|---------------------|
| Java (Eclipse Temurin) | 21 LTS (21.0.9 installed) | 2025-10-21 | adoptium.net | Within Spring Boot 4.1.1 range (Java 17–26) |
| Spring Boot | 4.1.1 | 2026-08-20 | github.com/spring-projects/spring-boot/releases; docs.spring.io system requirements | Spring Framework 7.0.9, Tomcat 11 |
| Maven | 3.9.x — Maven Wrapper pinned to 3.9.16 (3.9.14 installed) | — | maven.apache.org/docs/history.html | Spring Boot needs Maven 3.6.3+ |
| PostgreSQL | 18.6 | 2026-08-13 | postgresql.org/support/versioning | Supported until 2030-11-14 |
| PostgreSQL JDBC driver | 42.7.14 (override of Boot-managed 42.7.13) | 2026-10-07 | jdbc.postgresql.org/changelogs, /security | Security release; fixes two CVEs in 42.7.13 |
| Flyway | 12.4.0 (Boot-managed; `flyway-core` + `flyway-database-postgresql`) | not checked | Spring Boot dependency versions | Flyway documentation lists PostgreSQL 18 as supported |
| springdoc-openapi | 3.1.1 (`springdoc-openapi-starter-webmvc-ui`) | 2026-09-06 | springdoc.org; GitHub releases | 3.1 line built against Spring Boot 4.1 |
| JUnit + Spring Boot Test | Boot-managed | — | Spring Boot dependency versions | Backend developer tests |
| Testcontainers for Java | 2.0.5 (Boot-managed; `testcontainers-postgresql`) | — | GitHub releases | Real PostgreSQL 18 in developer tests via `@ServiceConnection` |
| Node.js | 24.21.0 LTS | 2026-09-08 | nodejs.org previous releases | Node 26 becomes LTS on 2026-10-28; moving later is a minor change |
| React | 19.3.0 | 2026-09-09 | github.com/facebook/react/releases | — |
| TypeScript | 6.0.3 | 2026-04-16 | github.com/microsoft/TypeScript/releases | Supported by linting tooling |
| Vite | 8.3.4 | 2026-10 | github.com/vitejs/vite/releases | Node ^20.19 or >=22.12 |
| Vitest | 5.0.4 | 2026-10 | github.com/vitest-dev/vitest/releases | Supports Vite 8 |
| React Testing Library | 16.3.3 with `@testing-library/dom` 10.4.2 | 2026-08-27 | GitHub releases | React 18 or 19 |
| Playwright (`@playwright/test`) | 1.64.0, Chromium | 2026-10 | github.com/microsoft/playwright/releases | Node >=20 |
| `@axe-core/playwright` | 4.13.0 | 2026-08 | github.com/dequelabs/axe-core-npm/releases | Any Playwright 1.x |
| Docker Engine / Docker Compose | 29.8.1 / v5.5.1 installed (latest 29.9.0 / v5.6.0) | — | docs.docker.com; github.com/docker/compose | Compose v5 is the continuation of the v2 plugin |

Versions checked: 2026-10-13.

**Developer test tools**: JUnit and Spring Boot Test with Testcontainers for the Task Service; Vitest with React
Testing Library for the To-Do Web App. **Acceptance tests**: Playwright with axe-core under `Testing/Automation`
(Constitution, Quality Control).

**Local environment needs**: JDK 21, Maven 3.9 (or the Maven Wrapper), Node.js 24 LTS with npm, Docker with Docker
Compose. Node.js is not yet installed on the reference developer machine.

## Consequences

- **Affects**: To-Do Web App, Task Service, acceptance automation.
- **Follow-up**:
  - Re-check versions before the first plan pins them: Spring's next patch release is 2026-10-22; Spring Boot 4.2 GA
    is expected in November 2026; PostgreSQL 19 GA is expected in October 2026.
  - Not fully verified: the Spring Boot 4.1 open-source support end date (about 2027-07 from an unofficial source);
    that Flyway 12.4.0 itself lists PostgreSQL 18; some release years were inferred from release order.
  - After approval, fill the Quality Control configuration TODOs in the Constitution (runner version, browsers,
    surfaces, local environment) with `/speckit-constitution`.
