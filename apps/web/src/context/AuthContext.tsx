import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserDto } from '@plotweaver/shared';

interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  apiKey: string | null;
  isLoading: boolean;
  login: (token: string, user: UserDto) => void;
  logout: () => void;
  setCustomApiKey: (key: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('plotweaver_token');
      const savedUser = localStorage.getItem('plotweaver_user');
      const savedKey = localStorage.getItem('plotweaver_gemini_key');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
      if (savedKey) {
        setApiKey(savedKey);
      }
    } catch (e) {
      console.error('Error hydrating auth state:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: UserDto) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('plotweaver_token', newToken);
    localStorage.setItem('plotweaver_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('plotweaver_token');
    localStorage.removeItem('plotweaver_user');
  };

  const setCustomApiKey = (key: string | null) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('plotweaver_gemini_key', key);
    } else {
      localStorage.removeItem('plotweaver_gemini_key');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        apiKey,
        isLoading,
        login,
        logout,
        setCustomApiKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
