# Security

**Status**: Approved — Tech team, 2026-10-13 (SAD 1.0) | **Constitution**: Principle I

## Rules

1. **Public access is explicit.** The platform has no sign-in and no identity provider (ADR-0002). Every API
   operation is public, and the API contract states this for each operation; adding sign-in is an architecture
   update, never a local change.
2. **Validate on the server.** Every input is validated by the receiving service (type, required, length, format);
   the front end's validation only helps the user. Invalid input is rejected with the standard error format
   (`error-handling.md`).
3. **Transport.** HTTPS everywhere outside the local environment; HTTP Strict Transport Security is set when served
   over HTTPS.
4. **Same origin.** The web application and the API share one origin, so no cross-origin access (CORS) is enabled
   (SAD §4.3).
5. **Response headers.** Responses carry `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer` and a
   Content Security Policy that allows scripts and styles only from the application's own origin.
6. **Output safety.** User-entered text is always rendered as text, never as HTML.
7. **Data access.** Database queries use parameters only; the service connects with a database account that has no
   rights beyond its own schema.
8. **Secrets** follow `configuration-and-secrets.md`; no secret, credential or user-entered content appears in logs,
   error responses or URLs.
9. **Dependencies** are kept on supported versions (ADR-0001); a known security fix in a dependency is applied by
   overriding the version, as done for the PostgreSQL JDBC driver.
