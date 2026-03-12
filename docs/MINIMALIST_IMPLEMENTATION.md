# 🛠️ Implementação do Design System Minimalista
## Especificação Técnica Completa

---

## 1. ARQUITETURA CSS

### Estrutura de Arquivos
```
apps/web-app/src/styles/
├── minimalist.css          # Design system completo
├── components/
│   ├── Card.css            # Cards de alta densidade
│   ├── Button.css          # Botões minimalistas
│   ├── Input.css           # Formulários condensados
│   ├── Navigation.css      # Navegação bottom
│   └── List.css            # Listas compactas
└── utilities.css           # Classes utilitárias
```

### 1.1 Tokens CSS (`minimalist.css`)

```css
:root {
  /* Paleta Monocromática (5 tons) */
  --mono-100: #FFFFFF;
  --mono-96:  #F5F5F5;
  --mono-88:  #E0E0E0;
  --mono-64:  #A3A3A3;
  --mono-40:  #666666;
  --mono-16:  #292929;
  --mono-0:   #0A0A0A;
  
  /* Accent */
  --accent: #1A1A1A;
  --accent-light: #333333;
  
  /* Estados */
  --error: #DC2626;
  --success: #16A34A;
  
  /* Tipografia (6 tamanhos) */
  --text-2xs: 0.75rem;
  --text-xs:  0.875rem;
  --text-sm:  1rem;
  --text-base: 1.125rem;
  --text-lg:  1.25rem;
  --text-xl:  1.5rem;
  --text-2xl: 2rem;
  
  --weight-normal: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  
  /* Espaçamento (6 valores) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2rem;
  --space-6: 3rem;
  
  /* Radius */
  --r-sm: 8px;
  --r-md: 12px;
  --r-lg: 16px;
  --r-full: 9999px;
  
  --transition: 150ms ease;
}
```

### 1.2 Tipografia Hierárquica

```css
.text-display {
  font-size: var(--text-2xl);
  font-weight: var(--weight-semibold);
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.text-heading {
  font-size: var(--text-xl);
  font-weight: var(--weight-semibold);
  line-height: 1.3;
}

.text-subhead {
  font-size: var(--text-lg);
  font-weight: var(--weight-medium);
  line-height: 1.4;
}

.text-body {
  font-size: var(--text-sm);
  font-weight: var(--weight-normal);
  line-height: 1.5;
  color: var(--mono-16);
}

.text-meta {
  font-size: var(--text-xs);
  font-weight: var(--weight-normal);
  color: var(--mono-40);
}

.text-micro {
  font-size: var(--text-2xs);
  font-weight: var(--weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### 1.3 Layout Base

```css
.screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--mono-100);
  padding-bottom: calc(64px + env(safe-area-inset-bottom));
}

.container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: var(--space-4);
}

.section {
  margin-bottom: var(--space-4);
}

.section:last-child {
  margin-bottom: 0;
}
```

---

## 2. COMPONENTES DE ALTA DENSIDADE

### 2.1 Card Condensado

**Layout Visual:**
```
┌─────────────────────────────────┐
│ Corte Masculino          R$ 45 │
│ 14:30 · 45min · João Silva      │
│ [CONFIRMADO]                    │
└─────────────────────────────────┘
```

**Implementação CSS:**
```css
.card {
  background: var(--mono-100);
  border: 1px solid var(--mono-88);
  border-radius: var(--r-md);
  padding: var(--space-3);
}

.card-dense {
  display: grid;
  gap: var(--space-2);
}

.card-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-2);
}

.card-row-primary {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--mono-0);
}

.card-row-secondary {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--mono-0);
}

.card-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--mono-40);
  font-size: var(--text-xs);
}

.card-meta-dot {
  width: 3px;
  height: 3px;
  border-radius: var(--r-full);
  background: var(--mono-64);
}
```

**Implementação React:**
```tsx
interface DenseCardProps {
  title: string;
  value?: string;
  meta: string[];
  badge?: { text: string; variant: 'default' | 'active' };
  onClick?: () => void;
}

export function DenseCard({ title, value, meta, badge, onClick }: DenseCardProps) {
  return (
    <div className="card card-dense" onClick={onClick}>
      <div className="card-row">
        <span className="card-row-primary">{title}</span>
        {value && <span className="card-row-secondary">{value}</span>}
      </div>
      <div className="card-meta">
        {meta.map((item, i) => (
          <React.Fragment key={i}>
            <span>{item}</span>
            {i < meta.length - 1 && <span className="card-meta-dot" />}
          </React.Fragment>
        ))}
      </div>
      {badge && (
        <span className={`badge badge-${badge.variant}`}>
          {badge.text}
        </span>
      )}
    </div>
  );
}
```

### 2.2 Lista Compacta

**Layout Visual:**
```
┌─────────────────────────────────┐
│ João Silva         (41) 9876... │
│ Corte · 14:30              R$45 │
├─────────────────────────────────┤
│ Maria Souza        (41) 9988... │
│ Barba · 15:00              R$25 │
└─────────────────────────────────┘
```

**Implementação CSS:**
```css
.list {
  border-top: 1px solid var(--mono-88);
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--mono-88);
}

