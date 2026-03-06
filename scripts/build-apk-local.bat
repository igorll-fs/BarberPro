@echo off
echo ==========================================
echo  BARBERPRO - BUILD APK LOCAL
echo ==========================================
echo.
echo [1/5] Preparando ambiente...
echo.

cd apps\mobile

echo [2/5] Instalando dependencias...
call npm install
echo.

echo [3/5] Gerando projeto Android nativo (prebuild)...
call npx expo prebuild --platform android --clean
echo.

echo [4/5] Build do APK...
cd android
setlocal enabledelayedexpansion

REM Verificar se tem Java instalado
java -version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Java nao encontrado!
    echo Instale o Java JDK 17: https://adoptium.net/
    pause
    exit /b 1
)

REM Build do APK
call gradlew assembleRelease

if errorlevel 1 (
    echo.
    echo [ERRO] Build falhou!
    echo Verifique os erros acima.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo  APK GERADO COM SUCESSO! 🎉
echo ==========================================
echo.
echo Local do APK:
echo app\build\outputs\apk\release\app-release.apk
echo.
echo Caminho completo:
cd app\build\outputs\apk\release
dir /b *.apk
echo.
echo [5/5] Copiando APK para pasta raiz...
copy app-release.apk ..\..\..\..\..\..\..\BarberPro-Release.apk >nul 2>&1
echo.
echo ✅ APK pronto para instalar!
echo.
echo 📱 Para instalar no Android:
echo 1. Transfira o arquivo BarberPro-Release.apk para seu celular
echo 2. No celular, toque no arquivo
echo 3. Permitir instalacao de fontes desconhecidas
echo 4. Instalar
echo.
pause
