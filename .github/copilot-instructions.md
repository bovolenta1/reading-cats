# Reading Cats — AI Coding Agent Instructions

## Project Overview
**Reading Cats** is a social reading progress tracking app with a **Next.js 16** frontend (TypeScript, React 19, Tailwind) and a **Go backend** running on AWS Lambda. The app uses AWS Cognito (Google OAuth) for authentication and Postgres (Neon) for data storage.

**Frontend:** `c:\Users\eduar\OneDrive\Documentos\Projetinhos\reading-cats` (this repo)  
**Backend:** Go + AWS Lambda (separate repo, called via `process.env.API_BASE_URL`)

---

## Authentication & User Data Flow

### Key Auth Pattern
1. **OAuth with Cognito:** Google login → Cognito PKCE flow → tokens stored in `httpOnly` cookies
2. **Tokens in Cookies:**
   - `access_token` — proves user is authenticated (checked in protected pages)
   - `id_token` — JWT used to call backend API with `Authorization: Bearer {id_token}`
   - `oauth_state` & `pkce_verifier` — temporary PKCE cookies (cleared after callback)

3. **Protected Pages:** Use `requireAuth()` in layout (e.g., [app/(app)/layout.tsx](app/(app)/layout.tsx)) to redirect unauthenticated users to `/login`

### User Data Fetching
- **Layout level** ([app/(app)/layout.tsx](app/(app)/layout.tsx)): Fetch `/v1/me` from backend using `id_token`, pass to `UserProvider`
- **Client level** ([src/contexts/user/UserContext.tsx](src/contexts/user/UserContext.tsx)): Context stores `Me` object + `refresh()` method for manual sync
- **API proxy** ([app/api/me/route.ts](app/api/me/route.ts)): Validates `id_token` exists, forwards to backend

**User type** ([src/contexts/user/types.ts](src/contexts/user/types.ts)): `Me` = `{ id, cognitoSub, email?, displayName?, avatarUrl?, profileSource?, createdAt?, updatedAt? }`

---

## Architecture: Client-Side Data Fetching

### Server vs Client Fetching
- **Server-only calls** (marked with `import "server-only"`): Use direct `backendFetchJSON()` with `id_token` from cookies
  - Examples: [src/lib/api/reading.server.ts](src/lib/api/reading.server.ts), [app/(app)/layout.tsx](app/(app)/layout.tsx)
  - **Why:** Direct backend access; no extra HTTP hop through Next.js API routes

- **Client-side calls:** Go through Next.js API routes (e.g., `/api/me`) then to backend
  - Examples: [src/lib/api/reading.ts](src/lib/api/reading.ts) (uses `fetch('/api/reading', ...)`), [UserContext refresh()](src/contexts/user/UserContext.tsx#L24)
  - **Why:** Browser can't access backend directly; API routes act as proxy

### Backend API Helper
[src/lib/api/backend.ts](src/lib/api/backend.ts): `backendFetchJSON<T>(path, { token?, method?, body?, cache? })` — handles Bearer token headers, JSON parsing, and throws `ApiError` on non-2xx responses

---

## Component & State Management Patterns

### Layout Structure
- **App layout** ([app/(app)/layout.tsx](app/(app)/layout.tsx)): Wraps protected pages with `UserProvider` (holds current user)
- **Auth layout** ([app/(auth)/layout.tsx](app/(auth)/layout.tsx)): Separate layout for `/login` and `/auth/callback`

### Reusable Components
- [src/components/ui/Button.tsx](src/components/ui/Button.tsx): Props extend `HTMLButtonElement` (standard pattern)
- [src/components/ui/MiniCalendar.tsx](src/components/ui/MiniCalendar.tsx): Day entries from reading progress
- [src/components/feed/GroupsPanel.tsx](src/components/feed/GroupsPanel.tsx): Lists reading groups with avatars (see `GroupItem` type)

### Avatar Generation
Uses **DiceBear** ([src/lib/utils/avatar.ts](src/lib/utils/avatar.ts)) for deterministic avatars from seeds (e.g., `seed: 'Eduardo'` → consistent avatar per name)

---

## Reading Progress API

### Data Fetching
- **Server**: [src/lib/api/reading.server.ts](src/lib/api/reading.server.ts) — `getReadingProgressServer()` → calls `/v1/reading/progress` with `id_token`
- **Client**: [src/lib/api/reading.ts](src/lib/api/reading.ts) — `getReadingProgress()` & `postReading(pages)` → call `/api/reading/*` routes

### Response Types
```typescript
ReadingProgress = {
  day: { date, pages, goal_pages },
  streak: { current_days },
  week: [{ date, pages, checked }]
}
```

---

## Key Files by Purpose

| Purpose | Files |
|---------|-------|
| Auth flow | [app/(auth)/](app/(auth)/), [app/api/auth/google/route.ts](app/api/auth/google/route.ts), [app/(auth)/auth/callback/route.ts](app/(auth)/auth/callback/route.ts) |
| Protected routes | [app/(app)/layout.tsx](app/(app)/layout.tsx), [src/lib/auth/requireAuth.ts](src/lib/auth/requireAuth.ts) |
| User context | [src/contexts/user/](src/contexts/user/) |
| API calls | [src/lib/api/](src/lib/api/) |
| Feed components | [src/components/feed/](src/components/feed/) |
| UI primitives | [src/components/ui/](src/components/ui/) |

---

## Development Commands

```bash
npm run dev          # Start Next.js dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

**Environment variables** (`.env.local` — not committed):
- `NEXT_PUBLIC_API_BASE_URL` — backend base URL (public, can be in browser)
- `API_BASE_URL` — same (server-side)
- `APP_URL` — OAuth redirect base (e.g., `http://localhost:3000`)
- `COGNITO_DOMAIN` — AWS Cognito domain
- `COGNITO_CLIENT_ID` — OAuth client ID

---

## Common Tasks

### Adding a New Page
1. Create file in `app/(app)/` or `app/(auth)/` with `page.tsx`
2. If protected, ensure layout uses `requireAuth()` and `UserProvider`
3. Use `backendFetchJSON()` for server-side data, or proxy via API routes for client

### Adding an API Proxy Route
1. Create `app/api/[feature]/route.ts`
2. Extract `id_token` from cookies
3. Call backend via `backendFetchJSON()` with token
4. Return JSON response (see [app/api/me/route.ts](app/api/me/route.ts))

### Updating User Context
Modify [src/contexts/user/types.ts](src/contexts/user/types.ts) → update `Me` type → adjust any code accessing `me.*` properties

---

## Conventions

- **"server-only" imports**: Mark files that call backend APIs directly (cannot run in browser)
- **API responses**: Always wrap in `try-catch` with `ApiError` check for proper status codes
- **Cookies**: Use `const store = await cookies()` then `store.get('name')?.value` (Next.js 15+ pattern)
- **Styling**: Tailwind CSS with dark theme base (`bg-[#0b0f14]`, `text-white`)
