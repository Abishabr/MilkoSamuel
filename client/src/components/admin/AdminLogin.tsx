import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../../context/ThemeContext";
import { ArrowRight, CircleAlert, Sun, Moon, Timer } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Alert, AlertDescription } from "@/src/components/ui/alert";

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
    <div className="min-h-screen py-16 flex items-center justify-center bg-background text-foreground transition-colors duration-300">
      <Card className="w-full max-w-md relative">
        {/* Admin-only theme toggle */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          title={isLight ? "Switch admin to dark mode" : "Switch admin to light mode"}
          className="absolute top-4 right-4"
        >
          {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </Button>

        <CardHeader className="pt-12 px-10 border-b pb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-8 font-extrabold text-lg bg-primary text-primary-foreground border border-primary">
            SM
          </div>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Authorized access only
          </p>
          <h1 className="text-4xl font-extrabold tracking-display uppercase font-sans leading-[0.9]">
            Admin<br />Portal
          </h1>
        </CardHeader>

        <CardContent className="px-10 pb-10 pt-8">
          {sessionExpired && !authError && (
            <Alert className="mb-6 border-amber-500/50 text-amber-600 dark:text-amber-400">
              <Timer className="w-4 h-4" />
              <AlertDescription className="text-amber-600 dark:text-amber-400">
                Your session expired. Please sign in again to continue.
              </AlertDescription>
            </Alert>
          )}

          {authError && (
            <Alert variant="destructive" className="mb-6">
              <CircleAlert className="w-4 h-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono text-muted-foreground">
                Email Address
              </Label>
              <Input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono text-muted-foreground">
                Access Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full p-6 text-[11px] font-bold uppercase tracking-[0.2em] group border border-primary hover:bg-transparent hover:text-foreground"
            >
              {submitting ? "Signing In..." : "Sign In to Dashboard"}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>

            {onBackToPortfolio && (
              <Button
                type="button"
                variant="ghost"
                onClick={onBackToPortfolio}
                className="w-full text-[10px] font-bold uppercase tracking-widest border border-dashed text-muted-foreground"
              >
                ← Return to Main Website
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
