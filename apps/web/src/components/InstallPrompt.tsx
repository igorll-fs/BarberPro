import { useState, useEffect } from 'react';
import { X, Share, PlusSquare } from 'phosphor-react';

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Show prompt after 3 seconds if not installed
    if (ios && !standalone) {
      const timer = setTimeout(() => {
        const hasSeenPrompt = localStorage.getItem('barberpro-install-prompt');
        if (!hasSeenPrompt) {
          setShowPrompt(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('barberpro-install-prompt', 'true');
  };

  if (!showPrompt || !isIOS || isStandalone) return null;

  return (
    <div className="install-prompt">
      <button className="install-prompt-close" onClick={handleClose}>
        <X size={20} />
      </button>
      
      <div className="install-prompt-title">
        📱 Adicione à Tela Inicial
      </div>
      
      <div className="install-prompt-text">
        Instale o BarberPro como um app nativo no seu iPhone:
      </div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        marginBottom: '12px',
        fontSize: '14px',
        color: '#94A3B8'
      }}>
        <span>1. Toque no botão</span>
        <Share size={18} style={{ color: '#10B981' }} />
        <span>Compartilhar</span>
      </div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        fontSize: '14px',
        color: '#94A3B8'
      }}>
        <span>2. Escolha</span>
        <PlusSquare size={18} style={{ color: '#10B981' }} />
        <span>Adicionar à Tela de Início</span>
      </div>
      
      <button 
        onClick={handleClose}
        style={{
          width: '100%',
          marginTop: '16px',
          padding: '12px',
          background: '#10B981',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
        }}
      >
        Entendi
      </button>
    </div>
  );
}
