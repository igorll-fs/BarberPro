# 🚀 Guia Rápido - Gerar APK do BarberPro

## Opção 1: Android Studio (Mais Rápida - Recomendada)

Como você já tem o Android Studio instalado, essa é a forma mais simples:

### Passo 1: Abrir o Projeto

1. Abra o **Android Studio**
2. Clique em **"Open an existing Android Studio project"**
3. Navegue até: `C:\Users\igor\Desktop\BARBERPRO\apps\mobile\android`
4. Aguarde a sincronização do Gradle (pode demorar alguns minutos na primeira vez)

### Passo 2: Gerar o APK

1. No menu superior, clique em: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Aguarde o build completar (barra de progresso na parte inferior)
3. Quando terminar, aparecerá uma notificação no canto inferior direito
4. Clique em **"locate"** para abrir a pasta com o APK

### Local do APK

```
apps\mobile\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## Opção 2: Script Automático (Em Execução)

O script `scripts\build-apk-local.bat` já está rodando no terminal.

**Status:** Em andamento - aguardando conclusão do Gradle.

---

## Opção 3: EAS Build Online (Sem Android Studio)

Se preferir não usar o Android Studio:

```bash
cd apps\mobile
eas login
eas build --platform android --profile preview
```

**Vantagens:**

- Build na nuvem (não usa seu PC)
- APK otimizado para produção
- Recebe link para download

**Requisito:** Conta gratuita em https://expo.dev/signup

---

## 📱 Instalação no Android

Após gerar o APK:

1. Transfira o arquivo para seu celular:
   - USB
   - Email
   - WhatsApp
   - Google Drive

2. No celular, ative:
   - **Configurações** → **Segurança** → **Fontes desconhecidas**

3. Toque no arquivo APK para instalar

---

## ✅ Funcionalidades Incluídas no APK

- ✅ Autenticação (Email, Google, Apple)
- ✅ Agendamento completo
- ✅ Gestão de barbearia
- ✅ Sistema de assinaturas (Stripe)
- ✅ Notificações push
- ✅ Inventário de Produtos
- ✅ Stories da Barbearia
- ✅ Multi-idioma (PT/EN/ES)
- ✅ Chat Global entre barbeiros
- ✅ Feed Global
- ✅ Sistema de seguir barbeiros
- ✅ Avaliação detalhada de cortes
- ✅ Marketplace de produtos
- ✅ Políticas de privacidade (LGPD, GDPR, CCPA)

---

## 🆘 Suporte

Se encontrar algum erro:

1. **Erro de Gradle:** Delete a pasta `apps\mobile\android\build` e tente novamente
2. **Erro de SDK:** Verifique se o Android SDK está em `C:\Users\igor\AppData\Local\Android\Sdk`
3. **Erro de Java:** Instale o JDK 17: https://adoptium.net/

---

**Recomendação:** Use a **Opção 1 (Android Studio)** para resultado mais rápido e confiável!
