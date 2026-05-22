"use client";
import { createContext, useContext, useEffect, useState } from "react";

export interface User {
  email: string;
  password: string;
  username: string;
  joined: string;
  purchases?: { name: string; type: string; date: string; status: string; icon: string; color: string }[];
}

interface AuthCtxType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (username: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthCtx = createContext<AuthCtxType>({} as AuthCtxType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("canflix-user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const getUsers = (): User[] => JSON.parse(localStorage.getItem("canflix-users") || "[]");
  const saveUsers = (users: User[]) => localStorage.setItem("canflix-users", JSON.stringify(users));

  const login = (email: string, password: string) => {
    const users = getUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem("canflix-user", JSON.stringify(found));
      return { success: true, message: `Welcome back, ${found.username}!` };
    }
    if (email && password.length >= 4) {
      const newUser: User = { email, password, username: email.split("@")[0], joined: new Date().toISOString() };
      users.push(newUser);
      saveUsers(users);
      setUser(newUser);
      localStorage.setItem("canflix-user", JSON.stringify(newUser));
      return { success: true, message: `Welcome, ${newUser.username}!` };
    }
    return { success: false, message: "Invalid credentials" };
  };

  const register = (username: string, email: string, password: string) => {
    const users = getUsers();
    if (users.find((u) => u.email === email)) return { success: false, message: "Email already exists" };
    const newUser: User = { email, password, username, joined: new Date().toISOString() };
    users.push(newUser);
    saveUsers(users);
    setUser(newUser);
    localStorage.setItem("canflix-user", JSON.stringify(newUser));
    return { success: true, message: `Welcome to Canflix, ${username}!` };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("canflix-user");
  };

  return (
    <AuthCtx.Provider value={{ user, login, register, logout, isLoggedIn: !!user }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
