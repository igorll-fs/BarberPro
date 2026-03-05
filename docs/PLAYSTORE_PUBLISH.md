# 📱 Guia de Publicação na Google Play Store

Passo a passo completo para publicar o BarberPro na Google Play Store.

---

## ✅ Pré-requisitos

Antes de começar, você precisa ter:

- [ ] Conta Google (Gmail)
- [ ] **Taxa de registro: US$ 25** (pagamento único)
- [ ] App funcionando e testado
- [ ] Ícones e imagens de divulgação
- [ ] Política de privacidade (LGPD/GDPR)
- [ ] Termos de uso

---

## 1️⃣ Criar Conta de Desenvolvedor

### 1.1 Acessar Google Play Console

1. Acesse: [play.google.com/console](https://play.google.com/console)
2. Clique em **"Criar conta de desenvolvedor"**
3. Faça login com sua conta Google

### 1.2 Pagar Taxa de Registro

- Valor: **US$ 25** (aprox. R$ 125)
- Pagamento via cartão de crédito/débito
- Taxa única, válida para sempre

### 1.3 Verificação de Identidade

A Google pode solicitar:
- Documento de identidade (RG, CNH, Passaporte)
- Comprovante de residência
- Foto para verificação facial

> ⏳ Prazo: 24-48 horas para aprovação

### 1.4 Configurar Perfil

Preencha:
- **Nome do desenvolvedor**: Sua empresa ou nome
- **E-mail de contato**: profissional
- **Website**: (opcional)
- **Telefone**: para contato

---

## 2️⃣ Preparar o App

### 2.1 Configurar app.json

Edite `apps/mobile/app.json`:

```json
{
  "expo": {
    "name": "BarberPro",
    "slug": "barberpro",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#4A90D9"
    },
    "android": {
      "package": "com.seunome.barberpro",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#4A90D9"
      },
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.RECEIVE_BOOT_COMPLETED",
        "android.permission.SCHEDULE_EXACT_ALARM",
        "android.permission.POST_NOTIFICATIONS"
      ]
    },
    "extra": {
      "eas": {
        "projectId": "seu-project-id"
      }
    }
  }
}
```

### 2.2 Atualizar Config.ts (Produção)

Certifique-se de que `apps/mobile/src/config.ts` aponta para produção:

```typescript
export const ENV = {
  FIREBASE_API_KEY: 'sua-api-key-de-producao',
  FIREBASE_AUTH_DOMAIN: 'seu-projeto.firebaseapp.com',
  FIREBASE_PROJECT_ID: 'seu-projeto',
  // ... outras configs de produção
};
```

### 2.3 Gerar Keystore (Android)

O EAS gerencia automaticamente, mas se quiser próprio:

```bash
cd apps/mobile
keytool -genkey -v -keystore barberpro.keystore -alias barberpro -keyalg RSA -keysize 2048 -validity 10000
```

> ⚠️ **GUARDE ESTE ARQUIVO!** Sem ele você não pode atualizar o app.

---

## 3️⃣ Build do App

### 3.1 Configurar EAS

Edite `apps/mobile/eas.json`:

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true,
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./pc-api-key.json"
      }
    }
  }
}
```

### 3.2 Login no EAS

```bash
cd apps/mobile
npx eas login
```

### 3.3 Build de Produção

```bash
# Build AAB (Android App Bundle) - Recomendado pela Google
npx eas build --platform android --profile production

# Ou build APK para testes internos
npx eas build --platform android --profile preview
```

> ⏳ Tempo de build: 10-30 minutos

### 3.4 Download do Build

Após o build, baixe o arquivo:
- **AAB**: `build-XXXXXXXX.aab` (para Play Store)
- **APK**: `build-XXXXXXXX.apk` (para testes)

---

## 4️⃣ Criar App na Play Console

### 4.1 Criar Novo App

1. Play Console > **Criar app**
2. Preencha:
   - **Nome do app**: BarberPro
   - **Idioma padrão**: Português (Brasil)
   - **Tipo de app**: App
   - **Gratuito ou pago**: Gratuito
3. Aceite as declarações
4. Criar app

### 4.2 Painel Principal

Você verá estas seções:
- 📊 Visão geral
- 🚀 Produção
- 🧪 Teste
- 📈 Estatísticas
- 💰 Monetização
- ⚙️ Configuração do app

---

## 5️⃣ Configurar App

### 5.1 Configuração do App > Informações do app

**Detalhes do app:**
- Nome: `BarberPro`
- Descrição curta: (máx 80 caracteres)
```
Agende horários na sua barbearia favorita. Rápido, fácil e prático.
```

- Descrição completa: (máx 4000 caracteres)
```
💈 BarberPro - Sistema Completo para Barbearias

