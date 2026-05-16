# GameHub 一键部署脚本
# 使用方法：在 PowerShell 中运行此脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GameHub 一键部署脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 进入项目目录
Set-Location "F:\国外游戏站\site"
Write-Host "[1/6] 进入项目目录: OK" -ForegroundColor Green

# 2. 拉取最新代码
Write-Host "[2/6] 拉取最新代码..." -ForegroundColor Yellow
git pull origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "[2/6] 拉取失败，尝试强制重置..." -ForegroundColor Red
    git fetch --all
    git reset --hard origin/main
}
Write-Host "[2/6] 拉取最新代码: OK" -ForegroundColor Green

# 3. 清理旧构建
Write-Host "[3/6] 清理旧构建文件..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "  已删除 .next 目录" -ForegroundColor Gray
}
if (Test-Path "node_modules\.prisma\client") {
    Remove-Item -Recurse -Force "node_modules\.prisma\client"
    Write-Host "  已删除 Prisma Client 缓存" -ForegroundColor Gray
}
Write-Host "[3/6] 清理旧构建文件: OK" -ForegroundColor Green

# 4. 安装依赖
Write-Host "[4/6] 安装依赖..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "[4/6] npm install 失败，尝试使用离线缓存..." -ForegroundColor Red
    npm install --prefer-offline
}
Write-Host "[4/6] 安装依赖: OK" -ForegroundColor Green

# 5. 执行构建
Write-Host "[5/6] 执行构建..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[5/6] 构建失败，查看上方错误信息" -ForegroundColor Red
    exit 1
}
Write-Host "[5/6] 执行构建: OK" -ForegroundColor Green

# 6. 部署到 Vercel（可选）
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  构建成功！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "可选步骤：" -ForegroundColor Yellow
Write-Host "  1. 手动部署到 Vercel: vercel --prod" -ForegroundColor White
Write-Host "  2. 本地测试: npm run start" -ForegroundColor White
Write-Host "  3. 运行开发服务器: npm run dev" -ForegroundColor White
Write-Host ""

# 询问是否部署到 Vercel
$deploy = Read-Host "是否部署到 Vercel？(y/n)"
if ($deploy -eq "y" -or $deploy -eq "Y") {
    Write-Host "正在部署到 Vercel..." -ForegroundColor Yellow
    vercel --prod
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  部署完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
