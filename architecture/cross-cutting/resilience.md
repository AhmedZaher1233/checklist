# Resilience

**Status**: Approved — Tech team, 2026-10-13 (SAD 1.0) | **Constitution**: Principle V

## Rules

1. **Timeouts on every call.** The web application aborts an API call after 10 seconds and treats it as failed
   (`error-handling.md`). Services set a database connection timeout of 5 seconds and a statement timeout of 10
   seconds.
2. **No automatic retry of creates.** A request that creates something is never retried automatically, by the
   client or the service; the user decides whether to try again.
3. **Repeatable changes.** Operations that set a target state or remove something are written so that repeating
   them gives the same result (`api-contracts.md`); a retry after a lost response is then harmless.
4. **One action, one request.** The front end sends at most one request per user action and ignores repeated
   clicks while it is in flight (`code-structure.md`).
5. **Fail visibly.** When the database is unavailable the service answers `503` in the standard error format and its
   readiness check fails (`observability.md`); it never answers from stale data.
6. **No circuit breakers, bulkheads or fallbacks** while a single service calls only its own database; they are
   reconsidered when a call to another service or an external system appears.
