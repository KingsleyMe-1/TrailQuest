import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { User } from "@supabase/supabase-js";
import { supabase } from "~/lib/supabase";

interface ProtectedRouteProps {
  children: (user: User) => React.ReactNode;
}

// ─── Dev bypass ──────────────────────────────────────────────────────────────
// Set VITE_DISABLE_AUTH_GUARD=true in .env to skip auth checks locally.
// Remove or set to false before deploying to production.
const AUTH_GUARD_DISABLED =
  import.meta.env.VITE_DISABLE_AUTH_GUARD === "true";

const DEV_MOCK_USER = {
  id: "dev-user",
  email: "dev@trailquest.local",
  user_metadata: { full_name: "Dev User" },
} as unknown as User;
// ─────────────────────────────────────────────────────────────────────────────

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  // Bypass: skip Supabase check entirely in local dev
  if (AUTH_GUARD_DISABLED) {
    return <>{children(DEV_MOCK_USER)}</>;
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user ?? null;
      if (!sessionUser) {
        navigate("/", { replace: true });
      } else {
        setUser(sessionUser);
      }
      setChecking(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      if (!sessionUser) {
        navigate("/", { replace: true });
      } else {
        setUser(sessionUser);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-sm text-muted-foreground animate-pulse">
          Loading…
        </span>
      </div>
    );
  }

  if (!user) return null;

  return <>{children(user)}</>;
}
