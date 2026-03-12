# 🔧 Troubleshooting: Build do APK

## ❌ Problema Encontrado

O build do APK falhou com o seguinte erro:

```
Could not GET 'https://repo.maven.apache.org/...'
Could not HEAD 'https://dl.google.com/...'
Este host não é conhecido (repo.maven.apache.org)
Este host não é conhecido (dl.google.com)
```

## 🔍 Causa

**Problema de conectividade de rede/DNS**. O computador não consegue resolver os nomes de host dos repositórios Maven e Google Android.

## ✅ Soluções

### 1. Verificar Conexão com a Internet

```bash
# Testar conectividade
ping google.com
ping maven.apache.org
```

### 2. Verificar Configurações de DNS

**Opção A: Usar DNS do Google**
1. Abrir "Painel de Controle" > "Rede e Internet" > "Conexões de Rede"
2. Clique com botão direito na conexão > "Propriedades"
3. Selecione "Protocolo TCP/IPv4" > "Propriedades"
4. DNS: `8.8.8.8` e `8.8.4.4`

**Opção B: Via PowerShell (Admin)**
```powershell
# Configurar DNS do Google
netsh interface ip set dns "Ethernet" static 8.8.8.8
netsh interface ip add dns "Ethernet" 8.8.4.4 index=2
```

### 3. Verificar Proxy/VPN

Se você usa VPN ou Proxy corporativo:
- Desative temporariamente
- Configure o Gradle para usar o proxy

**Arquivo: `~/.gradle/gradle.properties`**
```properties
systemProp.http.proxyHost=seu-proxy
systemProp.http.proxyPort=8080
systemProp.https.proxyHost=seu-proxy
systemProp.https.proxyPort=8080
```

### 4. Limpar Cache do Gradle

```bash
# Limpar cache global
rd /s /q %USERPROFILE%\.gradle\caches

# Limpar cache do projeto
rd /s /q android\.gradle
rd /s /q android\app\build
```

### 5. Verificar Firewall/Antivírus

- Adicionar exceção para `java.exe` e `gradle`
- Permitir acesso às portas 80 e 443

### 6. Usar EAS Build (Cloud Build)

Se o problema persistir, use o EAS para build na nuvem:

```bash
# Login no EAS
npx eas login

# Build na nuvem
npx eas build --platform android --profile preview
```

**Nota**: Requer conta no Expo (gratuita para builds limitados).

## 📋 Status Atual

| Item | Status |
|------|--------|
| Projeto Android | ✅ Configurado |
| App.tsx | ✅ Criado |
| Gradle | ✅ Funcionando |
| SDK Android | ✅ Instalado |
| Dependências | ❌ Não baixadas (rede) |

## 🚀 Próximos Passos

1. **Verificar conexão com a internet**
2. **Configurar DNS para 8.8.8.8**
3. **Desativar VPN/Proxy temporariamente**
4. **Executar build novamente**:
   ```bash
   cd android && gradlew.bat assembleRelease
   ```

## 📁 Arquivos Criados

- `App.tsx` - Entry point do app
- `docs/CLINE_INTELLIGENCE_GUIDE.md` - Guia de inteligência
- `docs/TOKEN_ECONOMY_CLINE.md` - Economia de tokens
- `.clinerules` - Regras globais
- `.context/README.md` - Contexto do projeto
- `.cline/memory-bank.md` - Memória persistente

## 🔗 Links Úteis

- [Gradle Proxy Configuration](https://docs.gradle.org/current/userguide/build_environment.html#sec:accessing_the_web_via_a_proxy)
- [Android Studio Proxy](https://developer.android.com/studio/intro/studio-config#proxy)
- [EAS Build](https://docs.expo.dev/build/introduction/)