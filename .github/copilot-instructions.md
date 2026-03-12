# BarberPro — Instruções IA (Otimizado)

## Contexto
App gestão barbearias, 3 perfis (cliente/dono/funcionario). Monorepo: mobile (Expo), web (Vite), Cloud Functions (Firebase).

## Arquitetura

### Auth & Navegação
- Firebase Auth + Custom Claims (`role`, `shopId`) → permissões
- Zustand sincroniza claims ([`store/user.ts`](apps/mobile/src/store/user.ts))
- `useAuthListener()` em [`useAuth.ts`](apps/mobile/src/hooks/useAuth.ts)
- Navegação condicional em [`AppNavigator.tsx`](apps/mobile/src/navigation/AppNavigator.tsx)

### Dados
- Firestore: `/barbershops/{shopId}` com subcoleções `services`, `staff`, `appointments`, `loyalty`
- Modelos: [`types/models.ts`](apps/mobile/src/types/models.ts), [`docs/modeling.md`](docs/modeling.md)
- Security Rules baseadas em claims ([`firestore.rules`](firebase/firestore.rules))

### Ambiente
- **DEV**: `__DEV__` + sem env → emuladores Firebase (`127.0.0.1:9099` Auth, `:8080` Firestore)
- **PROD**: variáveis `.env`
- App funciona offline (modo demo)

## Padrões

### Componentes
- Design system: [`theme.ts`](apps/mobile/src/theme.ts) → `colors`, `spacing`, `fontSize`, `radius`
- Reutilizáveis: `AppButton`, `AppInput`, `AppCard` em `src/components/`
- Props: `variant`, `size` com defaults

### Estado
- Zustand: `setAuth()`, `setProfile()`, `signOut()`, `setDemo()`
- Hooks: `useAppointments`, `useShop` em `hooks/`

### Convenções
- Arquivos: PascalCase (`LoginScreen.tsx`)
- Serviços: camelCase (`firebase.ts`)
- Erros: try-catch silencioso, logs com emojis (`🔧`, `❌`, `⚠️`)

## Comandos

```powershell
npm run mobile          # Expo start
npm run mobile:clear    # Limpa cache
cd firebase; firebase emulators:start  # Emuladores
cd apps/mobile; npm test               # Testes
```

## Novo Serviço Firebase

```typescript
// services/reviews.ts
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface Review { id: string; shopId: string; rating: number; comment: string; }

export async function listReviews(shopId: string): Promise<Review[]> {
  const snap = await getDocs(collection(db, 'barbershops', shopId, 'reviews'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() as any }));
}
```

## Nova Tela

1. Tipo em [`types/navigation.ts`](apps/mobile/src/types/navigation.ts)
2. Componente em `screens/{role}/`
3. Registrar em [`AppNavigator.tsx`](apps/mobile/src/navigation/AppNavigator.tsx)

```tsx
// Exemplo mínimo
export default function HistoryScreen() {
  const uid = useUser(s => s.uid);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg }}>
      <AppCard><Text style={{ color: colors.text }}>Histórico</Text></AppCard>
    </View>
  );
}
```

## Cloud Functions

### Segurança Obrigatória
```typescript
// ✅ Validar inputs
if (!data.shopId) throw new functions.https.HttpsError("invalid-argument", "Dados incompletos");

// ✅ Validar permissões
if (context.auth?.token?.role !== 'dono') throw new functions.https.HttpsError("permission-denied", "Sem permissão");

// ✅ Sanitizar strings
const phone = data.phone.replace(/[^\d+]/g, '');
```

### Deploy
```powershell
cd firebase
firebase deploy --only functions:myFunction
```

## Agendamentos

### Fluxo
1. `getAvailableSlots(shopId, serviceId, date, staffUid?)`
2. `createAppointmentClient(...)` → valida conflito, limite diário
3. Status: `pending` → `confirmed` → `completed` (ou `cancelled`, `no-show`)

### Operações
- Cancelar: `cancelAppointment(shopId, appointmentId)`
- Reagendar: `rescheduleAppointment(shopId, appointmentId, newStartISO)`

## Custom Claims

### Definição
- Criação: trigger `onUserCreate` → `role: 'cliente'`
- Dono: `setCustomUserClaims(uid, { role: 'dono', shopId })`
- Staff: `{ role: 'funcionario', shopId }`

### Uso
```typescript
const role = useUser(s => s.role);
const shopId = useUser(s => s.shopId);
if (role === 'dono') { /* UI owner */ }
```

## Design Tokens

| Token | Valor |
|-------|-------|
| `colors.primary` | `#22c55e` (verde) |
| `colors.bg` | `#0b1220` (fundo) |
| `colors.card` | `#1e293b` |
| `colors.text` | `#e2e8f0` |
| `colors.danger` | `#ef4444` |
| `spacing` | `{ xs:4, sm:8, md:12, lg:16, xl:20 }` |
| `fontSize` | `{ xs:10, sm:12, md:14, lg:16, xl:18 }` |
| `radius` | `{ sm:4, md:8, lg:12, round:9999 }` |

## Deploy

### Mobile (EAS)
```powershell
cd apps/mobile
eas build --platform android --profile preview  # Teste
eas build --platform all --profile production   # Produção
```

### Firebase
```powershell
cd firebase
firebase deploy                    # Completo
firebase deploy --only firestore:rules  # Seletivo
```

## Regras Críticas

1. **Sempre checar role**: `const role = useUser(s => s.role)`
2. **Testar offline**: App deve funcionar sem Firebase
3. **Claims = verdade**: Nunca guardar role só no Firestore
4. **PowerShell**: Usar `;` para encadear comandos
5. **Emuladores DEV**: `firebase emulators:start` antes do mobile

## Debug

```powershell
# Modo DEV local
cd firebase; firebase emulators:start  # Terminal 1
cd apps/mobile; npm start              # Terminal 2

# Modo demo (sem backend)
useUser.getState().setDemo('cliente');

# React DevTools
npm install -g react-devtools
react-devtools  # Conecta ao Expo
```

## Integrações
- **Stripe**: [`payments.ts`](apps/mobile/src/services/payments.ts)
- **Twilio**: WhatsApp via Cloud Functions
- **Firebase**: Auth, Firestore, Storage, FCM, Functions
- **Expo Secure Store**: Tokens sensíveis

---
**Resumo**: Multi-role, Firebase+Zustand, navegacao condicional, funciona offline. Paths críticos: `services/`, `navigation/`, `store/`.
