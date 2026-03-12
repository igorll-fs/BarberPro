# 📱 Página HTML de QR Code

## Arquivo Criado
📄 [`expo-qr-preview.html`](expo-qr-preview.html) — Página pronta para uso

---

## 🚀 Como Usar

### 1. Abrir no Navegador
```bash
# Opção 1: Duplo clique no arquivo
expo-qr-preview.html

# Opção 2: Via terminal
start expo-qr-preview.html        # Windows
open expo-qr-preview.html         # macOS
xdg-open expo-qr-preview.html     # Linux
```

### 2. Configurar URL do Expo
1. Execute no terminal:
   ```bash
   npm run mobile
   ```
2. Copie a URL exp:// mostrada no terminal
3. Cole no campo "URL do Expo" na página
4. Clique "Atualizar QR Code"

### 3. Ler com Expo Go
1. Baixe o **Expo Go** no celular
2. Toque em "Scan QR Code"
3. Aponte para o QR code na tela
4. O app carregará automaticamente

---

## 🎨 Design Implementado

Seguindo o **Design System Minimalista** do BARBERPRO:

| Elemento | Valor |
|----------|-------|
| Fundo | `#F5F5F5` (mono-96) |
| Card | `#FFFFFF` (mono-100) |
| Texto | `#0A0A0A` (mono-0) |
| Secundário | `#666666` (mono-40) |
| Borda | `#E0E0E0` (mono-88) |
| CTA | `#0A0A0A` (accent) |
| Radius | `24px` (container), `16px` (elementos) |
| Sombra | `0 4px 24px rgba(0,0,0,0.08)` |

---

## ✨ Funcionalidades

- ✅ **QR Code dinâmico** — atualiza em tempo real
- ✅ **Input editável** — cole qualquer URL exp://
- ✅ **Copiar URL** — botão para clipboard
- ✅ **Design responsivo** — funciona em mobile/desktop
- ✅ **Instruções integradas** — passo a passo no card
- ✅ **Links para lojas** — download do Expo Go

---

## 🔧 Personalização

Para alterar a URL padrão, edite a linha:
```html
<input 
    type="text" 
    id="urlInput" 
    value="exp://SEU_IP:8081"  ← Altere aqui
>
```

---

## 📱 Preview

```
┌─────────────────────────────┐
│  ● Expo Preview             │
│                             │
│       BarberPro             │
│    Aponte a câmera          │
│                             │
│  ┌─────────────────────┐    │
│  │  exp://192.168...   │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │                     │    │
│  │    [QR CODE]        │    │
│  │                     │    │
│  └─────────────────────┘    │
│                             │
│  exp://192.168.1.100:8081   │
│                             │
│  [ Atualizar QR Code ]      │
│  [ Copiar URL ]             │
│                             │
│  ┌─────────────────────┐    │
│  │  COMO USAR          │    │
│  │  1. Baixe Expo Go   │    │
│  │  2. Toque Scan QR   │    │
│  │  3. Aponte câmera   │    │
│  │  4. Pronto!         │    │
│  └─────────────────────┘    │
│                             │
│  [App Store] [Play Store]   │
│                             │
│    ou acesse barberpro.app  │
└─────────────────────────────┘
```

---

## 🎯 Próximos Passos

1. **Abra o arquivo** `expo-qr-preview.html` no navegador
2. **Inicie o Expo** (`npm run mobile`)
3. **Copie a URL** do terminal para o input
4. **Leia o QR** com o Expo Go no celular

**Pronto para usar!** 🚀
