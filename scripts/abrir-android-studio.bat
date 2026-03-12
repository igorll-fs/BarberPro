@echo off
echo ==========================================
echo  ABRINDO BARBERPRO NO ANDROID STUDIO
echo ==========================================
echo.

set PROJECT_PATH=C:\Users\igor\Desktop\BARBERPRO\apps\mobile\android

echo Caminho do projeto: %PROJECT_PATH%
echo.

REM Verificar se o Android Studio está instalado
if exist "C:\Program Files\Android\Android Studio\bin\studio64.exe" (
    echo Abrindo Android Studio...
    start "" "C:\Program Files\Android\Android Studio\bin\studio64.exe" "%PROJECT_PATH%"
) else if exist "C:\Program Files (x86)\Android\Android Studio\bin\studio.exe" (
    echo Abrindo Android Studio...
    start "" "C:\Program Files (x86)\Android\Android Studio\bin\studio.exe" "%PROJECT_PATH%"
) else (
    echo [ERRO] Android Studio nao encontrado!
    echo.
    echo Por favor, abra manualmente:
    echo 1. Abra o Android Studio
    echo 2. Selecione "Open an existing Android Studio project"
    echo 3. Navegue ate: %PROJECT_PATH%
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Android Studio abrindo com o projeto BarberPro!
echo.
echo Aguarde a sincronizacao do Gradle (pode demorar alguns minutos).
echo.
echo Para gerar o APK:
echo 1. Aguarde a sincronizacao completar
echo 2. Menu: Build → Build Bundle(s) / APK(s) → Build APK(s)
echo 3. O APK sera gerado em: app\build\outputs\apk\debug\
echo.
pause
