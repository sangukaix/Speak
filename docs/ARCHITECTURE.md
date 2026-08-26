# Architecture

## Current system

```text
Web / Android / iOS
        |
Expo + React Native + Expo Router
        |
        | REST: GET /health
        v
FastAPI
```

The frontend contains no secrets. Its only current API configuration is the public base URL. FastAPI loads private configuration from environment variables, owns CORS policy, validates responses with Pydantic, and exposes routes through a central router.

Supabase, OpenAI, and external speech services are planned boundaries and are not connected.

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
