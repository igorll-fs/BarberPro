import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Calendar, Clock, User, CheckCircle, XCircle, Hourglass } from 'phosphor-react';

// Mock data
const mockAppointments = [
  {
    id: '1',
    serviceName: 'Corte + Barba',
    barberName: 'João Silva',
    date: '2026-03-07',
    time: '14:00',
    status: 'confirmed',
    price: 60,
  },
  {
    id: '2',
    serviceName: 'Corte Degradê',
    barberName: 'Pedro Santos',
    date: '2026-03-10',
    time: '10:30',
    status: 'pending',
    price: 40,
  },
  {
    id: '3',
    serviceName: 'Barba Completa',
    barberName: 'João Silva',
    date: '2026-02-28',
    time: '16:00',
    status: 'completed',
    price: 25,
  },
];

export default function Appointments() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  
  const role = user?.role || 'cliente';
  const isOwner = role === 'dono';

  const filteredAppointments = mockAppointments.filter(apt => {
    if (activeTab === 'upcoming') {
      return apt.status === 'confirmed' || apt.status === 'pending';
    }
    return apt.status === 'completed' || apt.status === 'cancelled';
  });

  return (
    <div>
      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        padding: '4px',
        background: 'var(--bg-tertiary)',
        borderRadius: '12px',
      }}>
        <button
          onClick={() => setActiveTab('upcoming')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'upcoming' ? 'var(--primary)' : 'transparent',
            border: 'none',
            borderRadius: '10px',
            color: activeTab === 'upcoming' ? 'white' : 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Próximos
        </button>
        <button
          onClick={() => setActiveTab('past')}
          style={{
            flex: 1,
            padding: '10px',
            background: activeTab === 'past' ? 'var(--primary)' : 'transparent',
            border: 'none',
            borderRadius: '10px',
            color: activeTab === 'past' ? 'white' : 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Histórico
        </button>
      </div>

      {/* Appointments List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="card"
            style={{
              borderLeft: `4px solid ${getStatusColor(appointment.status)}`,
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px',
            }}>
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '4px',
                }}>
                  {appointment.serviceName}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                }}>
                  <User size={14} />
                  {appointment.barberName}
                </div>
              </div>
              <StatusBadge status={appointment.status} />
            </div>

            <div style={{
              display: 'flex',
              gap: '16px',
              fontSize: '13px',
              color: 'var(--text-secondary)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} />
                {formatDate(appointment.date)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} />
                {appointment.time}
              </div>
            </div>

            <div style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{
                fontSize: '16px',
                fontWeight: '700',
                color: 'var(--primary)',
              }}>
                R$ {appointment.price}
              </span>
              
              {appointment.status === 'pending' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{
                    padding: '6px 12px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#10B981',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}>
                    Confirmar
                  </button>
                  <button style={{
                    padding: '6px 12px',
                    background: 'rgba(244, 63, 94, 0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#F43F5E',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}>
                    Recusar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>
              {activeTab === 'upcoming' ? '📅' : '📋'}
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
              {activeTab === 'upcoming' ? 'Nenhum agendamento' : 'Nenhum histórico'}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              {activeTab === 'upcoming' 
                ? 'Agende seu próximo corte!' 
                : 'Seus agendamentos passados aparecerão aqui'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    confirmed: { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', label: 'Confirmado', icon: CheckCircle },
    pending: { color: '#F59E0B', bg: 'rgba(251, 191, 36, 0.1)', label: 'Pendente', icon: Hourglass },
    completed: { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', label: 'Concluído', icon: CheckCircle },
    cancelled: { color: '#F43F5E', bg: 'rgba(244, 63, 94, 0.1)', label: 'Cancelado', icon: XCircle },
  };

  const { color, bg, label, icon: Icon } = config[status as keyof typeof config] || config.pending;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 8px',
      background: bg,
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '600',
      color: color,
    }}>
      <Icon size={12} weight="fill" />
      {label}
    </div>
  );
}

function getStatusColor(status: string): string {
  const colors = {
    confirmed: '#10B981',
    pending: '#F59E0B',
    completed: '#3B82F6',
    cancelled: '#F43F5E',
  };
  return colors[status as keyof typeof colors] || '#64748B';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}
