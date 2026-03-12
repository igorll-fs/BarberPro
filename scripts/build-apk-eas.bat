@echo off
echo ==========================================
echo  BARBERPRO - BUILD APK VIA EAS (ONLINE)
echo ==========================================
echo.
echo Esta opcao usa a build online da Expo (EAS)
echo Nao precisa de Android Studio configurado
echo.

cd apps\mobile

echo [1/3] Verificando login na Expo...
eas whoami >nul 2>&1
if errorlevel 1 (
    echo.
    echo Voce precisa fazer login na Expo primeiro.
    echo.
    echo Para criar uma conta gratuita:
    echo 1. Acesse: https://expo.dev/signup
    echo 2. Crie sua conta
    echo 3. Volte aqui e execute: eas login
    echo.
    eas login
)

echo.
echo [2/3] Iniciando build online...
echo O APK sera gerado na nuvem e voce recebera um link
echo.
echo Perfil de build: preview (APK para testes)
echo.

echo [3/3] Enviando build para a Expo...
eas build --platform android --profile preview

echo.
echo ==========================================
echo  BUILD ENVIADO COM SUCESSO!
echo ==========================================
echo.
echo Acompanhe o progresso no link acima.
echo Quando terminar, baixe o APK e instale no celular.
echo.
pause
