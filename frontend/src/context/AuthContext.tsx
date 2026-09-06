import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  loginUser: (user: User, token: string) => void;
  logoutUser: () => void;
  hasConsent: boolean;
  setConsent: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('medsafe_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [hasConsent, setConsent] = useState<boolean>(() => {
    return localStorage.getItem('medsafe_consent') === 'true';
  });

  const loginUser = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('medsafe_user', JSON.stringify(userData));
    localStorage.setItem('medsafe_token', token);
  };

  const logoutUser = () => {
    setUser(null);
    setConsent(false);
    localStorage.removeItem('medsafe_user');
    localStorage.removeItem('medsafe_token');
    localStorage.removeItem('medsafe_consent');
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, hasConsent, setConsent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
