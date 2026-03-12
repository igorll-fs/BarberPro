/* ============================
   BARBERPRO — Hook de Autenticação
   Ouve onAuthStateChanged e sincroniza com store
   ============================ */
import { useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { getClaims } from '../services/claims';
import { useUser } from '../store/user';
import type { UserRole } from '../types/models';

export function useAuthListener() {
  // Usar seletores individuais para evitar problemas de referência
  const setAuth = useUser((s) => s.setAuth);
  const setProfile = useUser((s) => s.setProfile);
  const setReady = useUser((s) => s.setReady);
  const clearStore = useUser((s) => s.signOut);
  
  // Ref para controlar se já inicializou
  const initialized = useRef(false);

  useEffect(() => {
    // Evitar dupla inicialização
    if (initialized.current) return;
    initialized.current = true;

    // Se Firebase auth não inicializou, marcar como ready sem auth
    if (!auth) {
      console.log('⚠️ Firebase auth não disponível, modo demo');
      setReady();
      return;
    }

    // Timeout de segurança para não travar o app
    const timeout = setTimeout(() => {
      console.log('⏰ Auth timeout, continuando sem autenticação');
      setReady();
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(timeout);
      
      if (firebaseUser) {
        try {
          // Buscar claims (role, shopId)
          const claims = await getClaims();
          const role = (claims.role as UserRole) || 'cliente';
          const shopId = (claims.shopId as string) || null;
          setAuth(firebaseUser.uid, role, shopId);

          // Buscar perfil do Firestore
          if (db) {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              setProfile({
                name: data.name || firebaseUser.displayName || null,
                email: data.email || firebaseUser.email || null,
                phone: data.phone || firebaseUser.phoneNumber || null,
                photoUrl: data.photoUrl || firebaseUser.photoURL || null,
              });
            } else {
              setProfile({
                name: firebaseUser.displayName || undefined,
                email: firebaseUser.email || undefined,
                phone: firebaseUser.phoneNumber || undefined,
                photoUrl: firebaseUser.photoURL || undefined,
              });
            }
          }
        } catch (err) {
          console.warn('Erro ao carregar perfil:', err);
          // Manter autenticado mesmo com erro no perfil
          setAuth(firebaseUser.uid, 'cliente', null);
        }
      } else {
        clearStore();
      }
      setReady();
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [setAuth, setProfile, setReady, clearStore]);
}

export async function doSignOut() {
  try {
    if (auth) await firebaseSignOut(auth);
  } catch {}
  useUser.getState().signOut();
}
