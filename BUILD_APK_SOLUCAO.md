# 🚀 Solução para Build do APK - BarberPro

## ⚠️ Problema Identificado

O build local está falhando devido a incompatibilidade entre:

- **Expo SDK 52** (versão mais recente)
- **Gradle 8.10.2** (versão do Android Studio)
- **expo-modules-core** (plugin de publicação)

O erro `Could not get unknown property 'release'` é um problema conhecido.

---

## ✅ Solução 1: EAS Build Online (Recomendada)

Esta é a forma mais confiável e rápida de gerar o APK.

### Passo 1: Criar conta na Expo

1. Acesse: https://expo.dev/signup
2. Crie uma conta gratuita
3. Confirme seu email

### Passo 2: Login no terminal

```bash
cd apps\mobile
npx eas login
# Digite seu email e senha da conta Expo
```

### Passo 3: Iniciar o build

```bash
npx eas build --platform android --profile preview
```

**O que acontece:**

- O código é enviado para os servidores da Expo
- O build é feito na nuvem (não usa seu PC)
- Você recebe um link para download do APK
- O processo leva cerca de 10-15 minutos

---

## ✅ Solução 2: Android Studio (Alternativa)

Como você já tem o Android Studio instalado:

### Passo 1: Abrir o projeto

1. Abra o Android Studio
2. Selecione "Open an existing Android Studio project"
3. Navegue até: `C:\Users\igor\Desktop\BARBERPRO\apps\mobile\android`
4. Aguarde a sincronização do Gradle

### Passo 2: Modificar o build.gradle (se necessário)

Se ocorrer erro de `release`, comente as linhas de publicação no arquivo:
`apps\mobile\node_modules\expo-modules-core\android\ExpoModulesCorePlugin.gradle`

### Passo 3: Gerar APK

1. Menu: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Aguarde o build completar
3. O APK será gerado em: `app\build\outputs\apk\debug\app-debug.apk`

---

## ✅ Solução 3: Script Automático (Tentativa)

Execute o script que criamos:

```bash
scripts\build-apk-eas.bat
```

Se não estiver logado na Expo, ele vai pedir para fazer login.

---

## 📱 Instalação do APK

Após gerar o APK:

1. **Transfira para o celular:**
   - USB
   - Email
   - WhatsApp
   - Google Drive

2. **No celular Android:**
   - Vá em: **Configurações** → **Segurança**
   - Ative: **"Fontes desconhecidas"** ou **"Instalar apps desconhecidos"**
   - Toque no arquivo APK para instalar

---

## 🔧 Configurações do App

O APK gerado inclui:

- ✅ Autenticação (Email/Google/Apple)
- ✅ Agendamento completo
- ✅ Gestão de barbearia
- ✅ Sistema de assinaturas (Stripe)
- ✅ Notificações push
- ✅ Inventário de Produtos
- ✅ Stories (tipo Instagram)
- ✅ Multi-idioma (PT/EN/ES)
- ✅ Chat Global entre barbeiros
- ✅ Feed Global
- ✅ Sistema de seguir
- ✅ Avaliação de cortes
- ✅ Marketplace
- ✅ LGPD/GDPR/CCPA

---

## 🆘 Suporte

Se encontrar problemas:

1. **Erro de Gradle:** Delete as pastas `android` e `node_modules`, depois execute:

   ```bash
   npm install
   npx expo prebuild --platform android
   ```

2. **Erro de SDK:** Verifique se o Android SDK está em:
   `C:\Users\igor\AppData\Local\Android\Sdk`

3. **Erro de Java:** Instale o JDK 17: https://adoptium.net/

---

## 🎯 Recomendação Final

**Use a Solução 1 (EAS Build Online)** - É a mais confiável e não depende de configuração local complexa.

1. Crie conta em https://expo.dev/signup
2. Execute: `npx eas build --platform android --profile preview`
3. Aguarde o link do APK por email

---

**Pronto para começar?** 🚀
