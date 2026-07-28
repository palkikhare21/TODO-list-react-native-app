import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';
import { User } from '../types/auth';
import { clearToken, saveToken } from '../utils/storage';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAuth(action: 'login' | 'register', email: string, password: string) {
    setLoading(true);
    try {
      const response = await authApi[action](email, password);
      await saveToken(response.accessToken);
      setUser(response.user);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await clearToken();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      login: (email: string, password: string) => handleAuth('login', email, password),
      register: (email: string, password: string) => handleAuth('register', email, password),
      logout,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
