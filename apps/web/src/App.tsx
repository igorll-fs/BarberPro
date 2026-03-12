import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './services/firebase';
import { useAuthStore } from './store/authStore';
import { User } from './types';

// Layouts
import MainLayout from './components/MainLayout';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import Appointments from './pages/Appointments';
import Profile from './pages/Profile';
import DevModePanel from './pages/DevModePanel';
import InstallPrompt from './components/InstallPrompt';

function App() {
  const { setUser, setLoading, enableDevMode } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();
          
          const user: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || userData?.name || 'Usuário',
            photoURL: firebaseUser.photoURL,
            role: userData?.role || 'cliente',
            shopId: userData?.shopId,
          };
          
          setUser(user);
          
          // Enable dev mode for dev accounts
          if (userData?.role === 'dev' || 
              firebaseUser.email === 'igor@barberpro.app' ||
              firebaseUser.email?.includes('admin@') ||
              firebaseUser.email?.includes('dev@')) {
            enableDevMode(user);
          }
        } catch (error) {
          console.error('Error loading user:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading, enableDevMode]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="profile" element={<Profile />} />
          <Route path="dev" element={<DevModePanel />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <InstallPrompt />
    </>
  );
}

export default App;
