# 🚀 Guia de Configuração para Produção

Este guia explica passo a passo como configurar o BarberPro para ambiente de produção.

---

## 📋 Pré-requisitos

- Conta Google (para Firebase)
- Conta Stripe (para pagamentos)
- Conta Twilio (para WhatsApp OTP)
- Node.js >= 20.19
- Firebase CLI instalado: `npm install -g firebase-tools`

---

## 1️⃣ Criar Projeto Firebase

### Passo 1: Console Firebase
1. Acesse https://console.firebase.google.com
2. Clique em "Criar projeto"
3. Nome: `barberpro-prod` (ou nome de sua preferência)
4. Desative Google Analytics por enquanto (opcional)
5. Clique em "Criar projeto"

### Passo 2: Configurar Aplicativos

#### Android
1. No console, clique em "Adicionar app" (ícone Android)
2. Pacote: `app.barberpro.mobile`
3. Baixe o arquivo `google-services.json`
4. Coloque em: `apps/mobile/android/app/google-services.json`

#### iOS
1. Clique em "Adicionar app" (ícone Apple)
2. Bundle ID: `app.barberpro.mobile`
3. Baixe o arquivo `GoogleService-Info.plist`
4. Coloque em: `apps/mobile/ios/BarberPro/GoogleService-Info.plist`

#### Web
1. Clique em "Adicionar app" (ícone Web)
2. Nomeie: `BarberPro Web`
3. Copie as credenciais Firebase

---

## 2️⃣ Configurar Variáveis de Ambiente

### Mobile App

Crie o arquivo `apps/mobile/.env`:

```env
# Firebase Configuration
FIREBASE_API_KEY=sua_api_key_aqui
FIREBASE_AUTH_DOMAIN=barberpro-prod.firebaseapp.com
FIREBASE_PROJECT_ID=barberpro-prod
FIREBASE_STORAGE_BUCKET=barberpro-prod.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Stripe (opcional para beta)
STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave

# Google Maps (opcional)
GOOGLE_MAPS_API_KEY=sua_chave_maps
```

### Cloud Functions

Crie o arquivo `firebase/functions/.env`:

```env
# Twilio (WhatsApp OTP)
TWILIO_ACCOUNT_SID=AC_sua_conta_sid
TWILIO_AUTH_TOKEN=sua_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Stripe
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret
STRIPE_PRICE_MONTHLY=price_id_mensal
STRIPE_PRICE_YEARLY=price_id_anual

# App URL
FIREBASE_WEB_URL=https://barberpro-prod.web.app

# Environment
NODE_ENV=production
```

---

## 3️⃣ Configurar Stripe

### Criar Conta
1. Acesse https://stripe.com
2. Crie uma conta (modo teste primeiro)
3. Ative modo de desenvolvedor

### Produtos e Preços
1. No Dashboard Stripe, vá em "Products"
2. Clique "Add product"
3. Crie produto "Assinatura Mensal":
   - Preço: R$ 49,90
   - Frequência: Monthly
4. Crie produto "Assinatura Anual":
   - Preço: R$ 499,90
   - Frequência: Yearly
5. Copie os Price IDs para o `.env`

### Webhook
1. No Stripe, vá em "Developers" → "Webhooks"
2. Clique "Add endpoint"
3. URL: `https://sua-regiao-barberpro-prod.cloudfunctions.net/stripeWebhook`
4. Selecione eventos:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
5. Copie o Webhook Secret para o `.env`

---

## 4️⃣ Configurar Twilio

### Criar Conta
1. Acesse https://twilio.com
2. Crie conta (trial funciona para testes)

### WhatsApp Sandbox
1. No Console Twilio, vá em "Messaging" → "Try it out" → "Send a WhatsApp message"
2. Siga as instruções para ativar sandbox
3. Copie Account SID e Auth Token para o `.env`
4. O número "From" será algo como `whatsapp:+14155238886`

---

## 5️⃣ Deploy Firebase

### Login
```bash
cd firebase
firebase login
```

### Selecionar Projeto
```bash
firebase use --add
# Escolha o projeto barberpro-prod
```

### Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### Deploy Storage Rules
```bash
firebase deploy --only storage
```

