import type { AuthUser } from "../api/auth";

export function readStoredToken(): string | null {
  const token = localStorage.getItem("token");
  return token && token.trim() ? token : null;
}

export function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const user = value as Partial<AuthUser>;
    if (typeof user.id !== "string" || typeof user.email !== "string") return null;
    if (user.role !== "PLAYER" && user.role !== "ADMIN") return null;
    return { id: user.id, email: user.email, role: user.role };
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}
