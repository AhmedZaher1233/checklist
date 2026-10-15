# Date, Time and Time Zone

**Status**: Approved — Tech team, 2026-10-13 (SAD 1.0) | **Constitution**: Platform Scope (Africa/Cairo)

## Rules

1. **Store and exchange instants in UTC.** Services store moments as `timestamp with time zone` and exchange them in
   the API as ISO 8601 UTC strings (`2026-10-13T08:30:00Z`).
2. **Show in Africa/Cairo.** Whenever a date or time is shown to a user, the web application converts it to
   Africa/Cairo, whatever the browser's own time zone; business rules that depend on a calendar day use Africa/Cairo
   days.
3. **One clock.** Services read the current time only from an injected `java.time.Clock` bean (UTC), so tests can fix
   it; no `LocalDateTime.now()` or `new Date()` in business code.
4. **Ordering by time** uses the stored instant; when two instants are equal, a stable second key (the identifier)
   decides.
5. **Database and containers** run in UTC.