O BarberPro conecta clientes e barbearias de forma simples e eficiente.

✂️ PARA CLIENTES:
• Agende horários com poucos toques
• Encontre as melhores barbearias
• Veja preços e serviços
• Avalie seu atendimento
• Receba notificações de lembrete
• Chat direto com a barbearia

🏪 PARA BARBEARIAS:
• Gerencie sua agenda
• Controle de serviços e preços
• Cadastre sua equipe
• Receba avaliações
• Comunique-se com clientes
• Acompanhe métricas de crescimento

✨ FUNCIONALIDADES:
• Agendamento 24h por dia
• Confirmação automática
• Notificações em tempo real
• Sistema de avaliações
• Promoções exclusivas
• Histórico de cortes

Baixe agora e simplifique sua vida!
```

### 5.2 Gráficos

**Ícone do app:**
- Formato: PNG ou JPEG
- Tamanho: 512 x 512 px
- Tamanho máximo: 1 MB

**Imagens de recurso (Feature Graphic):**
- Tamanho: 1024 x 500 px
- Usada na vitrine do app

**Capturas de tela:**

Mínimo 2, máximo 8 por tipo:
- **Celular**: 16:9 ou 9:16 (1080x1920)
- **Tablet 7"**: 16:9 ou 9:16
- **Tablet 10"**: 16:9 ou 9:16

Dicas:
- Mostre telas principais (Home, Agendamento, Perfil)
- Use o mesmo dispositivo em todas
- Não inclua transparência
- Evite bordas de dispositivo

**Vídeo promocional:** (opcional)
- YouTube URL
- Mostre o app em uso

### 5.3 Categorização

- **Tipo de aplicativo**: Aplicativo
- **Categoria**: Estilo de vida / Beleza
- **Tags**: agendamento, barbearia, beleza, estilo
- **E-mail de contato**: seu-email@empresa.com
- **Telefone de contato**: (opcional)
- **Website**: https://seusite.com

---

## 6️⃣ Políticas e Conformidade

### 6.1 Política de Privacidade

**Obrigatório!** Crie uma página com:

```
POLÍTICA DE PRIVACIDADE - BARBERPRO

Última atualização: [DATA]

1. DADOS COLETADOS
• Nome e telefone (para agendamentos)
• E-mail (opcional)
• Localização (apenas busca, se permitido)
• Fotos de perfil (opcional)

2. USO DOS DADOS
• Realizar agendamentos
• Enviar notificações de lembrete
• Comunicação entre cliente e barbearia
• Melhorias no serviço

3. COMPARTILHAMENTO
• Dados compartilhados apenas entre cliente e barbearia escolhida
• Não vendemos dados para terceiros

4. DIREITOS DO USUÁRIO (LGPD)
• Acesso aos dados
• Correção de dados
• Exclusão de conta
• Exportação de dados

5. SEGURANÇA
• Criptografia em trânsito (HTTPS)
• Dados armazenados no Firebase (Google Cloud)
• Acesso restrito por autenticação

6. CONTATO
DPO: [seu-email@empresa.com]
```

Publique em: `https://seusite.com/privacidade`

### 6.2 Termos de Uso

```
TERMOS DE USO - BARBERPRO

1. ACEITAÇÃO
Ao usar o BarberPro, você aceita estes termos.

2. CADASTRO
• Informações verdadeiras
• Manter dados atualizados
• Responsável pela segurança da conta

3. AGENDAMENTOS
• Comparecer no horário marcado
• Cancelar com antecedência
• Respeitar políticas da barbearia

4. CONDUTA
• Sem spam ou abuso
• Sem conteúdo ofensivo
• Sem falsificação de identidade

5. LIMITAÇÃO DE RESPONSABILIDADE
• App é plataforma de conexão
• Qualidade do serviço é responsabilidade da barbearia
• Indisponibilidades técnicas podem ocorrer

6. ALTERAÇÕES
Reservamo-nos o direito de alterar estes termos.

Contato: [seu-email@empresa.com]
```

Publique em: `https://seusite.com/termos`

### 6.3 Classificação de Conteúdo

1. Play Console > **Configuração do app** > **Classificação de conteúdo**
2. Clique em **"Iniciar questionário"**
3. Responda:
   - Violência: Não
   - Sexo/Nudez: Não
   - Linguagem: Não
   - Drogas: Não
   - Apostas: Não
   - Medo: Não
   - Compras no app: Sim (se tiver pagamentos)
   - Interação de usuários: Sim (chat)
   - Compartilhamento de localização: Opcional
   - Idade mínima: Livre (ou 12+ se tiver chat)

