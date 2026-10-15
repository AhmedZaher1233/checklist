# Error Handling

**Status**: Approved — Tech team, 2026-10-13 (SAD 1.0) | **Constitution**: Principle VI

## Rules

1. **One error format.** Every error response from a service is `application/problem+json` (RFC 9457 Problem
   Details) with `type`, `title`, `status`, `detail` and, for invalid input, an `errors` list naming each field and
   what is wrong with it.
2. **One handler.** Each service maps exceptions to responses in a single global handler (`exception` package); a
   controller never builds an error response itself.
3. **Status codes.** `400` invalid input, `404` the requested item does not exist, `409` the request conflicts with
   the current state, `500` anything unexpected. Business rules state which case applies; the plan lists them per
   operation.
4. **No internals.** Error responses never contain stack traces, exception class names, SQL, or internal
   identifiers beyond the one requested. Unexpected errors return a generic `title` and are logged in full with the
   correlation ID (`observability.md`).
5. **User messages belong to the front end.** The web application maps each error `type` and status to the
   plain-language message the specification defines; it never shows raw server text. A network failure or timeout is
   shown as "the action failed" and the screen keeps the last confirmed state.
6. **Failed actions are never shown as done**: the front end updates the screen only after the service confirms the
   action.
