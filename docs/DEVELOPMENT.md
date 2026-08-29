# Development workflow

## Daily start

Pull changes, run `npm ci` if `package-lock.json` changed, and reinstall backend requirements if either requirements file changed. Start the backend and frontend in separate terminals with the scripts in `scripts/`.

## Verification

```powershell
Set-Location backend
../.venv/Scripts/python.exe -m pytest
Set-Location ../frontend
npm run typecheck
npx expo export --platform web
```

For Android, verify the screen through an emulator or physical device. iOS simulator validation requires macOS. Confirm both connected and disconnected UI states when changing networking behavior.

## Dependencies

Use npm only. Add Expo-compatible client packages with `npx expo install <package>` and commit `package.json` plus `package-lock.json`. Add runtime Python packages to `requirements.txt`, development-only packages to `requirements-dev.txt`, pin versions, and document why the dependency is needed.

## Git workflow across computers

The current continuation branch is `codex/phase-2-ui-foundation`; `main` does not yet contain Phase 2. Before switching computers, run checks, update [HANDOFF](HANDOFF.md) if the resume point changed, review `git status`, commit only intended source/documentation/config templates, and push.

On the other computer:

```powershell
git status -sb
git switch codex/phase-2-ui-foundation
git pull --ff-only
git status -sb
```

Recreate local `.env`, `.venv`, caches, and `node_modules`; these are intentionally not shared. Never move Codex auth files, browser cookies, emulator data, passwords, OTPs, or API keys through Git.
