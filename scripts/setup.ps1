$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$FrontendPath = Join-Path $ProjectRoot 'frontend'
$BackendRequirements = Join-Path $ProjectRoot 'backend\requirements-dev.txt'
$VenvPython = Join-Path $ProjectRoot '.venv\Scripts\python.exe'

Push-Location $FrontendPath
try {
    npm ci
    npm run typegen
} finally {
    Pop-Location
}

if (-not (Test-Path $VenvPython)) {
    py -3.13 -m venv (Join-Path $ProjectRoot '.venv')
}

& $VenvPython -m pip install --upgrade pip
& $VenvPython -m pip install -r $BackendRequirements

Write-Host 'Setup complete. Copy environment templates if you have not already done so.'
