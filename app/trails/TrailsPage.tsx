"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  Search,
  MapPin,
  Star,
  Clock,
  TrendingUp,
  Mountain,
  X,
  Route,
} from "lucide-react";
import { supabase } from "~/lib/supabase";
import { allTrails } from "~/constants/trails";
import {
  DIFFICULTY_FILTERS,
  TYPE_FILTERS,
  SORT_OPTIONS,
  TRAIL_CARD_IMAGES,
  type DifficultyFilter,
  type SortKey,
  type TypeFilter,
} from "~/constants/trails-page";
import {
  type Trail,
  TRAIL_DIFFICULTY_CONFIG,
} from "~/constants/trail-detail";
import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import TrailDetailModal from "~/components/trails/TrailDetailModal";
import FilterDropdown from "~/components/ui/FilterDropdown";
import { AuthModal, type AuthMode } from "~/components/auth/AuthModal";

function parseDistance(d: string) {
  return parseFloat(d.replace(/[^0-9.]/g, "")) || 0;
}

function StarRow({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i <= Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/20"
          }`}
        />
      ))}
      <span className="text-xs font-medium text-foreground">{value}</span>
    </span>
  );
}

function TrailCard({
  trail,
  onSelect,
}: {
  trail: Trail;
  onSelect: (t: Trail) => void;
}) {
  const cfg = TRAIL_DIFFICULTY_CONFIG[trail.difficulty];
  const imgSrc = TRAIL_CARD_IMAGES[trail.name];

  return (
    <button
      onClick={() => onSelect(trail)}
      className="w-full text-left border border-border border-l-4 border-r-4 border-l-primary border-r-primary rounded-xl overflow-hidden flex flex-col bg-card shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group focus-visible:outline-2 focus-visible:outline-ring"
    >
      <div className="relative w-full h-40 overflow-hidden bg-muted shrink-0">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={trail.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Mountain className="w-10 h-10 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className={`absolute top-2.5 right-2.5 text-xs font-semibold px-2.5 py-1 rounded-full shadow ${cfg.badge}`}>
          {trail.difficulty}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="min-w-0">
          <p className="font-semibold text-card-foreground leading-snug group-hover:text-primary transition-colors truncate">
            {trail.name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 shrink-0 text-primary" />
            {trail.location}
          </p>
        </div>

        <div className="grid grid-cols-3 text-xs border-t border-border pt-3">
          <span className="flex flex-col items-center gap-1">
            <Mountain className="w-3.5 h-3.5 text-primary/70" />
            <span className="font-semibold text-foreground">{trail.distance}</span>
            <span className="text-muted-foreground text-[10px] uppercase tracking-wide">distance</span>
          </span>
          <span className="flex flex-col items-center gap-1 border-x border-border">
            <Clock className="w-3.5 h-3.5 text-primary/70" />
            <span className="font-semibold text-foreground">{trail.duration}</span>
            <span className="text-muted-foreground text-[10px] uppercase tracking-wide">time</span>
          </span>
          <span className="flex flex-col items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-primary/70" />
            <span className="font-semibold text-foreground">{trail.elevation}</span>
            <span className="text-muted-foreground text-[10px] uppercase tracking-wide">elevation</span>
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          <StarRow value={trail.rating} />
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Route className="w-3 h-3" />
            {trail.type}
          </span>
        </div>
      </div>
    </button>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Mountain className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-base font-semibold text-foreground mb-1">No trails found</p>
      <p className="text-sm text-muted-foreground mb-5">
        Try adjusting your search or filters.
      </p>
      <button
        onClick={onClear}
        className="text-sm font-medium text-primary hover:underline cursor-pointer"
      >
        Clear all filters
      </button>
    </div>
  );
}

export default function TrailsPage() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>(
    (DIFFICULTY_FILTERS.includes(searchParams.get("difficulty") as DifficultyFilter)
      ? searchParams.get("difficulty")
      : "All") as DifficultyFilter
  );
  const [trailType, setTrailType] = useState<TypeFilter>(
    (TYPE_FILTERS.includes(searchParams.get("type") as TypeFilter)
      ? searchParams.get("type")
      : "All") as TypeFilter
  );
  const [sort, setSort] = useState<SortKey>(
    (["rating", "distance", "name"].includes(searchParams.get("sort") ?? "")
      ? searchParams.get("sort")
      : "rating") as SortKey
  );
  const [activeTrail, setActiveTrail] = useState<Trail | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allTrails
      .filter((t) => {
        if (q && !t.name.toLowerCase().includes(q) && !t.location.toLowerCase().includes(q))
          return false;
        if (difficulty !== "All" && t.difficulty !== difficulty) return false;
        if (trailType !== "All" && t.type !== trailType) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === "rating") return b.rating - a.rating;
        if (sort === "distance") return parseDistance(a.distance) - parseDistance(b.distance);
        return a.name.localeCompare(b.name);
      });
  }, [query, difficulty, trailType, sort]);

  const hasActiveFilters =
    query !== "" || difficulty !== "All" || trailType !== "All";

  function clearAll() {
    setQuery("");
    setDifficulty("All");
    setTrailType("All");
    setSort("rating");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <AuthModal
        isOpen={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onSwitchMode={setAuthMode}
        onAuthSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          setAuthOpen(false);
        }}
      />
      {activeTrail && (
        <TrailDetailModal
          trail={activeTrail}
          onClose={() => setActiveTrail(null)}
          user={user}
          onAuthRequired={() => {
            setActiveTrail(null);
            setAuthMode("signup");
            setAuthOpen(true);
          }}
        />
      )}

      <Navbar
        user={user}
        activePath="/trails"
        onSignUpClick={() => { setAuthMode("signup"); setAuthOpen(true); }}
      />

      <section className="px-4 py-6">
        <div className="max-w-5xl mx-auto flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
              Trail Directory
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              Explore Trails
            </h1>
          </div>
          <p className="text-sm text-muted-foreground shrink-0 hidden sm:block">
            {allTrails.length} trails nationwide
          </p>
        </div>
      </section>

      <div className="sticky top-[57px] z-40 bg-background/95 backdrop-blur-sm px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or location..."
              className="w-full pl-9 pr-9 py-2 text-sm bg-card border border-border rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <FilterDropdown<DifficultyFilter>
              label="Difficulty"
              value={difficulty}
              options={DIFFICULTY_FILTERS}
              onChange={setDifficulty}
              active={difficulty !== "All"}
              fullWidth
            />
            <FilterDropdown<TypeFilter>
              label="Type"
              value={trailType}
              options={TYPE_FILTERS}
              onChange={setTrailType}
              active={trailType !== "All"}
              fullWidth
              menuAlign="right"
            />
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer shrink-0"
                aria-label="Clear all filters"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 py-7">
        <div className="max-w-5xl mx-auto">

          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
              <span className="hidden sm:inline">{filtered.length === 1 ? "trail" : "trails"} found</span>
            </p>

            <div className="flex items-center gap-2">
              <div className="sm:hidden">
                <FilterDropdown<SortKey>
                  label="Sort"
                  value={sort}
                  options={SORT_OPTIONS}
                  onChange={setSort}
                  active={sort !== "rating"}
                  menuAlign="right"
                />
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Sort:</span>
                <div className="flex bg-card border border-border rounded-lg overflow-hidden">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSort(opt.value)}
                      className={`text-xs font-medium px-3 py-1.5 transition-colors cursor-pointer ${
                        sort === opt.value
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState onClear={clearAll} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((trail) => (
                <TrailCard key={trail.name} trail={trail} onSelect={setActiveTrail} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
