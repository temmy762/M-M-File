@echo off
echo ===============================================
echo Memories and More Photo Booths - PHP Form Server
echo ===============================================
echo.
echo This server is REQUIRED for form submissions to work properly.
echo KEEP THIS WINDOW OPEN while testing forms on the website.
echo.
echo PHP Server will be available at: http://localhost:8000
echo Your website should be accessed through your normal web server
echo (like VS Code Live Server at http://127.0.0.1:5501)
echo.
echo Form submissions will be automatically sent to this PHP server.
echo.
echo Press Ctrl+C to stop the server when done testing...
echo ===============================================
echo.

REM Change to the website directory
cd /d "%~dp0"

REM Check common PHP installation locations
SET PHP_FOUND=0

IF EXIST "C:\PHP\php.exe" (
    echo Using PHP from C:\PHP
    SET PHP_FOUND=1
    "C:\PHP\php.exe" -S localhost:8000
    GOTO end
)

IF EXIST "C:\xampp\php\php.exe" (
    echo Using PHP from C:\xampp\php
    SET PHP_FOUND=1
    "C:\xampp\php\php.exe" -S localhost:8000
    GOTO end
)

IF EXIST "%ProgramFiles%\PHP\php.exe" (
    echo Using PHP from Program Files
    SET PHP_FOUND=1
    "%ProgramFiles%\PHP\php.exe" -S localhost:8000
    GOTO end
)

IF EXIST "%ProgramFiles(x86)%\PHP\php.exe" (
    echo Using PHP from Program Files (x86)
    SET PHP_FOUND=1
    "%ProgramFiles(x86)%\PHP\php.exe" -S localhost:8000
    GOTO end
)

REM Try the system PATH as a last resort
where php >nul 2>nul
IF %ERRORLEVEL% EQU 0 (
    echo Using PHP from system PATH
    SET PHP_FOUND=1
    php -S localhost:8000
    GOTO end
)

IF %PHP_FOUND% EQU 0 (
    echo ===============================================
    echo ERROR: PHP not found!
    echo ===============================================
    echo.
    echo Please install PHP and try again.
    echo.
    echo You can download PHP from: https://windows.php.net/download/
    echo Or install XAMPP from: https://www.apachefriends.org/
    echo.
    echo After installing, make sure PHP is in your system PATH
    echo or update this batch file with the correct path.
    echo ===============================================
)

:end
pause
