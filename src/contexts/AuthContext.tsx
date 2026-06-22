"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken) {
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
          } catch (e) {
            console.error("Failed to parse saved user:", e);
          }
        }

        try {
          const res = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          });
          const data = await res.json();
          if (res.ok && data.user) {
            setUser(data.user);
            setToken(savedToken);
            localStorage.setItem("user", JSON.stringify(data.user));
          } else {
            logout();
          }
        } catch (error: any) {
          console.error("Auth init error:", error);
          const isNetworkError = 
            error.message?.includes("Failed to fetch") || 
            error.message?.includes("Load failed") ||
            error.name === "AbortError" ||
            error.name === "TypeError";

          if (!isNetworkError) {
            logout();
          }
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || "Login failed");
    }
    setUser(data.user);
    setToken(data.token);
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  };

  const userRole = (user?.role || "").toLowerCase();
  const isAdmin = userRole === "super_admin" || userRole === "admin" || userRole === "super admin";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      token: null,
      login: async () => {},
      logout: () => {},
      isAdmin: false,
      isAuthenticated: false,
      loading: false,
    };
  }
  return ctx;
};

