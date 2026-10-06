// Talks to the backend dungeon endpoints. Needs the auth token on every call
// since these routes are protected by requireAuth on the backend.

import { API_BASE, handleResponse } from "./client";

export interface CombatResult {
  status: "IN_PROGRESS" | "WON" | "LOST" | "FLED";
  player: { hp: number; maxHp: number };
  monster: { name: string; hp: number; maxHp: number };
  xpGained: number;
  log: string[];
}

export interface StartResult {
  runId: string;
  player: { hp: number; maxHp: number };
  monster: { name: string; hp: number; maxHp: number };
  log: string[];
}

export async function startDungeonRequest(token: string) {
  const res = await fetch(`${API_BASE}/dungeon/start`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<StartResult>(res);
}

export async function dungeonActionRequest(token: string, action: "attack" | "flee") {
  const res = await fetch(`${API_BASE}/dungeon/action`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action }),
  });
  return handleResponse<CombatResult>(res);
}
