# 📱 Guia: Gerar APK para Android

Como gerar o arquivo APK do BarberPro para instalar no seu celular Android.

---

## 🎯 Opção 1: Build Local (Recomendado - Grátis)

### Pré-requisitos:

1. **Node.js** instalado (v18 ou superior)
   - Download: https://nodejs.org/

2. **Java JDK 17** instalado
   - Download: https://adoptium.net/
   - Instale e configure a variável JAVA_HOME

3. **Android SDK** (opcional, mas recomendado)
   - Instale o Android Studio: https://developer.android.com/studio
   - Ou apenas o SDK Command Line Tools

### Passo a Passo:

#### 1. Execute o script de build:

```batch
# No Windows, execute:
cd c:\Users\igor\Desktop\BARBERPRO
scripts\build-apk-local.bat
```

Ou manualmente:
```batch
cd apps\mobile
npm install
npx expo prebuild --platform android --clean
cd android
gradlew assembleRelease
```

#### 2. Aguarde o build (5-15 minutos)

O processo irá:
- Instalar dependências
- Gerar projeto Android nativo
- Compilar o código
- Gerar o APK

#### 3. APK Gerado:

Local: `apps\mobile\android\app\build\outputs\apk\release\app-release.apk`

Ou na raiz: `BarberPro-Release.apk`

#### 4. Instalar no Android:

1. **Transfira o APK** para seu celular:
   - USB
   - WhatsApp/Web
   - Google Drive
   - Email

2. **No celular**, toque no arquivo APK

3. **Permitir instalação**:
   - Vá em Configurações > Segurança
   - Ative "Fontes desconhecidas" (ou toque em "Permitir" quando solicitado)

4. **Instalar** e abrir o app!

---

## 🎯 Opção 2: Build via EAS (Expo)

### Requisitos:
- Conta Expo (gratuita): https://expo.dev/signup

### Passo a Passo:

```bash
cd apps/mobile

# Login na Expo
npx eas login

# Configurar projeto
npx eas build:configure

# Build do APK
npx eas build --platform android --profile preview
```

O APK será gerado na nuvem e você receberá um link para download.

---

## 🎯 Opção 3: Expo Go (Teste Rápido)

Para testar sem gerar APK:

1. Instale o **Expo Go** na Play Store
2. No computador, execute:
   ```bash
   cd apps/mobile
   npx expo start
   ```
3. Escaneie o QR Code com o Expo Go

⚠️ **Limitação**: Algumas funcionalidades nativas podem não funcionar no Expo Go.

---

## 🛠️ Solução de Problemas

### Erro: "Java não encontrado"
```
[ERRO] Java nao encontrado!
```
**Solução**: Instale o Java JDK 17: https://adoptium.net/

### Erro: "ANDROID_HOME não definido"
```
[ERRO] ANDROID_HOME environment variable is not set
```
**Solução**:
1. Instale o Android Studio
2. Configure a variável ANDROID_HOME apontando para o SDK

### Erro: "Build falhou"
```
[ERRO] Build falhou!
```
**Solução**:
1. Limpe o cache: `cd apps/mobile && rm -rf node_modules && npm install`
2. Delete pasta android: `rm -rf android`
3. Execute o build novamente

### APK muito grande
O APK gerado pode ter 50-100MB (normal para apps React Native).
Para reduzir:
- Use App Bundle (AAB) para Play Store
- Otimizar imagens

---

## 📋 Checklist Pré-Build

- [ ] Node.js instalado (v18+)
- [ ] Java JDK 17 instalado
- [ ] Variáveis de ambiente configuradas
- [ ] Dependências instaladas (`npm install`)
- [ ] Firebase configurado (`.env` preenchido)
- [ ] Espaço em disco (mínimo 2GB livre)

---

## 🚀 Após o Build

### Testar o APK:
1. Instale no celular
2. Teste login
3. Teste agendamentos
4. Verifique notificações

### Distribuir:
- Envie o APK para amigos/testers
- Ou publique na Play Store (requer conta de desenvolvedor US$25)

---

## 💡 Dicas

- **Primeiro build**: Pode levar 10-20 minutos (baixa dependências)
- **Builds seguintes**: 3-5 minutos (cache)
- **Tamanho**: APK ~60-80MB é normal
- **Debug vs Release**: Release é otimizado e menor

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs de erro no terminal
2. Consulte: https://docs.expo.dev/build-reference/troubleshooting/
3. Comunidade: https://forums.expo.dev/

**Boa sorte com seu APK! 🎉**
