import { createContext, useContext, useState, useEffect } from 'react';
import { USERS } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('krishi_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = (email, password) => {
    setLoading(true);
    setError('');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const match = Object.values(USERS).find(
          (u) => u.email === email && u.password === password
        );
        if (match) {
          const { password: _, ...safeUser } = match;
          setUser(safeUser);
          localStorage.setItem('krishi_user', JSON.stringify(safeUser));
          setLoading(false);
          resolve(safeUser);
        } else {
          setError('Invalid email or password. Please use demo credentials.');
          setLoading(false);
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  };

  const loginAs = (role) => {
    const userData = USERS[role];
    if (userData) {
      const { password: _, ...safeUser } = userData;
      setUser(safeUser);
      localStorage.setItem('krishi_user', JSON.stringify(safeUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('krishi_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginAs, logout, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
