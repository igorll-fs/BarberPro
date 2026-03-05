# 🧪 Guia de Testes - BarberPro

Este documento explica como executar e criar testes no projeto BarberPro.

---

## 📋 Visão Geral dos Testes

O projeto possui testes configurados para:
- **Mobile App** (`apps/mobile/`) - Jest + React Native Testing Library
- **Cloud Functions** (`firebase/functions/`) - Jest

---

## 🚀 Executando os Testes

### 1. Testes do Mobile App

```bash
# Acesse a pasta do mobile
cd apps/mobile

# Executar todos os testes
npm test

# Executar testes em modo watch (desenvolvimento)
npm test -- --watch

# Executar testes com coverage
npm test -- --coverage

# Executar testes de um arquivo específico
npm test -- auth.service.test.ts

# Executar testes com verbose
npm test -- --verbose
```

### 2. Testes das Cloud Functions

```bash
# Acesse a pasta das functions
cd firebase/functions

# Executar todos os testes
npm test

# Executar testes em modo watch
npm test -- --watch

# Executar testes com coverage
npm test -- --coverage
```

---

## 📁 Estrutura dos Testes

### Mobile App (`apps/mobile/`)

```
__tests__/
├── auth.service.test.ts      # Testes do serviço de autenticação
├── LoginScreen.test.tsx      # Testes da tela de login
├── security.test.ts          # Testes de segurança
└── userStore.test.ts         # Testes da store Zustand

src/
├── hooks/__tests__/          # Testes de hooks customizados
└── services/__tests__/       # Testes de serviços
    └── scheduling.test.ts
```

### Cloud Functions (`firebase/functions/`)

```
__tests__/
└── auth.test.ts              # Testes de autenticação

src/__tests__/
└── (testes unitários das functions)
```

---

## 📝 Tipos de Testes

### Testes Unitários
Testam funções e componentes isoladamente:

```typescript
// Exemplo: Teste de store (userStore.test.ts)
import { useUser } from '../src/store/user';

describe('User Store (Zustand)', () => {
  beforeEach(() => {
    useUser.setState({ role: null, shopId: undefined });
  });

  it('estado inicial é role null', () => {
    const state = useUser.getState();
    expect(state.role).toBeNull();
  });

  it('setRole atualiza role corretamente', () => {
    useUser.getState().setRole('dono');
    expect(useUser.getState().role).toBe('dono');
  });
});
```

### Testes de Serviços
Testam chamadas a APIs e Firebase:

```typescript
// Exemplo: Teste de serviço (auth.service.test.ts)
import { startOtpWhatsApp, verifyOtpWhatsApp } from '../src/services/auth';

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('startOtpWhatsApp chama Cloud Function com telefone', async () => {
    const result = await startOtpWhatsApp('+5511999999999');
    expect(result).toBeDefined();
  });

  it('verifyOtpWhatsApp chama Cloud Function com phone, code e role', async () => {
    const result = await verifyOtpWhatsApp('+5511999999999', '123456', 'cliente');
    expect(result).toBeDefined();
  });
});
```

### Testes de Componentes (React Native)

```typescript
// Exemplo: Teste de componente
import { render, screen, fireEvent } from '@testing-library/react-native';
import { LoginScreen } from '../src/screens/auth/LoginScreen';

describe('LoginScreen', () => {
  it('renderiza corretamente', () => {
    render(<LoginScreen />);
    expect(screen.getByText('Entrar')).toBeTruthy();
  });

  it('valida campos vazios', () => {
    render(<LoginScreen />);
    const button = screen.getByText('Entrar');
    fireEvent.press(button);
    expect(screen.getByText('Telefone é obrigatório')).toBeTruthy();
  });
});
```

### Testes de Cloud Functions

```typescript
// Exemplo: Teste de Cloud Function
import * as functions from 'firebase-functions-test';

const testEnv = functions();

describe('startOtpWhatsApp', () => {
  it('envia OTP para telefone válido', async () => {
    const wrapped = testEnv.wrap(startOtpWhatsApp);
    const result = await wrapped({ phone: '+5511999999999' });
    expect(result.ok).toBe(true);
  });

  it('rejeita telefone inválido', async () => {
    const wrapped = testEnv.wrap(startOtpWhatsApp);
    await expect(wrapped({ phone: '123' }))
      .rejects.toThrow('Formato de telefone inválido');
  });
});
```

---

## 🔧 Configurações

### Jest Config (Mobile)

Arquivo: `apps/mobile/jest.config.js`

