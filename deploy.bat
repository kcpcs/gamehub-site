@echo off
chcp 65001 >nul
echo ========================================
echo    GameHub - Vercel 部署助手
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] 检查 Git 状态...
git status
echo.

echo [2/5] 添加文件到 Git...
git add .
echo.

echo [3/5] 提交更改...
git commit -m "Deploy to Vercel"
echo.

echo [4/5] 检查 Vercel CLI...
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Vercel CLI 未安装，正在安装...
    npm install -g vercel
)
echo.

echo [5/5] 开始部署...
echo.
echo 请按照提示操作：
echo   - Set up and deploy? Y
echo   - Link to existing project? N
echo   - Project name: gamehub (或你喜欢的名字)
echo   - In which directory is your code located? ./
echo   - Want to modify these settings? N
echo.
pause

vercel

echo.
echo ========================================
echo    部署完成！
echo ========================================
echo.
echo 接下来你可以：
echo 1. 访问 Vercel 提供的预览链接
echo 2. 运行 'vercel --prod' 部署到生产环境
echo 3. 在 Vercel 后台配置环境变量
echo.
pause
