import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../../context/ThemeContext";
import { ArrowRight, CircleAlert, Sun, Moon, Timer } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToPortfolio?: () => void;
  /** Shown when the dashboard session time limit ran out. */
  sessionExpired?: boolean;
}

export default function AdminLogin({ onLoginSuccess, onBackToPortfolio, sessionExpired }: AdminLoginProps) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
      if (error) {
        setAuthError(error.message);
      } else {
        onLoginSuccess();
      }
    } catch (err: any) {
      setAuthError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen py-16 flex items-center justify-center transition-colors duration-300 ${
      isLight ? "bg-zinc-50" : "bg-[#0a0a0a]"
    }`}>
      <div className={`w-full max-w-md p-10 border transition-all duration-300 shadow-2xl relative ${
        isLight ? "bg-white border-black/10" : "bg-[#111111] border-white/10"
      }`}>
        {/* Admin-only theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isLight ? "Switch admin to dark mode" : "Switch admin to light mode"}
          className={`absolute top-4 right-4 p-2 border transition-all cursor-pointer ${
            isLight
              ? "border-black/10 hover:border-black text-black hover:bg-black/5"
              : "border-white/10 hover:border-white text-white hover:bg-white/5"
          }`}
        >
          {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-12 h-12 mb-4 font-bold border text-xl ${
            isLight ? "bg-black text-white border-black" : "bg-white text-black border-white"
          }`}>
            SM
          </div>
          <h1 className={`text-2xl font-extrabold tracking-tighter uppercase font-sans ${isLight ? "text-black" : "text-white"}`}>
            Portfolio Admin Portal
          </h1>
          <p className={`text-xs mt-2 font-mono uppercase tracking-widest ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            Authorized access only
          </p>
        </div>

        {sessionExpired && !authError && (
          <div className={`mb-6 p-4 border text-xs flex items-center gap-3 ${
            isLight
              ? "bg-amber-50 border-amber-300 text-amber-800"
              : "bg-amber-900/20 border-amber-500/30 text-amber-400"
          }`}>
            <Timer className="w-5 h-5 flex-shrink-0" />
            <span>Your session expired. Please sign in again to continue.</span>
          </div>
        )}

        {authError && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
            <CircleAlert className="w-5 h-5 flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              Email Address
            </label>
            <input
              type="email"
              required
              autoComplete="username"
              placeholder="you@example.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className={`w-full p-3.5 border text-sm focus:outline-none transition-colors rounded-none ${
                isLight
                  ? "bg-zinc-50 border-black/10 text-black focus:border-black"
                  : "bg-zinc-900 border-white/10 text-white focus:border-white"
              }`}
            />
          </div>

          <div>
            <label className={`block text-[10px] font-bold uppercase tracking-wider mb-2 font-mono ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              Access Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className={`w-full p-3.5 border text-sm focus:outline-none transition-colors rounded-none ${
                isLight
                  ? "bg-zinc-50 border-black/10 text-black focus:border-black"
                  : "bg-zinc-900 border-white/10 text-white focus:border-white"
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full p-4 text-xs font-bold uppercase tracking-widest cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 group border disabled:opacity-50 ${
              isLight
                ? "bg-black text-white hover:bg-transparent hover:text-black border-black"
                : "bg-white text-black hover:bg-transparent hover:text-white border-white"
            }`}
          >
            {submitting ? "Signing In..." : "Sign In to Dashboard"}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {onBackToPortfolio && (
            <button
              type="button"
              onClick={onBackToPortfolio}
              className={`w-full p-3.5 text-[10px] font-bold uppercase tracking-widest border border-dashed transition-all duration-300 cursor-pointer text-center ${
                isLight
                  ? "border-black/30 text-gray-700 hover:text-black hover:border-black hover:bg-black/5"
                  : "border-white/20 text-gray-400 hover:text-white hover:border-white hover:bg-white/5"
              }`}
            >
              ← Return to Main Website
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
