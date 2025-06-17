import { User } from '@/types/db-types';
import { createContext, useContext, useState, useEffect } from 'react';

type AuthContextType = {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/refresh-token`, {
        method: 'POST',
        headers: {
          'Authorization': storedToken
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.token && data.user) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('auth_token', data.token);
        }
      })
      .catch(() => {
        localStorage.removeItem('auth_token');
      });
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
