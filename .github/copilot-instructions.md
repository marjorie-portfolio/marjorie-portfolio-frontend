# Frontend Project Instructions

## Project
Portfolio frontend. Stack: React, TypeScript (strict), Vite, Mantine, React Router, Zustand, TanStack Query, Axios.
The backend is a separate Node.js API. Never edit backend code.

## Folder map (`src/`)
- `api/` – Axios client and raw API request functions
- `services/` – business logic that wraps `api/` calls
- `query/` – TanStack Query keys, query hooks, and QueryClient setup
- `mutations/` – TanStack Query mutation hooks
- `store/` – Zustand stores (client-only state)
- `hooks/` – reusable custom hooks (non-query)
- `context/` – React contexts (e.g. `ThemeContext`)
- `provider/` – app-level provider wrappers
- `theme/` – Mantine theme config
- `routes/` – React Router route definitions
- `pages/` – route-level pages (e.g. `DashBoard`)
- `components/` – shared UI (e.g. `PageHeader`)
- `types/` – shared TypeScript types
- `helpers/` and `utils/` – small pure functions; check both for an existing one before adding a new one
- `assets/` – static files

## Where new code goes
- New endpoint: request function in `api/`, query hook in `query/` (reads) or `mutations/` (writes). Never call Axios from a component.
- New route: add the page in `pages/` and register it in `routes/`.
- New shared type: `types/`. Types used by only one file stay in that file.
- Don't create new top-level folders in `src/`.

## Conventions
- Use Mantine components and `ThemeContext` colors. No hardcoded colors or custom CSS unless Mantine can't do it.
- Use the shared `PageHeader` on every page.
- Server data goes through TanStack Query. Client-only UI state goes in Zustand.
- Use the existing Axios client for all HTTP requests.
- Reuse existing components, hooks, stores, and API functions before creating new ones.
- Keep components small and typed. No `any`. Preserve strict TypeScript checks.

## API
- The only valid endpoints are in [docs/api-contract.md](../docs/api-contract.md).
  Never invent an endpoint, field, or response shape.
- If an endpoint is missing or marked UNKNOWN, stop and ask.

## Real-time (planned: live visitors count)
- Use the native browser `WebSocket`, wrapped in one hook (e.g. `useVisitorsSocket` in `hooks/`).
- Push updates into the Zustand store or the Query cache. Keep socket logic out of components.
- Handle reconnect and cleanup on unmount.
- Don't add socket.io or any other realtime library without approval.

## Rules
- Prefer minimal, focused changes. Don't rewrite working code or touch unrelated files.
- No new dependencies without approval.
- Ask before changing more than 3 files.
- Don't re-read files already in context.
- If given a mockup, match it with Mantine components rather than custom styles.

## Checks and output
- Run `npm run build` once at the end of a task, not after each step.
- Use `npx tsc --noEmit` for quick mid-task checks.
- Don't summarize changes unless asked. If something is blocked or ambiguous, say so in one or two lines.