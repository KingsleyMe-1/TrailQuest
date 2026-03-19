import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { User } from "@supabase/supabase-js";
import { supabase } from "~/lib/supabase";

interface ProtectedRouteProps {
  children: (user: User) => React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

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
