# Troubleshooting

## `npm ci` fails

Confirm Node 24 with `node --version`, delete only the local `frontend/node_modules` folder if it is corrupt, and rerun `npm ci` inside `frontend`. Do not delete `package-lock.json`. Check proxy, antivirus, and npm registry access if downloads fail.

## `py -3.13` is not found

Install Python 3.13 from python.org with the Python Launcher option, open a new terminal, and run `py -3.13 --version`. The Microsoft Store alias alone is not sufficient.

## PowerShell blocks a script

Use `Set-ExecutionPolicy -Scope Process Bypass` in the current terminal. This does not permanently change the machine policy.

## Frontend shows `Backend Disconnected`

Start the API and open `http://localhost:8000/health`. Android emulator uses `10.0.2.2`, not `localhost`, to reach the host PC. A physical device needs the PC LAN IP, the same network, and a firewall rule for port 8000. After editing `frontend/.env`, restart Expo.

## Browser reports a CORS error

Add the exact frontend origin to `BACKEND_CORS_ORIGINS` in root `.env`, comma separated, then restart FastAPI. Do not use `*` as a production workaround.

## Expo version mismatch

Run `npx expo install --fix` inside `frontend`, review changes, and commit both package files. Expo Go generally supports the current SDK; use a compatible development build when required.

## npm audit reports the `uuid` advisory

Expo SDK 57 currently reaches `uuid@7` through its native build tooling dependency `xcode`. npm reports the same moderate advisory through multiple Expo package paths and suggests a forced downgrade to Expo 46. Do not run `npm audit fix --force`; that is a breaking, unsupported SDK downgrade. Recheck after Expo updates the upstream dependency and keep this item open in `TODO.md`.
