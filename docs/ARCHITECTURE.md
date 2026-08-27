# Architecture

## Current system

```text
Web / Android / iOS
        |
Expo + React Native + Expo Router
        |
        | REST: GET /health (developer screen only)
        v
FastAPI
```

The frontend contains no secrets. Its only current API configuration is the public base URL. FastAPI loads private configuration from environment variables, owns CORS policy, validates responses with Pydantic, and exposes routes through a central router.

Phase 2 product screens do not call the API. They use fixed local data under `frontend/src/mocks`, and the interface labels that data as demo or example content. The original health check remains functional under `src/app/developer/health.tsx`.

Supabase, OpenAI, and external speech services are planned boundaries and are not connected.

## Frontend structure

```text
frontend/src/
|-- app/
|   |-- (tabs)/                 Home, Practice, Review, Profile
|   |-- lesson/                 Preview, scripted session, example report
|   |-- developer/health.tsx    Real GET /health verification
|   |-- _layout.tsx             Root stack
|   `-- index.tsx               Tab redirect
|-- components/
|   |-- ui/                     Accessible visual primitives
|   `-- lesson/                 Current lesson domain UI
|-- features/lessons/types.ts   Shared lesson and review domain types
|-- mocks/                      Explicit fixed demo content
`-- theme/tokens.ts             Color, spacing, radius, layout, shadow tokens
```

Expo Router groups the four persistent tabs. Lesson screens live in the root stack, which removes tab navigation during the focused learning flow. The shared `Screen` component centers web content at a maximum width while keeping the same mobile information hierarchy.

`expo-symbols` and its required `expo-font` peer are the only Phase 2 runtime dependency additions. Expo Symbols maps SF Symbols on iOS and Material Symbols on Android and web. No navigation state, server cache, analytics, database client, or AI SDK was added.

## Data and behavior boundaries

- `mocks/lessons.ts` owns fixed lesson copy and scripted answer choices.
- `mocks/review.ts` owns fixed correction examples.
- Choosing an answer changes only in-memory local component state.
- Completing a scripted session does not create history, progress, a streak, or a learner record.
- The example report does not calculate or persist a score.
- The profile screen describes future memory controls but does not store a profile.
- `EXPO_PUBLIC_API_BASE_URL` remains the only client environment variable.

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

## Portability

All paths in source and scripts are repository-relative. Node and Python targets are checked in, npm uses a lock file, Python dependencies are pinned, and secrets are represented only by templates.