.list-item-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.list-item-title {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--mono-0);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-item-meta {
  font-size: var(--text-xs);
  color: var(--mono-40);
}

.list-item-value {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--mono-0);
  flex-shrink: 0;
}
```

### 2.3 Botões Minimalistas

**Layout Visual:**
```
┌─────────────────────────────────┐
│  [      Botão Primário      ]   │
│  [      Botão Secundário    ]   │
│        [  Ghost  ]              │
└─────────────────────────────────┘
```

**Implementação CSS:**
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border: none;
  border-radius: var(--r-md);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  cursor: pointer;
  transition: all var(--transition);
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--accent);
  color: var(--mono-100);
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-light);
}

.btn-secondary {
  background: var(--mono-96);
  color: var(--mono-16);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--mono-88);
}

.btn-ghost {
  background: transparent;
  color: var(--mono-40);
  padding: var(--space-2);
}

.btn-ghost:hover:not(:disabled) {
  color: var(--mono-16);
}

.btn-sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
}

.btn-full {
  width: 100%;
}
```

**Implementação React:**
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  full?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  full = false,
  className = '',
  children,
  ...props 
}: ButtonProps) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size === 'sm' && 'btn-sm',
    full && 'btn-full',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
```

### 2.4 Formulários Condensados

**Layout Visual:**
```
┌─────────────────────────────────┐
│ Nome                            │
│ ┌─────────────────────────────┐ │
│ │ João Silva                  │ │
│ └─────────────────────────────┘ │
│ Telefone                        │
│ ┌─────────────────────────────┐ │
│ │ (41) 98765-4321             │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Implementação CSS:**
```css
.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  margin-bottom: var(--space-3);
}

.field-label {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  color: var(--mono-40);
}

.input {
  width: 100%;
  padding: var(--space-3);
  background: var(--mono-100);
  border: 1px solid var(--mono-88);
  border-radius: var(--r-md);
  font-size: var(--text-sm);
  color: var(--mono-0);
  transition: border-color var(--transition);
}

.input:focus {
  outline: none;
  border-color: var(--mono-40);
}

.input::placeholder {
  color: var(--mono-64);
}
```

**Implementação React:**
```tsx
interface FieldProps {
  label: string;
  children: React.ReactNode;
}

export function Field({ label, children }: FieldProps) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input 
        ref={ref}
        className={`input ${className}`} 
        {...props} 
      />
    );
  }
);
```

### 2.5 Navegação Bottom Minimalista

**Layout Visual:**
```
┌──────┬──────┬──────┬──────┬──────┐
│  ●   │  ○   │  ○   │  ○   │  ○   │
│ Hoje │Agenda│Client│Relat │Perfil│
└──────┴──────┴──────┴──────┴──────┘
```

**Implementação CSS:**
```css
.nav-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--mono-100);
  border-top: 1px solid var(--mono-88);
  display: flex;
  justify-content: space-around;
  padding: var(--space-2) 0 calc(var(--space-2) + env(safe-area-inset-bottom));
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--space-1) var(--space-2);
  background: none;
  border: none;
  color: var(--mono-64);
  font-size: var(--text-2xs);
  font-weight: var(--weight-medium);
  cursor: pointer;
  transition: color var(--transition);
  min-width: 56px;
}

.nav-item.active {
  color: var(--accent);
}

.nav-indicator {
  width: 4px;
  height: 4px;
  border-radius: var(--r-full);
  background: currentColor;
}
```

**Implementação React:**
```tsx
interface NavItem {
  path: string;
  label: string;
}

interface BottomNavProps {
  items: NavItem[];
  activePath: string;
  onNavigate: (path: string) => void;
}

export function BottomNav({ items, activePath, onNavigate }: BottomNavProps) {
  return (
    <nav className="nav-bottom">
      {items.map((item) => {
        const isActive = activePath === item.path;
        return (
          <button
            key={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onNavigate(item.path)}
          >
            <span className="nav-indicator" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
```

---

## 3. BADGES E STATUS

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--r-sm);
  font-size: var(--text-2xs);
  font-weight: var(--weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.badge-default {
  background: var(--mono-96);
  color: var(--mono-40);
}

.badge-active {
  background: var(--accent);
  color: var(--mono-100);
}

.badge-outline {
  background: transparent;
  border: 1px solid var(--mono-88);
  color: var(--mono-40);
}
```

---

## 4. ESTADOS VAZIOS ELEGANTES

**Layout Visual:**
```
┌─────────────────────────────────┐
│                                 │
│            ┌─────┐              │
│            │ 📋  │              │
│            └─────┘              │
│        Nenhum agendamento       │
│        Agende seu primeiro      │
│                                 │
└─────────────────────────────────┘
```

**Implementação CSS:**
```css
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-6) var(--space-4);
  text-align: center;
  color: var(--mono-40);
}

.empty-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--r-full);
  background: var(--mono-96);
  font-size: var(--text-xl);
  margin-bottom: var(--space-3);
}

.empty-title {
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  color: var(--mono-16);
  margin-bottom: var(--space-1);
}

