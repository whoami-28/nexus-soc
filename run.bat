@echo off
setlocal
chcp 65001 >nul
title NEXUS Mobile App

if exist "%~dp0run.ps1" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run.ps1"
    exit /b %errorlevel%
)

if exist "%~dp0react-native-nexus\run.ps1" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0react-native-nexus\run.ps1"
    exit /b %errorlevel%
)

echo [ERROR] run.ps1 not found!
pause
