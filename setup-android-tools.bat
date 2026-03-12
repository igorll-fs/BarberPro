@echo off
echo ==========================================
echo  BARBERPRO - Setup Android Command Line Tools
==========================================
echo.

set SDK_DIR=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set CMDLINE_TOOLS_URL=https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip
set TEMP_DIR=%TEMP%\android-cmdline-tools

echo Verificando estrutura do SDK...
echo SDK Directory: %SDK_DIR%
echo.

REM Cria diretorios necessarios
if not exist "%SDK_DIR%" (
    echo Criando diretorio SDK...
    mkdir "%SDK_DIR%"
)

if not exist "%SDK_DIR%\cmdline-tools" (
    echo Criando diretorio cmdline-tools...
    mkdir "%SDK_DIR%\cmdline-tools"
)

echo.
echo Baixando Command Line Tools...
echo Isso pode levar alguns minutos...
echo.

REM Baixa o arquivo
powershell -Command "Invoke-WebRequest -Uri '%CMDLINE_TOOLS_URL%' -OutFile '%TEMP_DIR%\cmdline-tools.zip'" 2>nul

if %ERRORLEVEL% NEQ 0 (
    echo ERRO ao baixar!
    echo.
    echo Por favor, instale o NDK manualmente pelo Android Studio:
    echo 1. Abra o Android Studio
    echo 2. Tools -^> SDK Manager
    echo 3. SDK Tools -^> NDK (Side by side) 27.0.12077973
    echo.
    pause
    exit /b 1
)

echo Extraindo arquivos...
powershell -Command "Expand-Archive -Path '%TEMP_DIR%\cmdline-tools.zip' -DestinationPath '%TEMP_DIR%' -Force" 2>nul

echo Movendo para local correto...
if exist "%SDK_DIR%\cmdline-tools\latest" (
    rmdir /s /q "%SDK_DIR%\cmdline-tools\latest"
)

mkdir "%SDK_DIR%\cmdline-tools\latest"
xcopy /s /e /q "%TEMP_DIR%\cmdline-tools\*" "%SDK_DIR%\cmdline-tools\latest\" 2>nul

echo Limpando arquivos temporarios...
rmdir /s /q "%TEMP_DIR%" 2>nul

echo.
echo ==========================================
echo  Command Line Tools instalado!
echo ==========================================
echo.
echo Agora instalando NDK 27.0.12077973...
echo.

set SDKMANAGER=%SDK_DIR%\cmdline-tools\latest\bin\sdkmanager.bat

if exist "%SDKMANAGER%" (
    echo Executando: sdkmanager "ndk;27.0.12077973"
    call "%SDKMANAGER%" "ndk;27.0.12077973" --sdk_root="%SDK_DIR%"
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ==========================================
        echo  NDK instalado com sucesso!
        echo ==========================================
        echo.
        echo Agora execute: scripts\build-apk-local.bat
        echo.
    ) else (
        echo ERRO ao instalar NDK!
        echo.
        echo Tente manualmente pelo Android Studio:
        echo Tools -^> SDK Manager -^> SDK Tools -^> NDK
        echo.
    )
) else (
    echo SDK Manager nao encontrado apos instalacao!
    echo.
    echo Instale manualmente pelo Android Studio.
    echo.
)

pause
