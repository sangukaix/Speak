# Windows setup

Updated: 2026-09-01

이 절차는 Speak AI를 한 번도 실행한 적 없는 Windows PC를 기준으로 한다. 기존 PC의 `.venv`, `node_modules`, `.env`, Codex login cache, Android emulator data는 복사하지 않는다. Git에 있는 version, lock, requirements, template 파일로 다시 만든다.

현재 상태와 새 Codex에게 보낼 첫 메시지는 [HANDOFF](HANDOFF.md)에 있다.

## 1. One-time tools

Core development requires:

- Git for Windows
- Node.js 24.18.0 or another compatible Node 24 LTS patch
- npm 11+
- Python 3.13 with the Python Launcher for Windows
- PowerShell
- VS Code or another editor

Android Studio is needed only for local Android emulator testing. A local iOS Simulator/build requires macOS and Xcode; it cannot run on Windows.

Windows Package Manager can install the common tools:

```powershell
winget install --id Git.Git -e
winget install --id OpenJS.NodeJS.LTS -e
winget install --id Python.Python.3.13 -e
```

If `winget` is unavailable, install Microsoft App Installer or use the official Git, Node.js, and Python Windows installers. Close all terminals and open a new PowerShell window after installation. Package channels can change over time, so the version checks below are authoritative for this repository. If the Node package no longer installs Node 24, use the Node.js 24 download from [nodejs.org](https://nodejs.org/en/download) instead of continuing with a different major version.

Verify:

```powershell
git --version
node --version
npm --version
py -3.13 --version
```

Expected project targets:

```text
Node v24.18.0 (or compatible Node 24 LTS patch)
npm 11+
Python 3.13.x
```

Do not continue with a copied `.venv`. A Python virtual environment records machine-specific interpreter paths.

## 2. Install and sign in to Codex

Choose one local Codex surface:

### ChatGPT desktop app for Windows

```powershell
winget install --id 9PLM9XGG6VKS -s msstore
```

Open the app, select Continue, and complete the browser sign-in yourself. See the [official Windows app guide](https://learn.chatgpt.com/docs/windows/windows-app).

### VS Code Codex extension

Install the Codex extension from the VS Code marketplace, open the Codex sidebar, choose `Sign in with ChatGPT`, and complete the browser flow yourself. See the [official IDE guide](https://learn.chatgpt.com/docs/codex/ide).

ChatGPT sign-in is enough for local Codex work when the account has access. An OpenAI API key is not required for the current authentication phase. Never copy another PC's Codex auth file, paste a token into this repository, or put login credentials in a Codex prompt.

## 3. Configure Git identity and GitHub access

Set your own Git identity if it is not configured already:

```powershell
git config --global user.name "YOUR NAME"
git config --global user.email "YOUR_GITHUB_NOREPLY_EMAIL"
```

Use the no-reply address shown in your GitHub email settings when you do not want a personal email embedded in public commit metadata. Do not replace the placeholders inside repository files. These commands update only the current Windows user profile. Git for Windows includes Git Credential Manager; the first authenticated `git push` can open a browser login. GitHub CLI is optional.

## 4. Clone the active work branch

The latest product prototype is not on `main`. Clone the current continuation branch explicitly:

```powershell
git clone --branch codex/phase-3-authentication https://github.com/sangukaix/Speak.git
Set-Location Speak
git pull --ff-only
git status -sb
git log -3 --oneline --decorate
```

The active continuation branch must be `codex/phase-3-authentication`. Do not begin feature work from `main` until the repository documentation says the current work has been merged. The branch must be pushed from the source PC before a new computer can clone it.

Open this exact repository folder in VS Code or the ChatGPT desktop app. Codex reads the root `AGENTS.md` before work; that file requires it to read `docs/HANDOFF.md` and the other canonical documents.

## 5. Create local configuration

Create the backend/local application file:

```powershell
Copy-Item .env.example .env
```

Until an owner-controlled Supabase development project exists, leave these backend integration values blank:

```text
OPENAI_API_KEY
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
```

They are not required to review the current UI. `SUPABASE_SECRET_KEY` is backend-only and must never be copied into `frontend/.env` or an `EXPO_PUBLIC_*` variable.

Keep `SUPABASE_JWT_ALGORITHMS=ES256` for the recommended project signing key. Use `RS256` instead if that is the project's single active algorithm; list `ES256,RS256` only during a planned cross-algorithm rotation while both trusted keys can issue unexpired tokens. This setting is not a secret. `HS256` is intentionally unsupported.

The frontend selects a platform-specific local API URL when `EXPO_PUBLIC_API_BASE_URL` is unset:

| Platform | Source default |
|---|---|
| Web | `http://localhost:8000` |
| iOS Simulator | `http://localhost:8000` |
| Android emulator | `http://10.0.2.2:8000` |

Therefore, do not set `EXPO_PUBLIC_API_BASE_URL` for ordinary web/Android emulator setup. Create `frontend/.env` when an intentional API override or an owner-provided Supabase development configuration is needed:

```powershell
Copy-Item frontend/.env.example frontend/.env
```

Keep the safe template and edit only the values needed for the current machine:

| Use | `frontend/.env` content |
|---|---|
| Web or iOS Simulator | `EXPO_PUBLIC_API_BASE_URL=http://localhost:8000` |
| Android emulator | `EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8000` |
| Physical device example | `EXPO_PUBLIC_API_BASE_URL=http://192.168.0.10:8000` |

Real authentication also requires these two public client values from the same owner-controlled Supabase development project:

```text
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

When they remain blank, the account UI stays in review mode, actions that would contact Auth are disabled, and no account request is sent. The publishable key can appear in the client bundle, but it is not an authorization substitute: keep database grants minimal and enable RLS before exposing any future table. Never put the backend secret key in this file.

### Social-provider setup boundary

The client source already supports Google on Android/iOS/web, native Apple on iOS, and Apple OAuth on web. The owner-approved iOS bundle identifier and Android package are both `com.sangukaix.speakai`. Real social sign-in remains blocked until the owner controls and configures all three provider consoles.

1. Create the Supabase development project, choose its region, and configure email confirmation and exact app/web redirect URLs.
2. In Google Auth Platform, configure the consent screen and an OAuth client whose authorized redirect URI is the exact Supabase Auth callback shown by the [Supabase Google guide](https://supabase.com/docs/guides/auth/social-login/auth-google). Put the Google client ID/secret only in the Supabase Dashboard.
3. In Apple Developer, register the stable iOS bundle ID with Sign in with Apple. For web Apple login, also configure the Services ID/domain/return URL and generated client secret described by the [Supabase Apple guide](https://supabase.com/docs/guides/auth/social-login/auth-apple). Apple OAuth client secrets expire every six months, so assign an owner and rotation reminder before enabling web login.
4. Add exact local web and installed-app `/auth/callback` values to Supabase's redirect allowlist. Do not use a wildcard host and do not treat an Expo Go `exp://` callback as an installed `speakai://` test.
5. Put only `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in ignored `frontend/.env`. Google secrets, Apple private keys, generated Apple secrets, tokens, and provider account identifiers never belong in source, screenshots, prompts, or logs.

Android/iOS exports prove that modules bundle; they do not prove provider configuration or device interaction. Google must be tested in an installed Android build. Native Apple must be tested in an installed iOS build on an Apple-signed device, and web Apple must be tested separately through the browser OAuth path.

For a physical device, replace the example with this PC's actual LAN address. Restart Expo after changing the file. The device must be on the same network, and Windows Firewall must allow the backend port.

Root and frontend `.env*` files are local and ignored. Only safe `.env.example` templates belong in Git. Backend secrets must never use an `EXPO_PUBLIC_` name because those values can be bundled into the client.

## 6. Install project dependencies

Allow repository PowerShell scripts for this terminal session only and run setup:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
./scripts/setup.ps1
```

The script performs these actions:

1. `npm ci` inside `frontend`, using `package-lock.json`.
2. Regenerates Expo Router's ignored typed-route declarations with `npm run typegen` so a fresh clone and a branch switch do not depend on stale `.expo` cache files.
3. Creates root `.venv` with `py -3.13` when it does not exist.
4. Upgrades pip inside that venv.
5. Installs `backend/requirements-dev.txt`.

It does not install Git, Node, npm, or Python. If `py -3.13` fails, install Python 3.13 with the Launcher option and rerun setup. Do not work around the error by copying the existing PC's Python 3.12 venv.

Venv activation is optional because repository scripts call the interpreter directly. To activate manually:

```powershell
./.venv/Scripts/Activate.ps1
```

## 7. Verify the fresh clone

Run backend tests:

```powershell
Set-Location backend
../.venv/Scripts/python.exe -m pytest
Set-Location ..
```

Run frontend checks and cross-platform bundle exports:

```powershell
Set-Location frontend
npm run typecheck
npx expo export --platform web
npx expo export --platform all
Set-Location ..
```

`npm run typecheck` first regenerates Expo Router's typed-route declaration and then runs TypeScript, so route validation is independent of the ignored `.expo` cache left by an earlier branch. The current automated baseline is 25 backend tests plus TypeScript validation. Expo exports verify bundle generation but do not replace manual device interaction or a future end-to-end test suite. Do not claim Android or iOS visual behavior was verified on the new PC until it was actually opened there.

## 8. Run the project

Terminal 1, from the repository root:

```powershell
./scripts/run-backend.ps1
```

Open `http://localhost:8000/health`. Expected response:

```json
{"status":"ok"}
```

Terminal 2, from the repository root:

```powershell
./scripts/run-frontend.ps1 web
```

In development, open `/developer/auth-preview` from the sign-in screen to review the complete account UI flow, or open `/developer/health` directly to perform the only current real frontend-to-backend request. Learner tabs remain inaccessible until a real authenticated session exists.

## 9. Optional Android setup

Install [Android Studio](https://developer.android.com/studio) only when Android verification or additional Fluently research is needed. Use SDK Manager and Device Manager instead of copying the previous PC's SDK or AVD folders.

The previous PC used a Pixel 8-style Android 16/API 36 AVD with a Google Play image. That exact AVD is not a product requirement; an Expo SDK 57-compatible Google Play emulator or a physical Android device is sufficient.

Start the emulator, then run:

```powershell
./scripts/run-frontend.ps1 android
```

For `GET /health`, Android emulator traffic reaches the Windows host at `10.0.2.2`, not `localhost`. A real phone needs the PC LAN IP.

If competitor voice testing is repeated in an emulator, enable `Virtual microphone uses host audio input` under Emulator Extended Controls → Microphone and confirm the Windows input meter moves before testing the app. The previous PC had weak host microphone input and a temporary emulator DNS outage, so a physical phone is preferable for reliable voice-product observation.

Google Play and Fluently require the owner to sign in again. Account email, password, OTP, cookies, assessment answers, and personal results are not in this repository and must not be given to Codex or committed.

## 10. Start the new Codex session

Open the cloned repository root, start a new Codex chat, and paste the exact prompt in [HANDOFF — 새 Codex에게 보낼 첫 메시지](HANDOFF.md#새-codex에게-보낼-첫-메시지).

The first Codex turn should be read-only until it has confirmed:

- active Git branch and remote state;
- repository rules and current phase;
- implemented, Mock, and planned boundaries;
- runtime availability on the new PC;
- verification plan and the next scoped task.

## 11. Before changing computers again

From the repository root:

```powershell
git status -sb
git diff --check
git log -3 --oneline --decorate
```

Run the checks relevant to the files changed, update `docs/TODO.md` and `docs/HANDOFF.md` when the resume point changes, commit only intended files, and push the active branch. On the other PC, always pull before editing.
