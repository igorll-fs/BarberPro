import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { SignOut, House, Calendar, User, Code } from 'phosphor-react';
import { auth } from '../services/firebase';

export default function MainLayout() {
  const { user, isAuthenticated, isDevMode, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await auth.signOut();
    signOut();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Determine which navigation to show based on current role
  const role = user?.role || 'cliente';
  const isOwner = role === 'dono';
  const isStaff = role === 'funcionario';

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1 className="header-title">
          {isOwner ? 'Dashboard' : isStaff ? 'Área do Barbeiro' : 'BarberPro'}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isDevMode && (
            <NavLink to="/dev" style={{ color: '#10B981' }}>
              <Code size={24} />
            </NavLink>
          )}
          <button 
            onClick={handleSignOut}
            style={{
              background: 'none',
              border: 'none',
              color: '#F43F5E',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            <SignOut size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="screen">
        <div className="content">
          <Outlet />
        </div>
      </main>

      {/* Tab Bar */}
      <nav className="tab-bar">
        <NavLink to="/" className="tab-item" end>
          <House className="tab-icon" weight="fill" />
          <span>Início</span>
        </NavLink>
        
        <NavLink to="/appointments" className="tab-item">
          <Calendar className="tab-icon" weight="fill" />
          <span>Agenda</span>
        </NavLink>
        
        <NavLink to="/profile" className="tab-item">
          <User className="tab-icon" weight="fill" />
          <span>Perfil</span>
        </NavLink>
      </nav>
    </div>
  );
}