```javascript
module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|expo|@expo|expo-modules-core|firebase|@firebase)/)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/screens/(.*)$': '<rootDir>/src/screens/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/store/(.*)$': '<rootDir>/src/store/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
  },
};
```

### Setup de Testes (Mobile)

Arquivo: `apps/mobile/jest.setup.js`

```javascript
// Configurações globais para testes
import 'react-native-gesture-handler/jestSetup';

// Mock do Firebase
jest.mock('./src/services/firebase', () => ({
  auth: {},
  db: {},
  functions: {},
}));

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock das notificações
jest.mock('./src/services/notifications', () => ({
  registerForPushNotificationsAsync: jest.fn(() => Promise.resolve('token')),
  savePushToken: jest.fn(),
}));
```

---

## 🎯 Cobertura de Testes Recomendada

### Prioridade Alta (Core)
- [ ] Autenticação (login, registro, OTP)
- [ ] Agendamentos (criar, cancelar, confirmar)
- [ ] Pagamentos (Stripe, PIX)
- [ ] Segurança (Firestore rules, validações)

### Prioridade Média (Features)
- [ ] Chat (mensagens, notificações)
- [ ] Avaliações (criar, média, respostas)
- [ ] Perfil (atualizar, LGPD)
- [ ] Promoções (aplicar, calcular)

### Prioridade Baixa (UI)
- [ ] Navegação
- [ ] Componentes visuais
- [ ] Animações

---

## 🆕 Criando Novos Testes

### 1. Teste de Store (Zustand)

```typescript
// __tests__/appointmentsStore.test.ts
import { useAppointments } from '../src/store/appointments';

describe('Appointments Store', () => {
  beforeEach(() => {
    useAppointments.setState({ appointments: [], loading: false });
  });

  it('adiciona agendamento', () => {
    const appointment = { id: '1', serviceId: 'svc1', status: 'pending' };
    useAppointments.getState().addAppointment(appointment);
    expect(useAppointments.getState().appointments).toContainEqual(appointment);
  });
});
```

### 2. Teste de Hook

```typescript
// src/hooks/__tests__/useAuth.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  it('retorna usuário não autenticado inicialmente', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

### 3. Teste de Cloud Function

```typescript
// firebase/functions/__tests__/appointments.test.ts
import * as functions from 'firebase-functions-test';
import { getAvailableSlots } from '../src/index';

const testEnv = functions();

describe('getAvailableSlots', () => {
  it('retorna slots disponíveis', async () => {
    const wrapped = testEnv.wrap(getAvailableSlots);
    const result = await wrapped({
      shopId: 'shop1',
      serviceId: 'svc1',
      date: '2026-04-10'
    });
    expect(result.slots).toBeInstanceOf(Array);
  });
});
```

---

## 🐛 Debug de Testes

### Debug no Mobile

```bash
# Executar teste específico com debug
npm test -- --testNamePattern="startOtpWhatsApp"

# Debug com console.log visível
npm test -- --verbose --no-coverage

# Debug com node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Debug nas Functions

```bash
# Executar com debug
npm test -- --detectOpenHandles

# Ver logs detalhados
DEBUG=* npm test
```

---

## 📊 Relatórios de Cobertura

### Gerar relatório HTML

```bash
# Mobile
cd apps/mobile
npm test -- --coverage --coverageDirectory=coverage

# Abrir relatório
open coverage/lcov-report/index.html  # macOS
start coverage/lcov-report/index.html # Windows
```

### Configurar threshold mínimo

```javascript
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

---

## 🔗 Integração CI/CD

### GitHub Actions (Exemplo)

```yaml
# .github/workflows/tests.yml
name: Tests

on: [push, pull_request]

jobs:
  test-mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd apps/mobile && npm ci
      - run: cd apps/mobile && npm test -- --coverage

  test-functions:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd firebase/functions && npm ci
      - run: cd firebase/functions && npm test
```

---

## 📚 Recursos Úteis

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Firebase Functions Testing](https://firebase.google.com/docs/functions/unit-testing)
- [Zustand Testing](https://docs.pmnd.rs/zustand/guides/testing)

---

## ✅ Checklist de Qualidade

Antes de fazer commit:

- [ ] Todos os testes passam (`npm test`)
- [ ] Cobertura não diminuiu
- [ ] Novos recursos têm testes
- [ ] Código segue padrões do projeto
- [ ] Não há `console.log` em código de produção
- [ ] Não há erros de lint (`npm run lint`)

---

**Dúvidas?** Consulte a documentação do projeto ou entre em contato com a equipe.
