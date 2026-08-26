# Windows setup

## 1. Clone and enter the repository

```powershell
git clone <repository-url>
Set-Location <repository-folder>
```

Do not move files to user-specific absolute paths. All commands below run from the repository root.

## 2. Verify runtimes

Install Node.js 24 LTS and Python 3.13, then open a new PowerShell window:

```powershell
node --version
npm --version
py -3.13 --version
```

Node 24 was selected because it is Active LTS and satisfies Expo SDK 57's Node 22.13+ minimum. Python 3.13 is a stable, broadly supported target for the pinned backend packages.

## 3. Create local configuration

```powershell
Copy-Item .env.example .env
Copy-Item frontend/.env.example frontend/.env
```

The root `.env` is for backend secrets and private configuration. `frontend/.env` is bundled into the app; put only intentionally public `EXPO_PUBLIC_*` values there. Never put OpenAI or Supabase secret/service-role keys in the frontend.

For an Android emulator, the source default is `http://10.0.2.2:8000`. For web and iOS Simulator it is `http://localhost:8000`. For a physical device, replace the frontend URL with the development PC's LAN IP.

## 4. Install dependencies

```powershell
Set-ExecutionPolicy -Scope Process Bypass
./scripts/setup.ps1
```

The script runs `npm ci`, creates root `.venv`, and installs `backend/requirements-dev.txt`. A venv activation step is optional because repository scripts call its Python executable directly. To activate manually:

```powershell
./.venv/Scripts/Activate.ps1
```

## 5. Run

Terminal 1:

```powershell
./scripts/run-backend.ps1
```

Terminal 2:

```powershell
./scripts/run-frontend.ps1 web
```

Use `android` instead of `web` for Android. Local iOS Simulator builds require macOS/Xcode; Windows developers can use Expo Go on a physical iOS device where compatible.
