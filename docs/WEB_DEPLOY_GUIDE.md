# 🌐 Guia de Deploy Web - Firebase Hosting

Guia completo para publicar o BarberPro Web no Firebase Hosting.

---

## 📋 Pré-requisitos

1. **Firebase CLI instalado** - `npm install -g firebase-tools`
2. **Login no Firebase** - `firebase login`
3. **Projeto configurado** - Firebase já configurado
4. **Build da aplicação** - `npm run build` executado

---

## 🚀 Deploy Rápido (Script Automático)

Execute o script de deploy:

```bash
./scripts/deploy.sh
```

Ou manualmente:

```bash
cd firebase
firebase deploy
```

---

## 📖 Passo a Passo Detalhado

### 1. Verificar Configuração Firebase

O `firebase/firebase.json` deve estar assim:

```json
{
  "functions": {
    "source": "functions"
  },
  "hosting": {
    "public": "../apps/public-web/dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "headers": [
      {
        "source": "/assets/**",
        "headers": [
          { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
        ]
      },
      {
        "source": "/sw.js",
        "headers": [
          { "key": "Cache-Control", "value": "no-cache" }
        ]
      },
      {
        "source": "/manifest.webmanifest",
        "headers": [
          { "key": "Cache-Control", "value": "public, max-age=3600" }
        ]
      },
      {
        "source": "**",
        "headers": [
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "X-Frame-Options", "value": "DENY" },
          { "key": "X-XSS-Protection", "value": "1; mode=block" },
          { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
        ]
      }
    ],
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

---

### 2. Build do Web App

```bash
cd apps/public-web

# Instalar dependências (se necessário)
npm install

# Build de produção
npm run build
```

O build será gerado em: `apps/public-web/dist/`

---

### 3. Deploy para Firebase Hosting

```bash
cd firebase

# Deploy apenas do hosting
firebase deploy --only hosting

# Deploy de tudo (hosting + functions + rules)
firebase deploy
```

---

### 4. Verificar Deploy

Após o deploy, o Firebase mostrará a URL:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/baberpro-31c40/overview
Hosting URL: https://baberpro-31c40.web.app
```

Acesse a URL para verificar se está funcionando.

---

## 🔧 Deploy de Outros Serviços

### Cloud Functions

```bash
cd firebase
firebase deploy --only functions
```

### Firestore Rules

```bash
cd firebase
firebase deploy --only firestore:rules
```

### Storage Rules

```bash
cd firebase
firebase deploy --only storage
```

---

## 🌐 Domínio Personalizado

Para usar um domínio próprio (ex: app.barberpro.com.br):

1. Acesse: Firebase Console > Hosting > Domains
2. Clique em "Add custom domain"
3. Siga as instruções para configurar DNS
4. Aguarde propagação (até 24h)

---

## 🔄 Deploy Contínuo (GitHub Actions)

Crie `.github/workflows/deploy-web.yml`:

```yaml
name: Deploy Web

on:
  push:
    branches: [ main ]
    paths:
      - 'apps/public-web/**'
      - 'firebase/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Dependencies
        run: |
          cd apps/public-web
          npm ci
          
      - name: Build
        run: |
          cd apps/public-web
          npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only hosting
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

---

## 🐛 Troubleshooting

### Erro: "No public directory"

Verifique se o build foi executado:

```bash
cd apps/public-web
npm run build
```

### Erro: "firebase.json not found"

Execute do diretório correto:

```bash
cd firebase
firebase deploy
```

### Erro: "Permission denied"

Faça login novamente:

```bash
firebase login --reauth
```

### Site não atualiza

Limpe o cache do navegador ou force refresh (Ctrl+F5 / Cmd+Shift+R).

---

## 📊 Monitoramento

Acompanhe o tráfego em:
https://console.firebase.google.com/project/baberpro-31c40/hosting

Métricas disponíveis:
- Requisições por dia
- Dados transferidos
- Erros 404
- Performance

---

## ✅ Checklist Pré-Deploy

- [ ] Build executado sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] Testes passando
- [ ] Firebase CLI logado
- [ ] Código commitado no Git

---

## 🚀 Comandos Rápidos

```bash
# Build e deploy completo
cd apps/public-web && npm run build && cd ../../firebase && firebase deploy --only hosting

# Deploy functions + hosting
firebase deploy

# Deploy apenas hosting
firebase deploy --only hosting

# Ver logs
firebase hosting:channel:open

# Preview antes de deploy
firebase hosting:clone source:live target:preview
```

---

**Próximo passo**: Configure o Stripe para pagamentos! 💳
