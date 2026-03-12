# 📱 Instalar NDK - Último Passo para Gerar o APK

## ⚡ Instalação Rápida (2 minutos)

### Passo 1: Abrir Android Studio
- Abra o **Android Studio** que você acabou de instalar

### Passo 2: Abrir SDK Manager
- Clique no menu: `Tools` → `SDK Manager`
- Ou pressione: `Ctrl + Alt + S` → depois "SDK Manager"

### Passo 3: Selecionar NDK
1. Clique na aba: **SDK Tools** (no topo da janela)
2. Role até encontrar: **"NDK (Side by side)"**
3. ☑️ **Marque a caixinha** ao lado de "NDK (Side by side)"
4. Clique no dropdown e selecione versão: **27.0.12077973**

### Passo 4: Instalar
1. Clique no botão: **Apply** (canto inferior direito)
2. Clique em **OK** na confirmação
3. Aguarde o download (aproximadamente 500MB)
4. Quando terminar, clique em **Finish**

---

## ✅ Verificar Instalação

Abra o CMD e execute:
```cmd
dir "%LOCALAPPDATA%\Android\Sdk\ndk" /b
```

Você deve ver: `27.0.12077973`

---

## 🚀 Gerar o APK

Após instalar o NDK, execute no CMD:

```cmd
cd c:\Users\igor\Desktop\BARBERPRO
scripts\build-apk-local.bat
```

O APK será gerado em:
```
apps\mobile\android\app\build\outputs\apk\release\app-release.apk
```

---

## ⏱️ Tempo Total
- Instalação do NDK: ~3-5 minutos (depende da internet)
- Build do APK: ~5-10 minutos

**Total: Aproximadamente 10-15 minutos**

---

## 🎉 Parabéns!

Depois disso, seu APK estará pronto para instalar no Android!

O app contém **TODAS** as funcionalidades:
- ✅ Sistema de agendamento
- ✅ Inventário de produtos
- ✅ Stories (tipo Instagram)
- ✅ Multi-idioma (PT/EN/ES)
- ✅ Chat global entre barbeiros
- ✅ Feed social
- ✅ Avaliações detalhadas
- ✅ Marketplace
- ✅ E muito mais!

---

## 🆘 Problemas?

Se tiver dificuldades, use o **EAS Build** (build online):

```cmd
cd apps\mobile
eas login
eas build --platform android --profile preview
```

Receberá o APK por email sem precisar instalar NDK!
