import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthState {
  user: string;
  loggedAt: string;
  token: string;
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  authState: AdminAuthState | null;
  login: (devKey: string) => boolean;
  logout: () => void;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY = 'ats_admin_auth_v1';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authState, setAuthState] = useState<AdminAuthState | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const state = JSON.parse(stored) as AdminAuthState;
        setAuthState(state);
        setIsAuthenticated(true);
      } catch (e) {
        // Invalid stored state, clear it
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = (devKey: string): boolean => {
    const expectedKey = import.meta.env.VITE_ADMIN_DEV_KEY;

    if (!expectedKey) {
      console.warn('VITE_ADMIN_DEV_KEY not configured in environment variables');
      return false;
    }

    if (devKey === expectedKey) {
      const newAuthState: AdminAuthState = {
        user: 'admin',
        loggedAt: new Date().toISOString(),
        token: Math.random().toString(36).substring(2, 15),
      };
      setAuthState(newAuthState);
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthState(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, authState, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
