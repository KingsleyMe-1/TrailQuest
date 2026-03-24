import { useState } from "react";
import { Link } from "react-router";
import type { User } from "@supabase/supabase-js";
import {
  MapPin,
  Star,
  Calendar,
  Clock,
  TrendingUp,
  Heart,
  ChevronDown,
  ArrowRight,
  Footprints,
} from "lucide-react";
import TrailDetailModal from "~/components/trails/TrailDetailModal";
import {
  type Trail,
  TRAIL_DIFFICULTY_CONFIG,
} from "~/constants/trail-detail";
import { DASHBOARD_RECENT_TRAIL_IMAGES } from "~/constants/dashboard";
import { recentTrails } from "~/constants/trails";

function StarRating({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i <= Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{value}</span>
    </span>
  );
}

export default function RecentTrails({ user }: { user: User }) {
  const [expandedTrail, setExpandedTrail] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());
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

  function handleImgError(name: string) {
    setImgErrors((prev) => new Set(prev).add(name));
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold">Recent Trails</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your last {recentTrails.length} hikes
          </p>
        </div>
        <Link
          to="/trails"
          className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-75 transition-opacity cursor-pointer"
        >
          Browse All Trails<ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {recentTrails.map((trail) => {
          const cfg = TRAIL_DIFFICULTY_CONFIG[trail.difficulty];
          const isExpanded = expandedTrail === trail.name;
          const isFavorited = favorites.has(trail.name);
          const img = DASHBOARD_RECENT_TRAIL_IMAGES[trail.name];
          const imgFailed = imgErrors.has(trail.name);

          return (
            <div
              key={trail.name}
              className="group border border-border rounded-2xl bg-card overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 cursor-pointer"
              onClick={() => toggleExpand(trail.name)}
            >
              {img && !imgFailed ? (
                <div className="relative h-32 w-full overflow-hidden">
                  <img
                    src={img}
                    alt={trail.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={() => handleImgError(trail.name)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className={`absolute top-0 left-0 right-0 h-1 ${cfg.bar}`} />
                  <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
                    <div>
                      <p className="font-bold text-white text-sm leading-tight">{trail.name}</p>
                      <p className="text-xs text-white/70 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {trail.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-sm ${cfg.badge}`}>
                        {trail.difficulty}
                      </span>
                      <button
                        onClick={(e) => toggleFavorite(trail.name, e)}
                        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                        className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-colors cursor-pointer"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-colors ${
                            isFavorited ? "fill-rose-400 text-rose-400" : "text-white/70"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`h-1 w-full ${cfg.bar}`} />
              )}

              <div className="p-4">
                {(!img || imgFailed) && (
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">{trail.name}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                          {trail.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-primary mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" /> {trail.location}
                      </p>
                    </div>
                    <button
                      onClick={(e) => toggleFavorite(trail.name, e)}
                      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                      className="p-1.5 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isFavorited ? "fill-rose-500 text-rose-500" : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Footprints className="w-3 h-3" /> {trail.distance}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {trail.duration}</span>
                  <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {trail.elevation}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {trail.completedAt}</span>
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <StarRating value={trail.rating} />
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? "max-h-48" : "max-h-0"
                }`}
              >
                <div className="border-t border-border px-4 py-3 bg-muted/30">
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {trail.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full border border-border">
                      {trail.type}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTrail(trail);
                      }}
                      className="ml-auto flex items-center gap-1.5 text-xs font-semibold bg-primary text-primary-foreground px-3.5 py-1.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      View Details <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeTrail && (
        <TrailDetailModal
          trail={activeTrail}
          onClose={() => setActiveTrail(null)}
          user={user}
          onAuthRequired={() => setActiveTrail(null)}
        />
      )}
    </>
  );
}

