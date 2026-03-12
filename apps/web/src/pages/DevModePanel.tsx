import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { 
  User, Crown, Scissors, ArrowLeft, 
  Check, Warning, Info, Bug,
  UserSwitch, Eye, EyeSlash
} from 'phosphor-react';
import { UserRole } from '../types';

export default function DevModePanel() {
  const { 
    user, 
    isDevMode, 
    currentRoleView, 
    originalRole,
    switchRole, 
    disableDevMode 
  } = useAuthStore();
  
  const navigate = useNavigate();
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  // Only accessible for dev users
  if (!isDevMode) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <Warning size={48} color="#F59E0B" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
          Acesso Restrito
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Esta área é exclusiva para desenvolvedores.
        </p>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            background: 'var(--primary)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Voltar
        </button>
      </div>
    );
  }

  const roles: { id: UserRole; label: string; icon: React.ReactNode; description: string; color: string }[] = [
    {
      id: 'cliente',
      label: 'Cliente',
      icon: <User size={24} />,
      description: 'Visualização do app como cliente - agendamentos, busca de barbearias, histórico',
      color: '#3B82F6',
    },
    {
      id: 'dono',
      label: 'Proprietário',
      icon: <Crown size={24} />,
      description: 'Dashboard completo - agenda, relatórios, equipe, configurações',
      color: '#F59E0B',
    },
    {
      id: 'funcionario',
      label: 'Barbeiro',
      icon: <Scissors size={24} />,
      description: 'Área do barbeiro - agenda pessoal, clientes, disponibilidade',
      color: '#10B981',
    },
  ];

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    navigate('/');
  };

  const handleDisableDevMode = () => {
    disableDevMode();
    navigate('/');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '8px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            cursor: 'pointer',
            color: 'var(--text)',
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>
            🛠️ Painel Dev
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Teste todas as funcionalidades
          </p>
        </div>
      </div>

      {/* Dev Info Card */}
      <div style={{
        padding: '16px',
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        borderRadius: '12px',
        marginBottom: '20px',
        color: 'white',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <Bug size={24} />
          <span style={{ fontWeight: '600' }}>Modo Desenvolvedor Ativo</span>
        </div>
        <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '8px' }}>
          Você pode alternar entre diferentes perfis para testar todas as funcionalidades do app.
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          fontSize: '12px',
          opacity: 0.8,
        }}>
          <span>Role original: <strong>{originalRole}</strong></span>
          <span>•</span>
          <span>UID: <strong>{user?.uid?.slice(0, 8)}...</strong></span>
        </div>
      </div>

      {/* Current View */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Visualização Atual
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          background: 'var(--bg-tertiary)',
          borderRadius: '10px',
        }}>
          {currentRoleView && (
            <>
              <div style={{
                width: '48px',
                height: '48px',
                background: roles.find(r => r.id === currentRoleView)?.color + '20',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: roles.find(r => r.id === currentRoleView)?.color,
              }}>
                {roles.find(r => r.id === currentRoleView)?.icon}
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '16px' }}>
                  {roles.find(r => r.id === currentRoleView)?.label}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {roles.find(r => r.id === currentRoleView)?.description}
                </div>
              </div>
              <Check size={24} color="#10B981" style={{ marginLeft: 'auto' }} />
            </>
          )}
        </div>
      </div>

      {/* Role Switcher */}
      <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Alternar Perfil
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => handleRoleSwitch(role.id)}
            disabled={currentRoleView === role.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: currentRoleView === role.id ? role.color + '15' : 'var(--card)',
              border: `2px solid ${currentRoleView === role.id ? role.color : 'var(--border)'}`,
              borderRadius: '12px',
              cursor: currentRoleView === role.id ? 'default' : 'pointer',
              textAlign: 'left',
              width: '100%',
              opacity: currentRoleView === role.id ? 1 : 0.9,
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              background: role.color + '20',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: role.color,
            }}>
              {role.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: '600', 
                fontSize: '15px',
                color: currentRoleView === role.id ? role.color : 'var(--text)',
              }}>
                {role.label}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {role.description}
              </div>
            </div>
            {currentRoleView === role.id && (
              <div style={{
                padding: '4px 8px',
                background: role.color,
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '700',
                color: 'white',
              }}>
                ATIVO
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Debug Info */}
      <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Informações de Debug
      </h3>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px' }}>Dados Sensíveis</span>
          <button
            onClick={() => setShowSensitiveData(!showSensitiveData)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              color: 'var(--text)',
              cursor: 'pointer',
            }}
          >
            {showSensitiveData ? <EyeSlash size={16} /> : <Eye size={16} />}
            {showSensitiveData ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        {showSensitiveData && (
          <div style={{
            padding: '12px',
            background: 'var(--bg-tertiary)',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>UID: </span>
              <span>{user?.uid}</span>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Email: </span>
              <span>{user?.email}</span>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Role Original: </span>
              <span>{originalRole}</span>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Role Atual: </span>
              <span style={{ color: '#10B981' }}>{currentRoleView}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Shop ID: </span>
              <span>{user?.shopId || 'Nenhum'}</span>
            </div>
          </div>
        )}

        {!showSensitiveData && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            color: 'var(--text-muted)',
            fontSize: '13px',
          }}>
            Clique em "Mostrar" para ver dados sensíveis
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Ações Rápidas
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        <ActionButton 
          icon="🧹"
          label="Limpar Cache"
          onClick={() => {
            localStorage.clear();
            alert('Cache limpo!');
          }}
        />
        <ActionButton 
          icon="🔔"
          label="Testar Notificação"
          onClick={() => {
            if ('Notification' in window) {
              Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                  new Notification('BarberPro Dev', {
                    body: 'Notificações funcionando! 🎉',
                    icon: '/icons/icon-192x192.png',
                  });
                }
              });
            }
          }}
        />
        <ActionButton 
          icon="📱"
          label="Simular iOS"
          onClick={() => {
            document.body.classList.add('ios-standalone');
            alert('Simulação iOS ativada!');
          }}
        />
      </div>

      {/* Disable Dev Mode */}
      <button
        onClick={handleDisableDevMode}
        style={{
          width: '100%',
          padding: '16px',
          background: 'transparent',
          border: '2px solid var(--border)',
          borderRadius: '12px',
          color: 'var(--text-muted)',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <UserSwitch size={20} />
        Sair do Modo Dev
      </button>

      <p style={{ 
        textAlign: 'center', 
        marginTop: '12px',
        fontSize: '12px', 
        color: 'var(--text-muted)',
      }}>
        Você voltará ao seu perfil original: <strong>{originalRole}</strong>
      </p>
    </div>
  );
}

function ActionButton({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
      }}
    >
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)' }}>
        {label}
      </span>
    </button>
  );
}
