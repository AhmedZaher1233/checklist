# Observability

**Status**: Approved — Tech team, 2026-10-13 (SAD 1.0) | **Constitution**: Principle VII

## Rules

1. **Structured logs.** Services log to standard output in JSON (Spring Boot structured logging), with timestamp
   (UTC), level, logger, message and correlation ID.
2. **Correlation ID.** Every request carries an `X-Correlation-Id`; a service creates one when it is missing, puts
   it in the logging context for the whole request, and returns it in the response header.
3. **What to log.** One line per request (method, path template, status, duration) at `INFO`; handled business
   rejections at `INFO`; unexpected errors at `ERROR` with the stack trace.
4. **What never to log.** User-entered content, request bodies, secrets and credentials (Constitution I).
5. **Health.** Each service exposes Spring Boot Actuator `/actuator/health/liveness` and
   `/actuator/health/readiness` (readiness includes the database); other Actuator endpoints are not exposed
   publicly.
6. **Metrics.** Actuator metrics are enabled for HTTP requests and the database connection pool; exporting them is
   decided with the hosting target (TBC, SAD §9).
7. **Front end.** The web application logs nothing that contains user-entered content; unexpected client errors are
   written to the browser console only.
