import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "~/lib/supabase";

export type AuthMode = "signup" | "login";

interface AuthModalProps {
  isOpen: boolean;
  mode: AuthMode;
  onClose: () => void;
  onSwitchMode: (mode: AuthMode) => void;
  onAuthSuccess: (user: User) => void;
}

export function AuthModal({
  isOpen,
  mode,
  onClose,
  onSwitchMode,
  onAuthSuccess,
}: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccessMsg(null);
  }, [mode, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (authError) throw authError;
        if (data.user && !data.session) {
          // Email confirmation is required
          setSuccessMsg(
            "Account created! Please check your email to confirm your address before signing in."
          );
        } else if (data.user && data.session) {
          onAuthSuccess(data.user);
          onClose();
        }
      } else {
        const { data, error: authError } =
          await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        if (data.user) {
          onAuthSuccess(data.user);
          onClose();
        }
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={mode === "signup" ? "Sign up dialog" : "Log in dialog"}
    >
      <div
        className="w-full max-w-sm bg-card border border-border rounded-xl p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-card-foreground">
            {mode === "signup" ? "Create an account" : "Welcome back"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Mode tab toggle */}
        <div className="flex gap-1 bg-muted p-1 rounded-lg mb-5">
          {(["signup", "login"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onSwitchMode(m)}
              className={`flex-1 text-sm py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                mode === m
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "signup" ? "Sign Up" : "Log In"}
            </button>
          ))}
        </div>

        {/* Success message */}
        {successMsg && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
            {successMsg}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5">
            {error}
          </div>
        )}

        {/* Form — hidden after successful sign-up (email confirmation required) */}
        {!successMsg && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
            <div>
              <label
                htmlFor="auth-email"
                className="text-xs font-medium text-muted-foreground mb-1 block"
              >
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>

            <div>
              <label
                htmlFor="auth-password"
                className="text-xs font-medium text-muted-foreground mb-1 block"
              >
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>

            {mode === "signup" && (
              <div>
                <label
                  htmlFor="auth-confirm-password"
                  className="text-xs font-medium text-muted-foreground mb-1 block"
                >
                  Confirm Password
                </label>
                <input
                  id="auth-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity cursor-pointer"
            >
              {loading
                ? mode === "signup"
                  ? "Creating account…"
                  : "Signing in…"
                : mode === "signup"
                ? "Create Account"
                : "Sign In"}
            </button>
          </form>
        )}

        {/* Footer link */}
        {!successMsg && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            {mode === "signup"
              ? "Already have an account? "
              : "Don't have an account? "}
            <button
              type="button"
              onClick={() => onSwitchMode(mode === "signup" ? "login" : "signup")}
              className="text-primary hover:underline cursor-pointer font-medium"
            >
              {mode === "signup" ? "Log in" : "Sign up"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
