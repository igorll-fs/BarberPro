# 📱 Guia de Build EAS - BarberPro

Guia completo para gerar builds (APK/IPA) do BarberPro usando Expo Application Services (EAS).

---

## 📋 Pré-requisitos

1. **Conta Expo** - Crie em https://expo.dev/signup
2. **EAS CLI instalado** - `npm install -g eas-cli`
3. **Projeto configurado** - Firebase e credenciais já configuradas

---

## 🚀 Passo a Passo

### 1. Login na Expo

```bash
cd apps/mobile
npx eas login
```

Digite seu email e senha da conta Expo.

---

### 2. Configurar Projeto EAS

```bash
npx eas build:configure
```

Selecione:
- **platform**: `all` (iOS e Android)
- Isso vai criar/atualizar o `eas.json`

---

### 3. Configurar Build de Produção

O `eas.json` já está configurado. Verifique se está assim:

```json
{
  "cli": { "version": ">= 3.0.0" },
  "build": {
    "development": { 
      "developmentClient": true, 
      "distribution": "internal" 
    },
    "preview": { 
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": { 
      "autoIncrement": true 
    }
  },
  "submit": { 
    "production": {} 
  }
}
```

---

### 4. Build Preview (APK para testes)

```bash
npx eas build --platform android --profile preview
```

Isso gera um **APK** que pode ser instalado diretamente em qualquer Android.

---

### 5. Build Production (AAB para Play Store)

```bash
npx eas build --platform android --profile production
```

Isso gera um **AAB** (Android App Bundle) para publicar na Play Store.

---

### 6. Build iOS (requer Apple Developer)

```bash
npx eas build --platform ios --profile production
```

⚠️ **Requer:**
- Conta Apple Developer ($99/ano)
- Certificados e provisioning profiles configurados

---

## 📦 Build Local (Sem conta Expo)

Se preferir build local:

```bash
# Android
cd apps/mobile
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

APK gerado em: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🔧 Configurações Importantes

### Android

O `app.json` já está configurado com:

```json
{
  "android": {
    "package": "app.barberpro.mobile"
  }
}
```

### iOS

```json
{
  "ios": {
    "bundleIdentifier": "app.barberpro.mobile",
    "supportsTablet": true,
    "usesAppleSignIn": true
  }
}
```

---

## 🌐 Variáveis de Ambiente no EAS

As variáveis do `.env` precisam ser configuradas no EAS:

```bash
npx eas env:create --name FIREBASE_API_KEY --value "AIzaSy..." --scope project
npx eas env:create --name FIREBASE_AUTH_DOMAIN --value "baberpro-31c40.firebaseapp.com" --scope project
npx eas env:create --name FIREBASE_PROJECT_ID --value "baberpro-31c40" --scope project
npx eas env:create --name STRIPE_PUBLISHABLE_KEY --value "pk_live_..." --scope project
```

Ou adicione no `eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "FIREBASE_API_KEY": "AIzaSy...",
        "FIREBASE_AUTH_DOMAIN": "baberpro-31c40.firebaseapp.com"
      }
    }
  }
}
```

---

## 📲 Instalação do APK

Após o build, o EAS fornece um link para download:

1. Acesse o link no navegador do celular
2. Baixe o APK
3. Permita instalação de fontes desconhecidas
4. Instale o app

---

## 🔄 Atualizações OTA (Over-The-Air)

Com EAS Update, você pode atualizar o app sem nova build:

```bash
# Publicar atualização
npx eas update --branch production --message "Novas funcionalidades"
```

---

## 🐛 Troubleshooting

### Erro: "Missing package.json"

```bash
npm install
```

### Erro: "Invalid credentials"

```bash
npx eas login
# Faça login novamente
```

### Erro: "Bundle identifier not found"

Verifique se o `bundleIdentifier` está correto no `app.json`.

### Build falha por falta de memória

No `eas.json`, adicione:

```json
{
  "build": {
    "production": {
      "android": {
        "gradleCommand": "assembleRelease",
        "buildType": "apk"
      }
    }
  }
}
```

---

## 📊 Monitoramento

Acompanhe seus builds em:
https://expo.dev/accounts/[SEU_USUARIO]/projects/barberpro/builds

---

## ✅ Checklist Pré-Build

- [ ] Firebase configurado (`.env` preenchido)
- [ ] Login na Expo realizado
- [ ] Variáveis de ambiente configuradas no EAS
- [ ] Versão atualizada no `package.json`
- [ ] Testes passando
- [ ] Código commitado no Git

---

## 🚀 Comandos Rápidos

```bash
# Build APK para testes
npx eas build -p android --profile preview

# Build AAB para Play Store
npx eas build -p android --profile production

# Build iOS
npx eas build -p ios --profile production

# Build todos os platforms
npx eas build --profile production

# Ver status dos builds
npx eas build:list
```

---

**Próximo passo**: Após o build, configure o deploy web no Firebase Hosting! 🌐
