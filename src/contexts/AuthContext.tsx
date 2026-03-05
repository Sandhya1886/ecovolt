import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  email: string;
  name: string;
  userType: "municipality" | "citizen" | "company";
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, login: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("ecovolt_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (u: User) => {
    setUser(u);
    localStorage.setItem("ecovolt_user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ecovolt_user");
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
