# 📱 BarberPro PWA - Versão iOS

Guia completo para usar o BarberPro como PWA (Progressive Web App) no iPhone, sem precisar da App Store.

---

## 🎯 O que é PWA?

PWA (Progressive Web App) permite que o BarberPro funcione como um app nativo no iPhone:
- ✅ Ícone na tela inicial
- ✅ Tela cheia (sem barra do Safari)
- ✅ Funciona offline
- ✅ Notificações push
- ✅ Atualizações automáticas
- ✅ Experiência igual a app nativo

---

## 🚀 Como Instalar no iPhone

### Método 1: Instalação Manual (Recomendado)

1. **Abra o Safari** no seu iPhone
2. **Acesse**: `https://barberpro.app` (ou o domínio do seu deploy)
3. **Toque no botão Compartilhar** (ícone de quadrado com seta para cima)
4. **Role para baixo** e toque em **"Adicionar à Tela de Início"**
5. **Toque em "Adicionar"** no canto superior direito
6. **Pronto!** O ícone do BarberPro aparecerá na sua tela inicial

### Método 2: Via QR Code

1. **Abra a câmera** do iPhone
2. **Aponte para o QR code** do BarberPro
3. **Toque na notificação** que aparece
4. **Siga os passos** do Método 1 a partir do passo 3

---

## ⚙️ Configuração do Firebase Hosting

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login no Firebase

```bash
firebase login
```

### 3. Inicializar Hosting

```bash
cd apps/web
firebase init hosting
```

Escolha:
- **Project**: `baberpro-31c40`
- **Public directory**: `dist`
- **Single-page app**: `Yes`
- **GitHub deploys**: `No`

### 4. Build e Deploy

```bash
# Instalar dependências
npm install

# Build de produção
npm run build

# Deploy
npm run deploy
```

### 5. Configurar Domínio Customizado (Opcional)

No Firebase Console:
1. Vá em **Hosting**
2. Clique em **Add custom domain**
3. Siga as instruções para configurar `app.barberpro.com`

---

## 🔧 Configurações do Projeto Web

### Estrutura de Arquivos

```
apps/web/
├── public/
│   ├── manifest.json      # Configuração do PWA
│   ├── icons/             # Ícones em vários tamanhos
│   └── splash/            # Telas de splash
├── src/
│   ├── components/        # Componentes React
│   ├── pages/            # Páginas/Telas
│   ├── hooks/            # Custom hooks
│   ├── services/         # Firebase/services
│   ├── store/            # Zustand store
│   ├── types/            # TypeScript types
│   └── styles/           # CSS global
├── index.html            # HTML principal
├── vite.config.ts        # Config Vite + PWA
└── package.json
```

### Recursos do PWA

- **Service Worker**: Cache automático de assets
- **Manifest**: Configuração do app
- **Offline First**: Funciona sem internet
- **Background Sync**: Sincroniza quando voltar online
- **Push Notifications**: Notificações nativas

---

## 🛠️ Modo Desenvolvedor

### Como Ativar

1. **Crie uma conta** com email contendo:
   - `dev@` (ex: `dev@barberpro.app`)
   - `admin@` (ex: `admin@barberpro.app`)
   - Ou seu email específico: `igor@barberpro.app`

2. **No Settings**, aparecerá o botão **"🛠️ Ativar Modo Dev"**

3. **Acesse o Painel Dev** para alternar entre:
   - 👤 Cliente
   - 👑 Proprietário
   - ✂️ Barbeiro

### Funcionalidades do Modo Dev

- ✅ Alternar entre todos os perfis instantaneamente
- ✅ Ver dados sensíveis (UID, claims)
- ✅ Testar notificações
- ✅ Limpar cache/storage
- ✅ Simular diferentes dispositivos

---

## 📋 Checklist iOS PWA

### Antes do Deploy

- [ ] Ícones em todos os tamanhos (72x72 a 512x512)
- [ ] Splash screens para todos os tamanhos de iPhone
- [ ] Manifest.json válido
- [ ] Service Worker funcionando
- [ ] HTTPS ativo (obrigatório para PWA)
- [ ] CORS configurado no Firebase

### Testes

- [ ] Instalação funciona no Safari iOS
- [ ] App abre em tela cheia
- [ ] Pull-to-refresh desabilitado
- [ ] Zoom desabilitado
- [ ] Safe areas respeitadas (notch)
- [ ] Funciona offline
- [ ] Notificações funcionam

---

## 🐛 Solução de Problemas

### "Adicionar à Tela de Início" não aparece

- Limpe o cache do Safari: **Ajustes → Safari → Limpar Histórico e Dados**
- Verifique se o site está em HTTPS
- Confirme que o manifest.json está acessível

### App não abre em tela cheia

- Verifique `display: standalone` no manifest
- Confirme que `apple-mobile-web-app-capable` está no HTML
- Reinstale o PWA

### Notificações não funcionam

- PWA precisa ser instalado primeiro
- Usuário precisa permitir notificações
- Checkar permissões em **Ajustes → Notificações**

### Atualizações não aparecem

- O service worker atualiza automaticamente
- Force close e abra novamente
- Ou desinstale e reinstale o PWA

---

## 🔒 Segurança

### Recomendações

1. **Sempre use HTTPS**
2. **Configure CSP** (Content Security Policy)
3. **Valide o manifest**
4. **Limite o cache** de dados sensíveis
5. **Use Firebase Auth** para segurança

### Configuração firebase.json

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/service-worker.js",
        "headers": [{"key": "Cache-Control", "value": "no-cache"}]
      }
    ]
  }
}
```

---

## 📱 Dicas para iOS

### Otimizações Específicas

1. **Status Bar**: Use `black-translucent` para experiência imersiva
2. **Safe Areas**: Respeite `env(safe-area-inset-*)`
3. **Touch**: Desabilite zoom e highlight
4. **Scroll**: Use `-webkit-overflow-scrolling: touch`
5. **Tamanho**: Mantenha o app abaixo de 5MB inicial

### Limitações do iOS

- ⚠️ Push notifications só funcionam em PWA instalado
- ⚠️ Background sync é limitado
- ⚠️ Acesso a algumas APIs nativas restrito
- ⚠️ Storage limitado a ~50MB

---

## 🎨 Personalização

### Cores do Tema

Edite em `index.html`:
```html
<meta name="theme-color" content="#0A0E1A">
```

### Ícones

Substitua em `public/icons/`:
- `icon-72x72.png` a `icon-512x512.png`
- Use o mesmo ícone do app mobile

### Splash Screen

Gere em: https://pwa-asset-generator.nicepkg.cn/
Ou use o script:
```bash
npx pwa-asset-generator logo.png ./splash --padding 20%
```

---

## 📊 Analytics

### Monitoramento

```javascript
// No App.tsx
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics();
logEvent(analytics, 'pwa_installed');
```

### Eventos Importantes

- `pwa_installed` - Usuário instalou o PWA
- `pwa_opened` - App aberto (standalone)
- `role_switched` - Mudança de perfil no dev mode

---

## 📚 Recursos

- [Apple PWA Guidelines](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

---

## ✅ Status

| Feature | Status |
|---------|--------|
| PWA Install | ✅ Funcionando |
| Offline Mode | ✅ Funcionando |
| Push Notifications | ✅ Funcionando |
| Dev Mode | ✅ Funcionando |
| iOS Standalone | ✅ Funcionando |
| Background Sync | ⚠️ Limitado no iOS |

---

**Última atualização**: Março 2026
