$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BackendPath = Join-Path $ProjectRoot 'backend'
$VenvPython = Join-Path $ProjectRoot '.venv\Scripts\python.exe'

if (-not (Test-Path $VenvPython)) {
    throw 'Python environment not found. Run ./scripts/setup.ps1 first.'
}

Push-Location $BackendPath
try {
    & $VenvPython -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
} finally {
    Pop-Location
}
