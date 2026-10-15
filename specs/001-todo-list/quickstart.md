# Quickstart: To-Do List (001)

How to run the feature locally and prove it works end to end. Contract:
[contracts/task-service.openapi.yaml](contracts/task-service.openapi.yaml) · Data: [data-model.md](data-model.md).

## Prerequisites

- JDK 21, Maven 3.9 (or the Maven Wrapper in the service)
- Node.js 24 LTS with npm (**not yet installed on the reference machine**)
- Docker with Docker Compose

## Start

```bash
# 1. Database (PostgreSQL 18.6 on host port 55432)
cp implementation/dev/.env.example implementation/dev/.env      # then set the password
docker compose -f implementation/dev/docker-compose.yml up -d

# 2. Task Service (port 8080, profile local; Flyway creates the schema on start)
cd implementation/backend/task-service && ./mvnw spring-boot:run -Dspring-boot.run.profiles=local

# 3. Web application (port 5173; /api is proxied to 8080)
cd implementation/frontend/todo-web-app && npm ci && npm run dev
```

Ready when `GET http://localhost:8080/actuator/health/readiness` returns `{"status":"UP"}` and
`http://localhost:5173` shows the page.

## Validate the API

| Step | Request | Expected |
|------|---------|----------|
| 1 | `GET /api/v1/tasks` | `200`, `[]` on an empty database |
| 2 | `POST /api/v1/tasks` `{"title":"  Buy milk  "}` | `201`, `title` = `"Buy milk"`, `completed` = `false`, `Location` header |
| 3 | `POST /api/v1/tasks` `{"title":"   "}` | `400`, `type` = `/problems/validation`, error `title` / `required` |
| 4 | `POST /api/v1/tasks` with a 101-character title | `400`, error `title` / `too-long` |
| 5 | `POST` "Call Sam", then `GET /api/v1/tasks` | "Call Sam" first, "Buy milk" second |
| 6 | `PATCH /api/v1/tasks/{id}` `{"completed":true}` (twice) | `200` both times, `completed` = `true` |
| 7 | `PATCH /api/v1/tasks/{id}` `{"completed":false}` on that task | `409`, `type` = `/problems/task-completion-final` |
| 8 | `DELETE /api/v1/tasks/{id}` (twice) | `204`, then `404` with `type` = `/problems/task-not-found` |
| 9 | Stop the database, `GET /api/v1/tasks` | `503`, `type` = `/problems/service-unavailable`; readiness `DOWN` |

Every response carries an `X-Correlation-Id` header; the service log shows one JSON line per request with the same
ID and no task titles.

## Validate in the browser

1. Open `http://localhost:5173` on an empty database: "No tasks yet." and the "New task" field; no sign-in.
2. Add "Buy milk", then "Call Sam": both appear newest first, not completed; the field is cleared after each.
3. Press "Add" with an empty field: "Enter a title for the task." and nothing is added.
4. Mark "Buy milk" as completed: it shows "Completed", is struck through, keeps its place and has no button to undo.
5. Delete "Call Sam": it disappears at once, with no confirmation.
6. Reload: the list is unchanged.
7. Do steps 2–5 with the keyboard only (Tab, Enter, Space).

## Run the tests

```bash
cd implementation/backend/task-service && ./mvnw verify          # service + unit tests (Testcontainers needs Docker)
cd implementation/frontend/todo-web-app && npm test              # Vitest + React Testing Library
```

Acceptance automation runs under `Testing/Automation` through the Phase 2 and Polish `(QC)` tasks of `tasks.md`.
