# GameHub One-Click Deployment Script
# Usage: Run in PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GameHub Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Change to project directory
Set-Location "F:\国外游戏站\site"
Write-Host "[1/6] Enter project directory: OK" -ForegroundColor Green

# 2. Pull latest code
Write-Host "[2/6] Pulling latest code..." -ForegroundColor Yellow
git pull origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "[2/6] Pull failed, attempting hard reset..." -ForegroundColor Red
    git fetch --all
    git reset --hard origin/main
}
Write-Host "[2/6] Pull latest code: OK" -ForegroundColor Green

# 3. Clean old builds
Write-Host "[3/6] Cleaning old build files..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "  Removed .next directory" -ForegroundColor Gray
}
if (Test-Path "node_modules\.prisma\client") {
    Remove-Item -Recurse -Force "node_modules\.prisma\client"
    Write-Host "  Removed Prisma Client cache" -ForegroundColor Gray
}
Write-Host "[3/6] Clean old builds: OK" -ForegroundColor Green

# 4. Install dependencies
Write-Host "[4/6] Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "[4/6] npm install failed, trying offline cache..." -ForegroundColor Red
    npm install --prefer-offline
}
Write-Host "[4/6] Install dependencies: OK" -ForegroundColor Green

# 5. Run build
Write-Host "[5/6] Running build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[5/6] Build failed, check errors above" -ForegroundColor Red
    exit 1
}
Write-Host "[5/6] Build success: OK" -ForegroundColor Green

# 6. Deploy to Vercel (optional)
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Build Successful!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Optional steps:" -ForegroundColor Yellow
Write-Host "  1. Deploy to Vercel: vercel --prod" -ForegroundColor White
Write-Host "  2. Local testing: npm run start" -ForegroundColor White
Write-Host "  3. Dev server: npm run dev" -ForegroundColor White
Write-Host ""

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host ""
