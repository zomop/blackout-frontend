import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-emerald-400">BLACKOUT Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/dungeon")}
            className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded text-sm"
          >
            Enter Dungeon
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-sm"
          >
            Log Out
          </button>
        </div>
      </header>
      <main className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <p className="text-slate-400 text-sm">Logged in as</p>
        <p className="text-xl font-semibold">{user?.email}</p>
        <p className="text-slate-500 text-sm mt-1">Role: {user?.role}</p>
      </main>
    </div>
  );
}
