@echo off
echo ==========================================
echo  BARBERPRO - Instalador NDK
==========================================
echo.
echo Instalando NDK 27.0.12077973...
echo.

set SDK_DIR=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set NDK_VERSION=27.0.12077973

REM Verifica se o sdkmanager existe
if exist "%SDK_DIR%\cmdline-tools\latest\bin\sdkmanager.bat" (
    set SDKMANAGER=%SDK_DIR%\cmdline-tools\latest\bin\sdkmanager.bat
) else if exist "%SDK_DIR%\cmdline-tools\bin\sdkmanager.bat" (
    set SDKMANAGER=%SDK_DIR%\cmdline-tools\bin\sdkmanager.bat
) else (
    echo SDK Manager nao encontrado!
    echo.
    echo Por favor, instale manualmente:
    echo 1. Abra o Android Studio
    echo 2. V em: Tools -^> SDK Manager
    echo 3. Aba: SDK Tools
    echo 4. Marque: "NDK (Side by side)"
    echo 5. Selecione versao: 27.0.12077973
    echo 6. Clique em Apply
    echo.
    pause
    exit /b 1
)

echo SDK Manager encontrado em: %SDKMANAGER%
echo.
echo Instalando NDK %NDK_VERSION%...
echo Isso pode levar varios minutos...
echo.

"%SDKMANAGER%" "ndk;%NDK_VERSION%" --sdk_root="%SDK_DIR%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==========================================
    echo  NDK instalado com sucesso!
    echo ==========================================
    echo.
    echo Agora voce pode gerar o APK com:
    echo   scripts\build-apk-local.bat
    echo.
) else (
    echo.
    echo ==========================================
    echo  ERRO ao instalar NDK
    echo ==========================================
    echo.
    echo Tente instalar manualmente:
    echo 1. Abra o Android Studio
    echo 2. V em: Tools -^> SDK Manager
    echo 3. Aba: SDK Tools
    echo 4. Marque: "NDK (Side by side)"
    echo 5. Selecione versao: 27.0.12077973
    echo 6. Clique em Apply
    echo.
)

pause
