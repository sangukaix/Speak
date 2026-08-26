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

Before switching computers, run checks, review `git status`, commit source and lock/config templates, then push. On the other computer, pull before editing and recreate local `.env`, `.venv`, caches, and `node_modules`; these are intentionally not shared.
