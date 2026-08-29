# Troubleshooting

## A fresh clone only shows the Phase 1 foundation

The current Phase 2 work is on `codex/phase-2-ui-foundation`, while `main` is older. Run:

```powershell
git fetch origin
git status -sb
git switch codex/phase-2-ui-foundation
git pull --ff-only
git status -sb
```

If the branch is not present locally, use `git switch --track origin/codex/phase-2-ui-foundation`.

## A new Codex session does not know the previous conversation

Local conversation and login state are not part of Git. Open Codex at the repository root, confirm it loaded `AGENTS.md`, read [HANDOFF](HANDOFF.md), and use the first-message prompt stored there. Do not solve this by copying Codex auth files or by putting credentials in a prompt.

## `npm ci` fails

Confirm Node 24 with `node --version`, delete only the local `frontend/node_modules` folder if it is corrupt, and rerun `npm ci` inside `frontend`. Do not delete `package-lock.json`. Check proxy, antivirus, and npm registry access if downloads fail.

## `py -3.13` is not found

Install Python 3.13 from python.org with the Python Launcher option, open a new terminal, and run `py -3.13 --version`. The Microsoft Store alias alone is not sufficient.

## PowerShell blocks a script

Use `Set-ExecutionPolicy -Scope Process Bypass` in the current terminal. This does not permanently change the machine policy.

## Frontend shows `Backend Disconnected`

Start the API and open `http://localhost:8000/health`. Android emulator uses `10.0.2.2`, not `localhost`, to reach the host PC. A physical device needs the PC LAN IP, the same network, and a firewall rule for port 8000. If `EXPO_PUBLIC_API_BASE_URL` is set by any `.env*` file or the process environment, it overrides the source's platform default; correct or unset it and restart Expo.

## Browser reports a CORS error

Add the exact frontend origin to `BACKEND_CORS_ORIGINS` in root `.env`, comma separated, then restart FastAPI. Do not use `*` as a production workaround.

## Expo version mismatch

Run `npx expo install --fix` inside `frontend`, review changes, and commit both package files. Expo Go generally supports the current SDK; use a compatible development build when required.

## npm audit reports the `uuid` advisory

Expo SDK 57 currently reaches `uuid@7` through its native build tooling dependency `xcode`. npm reports the same moderate advisory through multiple Expo package paths and suggests a forced downgrade to Expo 46. Do not run `npm audit fix --force`; that is a breaking, unsupported SDK downgrade. Recheck after Expo updates the upstream dependency and keep this item open in `TODO.md`.
