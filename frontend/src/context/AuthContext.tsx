"use client";

import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { clearSession, getStoredUser, saveSession } from "@/lib/auth";
import { User } from "@/types/user";
import { ROLE_HOME } from "@/utils/constants";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();

    if (storedUser) {
      setUser(storedUser);
    }

    setLoading(false);
  }, []);

  const router = useRouter();

  const refreshUser = async () => {
    const { data } = await api.get("/auth/me");
    setUser(data.data.user);
    localStorage.setItem("lms_user", JSON.stringify(data.data.user));
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    const loggedInUser = data.data.user as User;
    saveSession(data.data.token, loggedInUser);
    setUser(loggedInUser);
    router.push(ROLE_HOME[loggedInUser.role]);
  };

  const signup = async (fullName: string, email: string, password: string) => {
    const { data } = await api.post("/auth/signup", {
      fullName,
      email,
      password,
    });
    saveSession(data.data.token, data.data.user);
    setUser(data.data.user);
    router.push("/borrower/personal-details");
  };

  const logout = () => {
    clearSession();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
