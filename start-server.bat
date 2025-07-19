@echo off
echo 🚀 Starting University Website Development Server...
echo.

REM Try Python 3 first
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Using Python
    python start-server.py
    goto :end
)

REM Try Python 3 explicit
python3 --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Using Python3
    python3 start-server.py
    goto :end
)

REM Try Node.js
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Using Node.js
    npx http-server -p 8000 -o
    goto :end
)

REM Try PHP
php --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Using PHP
    php -S localhost:8000
    goto :end
)

REM No suitable server found
echo ❌ No suitable server found!
echo 💡 Please install one of the following:
echo    - Python (recommended): https://python.org
echo    - Node.js: https://nodejs.org
echo    - PHP: https://php.net
echo.
echo 📖 Then run this script again
pause

:end
echo.
echo 🛑 Server stopped
pause
