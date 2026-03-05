import { useUser } from '../src/store/user';

describe('User Store (Zustand)', () => {
  beforeEach(() => {
    useUser.setState({
      uid: null,
      role: null,
      shopId: null,
      isAuthenticated: false,
      isDemo: false,
    });
  });

  it('estado inicial é role null', () => {
    const state = useUser.getState();
    expect(state.role).toBeNull();
    expect(state.shopId).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('setAuth atualiza role e shopId corretamente', () => {
    useUser.getState().setAuth('uid123', 'dono', 'shop123');
    expect(useUser.getState().role).toBe('dono');
    expect(useUser.getState().shopId).toBe('shop123');
    expect(useUser.getState().isAuthenticated).toBe(true);
  });

  it('setAuth aceita todos os roles válidos', () => {
    const roles = ['cliente', 'dono', 'funcionario'] as const;
    roles.forEach(role => {
      useUser.getState().setAuth(`uid-${role}`, role, 'shop123');
      expect(useUser.getState().role).toBe(role);
    });
  });

  it('setAuth aceita shopId null', () => {
    useUser.getState().setAuth('uid123', 'cliente', null);
    expect(useUser.getState().shopId).toBeNull();
    expect(useUser.getState().role).toBe('cliente');
  });

  it('signOut limpa todos os dados', () => {
    useUser.getState().setAuth('uid123', 'dono', 'shop123');
    useUser.getState().signOut();
    expect(useUser.getState().role).toBeNull();
    expect(useUser.getState().shopId).toBeNull();
    expect(useUser.getState().isAuthenticated).toBe(false);
  });

  it('setDemo configura modo demo corretamente', () => {
    useUser.getState().setDemo('cliente');
    expect(useUser.getState().isDemo).toBe(true);
    expect(useUser.getState().role).toBe('cliente');
    expect(useUser.getState().isAuthenticated).toBe(true);
  });
});
