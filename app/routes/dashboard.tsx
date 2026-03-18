import { useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/dashboard";
import {
  MapIcon,
  MapPin,
  Users,
  Star,
  Calendar,
  Clock,
  TrendingUp,
  Heart,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { supabase } from "~/lib/supabase";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import { ProfileMenu } from "~/components/ProfileMenu";

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
    difficulty: "Moderate" as const,
    distance: "5.2 mi",
    rating: 4.7,
    completedAt: "Mar 15, 2026",
    duration: "2h 45m",
    elevation: "820 ft",
    type: "Loop",
    description:
      "A scenic ridge trail through oak and pine forest with panoramic valley views at the summit.",
  },
  {
    name: "Meadow Walk",
    location: "Smoky Mountains, TN",
    difficulty: "Easy" as const,
    distance: "2.4 mi",
    rating: 4.5,
    completedAt: "Mar 10, 2026",
    duration: "1h 10m",
    elevation: "180 ft",
    type: "Out & Back",
    description:
      "A gentle stroll through wildflower meadows alongside a winding creek. Perfect for beginners.",
  },
  {
    name: "Summit Crest Trail",
    location: "Rocky Mountain, CO",
    difficulty: "Hard" as const,
    distance: "8.9 mi",
    rating: 4.9,
    completedAt: "Feb 28, 2026",
    duration: "5h 20m",
    elevation: "2,340 ft",
    type: "Loop",
    description:
      "A challenging high-altitude traverse with exposed ridgeline sections offering 360° summit views.",
  },
];

type Difficulty = "Easy" | "Moderate" | "Hard";

const difficultyConfig: Record<
  Difficulty,
  { bar: string; badge: string }
> = {
  Easy:     { bar: "bg-emerald-500",  badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" },
  Moderate: { bar: "bg-primary",       badge: "bg-secondary text-secondary-foreground" },
  Hard:     { bar: "bg-rose-500",      badge: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400" },
};

function StarRating({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i <= Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/40"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{value}</span>
    </span>
  );
}

const stats = [
  { label: "Trails Completed", value: "12" },
  { label: "Miles Hiked", value: "48.3" },
  { label: "Badges Earned", value: "5" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [expandedTrail, setExpandedTrail] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Sign out is handled inside ProfileMenu; navigate kept for potential future use
  void navigate;

  function toggleFavorite(name: string, e: React.MouseEvent) {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  function toggleExpand(name: string) {
    setExpandedTrail((prev) => (prev === name ? null : name));
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
              <ProfileMenu user={user} />
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
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold">Recent Trails</h2>
                  <button className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer">
                    See All <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {recentTrails.map((trail) => {
                    const cfg = difficultyConfig[trail.difficulty];
                    const isExpanded = expandedTrail === trail.name;
                    const isFavorited = favorites.has(trail.name);
                    return (
                      <div
                        key={trail.name}
                        className="group border border-border rounded-xl bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        onClick={() => toggleExpand(trail.name)}
                      >
                        {/* Difficulty accent bar */}
                        <div className={`h-1 w-full ${cfg.bar}`} />

                        <div className="p-4">
                          {/* Top row */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-sm text-card-foreground">
                                  {trail.name}
                                </p>
                                <span
                                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.badge}`}
                                >
                                  {trail.difficulty}
                                </span>
                              </div>
                              <p className="text-xs text-primary mt-0.5 flex items-center gap-1">
                                <MapPin className="w-3 h-3 shrink-0" />
                                {trail.location}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={(e) => toggleFavorite(trail.name, e)}
                                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                                className="p-1.5 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                              >
                                <Heart
                                  className={`w-4 h-4 transition-colors ${
                                    isFavorited
                                      ? "fill-rose-500 text-rose-500"
                                      : "text-muted-foreground group-hover:text-foreground"
                                  }`}
                                />
                              </button>
                              <ChevronDown
                                className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </div>

                          {/* Meta row */}
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {trail.distance}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {trail.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" /> {trail.elevation}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {trail.completedAt}
                            </span>
                          </div>

                          {/* Star rating */}
                          <div className="mt-2">
                            <StarRating value={trail.rating} />
                          </div>
                        </div>

                        {/* Expanded detail panel */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded ? "max-h-48" : "max-h-0"
                          }`}
                        >
                          <div className="border-t border-border px-4 py-3 bg-muted/40">
                            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                              {trail.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                                {trail.type}
                              </span>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                className="ml-auto text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer font-medium"
                              >
                                View Full Trail
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-base font-bold mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Browse Trails", icon: <MapIcon className="w-6 h-6" /> },
                    { label: "View Map", icon: <MapPin className="w-6 h-6" /> },
                    { label: "Community", icon: <Users className="w-6 h-6" /> },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className="border border-border rounded-xl p-4 bg-card shadow-sm flex flex-col items-center gap-2 hover:bg-secondary transition-colors cursor-pointer"
                    >
                      <span className="text-primary">{action.icon}</span>
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
