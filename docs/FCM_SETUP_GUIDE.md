# 🔔 Guia de Configuração FCM - Firebase Cloud Messaging

Guia completo para configurar notificações push no BarberPro.

---

## 📋 Pré-requisitos

1. **Projeto Firebase configurado** - Já realizado
2. **Acesso ao Firebase Console** - https://console.firebase.google.com
3. **App configurado** - Android/iOS já registrado no Firebase

---

## 🚀 Configuração Mobile

### 1. Acessar Firebase Console

1. Acesse: https://console.firebase.google.com
2. Selecione o projeto **"baberpro-31c40"**
3. Clique no ⚙️ **Project Settings**

---

### 2. Obter Configuração Cloud Messaging

#### A. Na aba **General**, role até **"Your apps"**

#### B. Selecione o app Android ou iOS

#### C. Clique em **"Cloud Messaging"**

Você verá:
```
Sender ID: 559665774528  ← Já configurado
Server Key: AAAA...       ← Para backend (legacy)
```

---

### 3. Configurar VAPID Key (Web Push)

#### A. Na aba **Cloud Messaging**

#### B. Role até **"Web Push certificates"**

#### C. Clique em **"Generate key pair"**

#### D. Copie a chave pública (começa com `BL...`)

---

### 4. Atualizar Arquivos .env

#### Mobile (`apps/mobile/.env`):
```env
# Firebase Cloud Messaging
FCM_VAPID_KEY=BLxxxxxxxxxxxxxxxxxxxxx
```

#### Web (`apps/public-web/.env`):
```env
VITE_FCM_VAPID_KEY=BLxxxxxxxxxxxxxxxxxxxxx
```

---

## 📱 Configuração Android

O Android usa Firebase por padrão, mas precisa do arquivo `google-services.json`:

### 1. Baixar Configuração

1. Firebase Console > Project Settings > General
2. Selecione o app Android
3. Clique em **"Download google-services.json"**
4. Salve em: `apps/mobile/android/app/google-services.json`

### 2. Verificar Configuração

O `app.json` já deve ter:
```json
{
  "plugins": [
    "expo-notifications"
  ]
}
```

---

## 🍎 Configuração iOS

### 1. Apple Developer Account

Requer conta Apple Developer ($99/ano):
https://developer.apple.com

### 2. Criar Chave APNs

1. Apple Developer > Certificates, Identifiers & Profiles
2. Keys > Create a key
3. Nome: **"BarberPro Push"**
4. Habilitar **"Apple Push Notifications service (APNs)"**
5. Clique em **Continue** > **Register** > **Download**

### 3. Configurar no Firebase

1. Firebase Console > Project Settings > Cloud Messaging
2. Seção **"iOS app configuration"**
3. Em **"APNs Authentication Key"**, clique em **Upload**
4. Selecione o arquivo `.p8` baixado
5. Digite o **Key ID** e **Team ID**

### 4. Baixar Configuração

1. Firebase Console > Project Settings > General
2. Selecione o app iOS
3. Clique em **"Download GoogleService-Info.plist"**
4. Salve em: `apps/mobile/ios/BarberPro/GoogleService-Info.plist`

---

## 🌐 Configuração Web

### 1. Service Worker

O arquivo `firebase-messaging-sw.js` já está em `apps/public-web/public/`

### 2. Verificar Configuração

```javascript
// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSy...",
  authDomain: "baberpro-31c40.firebaseapp.com",
  projectId: "baberpro-31c40",
  messagingSenderId: "559665774528",
  appId: "1:559665774528:web:..."
});

const messaging = firebase.messaging();
```

---

## 🧪 Testar Notificações

### 1. Teste via Firebase Console

1. Firebase Console > Engage > Cloud Messaging
2. Clique em **"Create your first campaign"**
3. Selecione **"Notification"**
4. Preencha:
   - **Title**: Teste BarberPro
   - **Text**: Esta é uma notificação de teste!
5. Clique em **"Send test message"**
6. Digite o FCM token do dispositivo

### 2. Obter FCM Token no App

Adicione este código para obter o token:

```typescript
import * as Notifications from 'expo-notifications';

async function getPushToken() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status === 'granted') {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'seu-project-id'
    });
    console.log('FCM Token:', token.data);
    return token.data;
  }
}
```

---

## 🎯 Tipos de Notificações

O BarberPro envia notificações para:

| Evento | Destinatário | Mensagem |
|--------|--------------|----------|
| Novo agendamento | Dono/Funcionário | "Novo agendamento recebido" |
| Lembrete 1h | Cliente | "Seu horário é em 1 hora" |
| Lembrete 30min | Cliente | "Seu horário é em 30 minutos" |
| Confirmação | Cliente | "Agendamento confirmado" |
| Cancelamento | Cliente | "Agendamento cancelado" |
| Avaliação | Cliente | "Avalie seu atendimento" |

---

## 🔧 Troubleshooting

### Notificações não chegam

Verifique:
1. Permissões concedidas no app
2. FCM token está sendo salvo no Firestore
3. Backend está chamando `notifyUser()` corretamente

### Erro: "Permission denied"

```typescript
// Solicitar permissão
const { status } = await Notifications.requestPermissionsAsync();
if (status !== 'granted') {
  Alert.alert('Permissão necessária', 'Ative as notificações nas configurações');
}
```

### iOS - Notificações não aparecem

Verifique:
1. APNs key configurada no Firebase
2. Provisioning profile correto
3. App assinado com certificado de distribuição

### Android - Notificações em background

Adicione no `app.json`:
```json
{
  "plugins": [
    [
      "expo-notifications",
      {
        "icon": "./assets/notification-icon.png",
        "color": "#6366f1"
      }
    ]
  ]
}
```

---

## 📊 Monitoramento

Acompanhe entregas em:
Firebase Console > Engage > Cloud Messaging > Reports

Métricas:
- Notificações enviadas
- Taxa de entrega
- Taxa de abertura

---

## ✅ Checklist

- [ ] VAPID Key gerada
- [ ] Chaves configuradas no .env
- [ ] Android: google-services.json baixado
- [ ] iOS: APNs key configurada (se aplicável)
- [ ] iOS: GoogleService-Info.plist baixado
- [ ] Service worker web configurado
- [ ] Teste de notificação realizado
- [ ] Permissões sendo solicitadas no app

---

## 📞 Suporte

- Firebase Docs: https://firebase.google.com/docs/cloud-messaging
- Expo Notifications: https://docs.expo.dev/versions/latest/sdk/notifications/

---

**Próximo passo**: Configure o Google Maps! 🗺️
