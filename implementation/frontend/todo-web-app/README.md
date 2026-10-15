# To-Do Web App

React single-page application: the only channel of the To-Do List (architecture/decisions/0002-building-blocks.md).
It holds no business rules and calls the Task Service only through relative `/api` URLs.

## Build

- Node.js 24 LTS (`.nvmrc`), npm
- `npm ci` — install the pinned dependencies (React 19.3.0, Vite 8.3.4, TypeScript 6.0.3, Vitest 5.0.4)
- `npm run typecheck` — TypeScript check
- `npm test` — component and API-layer tests (Vitest + React Testing Library, jsdom)
- `npm run build` — static files in `dist/` (`index.html` and hashed assets)

## Runtime

| Item | Value |
|---|---|
| Output | Static files in `dist/`; serve `index.html` for `/` |
| Same origin | The host must serve the app and forward `/api/*` to the Task Service on the same origin (no CORS; SAD §4.3) |
| Headers the host must set | `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `Content-Security-Policy: default-src 'self'`, HSTS on HTTPS (architecture/cross-cutting/security.md) |
| Configuration | None — no build-time variables and no secrets |
| Browser support | Chromium on desktop (Constitution, Quality Control configuration) |
| Request timeout | 10 s per API call; creates are never retried |

## Local run

`npm run dev` — Vite dev server on `http://localhost:5173` (strict port), forwarding `/api` to
`http://localhost:8080`. Start the Task Service first (`specs/001-todo-list/quickstart.md`). `npm run preview` serves
the production build on port 4173 with the same forwarding.
