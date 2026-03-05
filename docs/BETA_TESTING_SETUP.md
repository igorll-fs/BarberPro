# 🚀 Guia de Configuração para Beta Testing

Este guia explica como configurar o ambiente de desenvolvimento e executar o beta testing do BarberPro.

---

## ✅ Status Atual

- **Testes Mobile**: 16/16 passando ✅
- **Dependências**: Instaladas ✅
- **Firebase**: Pronto para configurar em modo dev

---

## 📋 Pré-requisitos

- Node.js >= 20.19
- Firebase CLI instalado globalmente
- Conta no Firebase
- Android Studio (para emulador Android) ou Xcode (para iOS)

---

## 🛠️ Configuração do Ambiente

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login no Firebase

```bash
firebase login
```

### 3. Configurar Projeto Firebase

```bash
cd firebase
firebase use --add
# Selecione ou crie um projeto
```

### 4. Configurar Variáveis de Ambiente

Crie o arquivo `apps/mobile/.env`:

```env
# Firebase Config (use os valores do seu projeto)
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Stripe (opcional para beta)
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Outros
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

Crie o arquivo `firebase/functions/.env`:

```env
# Twilio (WhatsApp OTP)
TWILIO_ACCOUNT_SID=AC_...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_YEARLY=price_...

# App
FIREBASE_WEB_URL=https://your_project.web.app
```

---

## 🔥 Modo Desenvolvimento (Emuladores Firebase)

### Iniciar Emuladores

```bash
cd firebase
firebase emulators:start
```

Isso iniciará:
- **Auth Emulator**: http://localhost:9099
- **Firestore Emulator**: http://localhost:8080
- **Functions Emulator**: http://localhost:5001
- **Storage Emulator**: http://localhost:9199
- **Emulator UI**: http://localhost:4000

### Iniciar App Mobile (Modo Demo)

O app já detecta automaticamente o modo de desenvolvimento e usa os emuladores locais quando `__DEV__` está ativo.

```bash
# Terminal 1 - Emuladores
cd firebase && firebase emulators:start

# Terminal 2 - App Mobile
cd apps/mobile && npx expo start
```

---

## 🧪 Executar Testes

### Testes Mobile

```bash
cd apps/mobile
npx jest --config jest.config.js --verbose
```

### Testes Cloud Functions

```bash
cd firebase/functions
npx jest --verbose
```

---

## 📱 Beta Testing

### Opção 1: Modo Demo (Sem Firebase)

O app tem um botão "Entrar em Modo Demo" na tela de login que permite testar todas as funcionalidades sem configurar Firebase.

### Opção 2: Com Emuladores Firebase

1. Inicie os emuladores: `cd firebase && firebase emulators:start`
2. Inicie o app: `cd apps/mobile && npx expo start`
3. O app conectará automaticamente aos emuladores locais
4. Use números de telefone fictícios para testar o login OTP

### Opção 3: EAS Build (Beta Distribution)

```bash
# Configurar EAS
cd apps/mobile && npx eas build:configure

# Build para Android
npx eas build --platform android --profile preview

# Build para iOS
npx eas build --platform ios --profile preview
```

---

## 🔍 Checklist de Beta Testing

### Funcionalidades Core
- [ ] Login via WhatsApp OTP
- [ ] Cadastro de barbearia (dono)
- [ ] Cadastro de serviços
- [ ] Agendamento (cliente)
- [ ] Confirmação/recusa de agendamentos (dono/funcionário)
- [ ] Chat cliente-barbearia
- [ ] Notificações push
- [ ] Sistema de avaliações

### Perfis de Usuário
- [ ] Cliente - Agendar serviço
- [ ] Cliente - Ver histórico
- [ ] Dono - Dashboard
- [ ] Dono - Gerenciar equipe
- [ ] Funcionário - Ver agenda
- [ ] Funcionário - Confirmar agendamentos

### Testes de Segurança
- [ ] Validação de roles
- [ ] Acesso negado a recursos de outros usuários
- [ ] Rate limiting de OTP
- [ ] Bloqueio de clientes

---

## 🐛 Reportar Bugs

Use o template abaixo para reportar issues:

```markdown
**Descrição:**
[Descreva o bug]

**Passos para Reproduzir:**
1. [Passo 1]
2. [Passo 2]

**Comportamento Esperado:**
[O que deveria acontecer]

**Comportamento Atual:**
[O que está acontecendo]

**Screenshots:**
[Se aplicável]

**Ambiente:**
- OS: [iOS/Android]
- Versão do App: [1.0.0]
- Modo: [Demo/Emulador/Produção]
```

---

## 📞 Suporte

Em caso de dúvidas durante o beta testing:

1. Consulte a documentação em `docs/`
2. Verifique os logs do console
3. Verifique os logs do Firebase Emulator UI (http://localhost:4000)

---

## 🎉 Próximos Passos Após Beta

1. Coletar feedback dos beta testers
2. Corrigir bugs reportados
3. Ajustar UX/UI baseado no feedback
4. Implementar features pendentes do backlog
5. Preparar para lançamento em produção

---

**Data de início do beta:** _[Preencher]_
**Versão do app:** 1.0.0-beta
