@echo off
echo ==========================================
echo  BARBERPRO - DEPLOY PARA PRODUCAO
echo ==========================================
echo.

REM Navegar para pasta do firebase
cd firebase

echo [1/3] Instalando dependencias do Firebase...
call npm install

echo.
echo [2/3] Fazendo login no Firebase...
call firebase login

echo.
echo [3/3] Deploy das Cloud Functions...
call firebase deploy --only functions

echo.
echo ==========================================
echo  DEPLOY CONCLUIDO!
echo ==========================================
echo.
echo Verifique os logs em: https://console.firebase.google.com/project/baberpro-31c40/functions
echo.
pause
