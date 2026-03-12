import { useAuthStore } from '../store/authStore';
import { User, Envelope, Phone, Scissors, Crown, UserCircle } from 'phosphor-react';

export default function Profile() {
  const { user, isDevMode, currentRoleView } = useAuthStore();

  const role = user?.role || 'cliente';
  const isOwner = role === 'dono';
  const isStaff = role === 'funcionario';

  const getRoleIcon = () => {
    if (role === 'dono') return <Crown size={20} color="#F59E0B" />;
    if (role === 'funcionario') return <Scissors size={20} color="#10B981" />;
    return <UserCircle size={20} color="#3B82F6" />;
  };

  const getRoleLabel = () => {
    if (role === 'dono') return 'Proprietário';
    if (role === 'funcionario') return 'Barbeiro';
    return 'Cliente';
  };

  return (
    <div>
      {/* Profile Header */}
      <div className="card" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          borderRadius: '50%',
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
        }}>
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            '👤'
          )}
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>
          {user?.displayName || 'Usuário'}
        </h2>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          background: 'var(--bg-tertiary)',
          borderRadius: '20px',
          fontSize: '13px',
          color: 'var(--text-secondary)',
        }}>
          {getRoleIcon()}
          {getRoleLabel()}
          {isDevMode && (
            <span style={{ 
              marginLeft: '4px',
              padding: '2px 6px',
              background: '#10B981',
              borderRadius: '4px',
              fontSize: '10px',
              color: 'white',
              fontWeight: '700',
            }}>
              DEV
            </span>
          )}
        </div>

        {isDevMode && currentRoleView && (
          <div style={{
            marginTop: '12px',
            padding: '8px',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#10B981',
          }}>
            Visualizando como: <strong>{currentRoleView}</strong>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <h3 style={{
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--text-secondary)',
        marginBottom: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        Informações de Contato
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        <InfoCard 
          icon={<Envelope size={20} />}
          label="Email"
          value={user?.email || 'Não informado'}
        />
        <InfoCard 
          icon={<Phone size={20} />}
          label="Telefone"
          value="(11) 99999-9999"
        />
      </div>

      {/* Stats - Only for owners/staff */}
      {(isOwner || isStaff) && (
        <>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Estatísticas
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '24px',
          }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>156</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cortes este mês</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#3B82F6' }}>4.9</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Avaliação</div>
            </div>
          </div>
        </>
      )}

      {/* Settings */}
      <h3 style={{
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--text-secondary)',
        marginBottom: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        Configurações
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <SettingsItem icon="🔔" label="Notificações" />
        <SettingsItem icon="🌙" label="Tema Escuro" value="Ativado" />
        <SettingsItem icon="🔒" label="Privacidade" />
        <SettingsItem icon="❓" label="Ajuda e Suporte" />
        
        {isDevMode && (
          <a 
            href="#/dev"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '12px',
              textDecoration: 'none',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <span style={{ fontSize: '20px' }}>🛠️</span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#10B981',
              }}>
                Painel de Desenvolvedor
              </div>
              <div style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
              }}>
                Alternar entre modos de visualização
              </div>
            </div>
            <span style={{ color: '#10B981' }}>→</span>
          </a>
        )}
      </div>

      {/* Version */}
      <div style={{
        marginTop: '32px',
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--text-muted)',
      }}>
        BarberPro v1.0.0 (PWA)
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      background: 'var(--card)',
      borderRadius: '12px',
      border: '1px solid var(--border)',
    }}>
      <div style={{ color: 'var(--text-muted)' }}>{icon}</div>
      <div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>
          {label}
        </div>
        <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)' }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function SettingsItem({ icon, label, value }: { icon: string; label: string; value?: string }) {
  return (
    <button style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'left',
    }}>
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text)' }}>
          {label}
        </div>
      </div>
      {value && (
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {value}
        </span>
      )}
      <span style={{ color: 'var(--text-muted)' }}>›</span>
    </button>
  );
}
