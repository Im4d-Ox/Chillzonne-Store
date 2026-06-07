@echo off
REM Initialize Git repository for ChillZone Store

cd /d "c:\Users\ctnim\OneDrive\Bureau\0\chillzone-store"

echo ===== Initializing Git Repository =====
git init

echo ===== Configuring Git User =====
git config user.name "Im4d-ox"
git config user.email "admin@chillzone.games"

echo ===== Adding all files =====
git add .

echo ===== Creating initial commit =====
git commit -m "Initial commit: ChillZone Store - Gaming Products Platform"

echo.
echo ===== Next Steps =====
echo.
echo 1. Go to https://github.com/new
echo 2. Create a NEW repository named: chillzone-store
echo 3. Make it PUBLIC
echo 4. Copy the following commands and run them:
echo.
echo    git branch -M main
echo    git remote add origin https://github.com/Im4d-ox/chillzone-store.git
echo    git push -u origin main
echo.
echo 5. Go to Settings ^> Pages and enable GitHub Pages with main branch
echo 6. Your site will be live at: https://Im4d-ox.github.io/chillzone-store/
echo.
pause
