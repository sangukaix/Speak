# Speak AI

Speak AI is a cross-platform English speaking coach in its foundation stage. The repository implements Phases 0–2: portable setup, an Expo Router client, a FastAPI health endpoint, and a responsive clickable product prototype. All lesson, progress, session, and report content in Phase 2 is explicitly labeled demo content; AI, voice, accounts, and persistence are not connected.

## Current features

- One Expo + React Native + TypeScript codebase for web, Android, and iOS
- Four-tab mobile-first navigation for Home, Practice, Review, and Profile
- Clickable demo loop from lesson preview through a scripted choice session to an example evidence-based report
- Accessible theme primitives, responsive layouts, and official cross-platform system symbols
- Three fixed sample lessons and clearly labeled sample review content
- FastAPI `GET /health` endpoint
- Preserved developer health screen that performs the real client-to-server check
- Environment-based, explicit development CORS origins
- Automated backend health test and frontend TypeScript check
- Product brief, competitor research, UX rules, architecture, and delivery documentation for later phases

No AI, authentication, database, payment, or speech integration is implemented yet.

## Technology

- Node.js 24.18.0 LTS, npm, Expo SDK 57, Expo Router, Expo Symbols, React Native 0.86.2, React 19.2.3, TypeScript 6.0
- Python 3.13, FastAPI 0.141.1, Uvicorn 0.52.4, Pydantic 2.13.4
- Planned: Supabase/PostgreSQL and OpenAI Realtime/WebRTC

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

## First setup (Windows PowerShell)

```powershell
git clone <repository-url>
Set-Location <repository-folder>
Copy-Item .env.example .env
Copy-Item frontend/.env.example frontend/.env
./scripts/setup.ps1
```

If PowerShell blocks local scripts, run `Set-ExecutionPolicy -Scope Process Bypass` for the current terminal only. Edit the copied `.env` files for the machine; never commit them.

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

For Android, start an emulator and run `./scripts/run-frontend.ps1 android`. For iOS on macOS, use `cd frontend; npm run ios`. A physical phone must use the development PC's LAN address in `frontend/.env`, for example `EXPO_PUBLIC_API_BASE_URL=http://192.168.0.10:8000`; ensure the firewall allows port 8000.

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

Commit source, documentation, lock files, requirements, tests, and `.env.example`. Do not commit `.env`, tokens, API keys, `node_modules`, `.venv`, Expo cache, or build output. Run `git status` before every push.

Start with the [product brief](docs/PRODUCT_BRIEF.md), [competitor research](docs/COMPETITOR_RESEARCH.md), [UX foundation](docs/UX_FOUNDATION.md), [SETUP](docs/SETUP.md), [DEVELOPMENT](docs/DEVELOPMENT.md), and the [documentation index](docs/PROJECT_CONTEXT.md).
