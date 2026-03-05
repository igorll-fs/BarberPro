#!/bin/bash

# ========================================
# BarberPro - Script de Deploy para Produção
# ========================================

set -e  # Para execução em caso de erro

echo "🚀 Iniciando deploy do BarberPro para produção..."

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para exibir mensagens
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    log_error "Execute este script do diretório raiz do projeto"
    exit 1
fi

# ========================================
# 1. Deploy Firebase Functions
# ========================================
echo ""
log_info "1. Deploy das Cloud Functions..."
cd firebase/functions
npm install
npm run build
cd ..
firebase deploy --only functions
log_info "✅ Functions deployadas"

# ========================================
# 2. Deploy Firestore Rules
# ========================================
echo ""
log_info "2. Deploy das regras do Firestore..."
firebase deploy --only firestore:rules
log_info "✅ Firestore rules deployadas"

# ========================================
# 3. Deploy Storage Rules
# ========================================
echo ""
log_info "3. Deploy das regras do Storage..."
firebase deploy --only storage
log_info "✅ Storage rules deployadas"

# ========================================
# 4. Deploy Web App
# ========================================
echo ""
log_info "4. Build e deploy do Web App..."
cd ../apps/public-web
npm install
npm run build
cd ../../firebase
firebase deploy --only hosting
log_info "✅ Web app deployado"

# ========================================
# 5. Verificação
# ========================================
echo ""
log_info "5. Verificando deploy..."
firebase functions:list
echo ""
firebase hosting:channel:list
echo ""

log_info "✅ Deploy concluído com sucesso!"
echo ""
echo "🌐 URLs:"
echo "  - Web App: https://seu-projeto.web.app"
echo "  - Functions: https://sua-regiao-seu-projeto.cloudfunctions.net"
echo ""
echo "📊 Próximos passos:"
echo "  1. Verifique se as functions estão funcionando"
echo "  2. Teste o login no app"
echo "  3. Crie uma conta de teste"
echo ""
