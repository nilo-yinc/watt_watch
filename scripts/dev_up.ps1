param(
    [string]$RoomId = "test-room",
    [string]$PrivacyMode = "blur"
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$backendDir = Join-Path $root "backend"
$frontendDir = Join-Path $root "frontend"
$cvDir = Join-Path $root "computer_vision"

Write-Host "[1/3] Starting backend on :8000 ..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd `"$backendDir`"; npm run dev"

Start-Sleep -Seconds 2

Write-Host "[2/3] Starting frontend on :5173 ..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd `"$frontendDir`"; npm run dev"

Start-Sleep -Seconds 2

Write-Host "[3/3] Starting computer_vision (room=$RoomId, privacy=$PrivacyMode) ..."
$cvCmd = @"
cd "$cvDir"
`$env:WATTWATCH_ROOM_ID="$RoomId"
`$env:WATTWATCH_PRIVACY_MODE="$PrivacyMode"
`$env:WATTWATCH_USE_HTTP="1"
python -m app.main
"@
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", $cvCmd

Write-Host ""
Write-Host "All services launched in separate terminals."
Write-Host "Open: http://localhost:5173/ghost-view"
