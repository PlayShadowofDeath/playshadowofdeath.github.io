@echo off
title Shadow of Death website preview
start "" http://localhost:8085/
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\serve.ps1" -Port 8085
