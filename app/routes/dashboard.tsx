import { useNavigate } from "react-router";
import type { Route } from "./+types/dashboard";
import { supabase } from "~/lib/supabase";
import { ProtectedRoute } from "~/components/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - TrailQuest" },
    { name: "description", content: "Your TrailQuest dashboard" },
  ];
}

const recentTrails = [
  {
    name: "Pine Ridge Loop",
    location: "Blue Ridge, VA",
    difficulty: "Moderate",
    distance: "5.2 mi",
    rating: 4.7,
    completedAt: "Mar 15, 2026",
  },
  {
    name: "Meadow Walk",
    location: "Smoky Mountains, TN",
    difficulty: "Easy",
    distance: "2.4 mi",
    rating: 4.5,
    completedAt: "Mar 10, 2026",
  },
];

const difficultyStyle: Record<string, string> = {
  Easy: "bg-green-100 text-green-700",
  Moderate: "bg-secondary text-secondary-foreground",
  Hard: "bg-red-100 text-red-600",
};

const stats = [
  { label: "Trails Completed", value: "12" },
  { label: "Miles Hiked", value: "48.3" },
  { label: "Badges Earned", value: "5" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  }

  return (
    <ProtectedRoute>
      {(user) => (
        <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
          {/* Navbar */}
          <header className="sticky top-0 z-50 bg-background border-b border-border">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
              <a href="/" className="text-lg font-bold tracking-tight">
                <span className="font-normal">Trail</span>
                <span className="text-primary">Quest</span>
              </a>
              <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
                <a href="/dashboard" className="text-foreground font-medium">
                  Dashboard
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Trails
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Map
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Community
                </a>
              </nav>
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-xs text-muted-foreground truncate max-w-[140px]">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-8">
            <div className="max-w-5xl mx-auto flex flex-col gap-8">

              {/* Welcome banner */}
              <div className="bg-primary text-primary-foreground rounded-xl px-5 py-6">
                <p className="text-sm opacity-80 mb-1">Welcome back,</p>
                <h1 className="text-xl font-bold truncate">
                  {user.user_metadata?.full_name ?? user.email}
                </h1>
                <p className="text-sm opacity-80 mt-1">
                  Ready for your next adventure?
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="border border-border rounded-xl p-4 bg-card text-center shadow-sm"
                  >
                    <p className="text-2xl font-bold text-primary">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Trails */}
              <div>
                <h2 className="text-base font-bold mb-3">Recent Trails</h2>
                <div className="flex flex-col gap-3">
                  {recentTrails.map((trail) => (
                    <div
                      key={trail.name}
                      className="border border-border rounded-xl p-4 bg-card shadow-sm flex items-start justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm text-card-foreground">
                            {trail.name}
                          </p>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              difficultyStyle[trail.difficulty]
                            }`}
                          >
                            {trail.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-primary mt-0.5">
                          {trail.location}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>📍 {trail.distance}</span>
                          <span>★ {trail.rating}</span>
                          <span>🗓 {trail.completedAt}</span>
                        </div>
                      </div>
                      <button className="shrink-0 text-xs border border-border text-primary font-medium px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-base font-bold mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Browse Trails", icon: "🗺️" },
                    { label: "View Map", icon: "📍" },
                    { label: "Community", icon: "👥" },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className="border border-border rounded-xl p-4 bg-card shadow-sm flex flex-col items-center gap-2 hover:bg-secondary transition-colors cursor-pointer"
                    >
                      <span className="text-2xl">{action.icon}</span>
                      <span className="text-sm font-medium text-card-foreground">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-border py-5 text-center text-xs text-muted-foreground">
            © 2026 TrailQuest. All rights reserved.
          </footer>
        </div>
      )}
    </ProtectedRoute>
  );
}
