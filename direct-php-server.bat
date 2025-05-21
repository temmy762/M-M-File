@echo off
echo ===============================================
echo Memories and More Photo Booths - PHP Form Server
echo ===============================================
echo.
echo Enter the full path to your PHP executable:
echo Example: C:\xampp\php\php.exe or C:\PHP\php.exe
echo.
set /p PHP_PATH="PHP Path: "

if exist "%PHP_PATH%" (
    echo.
    echo Starting PHP server with: %PHP_PATH%
    echo Server will be available at: http://localhost:8000
    echo.
    "%PHP_PATH%" -S localhost:8000
) else (
    echo.
    echo ERROR: The specified PHP path does not exist!
    echo Please check the path and try again.
    echo.
    pause
)
