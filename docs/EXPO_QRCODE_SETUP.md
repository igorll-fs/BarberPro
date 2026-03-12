# 📱 QR Code para Visualização no Expo
## Arquitetura de Acesso Rápido ao App

---

## 🎯 Objetivos

1. Gerar QR Code para preview instantâneo no Expo Go
2. Criar página de download com QR Code para produção
3. Automatizar geração de QR Codes para diferentes ambientes

---

## 🏗️ Arquitetura

### Fluxo de QR Codes

```
┌─────────────────────────────────────────────────────────────┐
│                     AMBIENTES                               │
├──────────────┬──────────────┬───────────────────────────────┤
│  Desenvolvimento            │  Produção                     │
│  (expo start)               │  (EAS Build / Web)            │
├──────────────┼──────────────┼───────────────────────────────┤
│              │              │                               │
│  ┌────────┐  │  ┌────────┐  │  ┌─────────────────────────┐  │
│  │ QR Code│  │  │ QR Code│  │  │    Página Download      │  │
│  │ Expo   │──┼──│ Preview│  │  │  ┌─────────────────┐    │  │
│  │ (LAN)  │  │  │ (Tunnel)│  │  │  │                 │    │  │
│  └────────┘  │  └────────┘  │  │  │   [QR CODE]     │    │  │
│              │              │  │  │                 │    │  │
│  URL:        │  URL:        │  │  │  Baixe o App    │    │  │
│  exp://192...│  exp://u.expo│  │  │  ─────────────  │    │  │
│              │  .dev/...    │  │  │  iOS | Android  │    │  │
│              │              │  │  │                 │    │  │
│              │              │  │  └─────────────────┘    │  │
│              │              │  │                         │  │
│              │              │  │  URL: barberpro.app/dl  │  │
│              │              │  └─────────────────────────┘  │
└──────────────┴──────────────┴───────────────────────────────┘
```

---

## 📦 Opções de Implementação

### Opção 1: QR Code para Desenvolvimento (Expo CLI)

**Uso:** Durante desenvolvimento com `expo start`

```bash
# Terminal já exibe QR code automaticamente
npm run mobile

# Ou para tunnel (acesso remoto)
npx expo start --tunnel
```

**Configuração no `package.json`:**
```json
{
  "scripts": {
    "mobile": "cd apps/mobile && npx expo start",
    "mobile:tunnel": "cd apps/mobile && npx expo start --tunnel",
    "mobile:clear": "cd apps/mobile && npx expo start --clear"
  }
}
```

---

### Opção 2: Página de Download com QR Code (Web)

**Componente React para PWA:**

```tsx
// apps/public-web/src/components/DownloadQR.tsx
import { useEffect, useState } from 'react';

export function DownloadQR() {
  const [qrUrl, setQrUrl] = useState('');
  
  useEffect(() => {
    // Gerar URL do app na loja ou PWA
    const appUrl = 'https://barberpro.app';
    
    // Usar API de QR Code (qrserver.com é free)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}`;
    setQrUrl(qrCodeUrl);
  }, []);

  return (
    <div className="download-qr">
      <h2>Baixe o BarberPro</h2>
      <p>Aponte a câmera do seu celular</p>
      
      {qrUrl && (
        <img 
          src={qrUrl} 
          alt="QR Code para download do app"
          width={200}
          height={200}
        />
      )}
      
      <div className="stores">
        <a href="/app-store">App Store</a>
        <a href="/play-store">Play Store</a>
      </div>
      
      <p className="or">ou acesse</p>
      <code>barberpro.app</code>
    </div>
  );
}
```

**Estilos CSS:**
```css
.download-qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-5);
  text-align: center;
}

.download-qr h2 {
  font-size: var(--text-xl);
  margin-bottom: var(--space-2);
}

.download-qr p {
  color: var(--mono-40);
  margin-bottom: var(--space-4);
}

.download-qr img {
  border-radius: var(--r-lg);
  border: 1px solid var(--mono-88);
  padding: var(--space-3);
  background: var(--mono-100);
}

