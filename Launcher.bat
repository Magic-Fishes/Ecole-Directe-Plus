@echo off

cd /d "%~dp0"



echo Ecole Directe Plus offers several options based on these commands. You can choose among the following:

echo 1. Run on localhost
echo    This option will serve the project locally for development purposes.
echo    Command: npm run dev

echo 2. Host the website
echo    Use this option to deploy the project for public access.
echo    Command: npm run host

echo 3. Run a preview of the build
echo    This allows you to see a preview of the production build.
echo    Command: npm run preview

:: Adding a beautiful entrance with nice text (Pseudo code / Suggestion)
echo.
echo ******************************************
echo * Welcome to Ecole Directe Plus Launcher *
echo ******************************************
echo Please select an option to proceed...

:: Waiting for user input to select an option (Example of implementation)
set /p option="Enter your choice (1-3): "
if "%option%"=="1" (
    npm run dev
) else if "%option%"=="2" (
    npm run host
) else if "%option%"=="3" (
    npm run preview
) else (
    echo Invalid option, please try again.
)

echo Done!
pause
