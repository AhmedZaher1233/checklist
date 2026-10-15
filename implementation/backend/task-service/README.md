# Task Service

Spring Boot service that holds the business rules and the durable, shared task list of the To-Do List
(architecture/decisions/0002-building-blocks.md). It owns its PostgreSQL database; no other component reads it.

## Build

- JDK 21, Maven Wrapper (Maven 3.9.16 — `./mvnw` / `mvnw.cmd`)
- `./mvnw verify` — compiles, runs unit tests (`*Test`) and service tests against PostgreSQL 18.6 in Docker
  (`*IT`, Testcontainers; Docker must be running), and builds `target/task-service-0.0.1-SNAPSHOT.jar`
- Run the jar: `java -jar target/task-service-0.0.1-SNAPSHOT.jar` (stateless; one instance is enough, SAD §9)

## Configuration (environment variables)

| Variable | Required | Meaning |
|---|---|---|
| `TODO_DB_URL` | yes (default only in profile `local`: `jdbc:postgresql://localhost:55432/todo`) | JDBC URL of the service's PostgreSQL database |
| `TODO_DB_USER` | yes | Database user (rights on its own schema only) |
| `TODO_DB_PASSWORD` | yes | Database password — from the platform's secret store, never committed |
| `PORT` | no (default `8080`) | HTTP port |
| `SPRING_PROFILES_ACTIVE` | no | `local` on a developer machine |

Fixed settings (application.yml): database connection timeout 5 s, statement timeout 10 s, schema managed by Flyway
(`src/main/resources/db/migration`, applied on start; Hibernate only validates), JSON (ECS) logs on standard output,
times in UTC.

## Runtime

| Item | Value |
|---|---|
| Port | `8080` (HTTP; HTTPS is terminated by the hosting platform — hosting TBC) |
| API | `/api/v1/tasks` — public, no sign-in (contract: `specs/001-todo-list/contracts/task-service.openapi.yaml`) |
| Liveness | `GET /actuator/health/liveness` |
| Readiness | `GET /actuator/health/readiness` (includes the database; `503`/`DOWN` when it is unreachable) |
| OpenAPI | `GET /v3/api-docs` |
| Logs | one JSON line per request (method, path template, status, duration) with `correlationId`; no task titles or bodies |
| Correlation | `X-Correlation-Id` request header is echoed, or created and returned |
| Data | PostgreSQL 18.6, table `task` |

## Local run

See `specs/001-todo-list/quickstart.md`: start `implementation/dev/docker-compose.yml` (PostgreSQL on 55432, values
in the git-ignored `implementation/dev/.env`), export `TODO_DB_USER` / `TODO_DB_PASSWORD` from it, then
`./mvnw spring-boot:run -Dspring-boot.run.profiles=local`.
