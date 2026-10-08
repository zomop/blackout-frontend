import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await register(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-lg p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-emerald-400 mb-6">BLACKOUT</h1>
        {error && <p className="text-red-400 text-sm mb-4" role="alert">{error}</p>}
        <label htmlFor="register-email" className="sr-only">Email</label>
        <input
          id="register-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-slate-800 text-white border border-slate-700"
          required
          autoComplete="email"
        />
        <label htmlFor="register-password" className="sr-only">Password</label>
        <input
          id="register-password"
          type="password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-slate-800 text-white border border-slate-700"
          required
          minLength={8}
          autoComplete="new-password"
        />
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded"
        >
          Create Account
        </button>
        <p className="text-slate-400 text-sm mt-4 text-center">
          Already have an account? <Link to="/login" className="text-emerald-400">Log In</Link>
        </p>
      </form>
    </div>
  );
}
