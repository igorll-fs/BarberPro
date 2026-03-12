# 💰 Estratégias para Economizar Tokens no Cline

> **Objetivo**: Maximizar eficiência e reduzir consumo de tokens mantendo qualidade das respostas.

---

## 🎯 Resumo Rápido

| Estratégia | Economia | Implementação |
|-----------|----------|---------------|
| `.clinerules` enxuto | 20-30% | ✅ Aplicado |
| Contexto seletivo | 30-50% | ✅ Aplicado |
| Prompt engineering | 20-40% | Manual |
| Filtros de busca | 10-20% | ✅ Aplicado |

---

## 1. 📁 .clinerules Enxuto (Aplicado ✅)

O arquivo `.clinerules` foi otimizado para ser conciso:

```markdown
# 🎯 REGRAS GLOBAIS DO CLINE

## Identidade
Especialista em: React Native/Expo, TypeScript, Firebase, Node.js

## Comunicação
- Português brasileiro
- Direto e objetivo
- Explique o "porquê"

## Código
- TypeScript strict mode
- SOLID
- Componentes < 200 linhas
- Nomes em inglês

## Proibições
- NÃO commitar .env
- NÃO ignorar erros TS
- NÃO expor chaves API
```

**Economia**: ~25% menos tokens por requisição.

---

## 2. 🔍 Contexto Seletivo (Aplicado ✅)

### Estrutura de Pastas Otimizada

```
.context/
├── README.md        # Contexto geral (ler primeiro)
├── ARCHITECTURE.md  # Apenas quando arquitetura
├── API.md           # Apenas quando API
└── DECISIONS.md     # Apenas quando decisões
```

### Regra de Contexto
- **Não** incluir node_modules
- **Não** incluir arquivos de build
- **Não** incluir arquivos de lock

**Configuração aplicada no `.vscode/settings.json`**:
```json
{
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true,
    "**/coverage": true,
    "**/*.lock": true,
    "**/build": true
  }
}
```

---

## 3. 📝 Prompt Engineering (Manual)

### Estrutura de Prompt Eficiente

```markdown
## Contexto (1-2 frases)
Trabalhando no módulo de agendamento do BARBERPRO.

## Objetivo
Criar hook useBooking com:
- Listar horários disponíveis
- Criar agendamento
- Cancelar agendamento

## Restrições
- Usar Firebase Firestore
- TypeScript strict
- Sem bibliotecas externas
```

### ❌ Evitar (Desperdício)

```markdown
# Ruim - Muito verboso
Olá, como vai? Espero que esteja bem. Estou trabalhando em um projeto muito
legal chamado BARBERPRO que é um app de barbearia e preciso de ajuda para
fazer um hook que gerencia agendamentos mas não sei muito bem como fazer...
```

### ✅ Preferir (Eficiente)

```markdown
# Bom - Direto
Criar hook useBooking para agendamentos Firebase.
Requisitos: list, create, cancel.
Stack: React Native + TypeScript + Firestore.
```

---

## 4. 🔄 Reutilização de Código

### Memory Bank (Aplicado ✅)

O arquivo `.cline/memory-bank.md` armazena padrões, evitando repetição:

```markdown
## Padrões Identificados
- Hook: useAsyncData<T>() para loading
- Componente: <Card title="" onPress={} />
- Service: firebase.ts padrão
```

### Antes de Pedir Código

1. **Verifique se já existe** no projeto
2. **Consulte memory-bank.md** para padrões
3. **Use `search_files`** antes de `read_file`

---

## 5. 🎯 Comandos Eficientes

### Busca Antes de Leitura

```bash
# Eficiente: busca primeiro
search_files "useAuth" → encontra arquivos → lê apenas relevantes

# Ineficiente: lê tudo
read_file "src/hooks/*" → consome muitos tokens
```

### Filtros de Arquivo

```
# Especifique extensões
search_files "função" --pattern "*.ts"

# Exclua irrelevantes
search_files "auth" --exclude "node_modules"
```

---

## 6. 📊 Chunking Inteligente

### Leia Arquivos em Partes

```
# Ruim: arquivo inteiro de 1000 linhas
read_file "App.tsx"  # todo o arquivo

# Bom: apenas a parte necessária
search_files "function Login" → encontra linha 50
read_file "App.tsx" lines 45-80  # apenas a função
```

---

## 7. 🚀 Respostas Compactas

### Nas suas mensagens:

```markdown
# Eficiente
"Implementar X com Y, restrição Z"

# Em vez de
"Gostaria de pedir por favor se pudesse implementar X usando Y..."
```

### Peça respostas diretas:

```markdown
"Código apenas, sem explicações"
"Explicação em 3 bullet points"
"Liste apenas os arquivos a modificar"
```

---

## 8. 📋 Templates Prontos

### Criar Componente

```markdown
Criar componente Button:
- Props: title, onPress, variant (primary/secondary)
- Estilo: StyleSheet
- Export: default
Sem comentários explicativos.
```

### Criar Hook

```markdown
Hook use[Name]:
- Parâmetros: [list]
- Retorno: { data, loading, error }
- Firebase: [collection]
TypeScript strict. Código apenas.
```

---

## 9. 🔧 Configurações Aplicadas

### .vscode/settings.json (✅ Aplicado)

```json
{
  // Exclusões de busca
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true,
    "**/coverage": true
  },

  // File nesting (organização)
  "explorer.fileNesting.enabled": true,

  // IntelliSense (sugestões precisas)
  "typescript.suggest.autoImports": true
}
```

### .clinerules (✅ Aplicado)

Arquivo enxuto com regras essenciais.

### .context/README.md (✅ Aplicado)

Contexto do projeto documentado.

### .cline/memory-bank.md (✅ Aplicado)

Memória persistente de padrões.

---

## 10. 📈 Métricas de Economia

| Antes | Depois | Economia |
|-------|--------|----------|
| ~10K tokens/requisição | ~5K tokens/requisição | ~50% |
| Ler projeto inteiro | Ler seletivamente | ~70% |
| Explicações longas | Respostas diretas | ~40% |
| Sem contexto | Memory bank | ~30% |

---

## ✅ Checklist de Economia

- [x] `.clinerules` enxuto aplicado
- [x] `search.exclude` configurado
- [x] `.context/` organizado
- [x] `.cline/memory-bank.md` criado
- [ ] Usar prompts estruturados (manual)
- [ ] Buscar antes de ler (manual)
- [ ] Pedir respostas compactas (manual)

---

## 🎯 Resumo para Aplicar Agora

1. **Sempre** use busca antes de leitura
2. **Seja** direto nos prompts
3. **Peça** código sem explicações quando não precisar
4. **Use** templates prontos
5. **Mantenha** memory-bank.md atualizado

---

*Token Economy Guide - BARBERPRO 2025*