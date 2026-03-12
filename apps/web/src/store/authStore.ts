import { create } from 'zustand';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Dev mode
  isDevMode: boolean;
  originalRole: UserRole | null;
  currentRoleView: UserRole | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
  
  // Dev mode actions
  enableDevMode: (user: User) => void;
  switchRole: (role: UserRole) => void;
  disableDevMode: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isDevMode: false,
  originalRole: null,
  currentRoleView: null,
  
  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
    isLoading: false,
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  signOut: () => set({
    user: null,
    isAuthenticated: false,
    isDevMode: false,
    originalRole: null,
    currentRoleView: null,
  }),
  
  // Dev mode - permite alternar entre roles
  enableDevMode: (user) => {
    if (user.role === 'dev' || user.email?.includes('dev@') || user.email === 'igor@barberpro.app') {
      set({
        isDevMode: true,
        originalRole: user.role,
        currentRoleView: 'cliente', // Começa como cliente para testar tudo
      });
    }
  },
  
  switchRole: (role) => set({
    currentRoleView: role,
    user: (state) => state.user ? { ...state.user, role } : null,
  }),
  
  disableDevMode: () => set((state) => ({
    isDevMode: false,
    currentRoleView: null,
    user: state.user && state.originalRole 
      ? { ...state.user, role: state.originalRole } 
      : state.user,
  })),
}));
