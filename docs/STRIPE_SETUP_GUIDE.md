# 💳 Guia de Configuração Stripe - BarberPro

Guia completo para configurar pagamentos com Stripe no BarberPro.

---

## 📋 Pré-requisitos

1. **Conta Stripe** - Crie em https://stripe.com (modo teste gratuito)
2. **Acesso ao Dashboard** - https://dashboard.stripe.com
3. **Projeto Firebase configurado** - Já realizado

---

## 🚀 Passo a Passo

### 1. Acessar Stripe Dashboard

1. Acesse: https://dashboard.stripe.com
2. Faça login na sua conta
3. No canto superior esquerdo, verifique se está em **"Test mode"** (para testes)

---

### 2. Obter Chaves de API

Vá em: **Developers > API keys**

Você verá:

```
Publicar chave (Publishable key): pk_test_xxxxx  ← PARA O APP
Chave secreta (Secret key): sk_test_xxxxx        ← PARA O BACKEND
```

**⚠️ IMPORTANTE:**
- `pk_test_...` = Ambiente de teste
- `pk_live_...` = Ambiente de produção (apenas após testes)

---

### 3. Configurar no Mobile (.env)

Edite `apps/mobile/.env`:

```env
# Stripe Payment Gateway
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

Para produção:
```env
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

---

### 4. Configurar no Backend (Firebase Functions)

Edite `firebase/functions/.env`:

```env
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_MONTHLY=price_xxxxx
STRIPE_PRICE_QUARTERLY=price_xxxxx
STRIPE_PRICE_YEARLY=price_xxxxx
FIREBASE_WEB_URL=https://baberpro-31c40.web.app
```

---

### 5. Criar Produtos e Preços no Stripe

#### A. Acesse: **Products > Add product**

#### B. Plano Mensal:
- **Nome**: BarberPro Mensal
- **Descrição**: Acesso completo - Plano mensal
- **Preço**: R$ 99,99
- **Moeda**: BRL
- **Intervalo**: Monthly
- Clique em **Save product**

Copie o **Price ID** (ex: `price_1Nxxxxx`)

#### C. Plano Trimestral:
- **Nome**: BarberPro Trimestral
- **Descrição**: Acesso completo - Plano trimestral (7 dias grátis)
- **Preço**: R$ 239,97 (R$ 79,99/mês)
- **Moeda**: BRL
- **Intervalo**: Every 3 months
- Clique em **Save product**

Copie o **Price ID**

#### D. Plano Anual (opcional):
- **Nome**: BarberPro Anual
- **Descrição**: Acesso completo - Plano anual
- **Preço**: R$ 999,99
- **Moeda**: BRL
- **Intervalo**: Yearly

---

### 6. Configurar Webhook

O webhook é essencial para receber notificações de pagamento.

#### A. Acesse: **Developers > Webhooks**

#### B. Clique em **Add endpoint**

#### C. Configure:
- **Endpoint URL**: `https://sua-regiao-baberpro-31c40.cloudfunctions.net/stripeWebhook`
- **Events to listen**:
  - `checkout.session.completed`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

#### D. Copie o **Signing secret** (whsec_xxxxx)

---

### 7. Deploy das Functions

Após configurar as variáveis:

```bash
cd firebase
firebase deploy --only functions
```

---

### 8. Testar Pagamento

#### A. Cartão de Teste:

Use esses dados no checkout:

```
Número: 4242 4242 4242 4242
Validade: 12/25
CVC: 123
CEP: 12345
```

#### B. Teste PIX (simulado):

O Stripe em modo teste não processa PIX real, mas simula a resposta.

---

## 🔧 Configuração de Produção

Quando estiver pronto para receber pagamentos reais:

### 1. Ativar Conta

1. No Stripe Dashboard, clique em **"Activate your account"**
2. Preencha dados do negócio (CNPJ, endereço, banco)
3. Aguarde aprovação (geralmente instantânea)

### 2. Trocar para Modo Live

1. No canto superior esquerdo, desative **"Test mode"**
2. Copie as novas chaves (pk_live_... e sk_live_...)
3. Atualize os arquivos `.env`

### 3. Criar Produtos em Produção

Repita o passo 5 no modo Live para criar os produtos reais.

### 4. Atualizar Webhook

Crie um novo webhook endpoint para produção.

---

## 💰 Taxas Stripe

### Para Brasil:
- **Cartão nacional**: 3.99% + R$ 0,10
- **Cartão internacional**: 4.99% + R$ 0,10
- **PIX**: 0.99% + R$ 0,10

Saiba mais: https://stripe.com/br/pricing

---

## 📱 Fluxo de Pagamento

```
1. Usuário clica em "Assinar"
2. App chama createCheckoutSession
3. Stripe retorna URL de checkout
4. Usuário preenche dados no Stripe
5. Stripe redireciona para success/cancel
6. Webhook atualiza status no Firebase
```

---

## 🐛 Troubleshooting

### Erro: "No such price"

Verifique se o Price ID está correto no `.env` das functions.

### Erro: "Invalid API Key"

Verifique se as chaves estão corretas (pk_ para app, sk_ para backend).

### Webhook não funciona

Verifique:
1. URL do endpoint está correta
2. Eventos estão selecionados
3. Signing secret está no `.env`

### Pagamento não atualiza status

Verifique os logs do Firebase:
```bash
firebase functions:log
```

---

## ✅ Checklist

- [ ] Conta Stripe criada
- [ ] Chaves copiadas (pk_test e sk_test)
- [ ] Produtos criados no Stripe
- [ ] Price IDs configurados no `.env`
- [ ] Webhook configurado
- [ ] Deploy das functions realizado
- [ ] Teste de pagamento realizado
- [ ] (Produção) Conta ativada
- [ ] (Produção) Chaves live configuradas

---

## 📞 Suporte Stripe

- Documentação: https://stripe.com/docs
- Suporte: https://support.stripe.com
- Email: support@stripe.com

---

**Próximo passo**: Configure as notificações push (FCM)! 🔔
