import { useState } from "react";
import type { Route } from "./+types/dashboard";
import {
  MapPin,
  Star,
  Calendar,
  Clock,
  TrendingUp,
  Heart,
  ChevronDown,
  ArrowRight,
  Mountain,
  Footprints,
  Award,
} from "lucide-react";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import TrailDetailModal, { type Trail, difficultyConfig } from "~/components/TrailDetailModal";
import { recentTrails } from "~/constants/trails";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - TrailQuest" },
    { name: "description", content: "Your TrailQuest dashboard" },
  ];
}

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
  const [expandedTrail, setExpandedTrail] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTrail, setActiveTrail] = useState<Trail | null>(null);

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
        <>
        <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
          <Navbar activePath="/dashboard" user={user} />

          <main className="flex-1 px-4 py-8">
            <div className="max-w-5xl mx-auto flex flex-col gap-8">

              <div
                className="relative overflow-hidden rounded-2xl px-6 py-7 shadow-lg"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, oklch(0.40 0.21 285) 100%)" }}
              >
                <svg
                  className="pointer-events-none absolute inset-0 w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 800 180"
                  preserveAspectRatio="xMidYMid slice"
                  aria-hidden="true"
                >
                  <path
                    d="M0,180 L0,90 Q100,30 200,80 Q300,130 400,40 Q500,-10 600,70 Q700,130 800,50 L800,180 Z"
                    fill="white"
                    fillOpacity="0.06"
                  />
                  <path
                    d="M0,180 L0,115 Q80,75 180,110 Q280,145 380,80 Q460,30 560,100 Q660,150 800,95 L800,180 Z"
                    fill="white"
                    fillOpacity="0.09"
                  />
                  <path
                    d="M0,180 L0,148 Q100,122 200,144 Q320,165 420,122 Q510,82 580,132 Q680,168 800,136 L800,180 Z"
                    fill="white"
                    fillOpacity="0.14"
                  />
                </svg>

                <div className="pointer-events-none absolute -top-6 -right-6 w-36 h-36 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute bottom-0 left-1/2 w-48 h-20 rounded-full bg-white/5 blur-3xl" />

                <div className="relative">
                  <p className="text-xs font-medium uppercase tracking-widest text-primary-foreground/60 mb-2">
                    Welcome back
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground leading-tight truncate">
                    {user.user_metadata?.full_name ?? user.email}
                  </h1>
                  <p className="mt-2 text-sm text-primary-foreground/75">
                    Ready for your next adventure?
                  </p>

                  <div className="mt-5 flex gap-2">
                    <button className="text-xs font-semibold bg-primary-foreground text-primary px-4 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
                      Find a Trail
                    </button>
                    <button className="text-xs font-semibold border border-primary-foreground/30 text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-foreground/10 transition-colors cursor-pointer">
                      View Progress
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="border border-border rounded-xl p-4 bg-card text-center shadow-sm hover:shadow-md transition-shadow"
                  >
                    <p className="text-2xl font-bold text-primary leading-none">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-tight">{s.label}</p>
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
                        <div className={`h-1 w-full ${cfg.bar}`} />

                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-sm text-card-foreground">
                                  {trail.name}
                                </p>
                                <span
                                  className={`text-xs font-medium px-2 py-1 rounded-full ${cfg.badge}`}
                                >
                                  {trail.difficulty}
                                </span>
                              </div>
                              <p className="text-xs text-primary mt-0.5 flex items-center gap-1">
                                <MapPin className="w-3 h-3 shrink-0" />
                                {trail.location}
                              </p>
                            </div>

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

                          <div className="mt-2">
                            <StarRating value={trail.rating} />
                          </div>
                        </div>

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
                              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                                {trail.type}
                              </span>
                              <button
                                onClick={(e) => { e.stopPropagation(); setActiveTrail(trail); }}
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

            </div>
          </main>

          <Footer />
        </div>

        {/* Trail Detail Modal */}
        {activeTrail && (
          <TrailDetailModal trail={activeTrail} onClose={() => setActiveTrail(null)} />
        )}
        </>
      )}
    </ProtectedRoute>
  );
}
