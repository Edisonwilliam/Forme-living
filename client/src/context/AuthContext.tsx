import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { authService } from '../services/authService';
import type { User } from '../types';

interface AuthState {
  user: Pick<User, 'id' | 'name' | 'email' | 'role'> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isAdmin: false,
  });

  const setUser = useCallback((user: AuthState['user']) => {
    setState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
      isAdmin: user?.role === 'admin',
    });
  }, []);

  // Restore session on mount if a token exists
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('forme_token');
    if (!token) {
      setState((s) => ({ ...s, isLoading: false }));
      return;
    }
    try {
      const fullUser = await authService.getMe();
      setUser({ id: fullUser.id, name: fullUser.name, email: fullUser.email, role: fullUser.role });
    } catch {
      localStorage.removeItem('forme_token');
      setUser(null);
    }
  }, [setUser]);

  useEffect(() => {
    refreshUser();

    // Listen for 401 events from apiClient interceptor
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('forme:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('forme:unauthorized', handleUnauthorized);
  }, [refreshUser, setUser]);

  const login = async (email: string, password: string) => {
    const { user } = await authService.login(email, password);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string) => {
    const { user } = await authService.register(name, email, password);
    setUser(user);
  };

  const googleLogin = async (credential: string) => {
    const { user } = await authService.googleLogin(credential);
    setUser(user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, googleLogin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an <AuthProvider>');
  return ctx;
}
