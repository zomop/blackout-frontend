// This makes "who is logged in" available to the whole app,
// so any page/component can check auth status without prop-drilling.

import { createContext, useContext, useState, type ReactNode } from "react";
import { registerRequest, loginRequest, type AuthUser } from "../api/auth";


interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // We persist the token in localStorage so refreshing the page
  // doesn't log the user out. We'll improve this later with refresh tokens.
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<AuthUser | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  function saveSession(newToken: string, newUser: AuthUser) {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  async function login(email: string, password: string) {
    const result = await loginRequest(email, password);
    saveSession(result.token, result.user);
  }

  async function register(email: string, password: string) {
    const result = await registerRequest(email, password);
    saveSession(result.token, result.user);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }
  return context;
}