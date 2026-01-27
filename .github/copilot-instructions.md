# Reading Cats — AI Coding Agent Instructions (concise)

Purpose: quickly orient AI coding agents to be productive in this Next.js frontend repo.

Project snapshot
- Frontend: Next.js 16 (TS, React 19, App Router), Tailwind. Repo root is the app code.
- Backend: Separate Go Lambda API (called via `API_BASE_URL` / `NEXT_PUBLIC_API_BASE_URL`).
- Auth: AWS Cognito (Google OAuth + PKCE). Tokens are stored in httpOnly cookies.

High-level architecture and data flows (what matters)
- Browser → Next.js App Router pages/components. Client-side API calls go to internal API routes under `app/api/*` which proxy to backend.
- Server-only code (files importing `server-only`) calls backend directly via `src/lib/api/backend.ts` using `id_token` from cookies.
- Authentication flow: login → Cognito → tokens in cookies (`id_token` used as bearer token to backend). See `app/api/auth/google/route.ts`, `app/(auth)/auth/callback/route.ts`, and `app/api/auth/otp/*` for OTP flow.

Key developer conventions (project-specific)
- Two fetch paths: server-only code uses `backendFetchJSON()` directly (no proxy). Client code must call `fetch('/api/feature')` which forwards to backend. Inspect `src/lib/api/reading.server.ts` vs `src/lib/api/reading.ts` for examples.
- User context: `UserProvider` is created at layout level. Canonical files: `app/(app)/layout.tsx` and `src/contexts/user/UserContext.tsx`.
- Cookies: use Next.js `cookies()` server API to read `id_token` and other auth cookies in API routes and server components.

Critical files to read first
- App layout and auth: app/(app)/layout.tsx, app/(auth)/layout.tsx
- API proxy examples: app/api/me/route.ts, app/api/reading/route.ts
- Backend helper: src/lib/api/backend.ts
- Auth helpers: src/lib/auth/getUserFromIdToken.ts, src/lib/auth/requireAuth.ts
- User types/context: src/contexts/user/types.ts, src/contexts/user/UserContext.tsx

Run & debug (commands you will likely need)
- Start dev server: `npm run dev` (Next.js dev on :3000) — default for local testing.
- Lint: `npm run lint`.
- Build: `npm run build` and `npm run start` for production preview.

Integration notes and external dependencies
- Cognito: env vars `COGNITO_CLIENT_ID`, `COGNITO_DOMAIN`, `APP_URL` used for OAuth flows. See API routes under `app/api/auth/*` and OTP handlers at `app/api/auth/otp/*`.
- Backend base URL: `API_BASE_URL` / `NEXT_PUBLIC_API_BASE_URL` — server expects `id_token` as Bearer for backend calls.
- DiceBear avatars: deterministic avatar generation in `src/lib/utils/avatar.ts`.

What AI agents should do differently here (concrete guidelines)
- Prefer server-only calls when editing server components or API routes that already use `server-only` (avoid adding unnecessary client proxies).
- When modifying auth or API proxy routes, update cookie handling and maxAge to match existing patterns (see `app/api/auth/otp/start/route.ts`).
- Use existing helpers (`backendFetchJSON`, `requireAuth`, `getUserFromIdToken`) rather than reimplementing token parsing or fetch logic.

If you change types: update `src/contexts/user/types.ts` and then run quick grep for usages before changing components.

Quick links (locate these first when exploring)
- `app/(app)/layout.tsx` — protected app layout
- `app/api/me/route.ts` — API proxy pattern
- `src/lib/api/backend.ts` — backendFetchJSON helper
- `src/contexts/user/UserContext.tsx` — Me type and refresh

If anything here is unclear or you want more examples (e.g., specific auth handlers or API route templates), tell me which area to expand and I will iterate.
