import { User } from '@/types/db-types';
import { createContext, useContext, useState, useEffect } from 'react';
import { getQueryClient } from '@/lib/get-query-client';
import { refreshToken } from '@/lib/api/generated/users/users';
import { unwrap } from '@/lib/api/unwrap';
import type { AuthResponse } from '@/lib/api/generated/model';

const AUTH_TOKEN_KEY = 'auth_token';

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
  const queryClient = getQueryClient();

  // Restore the session from a stored token on first load.
  useEffect(() => {
    if (!localStorage.getItem(AUTH_TOKEN_KEY)) return;

    let cancelled = false;

    const restore = async () => {
      try {
        // The generated client reads the stored token itself and throws on a
        // rejected refresh. The hand-written version called res.json() without
        // checking the status, so an expired token produced an error body,
        // left data.token undefined, and silently did nothing — stranding the
        // stale token in localStorage and the app in a half-signed-in state.
        const auth = unwrap<AuthResponse>(await refreshToken());
        if (cancelled) return;

        setToken(auth.token);
        setUser(auth.user);
        localStorage.setItem(AUTH_TOKEN_KEY, auth.token);
      } catch {
        if (cancelled) return;

        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    };

    void restore();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    // Drops every cached query so the next account cannot see this one's data.
    queryClient.clear();
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
