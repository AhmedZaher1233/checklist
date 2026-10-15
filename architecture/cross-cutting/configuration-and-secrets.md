# Configuration and Secrets

**Status**: Approved — Tech team, 2026-10-13 (SAD 1.0) | **Constitution**: Principles I and V

## Rules

1. **Externalized configuration.** Anything that differs between environments (database URL, credentials, ports,
   log level) comes from environment variables; `application.yml` holds defaults only and refers to them as
   `${VARIABLE}`.
2. **Profiles.** Spring profile `local` for the developer machine; other profiles are added with the hosting target
   (TBC, SAD §9). Code never branches on the profile name.
3. **Secrets.** No password, key or token is committed. Locally they live in a git-ignored `.env` file next to the
   Docker Compose file, with a committed `.env.example` that lists the variable names with placeholder values;
   elsewhere they come from the hosting platform's secret store (decided with the hosting target, SAD §9).
4. **Front end.** The web application contains no secrets; build-time settings use Vite `VITE_` variables and hold
   only non-secret values.
5. **Acceptance tests.** Environment URLs and any accounts are referenced by secret name (`E{n}_URL`, `A{n}_USER`)
   from the automation root's git-ignored `.env` (Constitution, QC-7).
