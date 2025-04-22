@echo off
echo WartaWA Installer
echo ======================================
echo.
echo This installer will set up WartaWA on your system.
echo.
echo Please select an installation method:
echo 1. Command-line installer (PowerShell)
echo 2. Graphical installer (Web browser)
echo.

set /p choice=Enter your choice (1 or 2):

if "%choice%"=="1" goto CommandLine
if "%choice%"=="2" goto Graphical

echo Invalid choice. Please enter 1 or 2.
echo.
pause
exit /b 1

:CommandLine
echo.
echo Running command-line installer with PowerShell...
echo.
powershell -ExecutionPolicy Bypass -File install.ps1
goto End

:Graphical
echo.
echo Launching graphical installer in your web browser...
echo.
start installer-gui.html
echo Please complete the installation in your web browser.
echo After filling out the form, the installer will generate a configuration file.
echo.
echo Note: The graphical installer is a form that helps you generate the configuration.
echo You will still need to run the command-line installer to complete the installation.
echo.

:End
echo.
echo If the installer did not run, please make sure PowerShell is installed and try again.
echo.
pause
