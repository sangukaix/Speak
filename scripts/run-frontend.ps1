param(
    [ValidateSet('web', 'android', 'ios', 'start')]
    [string]$Platform = 'web'
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$FrontendPath = Join-Path $ProjectRoot 'frontend'

Push-Location $FrontendPath
try {
    npm run $Platform
} finally {
    Pop-Location
}
