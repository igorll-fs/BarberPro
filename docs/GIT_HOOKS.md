# 🔒 Sistema de Git Hooks - BARBERPRO

Este documento descreve o sistema de verificação pré-commit implementado para garantir a qualidade do código e evitar problemas comuns.

---

## 📋 Visão Geral

O sistema de git hooks executa verificações automáticas antes de cada commit, garantindo que:

- ✅ Nenhum arquivo de backup seja commitado acidentalmente
- ✅ Nenhuma chave de API ou credencial seja exposta
- ✅ Nenhum arquivo .env seja commitado
- ✅ Console.logs de debug sejam removidos
- ✅ Arquivos grandes (>10MB) sejam detectados

---

## 🚀 Instalação

### Configuração Automática

Execute o script de configuração:

```bash
node scripts/setup-git-hooks.js
```

Isso configurará automaticamente o git para usar os hooks da pasta `.githooks/`.

### Configuração Manual

Se preferir configurar manualmente:

```bash
git config core.hooksPath .githooks
```

No Linux/Mac, torne o hook executável:

```bash
chmod +x .githooks/pre-commit
```

---

## 🔍 Verificações Realizadas

### 1. Arquivos de Backup

**Bloqueia**: Arquivos com extensões `.backup`, `.old`, `.bak`, `.tmp`, `.temp`, `.orig`

**Por quê**: Evita poluição do repositório com arquivos temporários.

### 2. Chaves de API Expostas

**Bloqueia**: Padrões comuns de chaves de API (Firebase, Stripe, OpenAI, etc.)

**Por quê**: Segurança - evita exposição acidental de credenciais.

**Padrões detectados**:

- Firebase API Keys (`AIza...`)
- Stripe Keys (`sk_...`, `pk_...`, `rk_...`)
- OpenAI Keys (`sk-...`)
- Senhas e secrets em texto plano

### 3. Arquivos .env

**Bloqueia**: Qualquer arquivo `.env` (exceto `.env.example`)

**Por quê**: Variáveis de ambiente contêm dados sensíveis.

### 4. Console.logs

**Avisa**: Arquivos com `console.log`, `console.warn`, `console.error`

**Por quê**: Logs de debug não devem ir para produção.

**Exceções**: Arquivos de teste (`.test.ts`, `.spec.ts`)

### 5. Arquivos Grandes

**Avisa**: Arquivos maiores que 10MB

**Por quê**: Repositorios git não são otimizados para arquivos binários grandes.

**Recomendação**: Use Git LFS para arquivos grandes.

---

## ⚙️ Como Funciona

### Fluxo de Execução

1. Você executa: `git commit -m "mensagem"`
2. Git executa automaticamente: `.githooks/pre-commit`
3. Hook chama: `node scripts/pre-commit-checks.js`
4. Verificações são executadas
5. Se passar: commit prossegue ✅
6. Se falhar: commit é bloqueado ❌

### Exemplo de Saída

```
🔍 INICIANDO VERIFICAÇÕES PRÉ-COMMIT

ℹ️ Verificando arquivos de backup...
✅ Nenhum arquivo de backup encontrado.

ℹ️ Verificando arquivos grandes (>10MB)...
✅ Nenhum arquivo grande encontrado.

ℹ️ Verificando console.logs esquecidos...
⚠️ Console.logs detectados:
  - src/services/auth.ts
⚠️ Remova os console.logs antes de commitar

ℹ️ Verificando chaves de API expostas...
✅ Nenhuma chave de API exposta detectada.

ℹ️ Verificando arquivos .env...
✅ Nenhum arquivo .env encontrado.

==================================================
⚠️ COMMIT PERMITIDO COM AVISOS.
⚠️ Recomendamos corrigir os avisos antes de push.
```

---

## 🛠️ Comandos Úteis

### Pular os Hooks (Emergências)

```bash
git commit --no-verify -m "mensagem"
```

⚠️ **Use com cautela!** Apenas em situações de emergência.

### Verificar Status dos Hooks

```bash
git config core.hooksPath
```

Deve retornar: `.githooks`

### Desativar Hooks Temporariamente

```bash
git config --unset core.hooksPath
```

Para reativar:

```bash
git config core.hooksPath .githooks
```

---

## 📝 Personalização

### Adicionar Novas Verificações

Edite o arquivo `scripts/pre-commit-checks.js` e adicione novas funções de verificação.

### Ignorar Verificações Específicas

Para ignorar console.log em uma linha específica:

```typescript
// eslint-disable-next-line no-console
console.log("Debug message");
```

---

## 🔧 Troubleshooting

### "Node.js não encontrado"

Certifique-se de que o Node.js está instalado e no PATH:

```bash
node --version
```

### "Permissão negada" (Linux/Mac)

Torne o hook executável:

```bash
chmod +x .githooks/pre-commit
```

### Hooks não executam

Verifique se o caminho está configurado:

```bash
git config core.hooksPath .githooks
```

### Falsos positivos em chaves de API

Se o hook detectar chaves que são apenas placeholders (ex: `password: "123456"` em testes), você pode:

1. Adicionar o arquivo ao `.gitignore`
2. Usar variáveis de ambiente
3. Modificar o padrão de regex no script

---

## 📊 Benefícios

| Problema Evitado              | Frequência | Impacto     |
| ----------------------------- | ---------- | ----------- |
| Arquivos de backup commitados | Comum      | Baixo       |
| Chaves de API expostas        | Raro       | **Crítico** |
| Console.logs em produção      | Comum      | Médio       |
| Arquivos .env commitados      | Raro       | **Crítico** |
| Arquivos grandes no repo      | Comum      | Médio       |

---

## 🤝 Contribuição

Para melhorar o sistema de hooks:

1. Edite `scripts/pre-commit-checks.js`
2. Teste as alterações: `node scripts/pre-commit-checks.js`
3. Commit as mudanças
4. Atualize este documento

---

## 📚 Recursos Relacionados

- [Documentação Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [Git LFS](https://git-lfs.github.com/) - Para arquivos grandes
- [dotenv](https://github.com/motdotla/dotenv) - Gerenciamento de variáveis de ambiente

---

**Última atualização**: 13/03/2026
