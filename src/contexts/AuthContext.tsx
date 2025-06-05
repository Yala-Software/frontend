"use client";

import type { User } from '@/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
  }, []);

  const login = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('mockUserId', user.id);
    router.push('/dashboard');
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mockUserId');
    router.push('/auth/login');
  };
  
  const isLoggedIn = !!currentUser;

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
