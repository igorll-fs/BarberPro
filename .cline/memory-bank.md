# 🧠 Memory Bank - Contexto Persistente do BARBERPRO

> Este arquivo mantém registro de decisões, padrões e aprendizados para que o Cline tenha contexto persistente entre sessões.

---

## 👤 Preferências do Usuário

### Comunicação
- [x] Respostas em português brasileiro
- [x] Explicações detalhadas quando relevante
- [x] Código comentado em português
- [x] Nomes de variáveis/funções em inglês

### Código
- [x] TypeScript strict mode
- [x] Componentes funcionais
- [x] Hooks personalizados para lógica
- [x] Prettier para formatação
- [x] ESLint para linting

### Fluxo de Trabalho
- [x] Commits semânticos (conventional commits)
- [x] Testes antes de finalizar
- [x] Documentação de mudanças importantes

---

## 📊 Conhecimento do Projeto

### Estrutura Atual
```
BARBERPRO/
├── apps/mobile/     # React Native + Expo
├── apps/web/        # React + Vite
├── apps/public-web/ # Landing page
├── firebase/        # Backend Firebase
├── docs/            # Documentação
└── scripts/         # Scripts de automação
```

### Stack Confirmada
- **Mobile**: React Native + Expo (SDK 52+)
- **Web**: React + Vite
- **Backend**: Firebase (Auth, Firestore, Functions, Storage, FCM)
- **Linguagem**: TypeScript
- **Testes**: Jest + Testing Library
- **Estado**: Zustand / Context API

### Telas Implementadas
1. **Autenticação**
   - LoginScreen
   - RegisterScreen
   - ForgotPasswordScreen

2. **Cliente**
   - HomeCustomerScreen
   - BarbersListScreen
   - BookingScreen
   - ProfileScreen

3. **Barbeiro**
   - HomeBarberScreen
   - ScheduleScreen
   - ServicesScreen

4. **Dono**
   - DashboardOwnerScreen
   - BarbersManagementScreen
   - ReportsScreen

---

## 📝 Decisões Tomadas

### 2025-03-07: Configuração do Cline
- Criado `.clinerules` com regras globais
- Criado `.context/README.md` com contexto do projeto
- Criado `.cline/memory-bank.md` para memória persistente
- Criado guia completo em `docs/CLINE_INTELLIGENCE_GUIDE.md`

### 2025-03-06: VS Code Settings
- Configurado Error Lens para visibilidade de erros
- Ativado formatOnSave com Prettier
- Configurado IntelliSense maximizado

### Decisões Anteriores (Histórico)
1. Firebase como backend (BaaS para velocidade)
2. Expo para desenvolvimento mobile simplificado
3. TypeScript para type safety
4. Monorepo para compartilhamento de código

---

## 🎯 Padrões Identificados

### Componentes
- Interface Props sempre tipada
- StyleSheet para estilos (não inline)
- Componentes pequenos (< 200 linhas)

### Hooks
- `useAuth` - Autenticação Firebase
- `useAsyncData` - Carregamento de dados assíncronos
- `useTheme` - Tema do app

### Serviços
- `firebase.ts` - Configuração e inicialização
- Funções organizadas por domínio

### Navegação
- Stack Navigator para fluxos lineares
- Tab Navigator para telas principais
- Drawer Navigator para configurações

---

## 💡 Lições Aprendidas

### Firebase
- Sempre verificar se usuário existe antes de acessar propriedades
- Usar `onAuthStateChanged` para detectar mudanças de estado
- Regras de segurança do Firestore são críticas

### React Native / Expo
- Usar FlatList para listas longas (performance)
- Memoizar componentes pesados com React.memo
- Otimizar imagens com expo-image

### TypeScript
- Tipar tudo, evitar `any`
- Usar utility types quando apropriado
- Interfaces para props e estado

### Debugging
- React DevTools para inspecionar componentes
- Console.log em desenvolvimento
- Flipper para debugging avançado

---

## ⚠️ Problemas Conhecidos

### Android Build
- Problemas com compileSdkVersion em node_modules
- Solução: Limpar cache do Gradle (`cd android && ./gradlew clean`)

### Dependências
- Verificar compatibilidade entre versões do Expo
- Usar `npx expo install` para instalar dependências

---

## 🚀 Próximos Passos

### Prioridade Alta
1. [ ] Completar sistema de agendamento
2. [ ] Implementar notificações push (FCM)
3. [ ] Integrar Stripe para pagamentos

### Prioridade Média
4. [ ] Desenvolver dashboard completo do dono
5. [ ] Adicionar testes automatizados
6. [ ] Otimizar performance do app

### Prioridade Baixa
7. [ ] Implementar dark mode
8. [ ] Adicionar internacionalização (i18n)
9. [ ] Criar Storybook para componentes

---

## 📚 Recursos Úteis

### Documentação
- [Expo Docs](https://docs.expo.dev/)
- [Firebase Docs](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Ferramentas
- Expo Go (testes no dispositivo)
- React DevTools (debugging)
- Firebase Console (backend)
- VS Code + Extensions

---

*Última atualização: 2025-03-08*