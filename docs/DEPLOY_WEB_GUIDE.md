# 🚀 Guia de Deploy - BarberPro Web (PWA)

Guia completo para fazer deploy da versão web PWA do BarberPro.

---

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta Firebase vinculada ao projeto
- Firebase CLI instalado (`npm install -g firebase-tools`)

---

## 🔧 Configuração Inicial

### 1. Login no Firebase

```bash
firebase login
```

### 2. Verificar projeto

```bash
cd apps/web
firebase projects:list
```

Deve mostrar: `baberpro-31c40`

---

## 🚀 Deploy Rápido (Script Automático)

Execute da raiz do projeto:

```powershell
.\scripts\deploy-web.ps1
```

Este script faz:
1. Instala dependências
2. Build de produção
3. Deploy no Firebase Hosting
4. Mostra as URLs de acesso

---

## 🚀 Deploy Manual

Se preferir fazer passo a passo:

### 1. Instalar dependências

```bash
cd apps/web
npm install
```

### 2. Build de produção

```bash
npm run build
```

Gera a pasta `dist/` com os arquivos otimizados.

### 3. Deploy

```bash
firebase deploy --only hosting
```

Ou use o atalho:
```bash
npm run deploy
```

---

## 🌐 URLs após Deploy

| Ambiente | URL |
|----------|-----|
| Produção | `https://baberpro-31c40.web.app` |
| Produção | `https://baberpro-31c40.firebaseapp.com` |
| Custom* | `https://app.barberpro.com` |

*Para usar domínio próprio, configure no Firebase Console > Hosting > Add custom domain

---

## 📱 Instalação no iPhone (PWA)

Após o deploy, usuários iOS podem instalar:

### Método 1: Safari
1. Abra Safari no iPhone
2. Acesse a URL de produção
3. Toque em **Compartilhar** (botão quadrado com seta)
4. Role e toque em **Adicionar à Tela de Início**
5. Toque em **Adicionar**

### Método 2: QR Code
Gere um QR code apontando para a URL de produção.

---

## 🛠️ Configurar Sua Conta Dev

### Passo 1: Criar Conta

Execute o script interativo:

```powershell
.\scripts\setup-my-dev-account.ps1
```

Informe:
- Email (ex: `igor@barberpro.app`)
- Senha forte

### Passo 2: Obter seu UID

1. Acesse: https://console.firebase.google.com/project/baberpro-31c40/authentication/users
2. Encontre seu email na lista
3. **Copie o UID** (string longa tipo `AbC123xYz...`)

### Passo 3: Adicionar à Whitelist

Edite **ambos** os arquivos:

```typescript
// apps/mobile/src/config/dev.config.ts
// apps/web/src/config/dev.config.ts

export const AUTHORIZED_DEV_UIDS: string[] = [
  'SEU_UID_AQUI',  // igor@barberpro.app
];
```

Substitua `SEU_UID_AQUI` pelo UID copiado no passo 2.

### Passo 4: Deploy

```bash
# Deploy web
cd apps/web
npm run deploy

# Build mobile (para testar no app)
cd apps/mobile
eas build --profile preview
```

---

## 🔒 Segurança - Modo Dev

### Como funciona a proteção?

1. **UID Fixo**: Apenas UIDs explicitamente listados em `dev.config.ts` podem acessar
2. **Verificação dupla**: Checa no login e ao tentar ativar dev mode
3. **Sem bypass**: Mesmo modificando código local, sem o UID correto não funciona
4. **Logs**: Tentativas não autorizadas são logadas no console

### O que NUNCA fazer?

❌ **Nunca commit seu UID em repositórios públicos**  
❌ **Nunca compartilhe seu UID**  
❌ **Nunca use email/senha fáceis na conta dev**  
❌ **Nunca deixe o modo dev ativo em produção**

### O que SEMPRE fazer?

✅ Use senha forte (12+ caracteres, misturando letras/números/símbolos)  
✅ Mantenha 2FA ativado no Firebase  
✅ Revise logs regularmente  
✅ Remova UIDs de devs que saíram do projeto  

---

## 🔄 Atualizações

### Atualizar PWA

1. Faça alterações no código
2. Incremente a versão em `package.json` (opcional)
3. Execute deploy:

```bash
cd apps/web
npm run deploy
```

O service worker atualiza automaticamente nos clientes.

### Forçar atualização imediata

Usuários podem:
1. Fechar o app completamente
2. Reabrir

Ou desinstalar/reinstalar o PWA.

---

## 🐛 Troubleshooting

### "403 Forbidden" no deploy

```bash
firebase login --reauth
```

### App não atualiza

Limpar cache do service worker:
```javascript
// No console do navegador
navigator.serviceWorker.getRegistrations().then(r => r.forEach(r => r.unregister()))
```

### PWA não instala no iOS

- Verifique se está em HTTPS
- Verifique se manifest.json é válido: https://manifest-validator.appspot.com/
- Teste em Safari (Chrome/Firefox no iOS não suportam instalação PWA)

### Modo dev não aparece

1. Verifique se seu UID está correto em `dev.config.ts`
2. Verifique se fez deploy após adicionar UID
3. Verifique no Firebase Console se o UID do usuário logado é exatamente igual
4. Limpe cache do app e logue novamente

---

## 📊 Monitoramento

### Logs Firebase

```bash
firebase functions:log
```

### Analytics

Acesse: https://console.firebase.google.com/project/baberpro-31c40/analytics

### Performance

Teste o PWA: https://web.dev/measure/

---

## 🎯 Checklist antes de cada Deploy

- [ ] Código testado localmente
- [ ] Build sem erros (`npm run build`)
- [ ] Nenhum log/debug esquecido
- [ ] UID dev não exposto (se repo público)
- [ ] Versão atualizada (se mudança maior)
- [ ] Changelog atualizado

---

## 📚 Recursos

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Vite PWA Guide](https://vite-pwa-org.netlify.app/)
- [iOS PWA Guidelines](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)

---

## 🆘 Suporte

Problemas com deploy?
1. Verifique logs: `firebase hosting:clone`
2. Teste local: `npm run preview`
3. Verifique config: `firebase hosting:channel:deploy test`

---

**Última atualização**: Março 2026
