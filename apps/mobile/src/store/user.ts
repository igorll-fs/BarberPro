/* ============================
   BARBERPRO — User Store (Zustand)
   Persiste auth state + claims
   ============================ */
import { create } from 'zustand';
import type { UserRole, UserProfile } from '../types/models';
import { isAuthorizedDev } from '../config/dev.config';

interface UserState {
  // Auth
  uid: string | null;
  role: UserRole | null;
  shopId: string | null;

  // Profile
  name: string | null;
  email: string | null;
  phone: string | null;
  photoUrl: string | null;
  pushToken: string | null;

  // Status
  isReady: boolean;        // Auth listener inicializado
  isAuthenticated: boolean;
  isDemo: boolean;         // Modo demo (sem Firebase)
  
  // Dev Mode - APENAS para UIDs autorizados na whitelist
  isDevMode: boolean;      // Modo desenvolvedor ativo
  isAuthorizedDev: boolean; // Se o usuário atual está na whitelist
  originalRole: UserRole | null;  // Role original antes do dev mode
  devRoleView: UserRole | null;   // Role atual sendo visualizada no dev mode

  // Actions
  setAuth: (uid: string, role: UserRole, shopId?: string | null) => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  setPushToken: (token: string | null) => void;
  setDemo: (role: UserRole, shopId?: string) => void;
  setReady: () => void;
  signOut: () => void;
  logout: () => void;  // Alias for signOut
  setUser: (uid: string, role: UserRole, shopId?: string | null) => void;  // Alias for setAuth
  
  // Dev Mode Actions
  checkDevAuthorization: () => boolean;
  enableDevMode: () => void;
  switchDevRole: (role: UserRole) => void;
  disableDevMode: () => void;
}

export const useUser = create<UserState>((set, get) => ({
  uid: null,
  role: null,
  shopId: null,
  name: null,
  email: null,
  phone: null,
  photoUrl: null,
  pushToken: null,
  isReady: false,
  isAuthenticated: false,
  isDemo: false,
  isDevMode: false,
  isAuthorizedDev: false,
  originalRole: null,
  devRoleView: null,

  setAuth: (uid, role, shopId = null) => {
    // Verifica se este UID está autorizado como dev
    const authorized = isAuthorizedDev(uid);
    
    set({ 
      uid, 
      role, 
      shopId, 
      isAuthenticated: true, 
      isDemo: false,
      isAuthorizedDev: authorized,
    });
  },

  setProfile: (profile) =>
    set((state) => ({
      name: profile.name ?? state.name,
      email: profile.email ?? state.email,
      phone: profile.phone ?? state.phone,
      photoUrl: profile.photoUrl ?? state.photoUrl,
    })),

  setPushToken: (token) => set({ pushToken: token }),

  setDemo: (role, shopId = 'demo') =>
    set({ uid: 'demo-user', role, shopId, isAuthenticated: true, isDemo: true, name: `Demo ${role}` }),

  setReady: () => set({ isReady: true }),

  signOut: () =>
    set({
      uid: null, role: null, shopId: null,
      name: null, email: null, phone: null, photoUrl: null,
      pushToken: null, isAuthenticated: false, isDemo: false,
      isDevMode: false, isAuthorizedDev: false, originalRole: null, devRoleView: null,
    }),
    
  // Verifica autorização contra a whitelist
  checkDevAuthorization: () => {
    const { uid } = get();
    const authorized = isAuthorizedDev(uid);
    set({ isAuthorizedDev: authorized });
    return authorized;
  },
    
  // Dev Mode Actions - Só funciona se estiver na whitelist
  enableDevMode: () => {
    const { uid, role, isAuthorizedDev: authorized } = get();
    
    // Verificação dupla de segurança
    if (!authorized || !isAuthorizedDev(uid)) {
      console.warn('🚫 Tentativa não autorizada de ativar dev mode:', uid);
      return;
    }
    
    set({
      isDevMode: true,
      originalRole: role,
      devRoleView: 'cliente', // Começa como cliente
    });
    
    console.log('✅ Modo desenvolvedor ativado para:', uid);
  },
  
  switchDevRole: (role: UserRole) => {
    if (!get().isDevMode) {
      console.warn('🚫 Tentativa de switch sem dev mode ativo');
      return;
    }
    
    set({
      devRoleView: role,
      role: role, // Atualiza o role atual para mudar a navegação
    });
  },
  
  disableDevMode: () => {
    const original = get().originalRole;
    set({
      isDevMode: false,
      devRoleView: null,
      role: original || get().role, // Volta ao role original
      originalRole: null,
    });
  },
  
  // Aliases for compatibility
  logout: () => {
    const { signOut } = get();
    signOut();
  },
  
  setUser: (uid: string, role: UserRole, shopId?: string | null) => {
    const { setAuth } = get();
    setAuth(uid, role, shopId);
  },
}));
