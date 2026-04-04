import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  points?: number;
  tier?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("antarestar_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        if (response.data && response.data.data) {
          setUser(response.data.data);
        } else {
          // fallback if wrapped differently
          setUser(response.data);
        }
      } catch (e) {
        console.error("Session fetch error:", e);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("antarestar_token", token);
    localStorage.setItem("antarestar_user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      if (localStorage.getItem("antarestar_token")) {
        await api.post("/auth/logout");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
      localStorage.removeItem("antarestar_token");
      localStorage.removeItem("antarestar_user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
