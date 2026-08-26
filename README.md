# Speak AI

Speak AI is a cross-platform AI English conversation service in its foundation stage. This repository currently implements Phase 0 and Phase 1 only: portable project setup, an Expo Router client, a FastAPI server, and a client-to-server health check.

## Current features

- One Expo + React Native + TypeScript codebase for web, Android, and iOS
- Expo Router entry and a minimal API connection screen
- FastAPI `GET /health` endpoint
- Environment-based, explicit development CORS origins
- Automated backend health test and frontend TypeScript check
- Architecture and delivery documentation for later Supabase and OpenAI work

No AI, authentication, database, payment, or speech integration is implemented yet.

## Technology

- Node.js 24.18.0 LTS, npm, Expo SDK 57, React Native 0.86.2, React 19.2.3, TypeScript 6.0
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
```

## Git safety

Commit source, documentation, lock files, requirements, tests, and `.env.example`. Do not commit `.env`, tokens, API keys, `node_modules`, `.venv`, Expo cache, or build output. Run `git status` before every push.

See [SETUP](docs/SETUP.md), [DEVELOPMENT](docs/DEVELOPMENT.md), and the [documentation index](docs/PROJECT_CONTEXT.md) for details.
