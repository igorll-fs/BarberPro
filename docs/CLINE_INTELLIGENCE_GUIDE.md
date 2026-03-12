# 🧠 Guia Completo: Deixando o Cline Mais Inteligente Globalmente

> **Objetivo**: Maximizar a inteligência, contexto e eficiência do agente Cline em projetos de desenvolvimento.

---

## 📋 Sumário

1. [Configurações Globais do VS Code](#1-configurações-globais-do-vs-code)
2. [Custom Instructions](#2-custom-instructions)
3. [Estrutura de Contexto](#3-estrutura-de-contexto)
4. [MCP Servers](#4-mcp-servers)
5. [Memory Bank](#5-memory-bank)
6. [Skills e Prompts](#6-skills-e-prompts)
7. [Configurações do Modelo](#7-configurações-do-modelo)
8. [Melhores Práticas](#8-melhores-práticas)

---

## 1. Configurações Globais do VS Code

### 📁 `.vscode/settings.json`

```json
{
  // 🧠 PARA O AGENTE ENTENDER MELHOR
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always",
    "source.organizeImports": "always",
    "source.removeUnusedImports": "always"
  },
  
  // 🎯 VISIBILIDADE DE ERROS (Crucial!)
  "errorLens.enabled": true,
  "errorLens.delay": 0,
  "errorLens.gutterIconsEnabled": true,
  "errorLens.messageTemplate": "❌ {message}",
  
  // 📝 LIMPEZA AUTOMÁTICA
  "editor.trimAutoWhitespace": true,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.trimFinalNewlines": true,
  
  // 🎨 PADRONIZAÇÃO
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.detectIndentation": false,
  
  // 🔍 BUSCA INTELIGENTE
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true,
    "**/coverage": true
  },
  
  // 📁 EXPLORADOR ORGANIZADO
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.patterns": {
    "*.ts": "${capture}.test.ts, ${capture}.spec.ts, ${capture}.type.ts",
    "*.tsx": "${capture}.test.tsx, ${capture}.stories.tsx, ${capture}.module.css",
    "*.js": "${capture}.test.js, ${capture}.config.js",
    "package.json": "package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb",
    "README.md": "CONTRIBUTING.md, LICENSE, CHANGELOG.md"
  },
  
  // 🤖 PARA O CLINE/AGENTE
  "cline.model": "openrouter/anthropic/claude-3.7-sonnet",
  "cline.terminalShellIntegration": true,
  "cline.autoApprove": false,
  
  // 💡 INTELLISENSE MAXIMIZADO
  "typescript.suggest.autoImports": true,
  "javascript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

### 🎯 Por que essas configurações ajudam:

| Configuração | Benefício para o Agente |
|-------------|------------------------|
| `errorLens.enabled` | Agente vê erros em tempo real |
| `editor.formatOnSave` | Código sempre padronizado |
| `explorer.fileNesting` | Estrutura mais clara |
| `search.exclude` | Buscas mais relevantes |
| `typescript.suggest.autoImports` | Sugestões inteligentes |

---

## 2. Custom Instructions

### 📁 `.clinerules` (na raiz do projeto)

```markdown
# 🎯 REGRAS GLOBAIS DO CLINE

## Identidade
Você é um especialista em desenvolvimento de software com foco em:
- React Native / Expo
- TypeScript
- Firebase
- Node.js
- Arquitetura limpa

## Comunicação
- Responda SEMPRE em português brasileiro
- Seja direto e objetivo
- Explique o "porquê" das decisões
- Documente mudanças importantes

## Código
- Use TypeScript strict mode
- Siga princípios SOLID
- Prefira composição sobre herança
- Escreva testes para lógica crítica
- Use nomes descritivos em inglês
- Comente em português quando necessário

## Arquitetura
- Mantenha componentes pequenos (< 200 linhas)
- Separe lógica de apresentação
- Use hooks personalizados
- Implemente error boundaries
- Valide inputs sempre

## Segurança
- Nunca exponha credenciais
- Valide todas as entradas
- Use HTTPS para APIs
- Implemente rate limiting
- Faça sanitização de dados

## Performance
- Evite re-renders desnecessários
- Use memo/useMemo quando apropriado
- Implemente lazy loading
- Otimize imagens
- Cache de dados frequentes

## Testes
- Jest para testes unitários
- Testing Library para componentes
- Mock externals dependencies
- 80%+ cobertura de código crítico
```

### 📁 `.clinerules` Global (User Home)

**Localização**: `~/.clinerules` ou `%USERPROFILE%\.clinerules`

```markdown
# 🌍 REGRAS GLOBAIS DO USUÁRIO

## Preferências Pessoais
- Tema escuro preferido
- Editor: VS Code
- Terminal: PowerShell/CMD
- Formatação: Prettier

## Convenções de Código
- Indentação: 2 espaços
- Aspas: simples para JS/TS
- Ponto e vírgula: sempre
- Trailing comma: ES5

## Fluxo de Trabalho
- Sempre criar branch para features
- Commits semânticos (conventional commits)
- PRs com descrição completa
- Code review antes de merge

## Proibições
- NUNCA apagar node_modules manualmente
- NUNCA commitar .env files
- NUNCA forçar push para main
- NUNCA ignorar erros de TypeScript
```

---

## 3. Estrutura de Contexto

### 📁 `.context/README.md`

```markdown
# 📚 Contexto do Projeto

## Visão Geral
BARBERPRO é um aplicativo de agendamento para barbearias.

## Stack Principal
- **Frontend Mobile**: React Native + Expo
- **Frontend Web**: React + Vite
- **Backend**: Firebase (Firestore, Functions, Auth)
- **Linguagem**: TypeScript

## Arquitetura
```
apps/
├── mobile/     # App React Native
├── web/        # Dashboard web
└── public-web/ # Landing page

firebase/
├── functions/  # Cloud Functions
├── storage.rules
└── firestore.rules
```

## Usuários
1. **Cliente**: Agenda cortes, vê histórico
2. **Barbeiro**: Gerencia agenda, serviços
3. **Dono**: Dashboard, relatórios, financeiro

## Fluxos Principais
1. Autenticação → Firebase Auth
2. Agendamento → Firestore
3. Pagamento → Stripe
4. Notificações → FCM

## Integrações
- Firebase Auth
- Cloud Firestore
- Cloud Storage
- Cloud Functions
- Firebase Cloud Messaging
- Google Maps API
- Stripe

## Variáveis de Ambiente Necessárias
- FIREBASE_API_KEY
- FIREBASE_PROJECT_ID
- GOOGLE_MAPS_KEY
- STRIPE_SECRET_KEY
```

### 📁 `.context/ARCHITECTURE.md`

```markdown
# 🏗️ Arquitetura do Sistema

## Diagrama de Alto Nível

```
┌─────────────────┐     ┌─────────────────┐
│   Mobile App    │     │    Web App      │
│  (React Native) │     │     (React)     │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
              ┌──────▼──────┐
              │   Firebase  │
              │   Backend   │
              └──────┬──────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────▼────┐ ┌────▼────┐ ┌────▼────┐
    │  Auth   │ │FireStore│ │Functions│
    └─────────┘ └─────────┘ └─────────┘
```

## Padrões Utilizados
- **Repository Pattern**: Abstração de dados
- **Observer Pattern**: Estado reativo
- **Factory Pattern**: Criação de componentes
- **Strategy Pattern**: Diferentes tipos de usuário

## Decisões Arquiteturais
1. **Monorepo**: Facilita compartilhamento de código
2. **TypeScript**: Type safety em todo projeto
3. **Firebase**: Backend as a Service para velocidade
4. **Expo**: Desenvolvimento mobile simplificado
```

---

## 4. MCP Servers

### 📁 Configuração MCP

MCP (Model Context Protocol) servers estendem as capacidades do Cline.

#### Servidores Recomendados:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-token"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "your-connection"
      }
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "your-key"
      }
    }
  }
}
```

#### Benefícios dos MCP Servers:

| Server | Capacidade Adicionada |
|--------|----------------------|
| `filesystem` | Acesso direto ao sistema de arquivos |
| `github` | Operações com GitHub (issues, PRs) |
| `postgres` | Consultas diretas ao banco |
| `brave-search` | Busca na web em tempo real |

---

## 5. Memory Bank

### 📁 `.cline/memory-bank.md`

```markdown
# 🧠 Memory Bank - Contexto Persistente

## Preferências do Usuário
- [ ] Sempre usar TypeScript
- [ ] Prefere componentes funcionais
- [ ] Gosta de explicações detalhadas
- [ ] Respostas em português

## Conhecimento do Projeto
### Estrutura Atual
```
BARBERPRO/
├── apps/mobile/     # React Native + Expo
├── apps/web/        # React + Vite
├── firebase/        # Backend
└── docs/            # Documentação
```

### Decisões Tomadas
1. 2024-01-15: Escolhido Firebase como backend
2. 2024-01-20: Adotado monorepo structure
3. 2024-02-01: Implementado autenticação

### Padrões Identificados
- Hooks personalizados para lógica
- Context API para estado global
- Firestore para persistência

## Lições Aprendidas
1. Expo simplifica muito o desenvolvimento mobile
2. TypeScript evita muitos bugs
3. Firebase Functions são essenciais para lógica server-side

## Próximos Passos
1. Implementar sistema de pagamentos
2. Adicionar notificações push
3. Otimizar performance
```

---

## 6. Skills e Prompts

### 📁 `.cline/skills/` (Estrutura)

```
.cline/
├── skills/
│   ├── react-native.md
│   ├── firebase.md
│   ├── testing.md
│   └── architecture.md
└── prompts/
    ├── debug.md
    ├── review.md
    └── feature.md
```

### 📁 `.cline/skills/react-native.md`

```markdown
# 🎯 Skill: React Native Development

## Setup Inicial
- Sempre usar Expo para novos projetos
- Configurar TypeScript strict mode
- Implementar navegação com React Navigation

## Componentes
- Usar componentes funcionais
- Hooks para estado e efeitos
- StyleSheet para estilos (não inline)

## Performance
- Usar FlatList para listas longas
- Memoizar componentes pesados
- Otimizar imagens com expo-image

## Debugging
- React DevTools para componentes
- Flipper para debugging avançado
- Console.log em desenvolvimento

## Exemplos de Código

### Hook Personalizado
```typescript
import { useState, useEffect } from 'react';

export function useAsyncData<T>(fetchFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchFn()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
```

### Componente Padrão
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  onPress?: () => void;
}

export const MyComponent: React.FC<Props> = ({ title, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```
```

### 📁 `.cline/prompts/debug.md`

```markdown
# 🔍 Prompt: Debugging

## Quando usar
Quando encontrar bugs ou erros no código.

## Estrutura do Prompt
1. **Contexto**: O que estava tentando fazer?
2. **Erro**: Qual é a mensagem de erro exata?
3. **Código**: Mostre o código relevante
4. **Esperado**: O que deveria acontecer?
5. **Atual**: O que está acontecendo?

## Exemplo
```
Estou com problema no componente de login.

**Erro**: "Cannot read property 'user' of undefined"

**Código**:
```typescript
const { user } = useAuth();
```

**Esperado**: Redirecionar para dashboard após login
**Atual**: App crasha ao tentar acessar user

**Contexto**: Firebase Auth, React Native
```

## Abordagem de Debug
1. Verificar se dados existem antes de acessar
2. Adicionar logs para tracing
3. Verificar dependências do useEffect
4. Conferir tipos TypeScript
5. Testar em ambiente isolado
```

---

## 7. Configurações do Modelo

### 📁 `.vscode/settings.json` - Cline Específico

```json
{
  // 🤖 Configurações do Cline
  "cline.model": "openrouter/anthropic/claude-3.7-sonnet",
  "cline.terminalShellIntegration": true,
  "cline.autoApprove": false,
  
  // Alternativas de modelo
  // "cline.model": "anthropic/claude-3.5-sonnet"
  // "cline.model": "openai/gpt-4-turbo"
  // "cline.model": "openrouter/anthropic/claude-3.7-sonnet"
  
  // Temperatura e comportamento
  "cline.temperature": 0.7,
  "cline.maxTokens": 8192,
  "cline.contextWindow": 200000,
  
  // Comportamento
  "cline.alwaysAllow": [
    "readFile",
    "listFiles",
    "searchFiles"
  ],
  
  "cline.requireApproval": [
    "writeFile",
    "executeCommand",
    "deleteFile"
  ]
}
```

### 🎯 Modelos Recomendados por Tarefa

| Tarefa | Modelo Recomendado | Motivo |
|--------|-------------------|--------|
| Código complexo | Claude 3.7 Sonnet | Melhor raciocínio |
| Debugging | Claude 3.5 Sonnet | Boa análise |
| Refatoração | Claude 3.7 Sonnet | Entende contexto |
| Documentação | GPT-4 Turbo | Bom texto |
| Testes | Claude 3.5 Sonnet | Lógica clara |

---

## 8. Melhores Práticas

### ✅ DO (Fazer)

1. **Sempre forneça contexto**
   ```markdown
   # Contexto
   Estou trabalhando no módulo de autenticação do BARBERPRO.
   Preciso adicionar login com Google.
   ```

2. **Seja específico nas requisições**
   ```markdown
   Crie um hook useAuth com:
   - Login com email/senha
   - Login com Google
   - Logout
   - Estado de loading
   - Tratamento de erros
   ```

3. **Use arquivos de contexto**
   - Mantenha `.context/README.md` atualizado
   - Documente decisões em `ARCHITECTURE.md`
   - Atualize `memory-bank.md` regularmente

4. **Aproveite o Error Lens**
   - Deixe visível para o agente ver
   - Copie mensagens de erro completas
   - Inclua stack traces

5. **Documente preferências**
   - Use `.clinerules` para regras
   - Mantenha consistência entre projetos
   - Versione configurações

### ❌ DON'T (Evitar)

1. **Não seja vago**
   ```markdown
   # Ruim
   "Arruma o código"
   
   # Bom
   "Refatora o componente LoginScreen para usar hooks personalizados"
   ```

2. **Não ignore erros**
   - Sempre reporte erros ao agente
   - Inclua contexto do erro
   - Mostre o que tentou

3. **Não pule contexto**
   - Explique o objetivo
   - Mencione arquivos relacionados
   - Descreva restrições

4. **Não misture tarefas**
   - Uma coisa por vez
   - Complete antes de iniciar outra
   - Documente progresso

---

## 📊 Checklist de Inteligência

Use este checklist para verificar se está maximizando a inteligência do Cline:

- [ ] `.vscode/settings.json` configurado
- [ ] `.clinerules` na raiz do projeto
- [ ] `.clinerules` global no home
- [ ] `.context/README.md` atualizado
- [ ] `.context/ARCHITECTURE.md` documentado
- [ ] `.cline/memory-bank.md` mantido
- [ ] Skills organizadas em `.cline/skills/`
- [ ] Prompts templates em `.cline/prompts/`
- [ ] MCP Servers configurados (se necessário)
- [ ] Modelo adequado para a tarefa
- [ ] Error Lens ativado
- [ ] IntelliSense maximizado

---

## 🚀 Resultado Esperado

Seguindo este guia, o Cline será capaz de:

1. **Entender melhor o contexto** do projeto
2. **Seguir padrões consistentes** de código
3. **Evitar erros comuns** através de regras
4. **Produzir código mais limpo** e padronizado
5. **Aprender com decisões anteriores** via memory bank
6. **Accessar recursos externos** via MCP servers
7. **Comunicar de forma clara** em português

---

## 📚 Referências

- [Cline Documentation](https://github.com/cline/cline)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Anthropic Claude](https://www.anthropic.com/claude)
- [VS Code Settings](https://code.visualstudio.com/docs/getstarted/settings)

---

*Última atualização: 2025-03-08*