### Deploy Cloud Functions
```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

### Deploy Hosting (Web)
```bash
cd ../apps/public-web
npm install
npm run build
firebase deploy --only hosting
```

---

## 6️⃣ Configurar EAS (Expo Application Services)

### Login
```bash
cd apps/mobile
npx eas login
```

### Configurar Projeto
```bash
npx eas build:configure
# Selecione "Android" e "iOS"
```

### Configurar Secrets no EAS
```bash
npx eas secret:create --name FIREBASE_API_KEY --value "sua_chave"
npx eas secret:create --name FIREBASE_PROJECT_ID --value "barberpro-prod"
# ... adicione todas as variáveis do .env
```

### Criar Build
```bash
# Android
npx eas build --platform android --profile production

# iOS (requer conta Apple Developer)
npx eas build --platform ios --profile production
```

---

## 7️⃣ Configurações de Segurança Importantes

### Firestore Rules
As regras já estão configuradas no arquivo `firestore.rules`. Certifique-se de que:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Só permitir acessos autenticados
    function isSignedIn() { return request.auth != null; }
    
    // Verificar role do usuário
    function userRole() { return request.auth.token.role; }
    
    // ... (regras completas no arquivo)
  }
}
```

### API Keys Restritas
No Console Firebase:
1. Vá em "Project settings" → "General" → "Web API Key"
2. Clique em "Restrict key"
3. Adicione restrições:
   - HTTP referrers (web sites)
   - Android apps
   - iOS apps

### Stripe Modo Produção
Antes de lançar:
1. Ative conta Stripe (modo live)
2. Atualize as chaves no `.env`
3. Atualize os Price IDs para os de produção
4. Atualize o webhook URL para produção

---

## 8️⃣ Testes em Produção

### Verificar Functions
```bash
# Listar functions
cd firebase
firebase functions:list

# Ver logs
firebase functions:log
```

### Testar Auth
1. Crie uma conta de teste no app
2. Verifique se o OTP chega no WhatsApp
3. Confirme o login

### Testar Agendamento
1. Crie uma barbearia de teste
2. Cadastre um serviço
3. Tente agendar como cliente

### Testar Pagamentos (Stripe Teste)
1. Use cartão de teste: `4242 4242 4242 4242`
2. Qualquer data futura
3. Qualquer CVC
4. Deve funcionar em modo teste

---

## 9️⃣ Checklist Pré-Lançamento

### Funcionalidades
- [ ] Login com WhatsApp funciona
- [ ] Cadastro de barbearia
- [ ] Cadastro de serviços
- [ ] Agendamentos (app e web)
- [ ] Chat
- [ ] Notificações push
- [ ] Sistema de avaliações
- [ ] Inventário de produtos
- [ ] Stories
- [ ] Multi-idioma

### Segurança
- [ ] Firestore rules testadas
- [ ] API keys restritas
- [ ] Stripe em modo live (se aplicável)
- [ ] SSL/HTTPS ativo

### Performance
- [ ] Imagens otimizadas
- [ ] Lazy loading funcionando
- [ ] Cache configurado

### Documentação
- [ ] Termos de uso
- [ ] Política de privacidade
- [ ] LGPD compliance

---

## 🆘 Troubleshooting

### Erro: "Firebase project not found"
```bash
firebase use --add
# Selecione o projeto correto
```

### Erro: "Permission denied" nas Functions
Verifique se as variáveis de ambiente estão configuradas:
```bash
firebase functions:config:set stripe.secret_key="sk_..."
```

### Erro: "API key not valid"
1. Verifique se a chave está correta no `.env`
2. Certifique-se de que a API key tem acesso ao projeto
3. Verifique restrições da chave no Console Firebase

### Erro no build EAS
```bash
# Limpar cache
npx eas build:configure --clear

# Ou recriar projeto EAS
npx eas project:delete
npx eas build:configure
```

---

## 📞 Suporte

Em caso de problemas:

1. Verifique logs: `firebase functions:log`
2. Console Firebase: https://console.firebase.google.com
3. Dashboard Stripe: https://dashboard.stripe.com
4. Console Twilio: https://console.twilio.com

---

**Pronto para lançar!** 🚀

Após seguir este guia, seu BarberPro estará configurado para produção e pronto para receber usuários reais.
