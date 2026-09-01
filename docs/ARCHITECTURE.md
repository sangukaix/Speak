# Architecture

## Current system

```text
Web / Android / iOS
        |
Expo + React Native + Expo Router
        |-- Supabase Auth client (email + Google/Apple code paths; inactive until project/provider config exists)
        |-- REST: GET /health (developer screen only) --> FastAPI
        `-- REST: GET /auth/me (bearer smoke check) ---> FastAPI --> Supabase public JWKS
```

The frontend contains no secrets. It accepts a public API base URL plus the Supabase project URL and publishable key; the latter two remain blank locally, so no real account traffic occurs. FastAPI loads private configuration from environment variables, owns CORS policy, validates responses with Pydantic, and exposes routes through a central router.

Phase 2 product screens do not call the API. They use fixed local data under `frontend/src/mocks`, and the interface labels that data as demo or example content. The original health check remains functional under `src/app/developer/health.tsx`.

The Supabase Auth client boundary and platform-specific social entry code are implemented but unconfigured. FastAPI now has an asymmetric JWKS verifier and protected `/auth/me` smoke route tested with ephemeral local keys. No Supabase project, Google/Apple provider credentials, live JWKS/session verification, account deletion, application database, OpenAI, or external speech service is connected.

## Frontend structure

```text
frontend/src/
|-- app/
|   |-- (tabs)/                 Home, Practice, Review, Profile
|   |-- auth/                   Sign-in, sign-up, verification, recovery, callback, reset, restore failure
|   |-- lesson/                 Preview, scripted session, example report
|   |-- developer/              Development-only auth preview and real GET /health verification
|   |-- privacy.tsx             Public privacy-development draft
|   |-- _layout.tsx             Auth provider and protected root stack
|   `-- index.tsx               Deterministic auth-state redirect
|-- components/
|   |-- auth/                   Shared account shells and global auth states
|   |-- ui/                     Accessible visual and form primitives
|   `-- lesson/                 Current lesson domain UI
|-- features/auth/              Typed state, PKCE/social client, safe flow context, session storage
|-- features/lessons/types.ts   Shared lesson and review domain types
|-- mocks/                      Explicit fixed demo content
`-- theme/tokens.ts             Color, spacing, radius, layout, shadow tokens
```

Expo Router groups the four persistent tabs. Lesson screens live in the root stack, which removes tab navigation during the focused learning flow. The shared `Screen` component centers web content at a maximum width while keeping the same mobile information hierarchy.

Phase 3 adds `@supabase/supabase-js`, URL/random-value polyfills, Expo SecureStore, WebBrowser, AppleAuthentication, Crypto, AsyncStorage, and AES support. Native session ciphertext is stored in AsyncStorage while the per-value encryption key is kept in platform-protected SecureStore; plaintext AsyncStorage is not used as a fallback. Web currently uses localStorage and still requires CSP/XSS review before deployment. No server cache, analytics, application database client, or AI SDK was added.

## Data and behavior boundaries

- `mocks/lessons.ts` owns fixed lesson copy and scripted answer choices.
- `mocks/review.ts` owns fixed correction examples.
- Choosing an answer changes only in-memory local component state.
- Completing a scripted session does not create history, progress, a streak, or a learner record.
- The example report does not calculate or persist a score.
- The profile screen describes future memory controls but does not store a profile.
- `EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_SUPABASE_URL`, and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are the only client environment variables. The Supabase pair is blank at this checkpoint.

## Planned service boundaries

```text
Expo client
  |-- REST ----------------------> FastAPI
  |                                 |-- Supabase (planned)
  |                                 |-- OpenAI APIs (planned)
  |                                 `-- speech service (planned)
  `-- WebRTC (future) ------------> OpenAI Realtime
             ^
             `-- ephemeral credential issued by FastAPI
```

For Realtime, the client will request a short-lived, scoped credential from FastAPI. The permanent OpenAI key remains on the server. WebRTC then carries media directly between the client and Realtime where supported.

### Phase 3 authentication boundary

```text
Expo client
  |-- publishable key ----------> Supabase Auth
  |                                 |-- verified email/password
  |                                 |-- Google OAuth (Android, iOS, web)
  |                                 |-- Apple native ID token (iOS)
  |                                 |-- Apple OAuth (web)
  |                                 `-- access + refresh session
  |
  `-- learner bearer JWT --------> FastAPI
                                    |-- verify issuer/audience/signature/expiry
                                    `-- privileged account deletion (server secret only)

Future user-owned tables
  `-- authenticated role + least grants + RLS scoped to auth user ID
```

The client calls Auth directly so FastAPI never receives a password or third-party ID token. Google uses a Supabase PKCE OAuth browser session on native and web. iOS Apple login uses Apple's native sheet with a random SHA-256 nonce and exchanges the returned identity token directly with Supabase; web Apple uses PKCE OAuth. The publishable key is intentionally exposable, but requests made with it retain the permissions granted to the relevant database role; every exposed table still needs least-privilege grants and RLS. Expo Router guards prevent accidental navigation and protected-screen disclosure; they are not a security boundary. FastAPI JWT/session checks and future database grants/RLS enforce authorization. All existing tabs and lesson routes are account-required in Phase 3. A future free experience uses a separate `/demo` tree. The development health diagnostic remains independent of learner authentication in development and is blocked from direct production navigation.

Phase 3 does not create profile or learning tables. Native long-lived session credentials require provider-compatible platform-protected storage; ordinary plaintext AsyncStorage is not an accepted fallback. Web storage receives a separate XSS/CSP review before public deployment.

The first backend checkpoint uses `PyJWT` with a backend-configured asymmetric algorithm allowlist, a fixed issuer derived from backend `SUPABASE_URL`, and a five-minute in-process public JWKS cache. The default allowlist contains only `ES256`; `RS256` can be added temporarily for a planned cross-algorithm rotation. Unknown key IDs can force at most one refresh per cooldown window. The verifier rejects symmetric algorithms and token-provided key URLs. `/auth/me` proves signature and learner-claim enforcement without exposing email or session ID. Authoritative `auth.sessions` validation and privileged deletion remain separate work because a cryptographically valid token can outlive sign-out until its expiry.

## Portability

All paths in source and scripts are repository-relative. Node and Python targets are checked in, npm uses a lock file, Python dependencies are pinned, and secrets are represented only by templates.
