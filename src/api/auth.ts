// This file is the ONLY place that talks directly to the backend for auth.
// Pages/components call these functions instead of using fetch() themselves.

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api/v1";

export interface AuthUser {
  id: string;
  email: string;
  role: "PLAYER" | "ADMIN";
}

export interface AuthResponse {
  status: string;
  token: string;
  user: AuthUser;
}

export interface ApiError {
  status: string;
  message: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong.");
  }
  return data;
}

export async function registerRequest(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(res);
}

export async function loginRequest(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(res);
}