.download-qr .stores {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.download-qr .stores a {
  padding: var(--space-2) var(--space-4);
  background: var(--mono-0);
  color: var(--mono-100);
  border-radius: var(--r-md);
  text-decoration: none;
  font-size: var(--text-sm);
}
```

---

### Opção 3: QR Code Dinâmico com EAS Updates

**Para OTA Updates do Expo:**

```tsx
// apps/mobile/src/components/ShareQR.tsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as Updates from 'expo-updates';

export function ShareQR() {
  // URL do update channel
  const updateUrl = `https://u.expo.dev/${Updates.manifest?.extra?.eas?.projectId}`;
  
  // Gerar QR Code via API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(updateUrl)}`;

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: qrCodeUrl }}
        style={styles.qrCode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
  },
  qrCode: {
    width: 300,
    height: 300,
    borderRadius: 16,
  },
});
```

---

### Opção 4: QR Code para Preview de PR (CI/CD)

**GitHub Actions para gerar QR em PRs:**

```yaml
# .github/workflows/preview.yml
name: Preview QR Code

on:
  pull_request:
    paths:
      - 'apps/mobile/**'

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
          
      - name: Create Preview
        working-directory: apps/mobile
        run: eas update --auto --branch=preview
        
      - name: Generate QR Code
        uses: expo/expo-github-action/preview-comment@v8
        with:
          channel: preview
```

---

## 🔧 Configuração Completa

### 1. Instalar Dependências

```bash
cd apps/mobile

# Para QR Code nativo (opcional)
npm install react-native-qrcode-svg

# Para compartilhamento
npx expo install expo-sharing
```

### 2. Componente QRCodeScreen

```tsx
// apps/mobile/src/screens/QRCodeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Share } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Button } from '../components/Button';

export function QRCodeScreen() {
  const appUrl = 'https://barberpro.app';
  
  const handleShare = async () => {
    await Share.share({
      message: `Baixe o BarberPro: ${appUrl}`,
      url: appUrl,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Convide Clientes</Text>
      <Text style={styles.subtitle}>Compartilhe seu app</Text>
      
      <View style={styles.qrContainer}>
        <QRCode
          value={appUrl}
          size={250}
          backgroundColor="white"
          color="#0A0A0A"
        />
      </View>
      
      <Text style={styles.url}>{appUrl}</Text>
      
      <Button onPress={handleShare} title="Compartilhar" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  qrContainer: {
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 24,
  },
  url: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
});
```

### 3. Configuração app.json

```json
{
  "expo": {
    "name": "BarberPro",
    "slug": "barberpro",
    "scheme": "barberpro",
    "extra": {
      "eas": {
        "projectId": "seu-project-id-aqui"
      }
    },
    "updates": {
      "url": "https://u.expo.dev/seu-project-id"
    }
  }
}
```

---

## 🎨 Design do QR Code (Minimalista)

Seguindo o design system minimalista:

```css
.qr-container {
  /* Fundo branco puro */
  background: #FFFFFF;
  
  /* Borda sutil */
  border: 1px solid #E0E0E0;
  border-radius: 16px;
  
  /* Espaçamento */
  padding: 24px;
  
  /* Sombra minimalista */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.qr-code {
  /* Cores do design system */
  color: #0A0A0A;  /* Foreground */
  background: #FFFFFF;  /* Background */
}
```

---

## 📱 Implementação Sugerida

### Para Desenvolvimento
```bash
# Já funciona automaticamente
npm run mobile
# Expo exibe QR no terminal
```

### Para Produção
```bash
# Build EAS com QR na página
eas build --platform all

# Update OTA
 eas update --channel production
```

### Para Compartilhamento
```tsx
// Adicionar tela de QR no app
<Stack.Screen 
  name="ShareQR" 
  component={QRCodeScreen}
  options={{ title: 'Compartilhar' }}
/>
```

---

## ✅ Checklist

- [ ] Instalar `react-native-qrcode-svg` (se QR nativo)
- [ ] Configurar `app.json` com scheme e updates
- [ ] Criar tela `QRCodeScreen` no mobile
- [ ] Criar página download com QR no web
- [ ] Configurar GitHub Action para PR previews
- [ ] Testar leitura em iOS e Android

---

## 🔗 Referências

- [Expo QR Codes](https://docs.expo.dev/build/internal-distribution/)
- [EAS Updates](https://docs.expo.dev/eas-update/introduction/)
- [react-native-qrcode-svg](https://github.com/awesomejerry/react-native-qrcode-svg)
