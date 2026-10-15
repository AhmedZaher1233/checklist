# API Contracts and Versioning

**Status**: Approved — Tech team, 2026-10-13 (SAD 1.0) | **Constitution**: Principle VI

## Rules

1. **Style.** Synchronous REST with JSON bodies; resources are plural nouns; standard HTTP methods (`GET` read,
   `POST` create, `PATCH` partial change, `DELETE` remove).
2. **Versioning.** Every path starts with `/api/v1`. A breaking change (removed or renamed field, changed meaning,
   new required input) needs a new version path; additive changes stay in the current version.
3. **Contract.** Each service publishes its OpenAPI 3 contract (springdoc-openapi) at `/v3/api-docs`; the feature
   plan defines its operations in `contracts/` and the implementation must match it. The contract marks every
   operation as public (`security.md`).
4. **Representation.** Field names in `camelCase`; identifiers are opaque strings to the client; moments are ISO 8601
   UTC (`date-and-time.md`); `null` fields may be omitted.
5. **Responses.** Create returns `201` with the created resource; change returns `200` with the updated resource;
   delete returns `204`; errors follow `error-handling.md`.
6. **Repeatable operations.** `GET`, `PATCH` to a target state and `DELETE` are safe to repeat with the same outcome
   (`resilience.md`).
7. **Client.** The web application calls the API only through its `api` layer, using relative URLs so the same build
   works on any origin.
