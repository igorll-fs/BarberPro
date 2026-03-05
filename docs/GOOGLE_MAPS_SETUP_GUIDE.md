# 🗺️ Guia de Configuração Google Maps

Guia completo para integrar Google Maps no BarberPro.

---

## 📋 Pré-requisitos

1. **Conta Google Cloud** - https://console.cloud.google.com
2. **Projeto criado** - Já existe (baberpro-31c40)
3. **Cartão de crédito** - Necessário para ativar (cobrança por uso)

---

## 🚀 Passo a Passo

### 1. Acessar Google Cloud Console

1. Acesse: https://console.cloud.google.com
2. Selecione o projeto **"baberpro-31c40"**

---

### 2. Ativar APIs

#### A. Vá em: **APIs & Services > Library**

#### B. Ative estas APIs:

1. **Maps SDK for Android**
2. **Maps SDK for iOS**
3. **Maps JavaScript API** (para web)
4. **Geocoding API** (converter endereço em coordenadas)
5. **Directions API** (rotas)

Clique em cada uma e depois em **"Enable"**

---

### 3. Criar API Key

#### A. Vá em: **APIs & Services > Credentials**

#### B. Clique em **"Create Credentials" > "API Key"**

#### C. Copie a chave (começa com `AIzaSy...`)

---

### 4. Restringir API Key (Segurança)

**IMPORTANTE:** Restrinja a chave para evitar uso indevido

#### A. Clique na chave criada

#### B. Em **"Application restrictions"**:

- **Android**: Adicione o package name (`app.barberpro.mobile`) e SHA-1
- **iOS**: Adicione o bundle ID (`app.barberpro.mobile`)
- **Web**: Adicione as URLs permitidas (`https://baberpro-31c40.web.app/*`)

#### C. Em **"API restrictions"**:

Selecione apenas as APIs:
- Maps SDK for Android
- Maps SDK for iOS
- Maps JavaScript API
- Geocoding API
- Directions API

---

### 5. Configurar no App

#### Mobile (`apps/mobile/.env`):
```env
GOOGLE_MAPS_API_KEY=AIzaSy...
```

#### Web (`apps/public-web/.env`):
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
```

#### app.json:
```json
{
  "expo": {
    "extra": {
      "GOOGLE_MAPS_API_KEY": "AIzaSy..."
    }
  }
}
```

---

## 💰 Custo

O Google Maps tem **crédito mensal gratuito de US$200**:

| Serviço | Preço | Uso no BarberPro |
|---------|-------|------------------|
| Maps SDK | $7 por 1.000 requisições | Baixo |
| Geocoding | $5 por 1.000 requisições | Médio |
| Directions | $5 por 1.000 requisições | Baixo |

**Estimativa para BarberPro:**
- Até ~10.000 usuários/mês: **Gratuito** (dentro do crédito)
- Acima disso: ~$5-20/mês

---

## 🧪 Testar Integração

### 1. Verificar se a API está ativa

```bash
# Teste com curl
curl "https://maps.googleapis.com/maps/api/geocode/json?address=Av+Paulista+1000+Sao+Paulo&key=SUA_API_KEY"
```

### 2. Teste no App

Adicione um componente de mapa:

```tsx
import MapView from 'react-native-maps';

<MapView
  style={{ width: '100%', height: 200 }}
  initialRegion={{
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }}
/>
```

---

## 📱 Funcionalidades Implementadas

### 1. Visualização do Mapa

Mostra a localização da barbearia no perfil.

### 2. Rotas (Já implementado)

O componente `AddressCard` já abre rotas no app de mapas nativo.

### 3. Geocoding (Opcional)

Converter endereço em coordenadas GPS:

```typescript
async function geocodeAddress(address: string) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
  );
  const data = await response.json();
  if (data.results[0]) {
    return data.results[0].geometry.location;
  }
}
```

---

## 🔧 Troubleshooting

### Erro: "API key not valid"

Verifique:
1. Chave copiada corretamente
2. APIs ativadas no console
3. Restrições configuradas corretamente

### Erro: "This API project is not authorized"

A API não está ativada. Vá em APIs & Services > Library e ative.

### Mapa aparece em branco (Android)

Verifique:
1. `google-services.json` configurado
2. API Key no `AndroidManifest.xml` (ou via Expo config)

### Mapa aparece em branco (iOS)

Verifique:
1. `GoogleService-Info.plist` configurado
2. API Key no `AppDelegate.m` (ou via Expo config)

### Cobrança inesperada

Monitore o uso em:
https://console.cloud.google.com/billing

Configure alertas de orçamento para evitar surpresas.

---

## 📊 Monitoramento

Acompanhe uso em:
Google Cloud Console > APIs & Services > Metrics

Métricas:
- Requisições por API
- Erros
- Latência

---

## ✅ Checklist

- [ ] APIs ativadas no Google Cloud
- [ ] API Key criada
- [ ] Restrições configuradas
- [ ] Chave adicionada no .env
- [ ] Teste de mapa realizado
- [ ] Geocoding testado (se aplicável)
- [ ] Alerta de orçamento configurado

---

## 📞 Suporte

- Google Maps Platform: https://developers.google.com/maps
- Preços: https://cloud.google.com/maps-platform/pricing
- Suporte: https://developers.google.com/maps/support

---

## 🎉 Parabéns!

Você completou todas as configurações do BarberPro!

### Resumo do que foi configurado:

✅ Firebase (Authentication, Firestore, Storage)
✅ Planos de assinatura (R$ 99,99 / R$ 79,99)
✅ Endereço obrigatório e rotas
✅ Build EAS configurado
✅ Deploy Web configurado
✅ Stripe para pagamentos
✅ FCM para notificações push
✅ Google Maps

**Seu app está pronto para produção!** 🚀
