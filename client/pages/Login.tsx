import { useState, useEffect, type FormEvent } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { loginAdmin, isAdminAuthenticated } from "@/lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/admin";

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate(from, { replace: true });
    }
  }, [from, navigate]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = loginAdmin(password.trim());

    if (success) {
      navigate(from, { replace: true });
      return;
    }

    setError("Invalid password. Please try again.");
  };

  return (
    <div className="dark bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617] min-h-screen text-white flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur"
      >
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/80">Admin Login</p>
          <h1 className="mt-4 text-3xl font-bold text-white">Sign in to continue</h1>
          <p className="mt-3 text-sm text-gray-400">
            Enter the admin password to access the protected admin panel.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block text-sm font-medium text-gray-200">
            Admin Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              autoFocus
            />
          </label>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Login
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            Return to the <Link to="/" className="text-cyan-300 hover:text-cyan-200">public site</Link>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
