# Setup do Ambiente

## Pré-requisitos
- **Node.js >= 20.19** (obrigatório para RN 0.81)
- **Firebase CLI**: `npm install -g firebase-tools`
- **Expo CLI**: `npm install -g @expo/cli`
- **EAS CLI** (builds): `npm install -g eas-cli`

## Instalação

```bash
git clone <repo-url> && cd barberpro
npm install                                    # Raiz
cd apps/mobile && npm install && cd ../..      # Mobile
cd firebase/functions && npm install && cd ../.. # Functions
```

## Configuração

### Mobile (`apps/mobile/.env`)
```bash
cp apps/mobile/.env.example apps/mobile/.env
```

Variáveis necessárias:
| Variável | Descrição |
|----------|-----------|
| `FIREBASE_API_KEY` | Chave API Firebase |
| `FIREBASE_AUTH_DOMAIN` | Domínio Auth |
| `FIREBASE_PROJECT_ID` | ID do projeto |
| `FIREBASE_STORAGE_BUCKET` | Bucket Storage |
| `FIREBASE_MESSAGING_SENDER_ID` | Sender ID FCM |
| `FIREBASE_APP_ID` | App ID |

### Firebase Functions (`firebase/functions/.env`)
```bash
cp firebase/functions/.env.example firebase/functions/.env
```

### Firebase CLI
```bash
firebase login
firebase use --add
```

## Desenvolvimento

```bash
# Terminal 1 - Emuladores
cd firebase && firebase emulators:start

# Terminal 2 - Mobile
cd apps/mobile && npx expo start --clear
```

**Emuladores**: Auth `:9099` | Firestore `:8080` | Functions `:5001` | UI `:4000`

## Troubleshooting

| Erro | Solução |
|------|---------|
| Project not found | Verificar `FIREBASE_PROJECT_ID` no `.env` |
| Metro cache | `npx expo start --clear` |
| Module not found | `rm -rf node_modules && npm install` |

> **Modo Demo**: Sem `.env` configurado, o app usa dados mockados automaticamente.

## Próximos Passos
1. [Regras Firestore](docs/modeling.md)
2. [Deploy](docs/DEPLOY.md)
3. [LGPD](docs/LGPD.md)
