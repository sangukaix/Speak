# Speak AI

Speak AI is a cross-platform English speaking coach in its foundation stage. The repository implements Phases 0–2 plus the current Phase 3 authentication checkpoint: portable setup, an Expo Router client, a FastAPI health endpoint and locally tested JWT boundary, a responsive clickable learning prototype, typed authentication state, guarded routes, and a navigable email/Google/Apple account entry flow. All lesson, progress, session, and report content remains explicitly labeled demo content. The Supabase client and live JWKS connection are intentionally inactive until an owner-controlled project is configured.

## Current features

- One Expo + React Native + TypeScript codebase for web, Android, and iOS
- Four-tab mobile-first navigation for Home, Practice, Review, and Profile
- Clickable demo loop from lesson preview through a scripted choice session to an example evidence-based report
- Accessible theme primitives, responsive layouts, and official cross-platform system symbols
- Three fixed sample lessons and clearly labeled sample review content
- FastAPI `GET /health` endpoint
- FastAPI `GET /auth/me` bearer-token smoke route with exact asymmetric Supabase JWT/JWKS validation
- Preserved developer health screen that performs the real client-to-server check
- Sign-in with email plus Google on Android/iOS/web and Apple on iOS/web, with sign-up, email verification, recovery, callback, reset, restore-error, privacy, and developer-preview screens
- Typed Supabase Auth boundary with PKCE OAuth, native Apple nonce verification, secure native session storage, and root protection for every current learner route
- Environment-based, explicit development CORS origins
- Automated backend health test and frontend TypeScript check
- Product brief, competitor research, UX rules, architecture, and delivery documentation for later phases

No live Supabase/provider configuration, real user account, authoritative active-session check, account deletion, AI, learning database, payment, or speech integration is connected yet.

## Technology

- Node.js 24.18.0 LTS, npm, Expo SDK 57, Expo Router, Expo Symbols, React Native 0.86.3, React 19.2.3, TypeScript 6.0
- Python 3.13, FastAPI 0.141.1, Uvicorn 0.52.4, Pydantic 2.13.4, PyJWT 2.13.0
- Supabase JS, Expo SecureStore, WebBrowser, AppleAuthentication, and Crypto for the inactive Phase 3 authentication boundary
- Planned: Supabase/PostgreSQL persistence and OpenAI Realtime/WebRTC

## Repository layout

```text
.
|-- frontend/               Expo application
|-- backend/                FastAPI application and tests
|-- docs/                   Product and engineering documentation
|-- scripts/                Windows PowerShell helpers
|-- .env.example            Safe environment variable template
|-- .nvmrc                  Node version
|-- .python-version         Python version
|-- AGENTS.md               Repository working rules
`-- README.md
```

## Requirements

- Git
- Node.js 24.18.0 (or another compatible Node 24 LTS patch)
- npm 11+
- Python 3.13
- Android Studio/emulator or a physical Android device for Android testing
- macOS with Xcode for a local iOS Simulator/build; Windows can still develop with Expo Go on a physical iOS device

## Continue on a new Windows computer

The current Phase 3 continuation work is on `codex/phase-3-authentication`; `main` is still the earlier foundation. After that branch is committed and pushed, clone it explicitly:

```powershell
git clone --branch codex/phase-3-authentication https://github.com/sangukaix/Speak.git
Set-Location Speak
git pull --ff-only
git status -sb
```

Read [HANDOFF](docs/HANDOFF.md) before continuing. It records the current product state, implemented/Mock/planned boundaries, local tool inventory, accounts that require user sign-in, next work, and the exact first prompt for a fresh Codex session. Passwords, OTPs, API keys, login sessions, and service-login identifiers are intentionally excluded from handoff and source files.

## First setup (Windows PowerShell)

After cloning and installing the required runtimes:

```powershell
Copy-Item .env.example .env
Set-ExecutionPolicy -Scope Process Bypass
./scripts/setup.ps1
```

OpenAI and Supabase values remain blank until the owner creates the development project. With blank frontend Supabase values, the authentication UI runs in clearly labeled review mode and sends no account request. When `EXPO_PUBLIC_API_BASE_URL` is unset, the source selects `localhost` for web/iOS and `10.0.2.2` for an Android emulator. Never commit local environment files.

## Run the backend

```powershell
./scripts/run-backend.ps1
```

Verify `http://localhost:8000/health` returns `{"status":"ok"}`.

## Run the frontend

Open a second PowerShell window:

```powershell
./scripts/run-frontend.ps1 web
```

For Android, start an emulator and run `./scripts/run-frontend.ps1 android`. If `EXPO_PUBLIC_API_BASE_URL` is set through an `.env*` file or the process environment, its Android emulator URL must be `http://10.0.2.2:8000`; restart Expo after changing it. For iOS on macOS, use `cd frontend; npm run ios`. A physical phone must use the development PC's LAN address in `frontend/.env`, for example `EXPO_PUBLIC_API_BASE_URL=http://192.168.0.10:8000`; ensure the firewall allows port 8000.

## Tests and checks

```powershell
Set-Location backend
../.venv/Scripts/python.exe -m pytest
Set-Location ../frontend
npm run typecheck
npx expo export --platform web
npx expo export --platform all
```

## Git safety

Commit source, documentation, lock files, requirements, tests, and `.env.example`. Do not commit any local `.env*` variant, tokens, API keys, `node_modules`, `.venv`, Expo cache, or build output. Run `git status` before every push.

Start with the [cross-computer handoff](docs/HANDOFF.md), [product brief](docs/PRODUCT_BRIEF.md), [competitor research](docs/COMPETITOR_RESEARCH.md), [UX foundation](docs/UX_FOUNDATION.md), [Phase 3 authentication specification](docs/AUTHENTICATION.md), [SETUP](docs/SETUP.md), [DEVELOPMENT](docs/DEVELOPMENT.md), and the [documentation index](docs/PROJECT_CONTEXT.md).
