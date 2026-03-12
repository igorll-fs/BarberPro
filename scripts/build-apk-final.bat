@echo off
echo ==========================================
echo  BARBERPRO - BUILD APK (SOLUCAO FINAL)
echo ==========================================
echo.
echo Tentando build local...
echo.

cd apps\mobile\android

REM Configurar SDK
echo sdk.dir=C:\Users\%USERNAME%\AppData\Local\Android\Sdk > local.properties

echo [1/3] Limpando build anterior...
call gradlew.bat clean 2>nul
echo.

echo [2/3] Tentando build de debug...
call gradlew.bat assembleDebug

if %errorlevel% equ 0 (
    echo.
    echo ==========================================
    echo  BUILD SUCESSO! 🎉
    echo ==========================================
    echo.
    echo APK gerado em:
    echo app\build\outputs\apk\debug\app-debug.apk
    echo.

    REM Copiar para raiz
    copy app\build\outputs\apk\debug\app-debug.apk ..\..\..\..\BarberPro-Debug.apk >nul 2>&1
    echo APK copiado para: BarberPro-Debug.apk
    echo.
    pause
    exit /b 0
) else (
    echo.
    echo ==========================================
    echo  BUILD LOCAL FALHOU 😢
    echo ==========================================
    echo.
    echo Isso e normal devido a incompatibilidade entre
    echo Expo SDK 52 e Gradle 8.x
    echo.
    echo === SOLUCAO RECOMENDADA: EAS BUILD ONLINE ===
    echo.
    echo 1. Crie uma conta gratuita em:
    echo    https://expo.dev/signup
    echo.
    echo 2. Faca login:
    echo    cd apps\mobile
    echo    npx eas login
    echo.
    echo 3. Inicie o build online:
    echo    npx eas build --platform android --profile preview
    echo.
    echo 4. Aguarde o link do APK por email (10-15 min)
    echo.
    echo === ALTERNATIVA: ANDROID STUDIO ===
    echo.
    echo 1. Abra o Android Studio
    echo 2. Selecione "Open an existing Android Studio project"
    echo 3. Navegue ate: apps\mobile\android
    echo 4. Menu: Build -^> Build APK(s)
    echo.
    echo ==========================================
    echo.
    pause
    exit /b 1
)
