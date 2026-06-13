'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface UserContextType {
  user: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Oturum kaynağı: httpOnly cookie. Mount'ta sunucudan doğrula.
  useEffect(() => {
    let active = true;
    fetch('/api/user/me', { credentials: 'same-origin' })
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (active) setUser(data.user ?? null);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Giriş başarısız' };
    } catch {
      return { success: false, error: 'Bir hata oluştu' };
    }
  };

  const register = async (regData: { email: string; password: string; firstName: string; lastName: string }) => {
    try {
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(regData),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Kayıt başarısız' };
    } catch {
      return { success: false, error: 'Bir hata oluştu' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/user/logout', { method: 'POST', credentials: 'same-origin' });
    } catch {
      // yine de yerel durumu temizle
    }
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
