# BarberPro Web - Script de Deploy
# Uso: .\scripts\deploy-web.ps1

Write-Host "🚀 BarberPro Web Deploy" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host ""

# Verifica se está na pasta correta
if (-not (Test-Path "apps/web")) {
    Write-Host "❌ Erro: Execute este script da raiz do projeto (BARBERPRO)" -ForegroundColor Red
    Write-Host "   Exemplo: .\scripts\deploy-web.ps1" -ForegroundColor Yellow
    exit 1
}

# Navega para a pasta do web
Set-Location apps/web

Write-Host "📦 Instalando dependências..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha ao instalar dependências" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔨 Build de produção..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha no build" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "☁️  Deploy no Firebase Hosting..." -ForegroundColor Cyan

# Verifica se firebase CLI está instalado
$firebaseCheck = firebase --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Firebase CLI não encontrado. Instalando..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

firebase deploy --only hosting

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 URLs:" -ForegroundColor Cyan
    Write-Host "   Site: https://baberpro-31c40.web.app" -ForegroundColor White
    Write-Host "   (ou seu domínio customizado)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📱 Para instalar no iPhone:" -ForegroundColor Cyan
    Write-Host "   1. Abra o Safari no iPhone" -ForegroundColor White
    Write-Host "   2. Acesse a URL acima" -ForegroundColor White
    Write-Host "   3. Toque em Compartilhar → Adicionar à Tela de Início" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Falha no deploy" -ForegroundColor Red
    Write-Host "   Verifique se você está logado no Firebase:" -ForegroundColor Yellow
    Write-Host "   firebase login" -ForegroundColor White
}

# Volta para a raiz
Set-Location ../..
