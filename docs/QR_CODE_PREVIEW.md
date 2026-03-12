# 📱 QR Code - Preview do BarberPro

## 🎯 Acesso Rápido

### Opção 1: Desenvolvimento (Expo CLI)
Execute no terminal:
```bash
npm run mobile
```
O Expo exibirá automaticamente um QR code no terminal.

### Opção 2: QR Code Estático para Testes

**URL do App:** `exp://192.168.1.X:8081` (substitua pelo IP da sua máquina)

**Gerar QR Code Online:**
1. Acesse: https://qrserver.com/
2. Cole a URL: `exp://SEU_IP:8081`
3. Baixe o QR code

### Opção 3: Tela de QR no Próprio App

Adicione esta tela no aplicativo para compartilhamento:

```tsx
// apps/mobile/src/screens/QRScreen.tsx
import { View, Text, Image } from 'react-native';

export default function QRScreen() {
  const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://barberpro.app';
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 16 }}>
        BarberPro
      </Text>
      <Text style={{ fontSize: 16, color: '#666', marginBottom: 32 }}>
        Aponte a câmera para acessar
      </Text>
      <Image 
        source={{ uri: qrUrl }}
        style={{ width: 300, height: 300, borderRadius: 16 }}
      />
      <Text style={{ marginTop: 24, fontSize: 14, color: '#999' }}>
        ou acesse: barberpro.app
      </Text>
    </View>
  );
}
```

---

## 🚀 Como Usar

### Para Desenvolvedor
```bash
# 1. Inicie o servidor
cd apps/mobile
npx expo start

# 2. Leia o QR code com o app Expo Go
#    iOS: App Store → "Expo Go"
#    Android: Play Store → "Expo Go"
```

### Para Clientes (Produção)
```
URL: https://barberpro.app

QR Code:
┌─────────────────┐
│ ▄▄▄▄▄ █▀▄ █▄█ │
│ █   █ █▄▀ ▄▄▄ │
│ █▄▄▄█ ▄ ▄ ▀▄▀ │
│ ▄▄▄▄▄ ▄▄▄ █▄▀ │
│ █   █ ▀▄▀ ▄▀▄ │
│ █▄▄▄█ █▄▀ █▄█ │
└─────────────────┘
```

---

## 🔧 Configuração Rápida

### Adicionar ao Menu do App

```tsx
// No BottomNav ou Menu
{
  path: '/qr',
  label: 'Compartilhar',
  icon: '⚡'
}
```

### Ou como Modal

```tsx
// Botão flutuante para compartilhar
<Button 
  onPress={() => navigation.navigate('QRScreen')}
  title="Compartilhar App"
/>
```

---

## 📲 Expo Go

**Download:**
- 📱 iOS: https://apps.apple.com/app/expo-go/id982107779
- 🤖 Android: https://play.google.com/store/apps/details?id=host.exp.exponent

**Depois de instalado:**
1. Abra o Expo Go
2. Toque em "Scan QR Code"
3. Aponte para o QR exibido no terminal
4. O app carregará automaticamente

---

## 🎨 Design Minimalista do QR

Seguindo o design system BARBERPRO:

```
┌─────────────────────────────┐
│                             │
│     ┌───────────────┐       │
│     │               │       │
│     │    [QR]       │       │  ← Fundo branco
│     │               │       │
│     └───────────────┘       │
│                             │
│     BarberPro               │  ← Título
│     Aponte a câmera         │  ← Subtítulo
│                             │
└─────────────────────────────┘
   Fundo: #F5F5F5 (mono-96)
   QR: Preto sobre branco
   Borda: #E0E0E0 (mono-88)
```

---

## ✅ Pronto!

Escolha uma opção acima e o QR code estará disponível para visualização no Expo.
