import { useAuthStore } from '../store/authStore';
import { Scissors, Calendar, Star, Users, TrendUp, Clock } from 'phosphor-react';

export default function Home() {
  const { user, isDevMode, currentRoleView } = useAuthStore();
  
  const role = user?.role || 'cliente';
  const isOwner = role === 'dono';
  const isStaff = role === 'funcionario';
  const isCustomer = role === 'cliente';

  // Show dev mode banner if active
  const showDevBanner = isDevMode && currentRoleView;

  return (
    <div>
      {/* Dev Mode Banner */}
      {showDevBanner && (
        <div style={{
          padding: '12px 16px',
          background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
          borderRadius: '12px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontSize: '12px', opacity: 0.9 }}>🛠️ Modo Dev - Visualizando como:</span>
            <span style={{ 
              marginLeft: '8px', 
              fontWeight: '700',
              textTransform: 'uppercase',
              fontSize: '14px',
            }}>
              {currentRoleView}
            </span>
          </div>
        </div>
      )}

      {/* Welcome */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ 
          fontSize: '22px', 
          fontWeight: '700',
          marginBottom: '4px',
        }}>
          Olá, {user?.displayName?.split(' ')[0] || 'Usuário'}! 👋
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          {isOwner ? 'Gerencie sua barbearia' : isStaff ? 'Veja sua agenda' : 'Agende seu horário'}
        </p>
      </div>

      {/* Quick Stats - Owner/Staff */}
      {(isOwner || isStaff) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '20px',
        }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <Calendar size={24} color="#10B981" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>12</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Hoje</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <Users size={24} color="#3B82F6" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#3B82F6' }}>48</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Esta semana</div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <h3 style={{ 
        fontSize: '16px', 
        fontWeight: '600',
        marginBottom: '12px',
        color: 'var(--text-secondary)',
      }}>
        Ações Rápidas
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isCustomer && (
          <>
            <ActionCard 
              icon={<Scissors size={24} />}
              title="Agendar Corte"
              subtitle="Escolha horário e barbeiro"
              color="#10B981"
            />
            <ActionCard 
              icon={<Calendar size={24} />}
              title="Meus Agendamentos"
              subtitle="Veja seus próximos cortes"
              color="#3B82F6"
            />
            <ActionCard 
              icon={<Star size={24} />}
              title="Fidelidade"
              subtitle="Seus pontos e recompensas"
              color="#F59E0B"
            />
          </>
        )}

        {(isOwner || isStaff) && (
          <>
            <ActionCard 
              icon={<Calendar size={24} />}
              title="Ver Agenda"
              subtitle="Próximos atendimentos"
              color="#10B981"
            />
            <ActionCard 
              icon={<TrendUp size={24} />}
              title="Relatórios"
              subtitle="Vendas e estatísticas"
              color="#3B82F6"
            />
            <ActionCard 
              icon={<Clock size={24} />}
              title="Horários"
              subtitle="Configurar disponibilidade"
              color="#F59E0B"
            />
          </>
        )}
      </div>

      {/* Recent Activity */}
      <h3 style={{ 
        fontSize: '16px', 
        fontWeight: '600',
        marginTop: '24px',
        marginBottom: '12px',
        color: 'var(--text-secondary)',
      }}>
        Atividade Recente
      </h3>

      <div className="card">
        <EmptyState 
          icon="📋"
          title="Nenhuma atividade"
          subtitle="Suas ações recentes aparecerão aqui"
        />
      </div>
    </div>
  );
}

// Components
function ActionCard({ icon, title, subtitle, color }: { 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string;
  color: string;
}) {
  return (
    <button style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'left',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        background: `${color}20`,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          fontSize: '15px',
          fontWeight: '600',
          color: 'var(--text)',
          marginBottom: '2px',
        }}>
          {title}
        </div>
        <div style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
        }}>
          {subtitle}
        </div>
      </div>
    </button>
  );
}

function EmptyState({ icon, title, subtitle }: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '32px 16px',
    }}>
      <div style={{ fontSize: '48px', marginBottom: '12px' }}>{icon}</div>
      <div style={{
        fontSize: '15px',
        fontWeight: '600',
        color: 'var(--text)',
        marginBottom: '4px',
      }}>
        {title}
      </div>
      <div style={{
        fontSize: '13px',
        color: 'var(--text-muted)',
      }}>
        {subtitle}
      </div>
    </div>
  );
}
