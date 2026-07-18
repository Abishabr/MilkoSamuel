import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../../context/ThemeContext";
import { ArrowRight, CircleAlert } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToPortfolio?: () => void;
}

export default function AdminLogin({ onLoginSuccess, onBackToPortfolio }: AdminLoginProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [authError, setAuthError] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState("milkosamuel470@gmail.com");
  const [loginPassword, setLoginPassword] = useState("admin");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
      if (error) {
        setAuthError(error.message);
      } else {
        onLoginSuccess();
      }
    } catch (err: any) {
      setAuthError(err.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className={`min-h-screen pt-32 pb-16 flex items-center justify-center transition-colors duration-300 ${
      isLight ? "bg-zinc-50" : "bg-[#0a0a0a]"
    }`}>
      <div className={`w-full max-w-md p-10 border transition-all duration-300 shadow-2xl relative ${
        isLight ? "bg-white border-black/10" : "bg-[#111111] border-white/10"
      }`}>
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
            Database Control Desk
          </p>
        </div>

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
            className={`w-full p-4 text-xs font-bold uppercase tracking-widest cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 group border ${
              isLight
                ? "bg-black text-white hover:bg-transparent hover:text-black border-black"
                : "bg-white text-black hover:bg-transparent hover:text-white border-white"
            }`}
          >
            Sign In to Dashboard
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

        <div className={`mt-8 pt-6 border-t border-dashed text-xs space-y-1.5 ${
          isLight ? "border-black/10 text-gray-500" : "border-white/10 text-gray-400"
        }`}>
          <p className="font-bold uppercase tracking-wider text-[9px] font-mono">Default Demo Access:</p>
          <p className="font-mono">Email: <span className={isLight ? "text-black" : "text-white font-semibold"}>milkosamuel470@gmail.com</span></p>
          <p className="font-mono">Password: <span className={isLight ? "text-black" : "text-white font-semibold"}>admin</span></p>
        </div>
      </div>
    </div>
  );
}
