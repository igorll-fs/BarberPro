import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Envelope, Lock, GoogleLogo, Scissors } from 'phosphor-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'cliente' | 'dono'>('cliente');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { setUser, enableDevMode } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let userCredential;
      
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Create user document
        const isDev = email === 'igor@barberpro.app' || email.includes('dev@') || email.includes('admin@');
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          role: isDev ? 'dev' : role,
          createdAt: new Date(),
        });
      }

      // Get user data
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();

      const user = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || userData?.name || 'Usuário',
        photoURL: userCredential.user.photoURL,
        role: userData?.role || 'cliente',
        shopId: userData?.shopId,
      };

      setUser(user);
      
      if (userData?.role === 'dev') {
        enableDevMode(user);
      }
      
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user exists
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        // New user - create as cliente by default
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          name: result.user.displayName,
          role: 'cliente',
          createdAt: new Date(),
        });
      }

      const userData = userDoc.data();
      const isNewUser = !userDoc.exists();

      const user = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || 'Usuário',
        photoURL: result.user.photoURL,
        role: isNewUser ? 'cliente' : userData?.role,
        shopId: userData?.shopId,
      };

      setUser(user);
      
      if (user.role === 'dev') {
        enableDevMode(user);
      }
      
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login com Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Logo */}
      <div style={{
        width: '100px',
        height: '100px',
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
      }}>
        💈
      </div>

      <h1 style={{
        fontSize: '28px',
        fontWeight: '700',
        color: 'var(--text)',
        marginBottom: '8px',
      }}>
        BarberPro
      </h1>

      <p style={{
        fontSize: '14px',
        color: 'var(--text-muted)',
        marginBottom: '32px',
      }}>
        {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
      </p>

      {/* Google Sign In */}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        style={{
          width: '100%',
          maxWidth: '320px',
          padding: '14px',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          color: 'var(--text)',
          fontSize: '15px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          cursor: 'pointer',
          marginBottom: '24px',
        }}
      >
        <GoogleLogo size={20} color="#EA4335" />
        Continuar com Google
      </button>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        width: '100%',
        maxWidth: '320px',
        marginBottom: '24px',
      }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>ou</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>

      {/* Email Form */}
      <form onSubmit={handleSubmit} style={{
        width: '100%',
        maxWidth: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{ position: 'relative' }}>
          <Envelope 
            size={20} 
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--text)',
              fontSize: '15px',
              outline: 'none',
            }}
            required
          />
        </div>

        <div style={{ position: 'relative' }}>
          <Lock 
            size={20} 
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--text)',
              fontSize: '15px',
              outline: 'none',
            }}
            required
          />
        </div>

        {!isLogin && (
          <div style={{
            display: 'flex',
            gap: '12px',
            padding: '4px',
            background: 'var(--bg-tertiary)',
            borderRadius: '10px',
          }}>
            <button
              type="button"
              onClick={() => setRole('cliente')}
              style={{
                flex: 1,
                padding: '10px',
                background: role === 'cliente' ? 'var(--primary)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: role === 'cliente' ? 'white' : 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Cliente
            </button>
            <button
              type="button"
              onClick={() => setRole('dono')}
              style={{
                flex: 1,
                padding: '10px',
                background: role === 'dono' ? 'var(--primary)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: role === 'dono' ? 'white' : 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Dono
            </button>
          </div>
        )}

        {error && (
          <div style={{
            padding: '12px',
            background: 'rgba(244, 63, 94, 0.1)',
            borderRadius: '8px',
            color: '#F43F5E',
            fontSize: '13px',
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: 'var(--primary)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '15px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginTop: '8px',
          }}
        >
          {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar Conta'}
        </button>
      </form>

      <button
        onClick={() => setIsLogin(!isLogin)}
        style={{
          marginTop: '24px',
          background: 'none',
          border: 'none',
          color: 'var(--primary)',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
        }}
      >
        {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
      </button>

      {/* Dev hint */}
      <div style={{
        marginTop: '32px',
        padding: '12px 16px',
        background: 'var(--bg-tertiary)',
        borderRadius: '8px',
        fontSize: '12px',
        color: 'var(--text-muted)',
        textAlign: 'center',
      }}>
        💡 Use email com <strong>@dev</strong> ou <strong>@admin</strong> para modo desenvolvedor
      </div>
    </div>
  );
}