.empty-text {
  font-size: var(--text-sm);
  color: var(--mono-40);
}
```

**Implementação React:**
```tsx
interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      {description && <div className="empty-text">{description}</div>}
      {action && (
        <Button variant="primary" onClick={action.onClick} style={{ marginTop: 'var(--space-4)' }}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
```

---

## 5. EXEMPLO DE TELA: HomePage Refatorada

```tsx
// pages/customer/HomePageMinimalist.tsx
import { DenseCard } from '../../components/DenseCard';
import { EmptyState } from '../../components/EmptyState';
import { Button } from '../../components/Button';
import { useUser } from '../../store/user';
import { useAppointments } from '../../hooks/useAppointments';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { name } = useUser();
  const { upcoming, loading } = useAppointments('customer');
  const navigate = useNavigate();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const formatCurrency = (cents: number) => 
    `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;

  return (
    <div className="screen">
      <div className="container">
        {/* Header */}
        <div className="section">
          <p className="text-meta">{greeting()}</p>
          <h1 className="text-display">{name || 'Cliente'}</h1>
        </div>

        {/* Quick Actions */}
        <div className="section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <button className="card" onClick={() => navigate('/booking')}>
            <div style={{ fontSize: '24px', marginBottom: 'var(--space-2)' }}>📅</div>
            <div className="text-subhead">Agendar</div>
            <div className="text-meta">Novo horário</div>
          </button>
          <button className="card" onClick={() => navigate('/chat')}>
            <div style={{ fontSize: '24px', marginBottom: 'var(--space-2)' }}>💬</div>
            <div className="text-subhead">Chat</div>
            <div className="text-meta">Fale conosco</div>
          </button>
        </div>

        {/* Appointments */}
        <div className="section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <h2 className="text-heading">Próximos</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/appointments')}>
              Ver todos →
            </Button>
          </div>

          {loading ? (
            <div className="skeleton" style={{ height: 100, borderRadius: 'var(--r-md)' }} />
          ) : upcoming.length === 0 ? (
            <EmptyState
              icon="📋"
              title="Nenhum agendamento"
              description="Agende seu primeiro horário"
              action={{ label: 'Agendar agora', onClick: () => navigate('/booking') }}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {upcoming.slice(0, 3).map((a) => (
                <DenseCard
                  key={a.id}
                  title={a.serviceName || 'Serviço'}
                  value={a.priceCents ? formatCurrency(a.priceCents) : undefined}
                  meta={[
                    a.start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    `${a.durationMin}min`,
                    a.staffName || 'Profissional'
                  ]}
                  badge={{ 
                    text: a.status === 'confirmed' ? 'Confirmado' : 'Pendente',
                    variant: a.status === 'confirmed' ? 'active' : 'default'
                  }}
                  onClick={() => navigate(`/appointments/${a.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 6. COMPARAÇÃO: Antes vs Depois

### Antes (Design Dark Atual)
```tsx
// 6 linhas de informação, 120px altura
<div className="appointment-card">
  <div className="heading">{a.serviceName}</div>
  <div className="caption">{a.staffName}</div>
  <div className="caption">{formatDate(a.start)}</div>
  <div className="caption">{formatTime(a.start)}</div>
  <span className="badge">{a.status}</span>
  <div className="heading">{formatPrice(a.priceCents)}</div>
</div>
```

### Depois (Design Minimalista)
```tsx
// 2 linhas de informação, 72px altura (40% menor)
<DenseCard
  title={a.serviceName}
  value={formatPrice(a.priceCents)}
  meta={[formatTime(a.start), `${a.durationMin}min`, a.staffName]}
  badge={{ text: a.status, variant: 'active' }}
/>
```

**Economias:**
- **Vertical:** 40% menos espaço
- **Tokens CSS:** 65% menos variáveis
- **Código:** 50% menos linhas

---

## 7. CHECKLIST DE IMPLEMENTAÇÃO

### Setup Inicial
- [ ] Criar `minimalist.css` com tokens
- [ ] Atualizar `index.css` para importar novo design
- [ ] Criar pasta `components/ui/` para componentes base

### Componentes Base (Ordem de Prioridade)
1. [ ] `Button` - Botões minimalistas
2. [ ] `Card` / `DenseCard` - Cards de alta densidade
3. [ ] `Input` / `Field` - Formulários condensados
4. [ ] `List` / `ListItem` - Listas compactas
5. [ ] `Badge` - Status minimalistas
6. [ ] `EmptyState` - Estados vazios elegantes
7. [ ] `BottomNav` - Navegação minimalista

### Telas a Migrar
1. [ ] `HomePage` (cliente)
2. [ ] `AppointmentsPage` (cliente)
3. [ ] `BookingPage` (cliente)
4. [ ] `DashboardPage` (owner)
5. [ ] `ServicesPage` (owner)
6. [ ] `LoginPage` (auth)

### Validação Final
- [ ] Contraste WCAG AA em todos os textos
- [ ] Touch targets mínimo 44x44px
- [ ] Teste em dispositivos reais (iOS/Android)
- [ ] Lighthouse score > 90 (Performance, Acessibilidade)
