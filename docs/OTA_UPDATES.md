# 🔄 Sistema de Auto-Atualização OTA (Over-the-Air)

O BarberPro possui um sistema completo de atualização que permite:
- Atualizações nativas (APK/IPA) via download
- Atualizações JavaScript OTA via Expo Updates
- Gerenciamento de versões pelo admin

---

## 📱 Como Funciona

### 1. Atualização Nativa (APK/IPA)
Quando há uma nova versão do app:
1. Usuário abre o app
2. Sistema verifica no Firestore a versão mais recente
3. Se houver atualização, mostra diálogo com release notes
4. Usuário clica em "Atualizar" e é redirecionado para o link de download
5. Após instalar, usuário volta ao app atualizado

### 2. Atualização OTA (JavaScript)
Para pequenas correções (hotfixes):
1. Expo Updates verifica automaticamente ao iniciar
2. Baixa o novo bundle JavaScript em background
3. Mostra diálogo para reiniciar e aplicar
4. App reinicia com o código atualizado (sem reinstalar APK)

---

## 🎯 Tipos de Atualização

| Tipo | Descrição | Tempo | Exemplo |
|------|-----------|-------|---------|
| **Opcional** | Usuário pode ignorar | ~5 min | Nova funcionalidade |
| **Recomendada** | Avisa mas não força | ~3 min | Melhorias de UI |
| **Obrigatória** | Não permite usar sem atualizar | ~5 min | Correção crítica |
| **OTA** | Silenciosa, reinicia app | ~30s | Hotfix JavaScript |

---

## 🚀 Fluxo de Publicação de Atualização

### Para Desenvolvedores:

#### Opção 1: Via Tela Admin (Recomendada)
1. Acesse o app como admin
2. Vá em: **Menu → Gerenciar Versões**
3. Preencha o formulário:
   - **Versão**: 1.2.3 (formato semântico)
   - **Build Number**: 42
   - **Plataforma**: Android / iOS / Todas
   - **URL**: Link direto para o APK/IPA
   - **Versão Mínima**: Versão abaixo disso será forçada a atualizar
   - **Forçar**: Se marcado, atualização é obrigatória
   - **Release Notes**: O que mudou
4. Clique em **Publicar Versão**

#### Opção 2: Via Firestore (Manual)
```javascript
// Coleção: app_versions
db.collection('app_versions').add({
  version: '1.2.3',
  buildNumber: '42',
  platform: 'android', // 'android' | 'ios' | 'all'
  updateUrl: 'https://seuservidor.com/barberpro-1.2.3.apk',
  minVersion: '1.0.0',
  forceUpdate: false,
  releaseNotes: '- Nova funcionalidade X\n- Correção do bug Y',
  createdAt: new Date()
});
```

---

## ⚙️ Configuração Técnica

### Arquivos Criados:
- `src/services/updates.ts` - Serviço de atualização
- `src/hooks/useUpdates.ts` - Hook React
- `src/screens/owner/VersionManagerScreen.tsx` - Tela admin

### Configuração Expo Updates:
```json
// app.json
{
  "updates": {
    "enabled": true,
    "checkAutomatically": "ON_LOAD",
    "fallbackToCacheTimeout": 0
  },
  "runtimeVersion": {
    "policy": "sdkVersion"
  }
}
```

### Verificação Automática:
O hook `useUpdates` verifica:
1. Ao iniciar o app (após 2 segundos)
2. Quando o app volta para primeiro plano (a cada 1 hora)

---

## 📦 Hospedando o APK para Download

### Opção 1: Firebase Storage (Recomendada)
```bash
# Faça upload do APK
firebase storage:upload app-release.apk

# Obtenha o link público
# Use esse link no campo "URL de Download"
```

### Opção 2: GitHub Releases
1. Crie uma Release no GitHub
2. Anexe o APK
3. Copie o link direto

### Opção 3: Servidor Próprio
```bash
# Envie para seu servidor
scp app-release.apk usuario@servidor.com:/var/www/downloads/

# URL: https://seuservidor.com/downloads/barberpro-1.2.3.apk
```

---

## 🔄 Atualização OTA via Expo

Para correções rápidas sem novo APK:

```bash
# 1. Faça as correções no código

# 2. Publique OTA update
npx eas update --branch preview --message "Correção bug X"

# 3. Usuários recebem automaticamente
# 4. App reinicia com nova versão
```

---

## 📊 Estrutura Firestore

```
app_versions/
  ├── {docId}/
  │   ├── version: string (ex: "1.2.3")
  │   ├── buildNumber: string (ex: "42")
  │   ├── platform: "android" | "ios" | "all"
  │   ├── updateUrl: string (link APK/IPA)
  │   ├── minVersion: string (versão mínima aceita)
  │   ├── forceUpdate: boolean
  │   ├── releaseNotes: string
  │   └── createdAt: timestamp
```

---

## 🎨 Personalização

### Mensagens de Atualização:
Editar em `src/services/updates.ts`:
```typescript
const title = forceUpdate 
  ? 'Atualização Necessária' 
  : 'Nova Versão Disponível';
```

### Frequência de Verificação:
Editar em `src/hooks/useUpdates.ts`:
```typescript
// A cada 1 hora (em milissegundos)
const INTERVAL = 60 * 60 * 1000;
```

---

## 🆘 Solução de Problemas

### "Não está verificando atualizações"
- Verifique se `app_versions` existe no Firestore
- Verifique as regras de segurança (deve permitir read)

### "Link de download não funciona"
- Certifique-se de que o link é direto (termina em .apk)
- Teste o link no navegador antes
- Use HTTPS (obrigatório para Android 9+)

### "OTA não funciona"
- Verifique configuração em `app.json`
- Execute: `npx expo prebuild`
- Certifique-se de que `expo-updates` está instalado

---

## ✅ Checklist para Publicar Atualização

- [ ] Incrementar `version` em `app.json`
- [ ] Incrementar `android.versionCode` (para Android)
- [ ] Gerar novo APK/IPA
- [ ] Fazer upload para servidor
- [ ] Acessar tela "Gerenciar Versões"
- [ ] Preencher formulário com nova versão
- [ ] Publicar
- [ ] Testar em dispositivo

---

## 🎉 Benefícios

✅ **Sem lojas de apps** - Distribua diretamente
✅ **Rápido** - Usuários recebem em segundos
✅ **Flexível** - Controle total sobre versões
✅ **Econômico** - Sem taxas de lojas
✅ **Seguro** - Verificação automática de versões

---

## 📞 Suporte

Dúvidas sobre o sistema de atualização?
- Verifique os logs em: `console.log` do serviço
- Teste a URL de download no navegador
- Verifique permissões do Firestore
