@echo off
rem Double-click to install the AI Chat panel into After Effects (current user, no admin needed).
setlocal
cd /d "%~dp0"
set "EXT=%APPDATA%\Adobe\CEP\extensions"

echo [1/4] Build
where npm >nul 2>&1 || (echo Node.js is not installed. Get it from https://nodejs.org then run this again. & goto :fail)
if not exist node_modules (call npm install || goto :fail)
call npm run build || goto :fail

echo [2/4] Allow unsigned extensions for every CEP runtime AE may use, with logs on
for %%v in (9 10 11 12 13 14) do (
  reg add "HKCU\Software\Adobe\CSXS.%%v" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul
  reg add "HKCU\Software\Adobe\CSXS.%%v" /v LogLevel /t REG_SZ /d 6 /f >nul
)

echo [3/4] Link this folder into %EXT%
if not exist "%EXT%" mkdir "%EXT%"
rem rmdir without /s only removes an old link or an empty folder, never files
if exist "%EXT%\ae-ai-chat" rmdir "%EXT%\ae-ai-chat" 2>nul
if exist "%EXT%\ae-ai-chat" (echo "%EXT%\ae-ai-chat" already exists and is not empty. Delete it, then run this again. & goto :fail)
mklink /J "%EXT%\ae-ai-chat" "%CD%" >nul || goto :fail

echo [4/4] Check
if not exist "%EXT%\ae-ai-chat\CSXS\manifest.xml" (echo manifest.xml not reachable through the link. & goto :fail)
if not exist "%EXT%\ae-ai-chat\dist\main.js" (echo dist\main.js is missing: the build did not finish. & goto :fail)

echo.
echo Installed. Quit After Effects completely, reopen it, then: Window ^> Extensions ^> AI Chat
echo If it still does not show, send the newest CEP*.log files from: %TEMP%
pause
exit /b 0

:fail
echo.
echo Install stopped. Screenshot this window and send it.
pause
exit /b 1
