"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  altPhone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (data: any) => Promise<any>;
  verifyOtp: (email: string, otp: string) => Promise<any>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) { setUser(null); return; }
      const data = await authApi.getProfile();
      setUser(data.user);
    } catch {
      localStorage.removeItem("auth_token");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshProfile().finally(() => setLoading(false));
  }, [refreshProfile]);

  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    if (data.token) {
      localStorage.setItem("auth_token", data.token);
      setUser(data.user);
    }
    return data;
  };

  const register = async (regData: any) => {
    const data = await authApi.register(regData);
    return data;
  };

  const verifyOtp = async (email: string, otp: string) => {
    const data = await authApi.verifyOtp(email, otp);
    if (data.token) {
      localStorage.setItem("auth_token", data.token);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isLoggedIn: !!user, login, register, verifyOtp, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
