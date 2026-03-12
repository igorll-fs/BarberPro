# Script para configurar SUA conta como desenvolvedor
# Uso: .\scripts\setup-my-dev-account.ps1

Write-Host "🔧 Configurar Conta de Desenvolvedor" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

Write-Host "Este script vai criar sua conta dev segura." -ForegroundColor Cyan
Write-Host ""

# Pede o email
$email = Read-Host "📧 Digite seu email (ex: igor@barberpro.app)"

if (-not ($email -match "^[^@\s]+@[^@\s]+\.[^@\s]+$")) {
    Write-Host "❌ Email inválido" -ForegroundColor Red
    exit 1
}

# Pede a senha (oculta)
$password = Read-Host "🔑 Digite uma senha forte" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

if ($plainPassword.Length -lt 6) {
    Write-Host "❌ Senha deve ter pelo menos 6 caracteres" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 Resumo:" -ForegroundColor Cyan
Write-Host "   Email: $email" -ForegroundColor White
Write-Host "   Role: dev (com acesso total)" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "⚠️  Confirma? (s/n)"

if ($confirm -ne 's' -and $confirm -ne 'S') {
    Write-Host "❌ Cancelado" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🚀 Criando conta..." -ForegroundColor Cyan

# Chama o script Node.js
node scripts/setup-dev-account.js "$email" "$plainPassword"

Write-Host ""
Write-Host "⚠️  PRÓXIMOS PASSOS IMPORTANTES:" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Acesse o Firebase Console:" -ForegroundColor Cyan
Write-Host "   https://console.firebase.google.com/project/baberpro-31c40/authentication/users" -ForegroundColor White
Write-Host ""
Write-Host "2. Encontre seu usuário na lista e copie o UID" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Edite o arquivo: apps/mobile/src/config/dev.config.ts" -ForegroundColor Cyan
Write-Host "   Adicione seu UID na array AUTHORIZED_DEV_UIDS" -ForegroundColor White
Write-Host ""
Write-Host "   Exemplo:" -ForegroundColor Gray
Write-Host "   export const AUTHORIZED_DEV_UIDS: string[] = [" -ForegroundColor White
Write-Host "     'ABC123xyz456789',  // $email" -ForegroundColor Green
Write-Host "   ];" -ForegroundColor White
Write-Host ""
Write-Host "4. Faça o mesmo em: apps/web/src/config/dev.config.ts" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. Deploy das alterações:" -ForegroundColor Cyan
Write-Host "   cd apps/mobile && eas build (para mobile)" -ForegroundColor White
Write-Host "   cd apps/web && npm run deploy (para web)" -ForegroundColor White
Write-Host ""
Write-Host "🔒 SEGURANÇA:" -ForegroundColor Yellow
Write-Host "   - Nunca compartilhe seu UID" -ForegroundColor White
Write-Host "   - Mantenha a senha segura" -ForegroundColor White
Write-Host "   - O modo dev só funciona para UIDs na whitelist" -ForegroundColor White
