# 📚 Contexto do Projeto - BARBERPRO

## Visão Geral
BARBERPRO é um aplicativo de agendamento para barbearias, permitindo que clientes agendem cortes, barbeiros gerenciem suas agendas e donos de barbearias tenham visão geral do negócio.

## Stack Principal
- **Frontend Mobile**: React Native + Expo (TypeScript)
- **Frontend Web**: React + Vite (TypeScript)
- **Backend**: Firebase (Firestore, Functions, Auth, Storage, FCM)
- **Linguagem**: TypeScript strict mode

## Arquitetura do Projeto
```
BARBERPRO/
├── apps/
│   ├── mobile/         # App React Native + Expo
│   │   ├── src/
│   │   │   ├── components/   # Componentes reutilizáveis
│   │   │   ├── screens/      # Telas do app
│   │   │   ├── hooks/        # Hooks personalizados
│   │   │   ├── services/     # Serviços (Firebase, API)
│   │   │   ├── store/        # Estado global (Zustand/Context)
│   │   │   ├── navigation/   # Navegação (React Navigation)
│   │   │   ├── types/        # Tipos TypeScript
│   │   │   └── utils/        # Utilitários
│   │   └── assets/           # Imagens, fontes, etc.
│   │
│   ├── web/            # Dashboard web (React + Vite)
│   │
│   └── public-web/     # Landing page
│
├── firebase/
│   ├── functions/      # Cloud Functions
│   ├── firestore.rules # Regras de segurança
│   └── storage.rules   # Regras de storage
│
├── docs/               # Documentação
│
└── scripts/            # Scripts de automação
```

## Tipos de Usuários
1. **Cliente (Customer)**
   - Agenda cortes
   - Vê histórico de agendamentos
   - Gerencia perfil
   - Recebe notificações

2. **Barbeiro (Barber)**
   - Gerencia sua agenda
   - Configura serviços e preços
   - Vê histórico de clientes
   - Recebe notificações de agendamentos

3. **Dono (Owner)**
   - Dashboard administrativo
   - Gerencia barbeiros
   - Relatórios e métricas
   - Configurações da barbearia
   - Visão financeira

## Fluxos Principais
1. **Autenticação**
   - Firebase Auth (Email/Senha, Google, Apple)
   - Recuperação de senha
   - Verificação de email

2. **Agendamento**
   - Escolha de barbeiro
   - Seleção de serviço
   - Escolha de data/hora
   - Confirmação

3. **Pagamento**
   - Integração com Stripe
   - Pagamento online
   - Histórico de transações

4. **Notificações**
   - Firebase Cloud Messaging
   - Lembretes de agendamentos
   - Promoções e novidades

## Integrações Externas
- **Firebase Auth**: Autenticação
- **Cloud Firestore**: Banco de dados
- **Cloud Storage**: Armazenamento de imagens
- **Cloud Functions**: Lógica server-side
- **Firebase Cloud Messaging**: Push notifications
- **Google Maps API**: Localização de barbearias
- **Stripe**: Pagamentos online

## Variáveis de Ambiente Necessárias
```env
# Firebase
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

# Google Maps
GOOGLE_MAPS_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Padrões de Código
- **Componentes**: Funcionais com TypeScript
- **Estado**: Zustand para estado global, React Query para server state
- **Estilos**: StyleSheet (React Native), TailwindCSS (Web)
- **Testes**: Jest + Testing Library
- **Navegação**: React Navigation (Mobile), React Router (Web)

## Comandos Principais
```bash
# Mobile
cd apps/mobile && npm start        # Inicia Expo
npm run android                     # Android
npm run ios                         # iOS

# Web
cd apps/web && npm run dev          # Desenvolvimento

# Firebase
cd firebase && npm run serve        # Emuladores
npm run deploy                      # Deploy
```

## Status Atual do Projeto
- [x] Setup inicial do projeto
- [x] Autenticação Firebase
- [x] Telas básicas de login/registro
- [x] Navegação principal
- [ ] Sistema de agendamento completo
- [ ] Integração com Stripe
- [ ] Notificações push
- [ ] Dashboard do dono
- [ ] Testes automatizados

## Próximos Passos Prioritários
1. Completar fluxo de agendamento
2. Implementar notificações push
3. Integrar sistema de pagamentos
4. Desenvolver dashboard do dono
5. Aumentar cobertura de testes