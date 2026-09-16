import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { startDungeonRequest, dungeonActionRequest } from "../api/dungeon";

interface CombatState {
  status: "NOT_STARTED" | "IN_PROGRESS" | "WON" | "LOST" | "FLED";
  playerHp: number;
  playerMaxHp: number;
  monsterName: string;
  monsterHp: number;
  monsterMaxHp: number;
  log: string[];
}

const initialState: CombatState = {
  status: "NOT_STARTED",
  playerHp: 0,
  playerMaxHp: 0,
  monsterName: "",
  monsterHp: 0,
  monsterMaxHp: 0,
  log: [],
};

export default function Dungeon() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [combat, setCombat] = useState<CombatState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart() {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const result = await startDungeonRequest(token);
      setCombat({
        status: "IN_PROGRESS",
        playerHp: result.player.hp,
        playerMaxHp: result.player.maxHp,
        monsterName: result.monster.name,
        monsterHp: result.monster.hp,
        monsterMaxHp: result.monster.maxHp,
        log: result.log,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start dungeon.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(action: "attack" | "flee") {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const result = await dungeonActionRequest(token, action);
      setCombat((prev) => ({
        status: result.status,
        playerHp: result.player.hp,
        playerMaxHp: result.player.maxHp,
        monsterName: result.monster.name,
        monsterHp: result.monster.hp,
        monsterMaxHp: result.monster.maxHp,
        // Newest messages at the top, keep the fight's history.
        log: [...result.log, ...prev.log],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setLoading(false);
    }
  }

  function HealthBar({ current, max, color }: { current: number; max: number; color: string }) {
    const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0;
    return (
      <div className="w-full bg-slate-800 rounded h-3 overflow-hidden">
        <div className={`${color} h-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    );
  }

  const fightOver = combat.status === "WON" || combat.status === "LOST" || combat.status === "FLED";

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="flex justify-between items-center mb-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-400">Dungeon</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-slate-400 hover:text-white text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-lg p-6">
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {combat.status === "NOT_STARTED" && (
          <div className="text-center py-8">
            <p className="text-slate-400 mb-4">The dungeon awaits...</p>
            <button
              onClick={handleStart}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded"
            >
              {loading ? "Entering..." : "Enter Dungeon"}
            </button>
          </div>
        )}

        {combat.status !== "NOT_STARTED" && (
          <>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold">{combat.monsterName}</span>
                <span className="text-slate-400">
                  {combat.monsterHp} / {combat.monsterMaxHp} HP
                </span>
              </div>
              <HealthBar current={combat.monsterHp} max={combat.monsterMaxHp} color="bg-red-500" />
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold">You</span>
                <span className="text-slate-400">
                  {combat.playerHp} / {combat.playerMaxHp} HP
                </span>
              </div>
              <HealthBar current={combat.playerHp} max={combat.playerMaxHp} color="bg-emerald-500" />
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded p-3 mb-6 h-40 overflow-y-auto text-sm space-y-1">
              {combat.log.map((line, i) => (
                <p key={i} className="text-slate-300">
                  {line}
                </p>
              ))}
            </div>

            {!fightOver ? (
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction("attack")}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold py-2 rounded"
                >
                  Attack
                </button>
                <button
                  onClick={() => handleAction("flee")}
                  disabled={loading}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-semibold py-2 rounded"
                >
                  Flee
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p
                  className={`font-bold mb-4 ${
                    combat.status === "WON" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {combat.status === "WON" && "Victory!"}
                  {combat.status === "LOST" && "You were defeated."}
                  {combat.status === "FLED" && "You escaped."}
                </p>
                <button
                  onClick={handleStart}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded"
                >
                  Enter Again
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}