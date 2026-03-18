import { useState, useMemo, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Search,
  MapPin,
  Star,
  Clock,
  TrendingUp,
  Mountain,
  X,
  SlidersHorizontal,
  Route,
} from "lucide-react";
import type { Route as RRRoute } from "./+types/trails";
import { supabase } from "~/lib/supabase";
import { allTrails } from "~/constants/trails";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import TrailDetailModal, {
  type Trail,
  difficultyConfig,
} from "~/components/TrailDetailModal";

export function meta({}: RRRoute.MetaArgs) {
  return [
    { title: "Explore Trails - TrailQuest" },
    {
      name: "description",
      content:
        "Browse and discover hiking trails. Filter by difficulty, type, and distance.",
    },
  ];
}

// ─── Types ─────────────────────────────────────────────────────────────────

type DifficultyFilter = "All" | "Easy" | "Moderate" | "Hard";
type TypeFilter = "All" | "Loop" | "Out & Back" | "Point to Point";
type SortKey = "rating" | "distance" | "name";

// ─── Helpers ───────────────────────────────────────────────────────────────

const DIFFICULTY_FILTERS: DifficultyFilter[] = ["All", "Easy", "Moderate", "Hard"];
const TYPE_FILTERS: TypeFilter[] = ["All", "Loop", "Out & Back", "Point to Point"];
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "rating", label: "Top Rated" },
  { value: "distance", label: "Distance" },
  { value: "name", label: "Name" },
];

const difficultyBorder: Record<string, string> = {
  Easy: "border-l-emerald-500",
  Moderate: "border-l-primary",
  Hard: "border-l-rose-500",
};

function parseDistance(d: string) {
  return parseFloat(d.replace(/[^0-9.]/g, "")) || 0;
}

function StarRow({ value }: { value: number }) {
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

// ─── Trail Card ────────────────────────────────────────────────────────────

function TrailCard({
  trail,
  onSelect,
}: {
  trail: Trail;
  onSelect: (t: Trail) => void;
}) {
  const cfg = difficultyConfig[trail.difficulty];
  return (
    <button
      onClick={() => onSelect(trail)}
      className={`text-left border border-border border-l-4 ${difficultyBorder[trail.difficulty]} rounded-xl p-4 flex flex-col gap-3 bg-card shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group focus-visible:outline-2 focus-visible:outline-ring`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-card-foreground leading-snug group-hover:text-primary transition-colors truncate">
            {trail.name}
          </p>
          <p className="text-xs text-primary mt-0.5 flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 shrink-0" />
            {trail.location}
          </p>
        </div>
        <span
          className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${cfg.badge}`}
        >
          {trail.difficulty}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-1 text-xs text-muted-foreground border-t border-border pt-3">
        <span className="flex flex-col items-center gap-0.5">
          <Mountain className="w-3.5 h-3.5 text-primary/70" />
          <span className="font-medium text-foreground text-[11px]">{trail.distance}</span>
          <span className="text-[10px]">distance</span>
        </span>
        <span className="flex flex-col items-center gap-0.5 border-x border-border">
          <Clock className="w-3.5 h-3.5 text-primary/70" />
          <span className="font-medium text-foreground text-[11px]">{trail.duration}</span>
          <span className="text-[10px]">duration</span>
        </span>
        <span className="flex flex-col items-center gap-0.5">
          <TrendingUp className="w-3.5 h-3.5 text-primary/70" />
          <span className="font-medium text-foreground text-[11px]">{trail.elevation}</span>
          <span className="text-[10px]">elevation</span>
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <StarRow value={trail.rating} />
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Route className="w-3 h-3" />
          {trail.type}
        </span>
      </div>
    </button>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────

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

// ─── Page ──────────────────────────────────────────────────────────────────

export default function Trails() {
  const [user, setUser] = useState<User | null>(null);
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("All");
  const [trailType, setTrailType] = useState<TypeFilter>("All");
  const [sort, setSort] = useState<SortKey>("rating");
  const [activeTrail, setActiveTrail] = useState<Trail | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

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
      {activeTrail && (
        <TrailDetailModal trail={activeTrail} onClose={() => setActiveTrail(null)} />
      )}

      <Navbar user={user} activePath="/trails" />

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-card/40 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
            Trail Directory
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            Explore Trails
          </h1>
          <p className="text-sm text-muted-foreground">
            {allTrails.length} trails across the country — find your next adventure.
          </p>
        </div>
      </section>

      {/* ── Search & Filters ─────────────────────────────────────────────── */}
      <div className="sticky top-[57px] z-40 border-b border-border bg-background/95 backdrop-blur-sm px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-col gap-3">

          {/* Search row */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or location…"
                className="w-full pl-9 pr-9 py-2 text-sm bg-card border border-border rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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

            {/* Mobile filter toggle */}
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={`sm:hidden flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-colors cursor-pointer ${
                hasActiveFilters
                  ? "border-primary bg-secondary text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          </div>

          {/* Filter chips row — always visible on sm+, collapsible on mobile */}
          <div
            className={`flex flex-wrap items-center gap-2 ${
              filtersOpen ? "flex" : "hidden sm:flex"
            }`}
          >
            {/* Difficulty chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {DIFFICULTY_FILTERS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    difficulty === d
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="w-px h-4 bg-border hidden sm:block" />

            {/* Type chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {TYPE_FILTERS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTrailType(t)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    trailType === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer ml-auto"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 px-4 py-7">
        <div className="max-w-5xl mx-auto">

          {/* Results bar */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "trail" : "trails"} found
            </p>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:inline">Sort:</span>
              <div className="flex gap-1">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSort(opt.value)}
                    className={`text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      sort === opt.value
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid or Empty State */}
          {filtered.length === 0 ? (
            <EmptyState onClear={clearAll} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