### 6.4 Declarações de Permissões

Para cada permissão solicitada, explique o motivo:

| Permissão | Motivo |
|-----------|--------|
| Câmera | Tirar foto de perfil |
| Armazenamento | Salvar imagens do chat |
| Localização | Buscar barbearias próximas |
| Notificações | Lembretes de agendamento |

---

## 7️⃣ Testes

### 7.1 Teste Interno

1. Play Console > **Teste** > **Teste interno**
2. Criar nova versão
3. Upload do AAB
4. Adicionar testers (e-mail dos testadores)
5. Salvar

> ✅ Recomendado: Teste com 5-10 pessoas antes do lançamento

### 7.2 Teste Fechado (Opcional)

- Teste com grupo maior (100+ pessoas)
- Requer convite
- Ótimo para feedback antes do lançamento público

### 7.3 Teste Aberto (Opcional)

- Qualquer pessoa pode participar
- App aparece na Play Store com badge "Beta"
- Limite de usuários configurável

---

## 8️⃣ Lançamento em Produção

### 8.1 Criar Versão de Produção

1. Play Console > **Produção** > **Criar nova versão**
2. Upload do AAB
3. Preencher **Notas de lançamento**:

```
Versão 1.0.0 - Lançamento inicial

✨ Funcionalidades:
• Agendamento de serviços
• Chat com barbearia
• Sistema de avaliações
• Notificações push
• Perfil do cliente
• Dashboard para donos

🚀 Pronto para uso!
```

4. Revisar e salvar

### 8.2 Revisão do Google

- Status: **"Em análise"**
- Prazo: 1-7 dias úteis
- Podem solicitar esclarecimentos
- Verificam: conteúdo, segurança, conformidade

### 8.3 Lançamento

Após aprovação:
- **Lançamento manual**: Você ativa quando quiser
- **Lançamento gradual**: 20% → 50% → 100% dos usuários
- **Lançamento imediato**: Disponível para todos

---

## 9️⃣ Pós-Lançamento

### 9.1 Monitorar

Play Console > **Estatísticas**:
- Instalações ativas
- Avaliações e comentários
- Crash reports (ANR)
- Retenção de usuários

### 9.2 Responder Avaliações

- Responda TODAS as avaliações (especialmente negativas)
- Seja educado e profissional
- Ofereça soluções

### 9.3 Atualizações

Para atualizar o app:

1. Incremente `versionCode` no app.json
2. Faça novo build
3. Upload na Play Console
4. Nova revisão (geralmente mais rápida)

---

## 📋 Checklist Final

Antes de publicar:

```
□ Conta de desenvolvedor criada (US$ 25 pago)
□ App testado em múltiplos dispositivos
□ app.json configurado corretamente
□ Ícone 512x512 px
□ Feature graphic 1024x500 px
□ 4+ capturas de tela
□ Descrição curta (< 80 chars)
□ Descrição completa (< 4000 chars)
□ Política de privacidade publicada
□ Termos de uso publicados
□ Classificação de conteúdo preenchida
□ Permissões justificadas
□ Build AAB gerado com sucesso
□ Teste interno realizado
□ Notas de lançamento escritas
```

---

## 💰 Custos

| Item | Custo |
|------|-------|
| Conta Google Play | US$ 25 (único) |
| Servidor Firebase | Gratuito (Spark) ou US$ 25+/mês (Blaze) |
| Expo EAS Build | Gratuito ou US$ 29+/mês |
| Taxa Google (pagamentos) | 30% das transações |
| **Total inicial** | **~US$ 25-50** |

---

## 🆘 Troubleshooting

### "App rejeitado: Política de privacidade"
- Verifique se URL está acessível
- Confirme que cobre todos os dados coletados

### "Permissão desnecessária"
- Remova permissões não essenciais do app.json
- Explique claramente o uso de cada permissão

### "Crash report"
- Teste o app em diferentes Android versions
- Corrija crashes antes de publicar

### "Conteúdo enganoso"
- Screenshots devem ser do app real
- Não exagere nas funcionalidades na descrição

---

## 📚 Recursos

- [Documentação Play Console](https://support.google.com/googleplay/android-developer)
- [Diretrizes de Qualidade](https://developer.android.com/docs/quality-guidelines)
- [Políticas do Google Play](https://play.google.com/about/developer-content-policy/)
- [Expo Build Documentation](https://docs.expo.dev/build/introduction/)

---

**Boa sorte com o lançamento! 🚀**
